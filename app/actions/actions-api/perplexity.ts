'use server';

import axios, { AxiosError } from 'axios';

interface Message {
    role: 'system' | 'user';
    content: string;
}

interface PerplexityRequest {
    model: string;
    messages: Message[];
}

interface PerplexityResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: Message;
    }[];
}

export async function getPerplexityResponse(prompt: string): Promise<string> {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    const apiUrl = 'https://api.perplexity.ai/chat/completions';

    if (!apiKey) {
        return 'Error: Perplexity API key not found.';
    }

    const requestBody: PerplexityRequest = {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ]
    };

    try {
        const response = await axios.post<PerplexityResponse>(apiUrl, requestBody, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error: unknown) {
        console.error('Error calling Perplexity API:', error);
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            alert("Error when calling Perplexity API. Details: " + axiosError.message)
            return 'Error'
        } else if (error instanceof Error) {
            return `Error: ${error.message}`;
        } else {
            return 'An unknown error occurred.';
        }

    }
}