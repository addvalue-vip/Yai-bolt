import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const { transcriptId, userInput } = await req.json();

  try {
    // Fetch the transcript from Supabase
    const { data, error } = await supabase
      .from('transcripts')
      .select('transcript')
      .eq('id', transcriptId)
      .single();

    if (error) throw error;

    const aiResponse = await generateAIResponse(data.transcript, userInput);

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
  }
}