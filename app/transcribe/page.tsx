"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast"
import VideoPlayer from '@/components/VideoPlayer';
import TranscriptDisplay from '@/components/TranscriptDisplay';
import AIChat from '@/components/AIChat';

export default function TranscribePage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [transcriptId, setTranscriptId] = useState<number | null>(null);
  const { toast } = useToast()

  const handleTranscribe = async () => {
    toast({
      title: "Transcription started",
      description: "Your video is being transcribed. This may take a few minutes.",
    })

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeUrl: videoUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe video');
      }

      const data = await response.json();
      setTranscript(data.transcript);
      setTranscriptId(data.id);

      toast({
        title: "Transcription complete",
        description: "Your video has been successfully transcribed.",
      })
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Transcription failed",
        description: "An error occurred while transcribing the video. Please try again.",
        variant: "destructive",
      })
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Transcribe YouTube Video</h1>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Enter YouTube URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <Button onClick={handleTranscribe}>Transcribe</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <VideoPlayer url={videoUrl} />
          <TranscriptDisplay transcript={transcript} />
        </div>
        <AIChat transcriptId={transcriptId} />
      </div>
    </div>
  );
}