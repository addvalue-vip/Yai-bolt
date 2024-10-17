import { NextResponse } from 'next/server';
import { transcribeAudioUrl, getTranscriptionResult } from '@/lib/assemblyai';
import { supabase, uploadAudioToSupabase } from '@/lib/supabase';
import fs from 'fs';
import { YtdlCore } from '@ybd-project/ytdl-core';
import { v4 as uuidv4 } from 'uuid'; // To generate unique filenames

// No need to instantiate YtdlCore for validation
const ytdl = new YtdlCore();

export async function POST(req: Request) {
  const { youtubeUrl } = await req.json();

  try {
    // Step 1: Validate YouTube URL using the static method
    if (!YtdlCore.validateURL(youtubeUrl)) {
      throw new Error('Invalid YouTube URL');
    }

    console.log('Valid YouTube URL:', youtubeUrl);

    // Step 2: Download audio from YouTube
    const audioStream = await ytdl.download(youtubeUrl, {
      streamType: 'nodejs', // Ensure the stream type is set for Node.js
      filter: 'audioonly', // Use the audio-only filter
    }) as NodeJS.ReadableStream; // Explicitly cast to NodeJS.ReadableStream

    // Create a Promise to handle stream errors and gather chunks
    const streamPromise = new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      audioStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      audioStream.on('end', () => {
        console.log('Successfully downloaded audio from YouTube');
        resolve(Buffer.concat(chunks));
      });
      audioStream.on('error', (err) => {
        console.error('Error with audio stream:', err);
        reject(new Error(`Failed to download audio from YouTube: ${err.message}`));
      });
    });

    const fileBuffer = await streamPromise;

    // Step 3: Upload the audio to Supabase Storage
    const fileName = `${uuidv4()}.mp3`;
    const publicUrl = await uploadAudioToSupabase(fileName, fileBuffer);
    console.log('Audio uploaded to Supabase. Public URL:', publicUrl);

    // Step 4: Transcribe the uploaded audio using AssemblyAI
    const transcriptId = await transcribeAudioUrl(publicUrl);
    console.log('Transcription started. Transcript ID:', transcriptId);

    // Step 5: Poll for transcription result
    let result;
    do {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
      result = await getTranscriptionResult(transcriptId);
    } while (result.status !== 'completed' && result.status !== 'error');

    if (result.status === 'error') {
      throw new Error('Transcription failed');
    }

    // Step 6: Store the transcript in Supabase
    const { data, error } = await supabase
      .from('transcripts')
      .insert({ youtube_url: youtubeUrl, transcript: result.text })
      .select();

    if (error) {
      throw error; // If there's an error during the insert
    } else if (data && data.length > 0) {
      console.log(`Transcript successfully added with ID: ${data[0].id}`);
    }

    return NextResponse.json({ transcript: result.text, id: data[0].id });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
