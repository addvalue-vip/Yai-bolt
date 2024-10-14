import { NextResponse } from 'next/server';
import { transcribeYouTubeVideo, getTranscriptionResult } from '@/lib/assemblyai';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const { youtubeUrl } = await req.json();

  try {
    const transcriptId = await transcribeYouTubeVideo(youtubeUrl);
    
    // Poll for transcription result
    let result;
    do {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
      result = await getTranscriptionResult(transcriptId);
    } while (result.status !== 'completed' && result.status !== 'error');

    if (result.status === 'error') {
      throw new Error('Transcription failed');
    }

    // Store the transcript in Supabase
    const { data, error } = await supabase
      .from('transcripts')
      .insert({ youtube_url: youtubeUrl, transcript: result.text })
      .select();

    if (error) throw error;

    return NextResponse.json({ transcript: result.text, id: data[0].id });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to transcribe video' }, { status: 500 });
  }
}