import { NextResponse } from 'next/server';
import { transcribeAudioUrl, getTranscriptionResult } from '@/lib/assemblyai';
import { supabase, uploadAudioToSupabase } from '@/lib/supabase';
import { YtdlCore } from '@ybd-project/ytdl-core';
import { v4 as uuidv4 } from 'uuid'; // To generate unique filenames

const ytdl = new YtdlCore();

export async function POST(req: Request) {
  const { youtubeUrl } = await req.json();

  try {
    // Step 1: Validate YouTube URL
    if (!YtdlCore.validateURL(youtubeUrl)) {
      throw new Error('Invalid YouTube URL');
    }

    console.log('Valid YouTube URL:', youtubeUrl);

    // Step 2: Check if a transcription for this URL already exists
    const { data: existingTranscripts, error: checkError } = await supabase
      .from('transcripts')
      .select('*')
      .eq('youtube_url', youtubeUrl)
      .limit(1); // Ensure you only get one row

    if (checkError) {
      throw new Error(`Error checking for existing transcription: ${checkError.message}`);
    }

    if (existingTranscripts && existingTranscripts.length > 0) {
      // If a transcript exists, return it without re-transcribing
      console.log(`Transcript already exists for URL: ${youtubeUrl}`);
      return NextResponse.json({ transcript: existingTranscripts[0].transcript, id: existingTranscripts[0].id });
    }

    // Step 3: Download audio from YouTube if no existing transcription
    const audioStream = await ytdl.download(youtubeUrl, {
      streamType: 'nodejs', // Ensure the stream type is set for Node.js
      filter: 'audioonly',  // Use the audio-only filter
    }) as NodeJS.ReadableStream;

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

    // Step 4: Upload the audio to Supabase Storage
    const fileName = `${uuidv4()}.mp3`;
    const publicUrl = await uploadAudioToSupabase(fileName, fileBuffer);
    console.log('Audio uploaded to Supabase. Public URL:', publicUrl);

    // Step 5: Transcribe the uploaded audio using AssemblyAI
    const transcriptId = await transcribeAudioUrl(publicUrl);
    console.log('Transcription started. Transcript ID:', transcriptId);

    // Step 6: Poll for transcription result
    let result;
    do {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
      result = await getTranscriptionResult(transcriptId);
    } while (result.status !== 'completed' && result.status !== 'error');

    if (result.status === 'error') {
      throw new Error('Transcription failed');
    }

    // Step 7: Store the new transcript in Supabase
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
