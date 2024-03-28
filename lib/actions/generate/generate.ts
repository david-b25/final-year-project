"use server";
import OpenAI from "openai";
import { OpenAIStream, experimental_StreamingReactResponse, Message } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generate(content: string) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ 
          role: "system", 
          content: 
          "You are an AI website copywriting assistant." +
          "Take the following content, context within the site and word count to create your response. " +
          "Be clear, concise, and not cringey --",
      },
      {
          role: "user",
          content,
      }],
    });

    const response = completion.choices[0].message.content;
    
    return response;
  }
