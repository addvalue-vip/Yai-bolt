import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIResponse(transcript: string, userInput: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant that answers questions about the content of a video based on its transcript." },
      { role: "user", content: `Transcript: ${transcript}\n\nQuestion: ${userInput}` },
    ],
    max_tokens: 150,
  });

  return response.choices[0].message.content;
}