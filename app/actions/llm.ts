'use server'

import { OpenAI } from "openai";

export async function llm(prompt: string, model: 'gpt-4o' | 'gpt-4o-mini' = 'gpt-4o-mini'): Promise<string> {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
        model: model,
        messages: [
            {
                role: "system",
                content: "Always only respond to the user's query. Don't respond with anything else, for example 'Here's ...' or 'feel free to ask...' - none of that stuff. The user query is all that matters."
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        response_format: {
            "type": "text"
        },
        temperature: 0.75,
        max_tokens: 1024,
    });

    return response.choices[0].message.content as string;
}