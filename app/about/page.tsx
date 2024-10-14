import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">About YouTube Transcript AI Chat</h1>
      <p className="mb-4">
        YouTube Transcript AI Chat is a powerful SaaS platform that allows users to transcribe YouTube videos and interact with the content using advanced AI technology. Our platform combines the capabilities of AssemblyAI for accurate transcription and OpenAI for intelligent conversation about the video content.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Key Features:</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Transcribe YouTube videos with high accuracy</li>
        <li>Interactive AI chat based on video content</li>
        <li>User-friendly interface for easy navigation</li>
        <li>Secure storage of transcripts for future reference</li>
      </ul>
      <p className="mb-4">
        Whether you're a content creator, researcher, or just curious about video content, YouTube Transcript AI Chat provides valuable insights and makes it easy to explore and understand YouTube videos in depth.
      </p>
      <Link href="/transcribe">
        <Button>Try It Now</Button>
      </Link>
    </div>
  );
}