import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  return (
    <div className="mt-4">
      <h2 className="text-2xl font-semibold mb-2">Transcript</h2>
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        <p>{transcript}</p>
      </ScrollArea>
    </div>
  );
};

export default TranscriptDisplay;