"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/components/ui/use-toast"

interface AIChatProps {
  transcriptId: number | null;
}

const AIChat: React.FC<AIChatProps> = ({ transcriptId }) => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const { toast } = useToast()

  const handleSendMessage = async () => {
    if (!userInput.trim() || !transcriptId) return;

    // Add user message to chat history
    setChatHistory([...chatHistory, { role: 'user', content: userInput }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcriptId, userInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      // Add AI response to chat history
      setChatHistory(prev => [...prev, { role: 'ai', content: data.response }]);

      // Clear user input
      setUserInput('');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "AI response failed",
        description: "An error occurred while getting the AI response. Please try again.",
        variant: "destructive",
      })
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold mb-2">AI Chat</h2>
      <ScrollArea className="flex-grow mb-4 p-4 rounded-md border">
        {chatHistory.map((message, index) => (
          <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {message.content}
            </span>
          </div>
        ))}
      </ScrollArea>
      <div className="flex space-x-2">
        <Textarea
          placeholder="Ask a question about the video..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSendMessage} disabled={!transcriptId}>Send</Button>
      </div>
    </div>
  );
};

export default AIChat;