const API_KEY = process.env.ASSEMBLYAI_API_KEY;

export async function transcribeYouTubeVideo(youtubeUrl: string) {
  const response = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audio_url: youtubeUrl,
      language_code: 'en',
    }),
  });

  const data = await response.json();
  return data.id;
}

export async function getTranscriptionResult(transcriptId: string) {
  const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
    headers: {
      'Authorization': API_KEY,
    },
  });

  return await response.json();
}