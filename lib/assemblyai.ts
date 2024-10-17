const API_KEY = process.env.ASSEMBLYAI_API_KEY!;

// Function to transcribe an audio file from a direct audio URL
export async function transcribeAudioUrl(audioUrl: string) {
  const response = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audio_url: audioUrl, // Pass the direct audio file URL
      language_code: 'en', // Specify the language
    }),
  });

  const data = await response.json();

  // Check for errors in the response
  if (!response.ok) {
    console.error('AssemblyAI API Error:', data);
    throw new Error(data?.error || 'Failed to transcribe audio');
  }

  return data.id; // Return the transcript ID
}

// Function to poll and get the transcription result from AssemblyAI
export async function getTranscriptionResult(transcriptId: string) {
  const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
    headers: {
      'Authorization': API_KEY,
    },
  });

  const data = await response.json();

  // Check for errors in the response
  if (!response.ok) {
    console.error('AssemblyAI Transcription Result Error:', data);
    throw new Error(data?.error || 'Failed to get transcription result');
  }

  return data; // Return the transcription result
}
