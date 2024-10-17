"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import VideoPlayer from '@/components/VideoPlayer';
import TranscriptDisplay from '@/components/TranscriptDisplay';
import AIChat from '@/components/AIChat';

export default function TranscribePage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [transcriptId, setTranscriptId] = useState<number | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false); // Loading state
  const { toast } = useToast();

  // Validate if the URL is a valid YouTube URL
  const isValidYouTubeUrl = (url: string) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return pattern.test(url);
  };

  const handleTranscribe = async () => {
    // Check if a YouTube URL is provided
    if (!videoUrl.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid YouTube URL.",
        variant: "destructive",
      });
      return;
    }

    // Check if the URL is valid
    if (!isValidYouTubeUrl(videoUrl)) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube URL.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Transcription started",
      description: "Your video is being transcribed. This may take a few minutes.",
    });

    setIsTranscribing(true); // Start loading state

    try {
      // API call to transcribe the video
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeUrl: videoUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to transcribe video:', errorData);
        throw new Error(errorData?.error || 'Failed to transcribe video');
      }

      const data = await response.json();
      setTranscript(data.transcript);
      setTranscriptId(data.id);

      toast({
        title: "Transcription complete",
        description: "Your video has been successfully transcribed.",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      } else {
        console.error('Unknown error:', error);
      }

      toast({
        title: "Transcription failed",
        description: "An error occurred while transcribing the video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false); // End loading state
    }
  };

  useEffect(() => {
    // Ensure client-side rendering only for dynamic parts
    if (typeof window === 'undefined') {
      return;
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Transcribe YouTube Video</h1>

      {/* Input for YouTube URL */}
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Enter YouTube URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <Button onClick={handleTranscribe} disabled={isTranscribing}>
          {isTranscribing ? 'Transcribing...' : 'Transcribe'}
        </Button>
      </div>

      {/* Display Video and Transcript */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          {/* Client-side rendering only for VideoPlayer */}
          {videoUrl && <VideoPlayer url={videoUrl} />}
          {transcript && <TranscriptDisplay transcript={transcript} />}
        </div>
        {transcriptId && <AIChat transcriptId={transcriptId} />}
      </div>
    </div>
  );
}
