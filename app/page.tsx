import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mb-8">
          Welcome to YouTube Transcript AI Chat
        </h1>
        <p className="text-xl mb-8">
          Transcribe YouTube videos and chat with AI about the content
        </p>
        <div className="flex space-x-4">
          <Link href="/transcribe">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg">Learn More</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}