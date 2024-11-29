'use server'

import { OpenAI } from "openai";

export async function generateAgent(prompt: string): Promise<string> {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are expert at creating automation workflows for AI agents that users want to create. You always only respond in JSON, nothing else, not event backticks.",
            },
            {
                role: "user",
                content: "You will be provided user's answer for the question \"What would you like your agent to do?\".\n\nYour job is to create a workflow that contains actions leading to achieving specified goal + list of used APIs + frequency (if it's not provided, enter ['One-time']). Action might be calling specific API or an LLM task. When it comes to calling APIs, only call APIs that are present in the provided list.\n\nAlways respond only in JSON.",
            },
            {
                role: "user",
                content: "User's answer: \"Summarize all daily emails on my Gmail and send them to Slack.\"\n\nAPI list: [\"Gmail\", \"Slack\", \"Google Calendar\", \"Perplexity\", \"Runway\"]"
            },
            {
                role: "assistant",
                content: "{\n  \"workflow_elements\": [\n    {\n      \"title\": \"Fetch unread emails\",\n      \"action\": \"Gmail\"\n    },\n    {\n      \"title\": \"Generate summary\",\n      \"action\": \"LLM\"\n    },\n    {\n      \"title\": \"Send message on Slack\",\n      \"action\": \"Slack\"\n    }\n  ],\n  \"api_used\": [\"Gmail\", \"Slack\"],\n  \"frequency\": [\"Daily 7:00PM\"]\n}"
            },
            {
                role: "user",
                content: "User's answer: \"Every day morning get the latest piece of information related to Elon Musk in one short and concise sentence and sent it to Slack channel\"\n\nAPI list: [\"Gmail\", \"Slack\", \"Google Calendar\", \"Perplexity\", \"Runway\"]"
            },
            {
                role: "assistant",
                content: "{\n  \"workflow_elements\": [\n    {\n      \"title\": \"Get latest info about Elon Musk\",\n      \"action\": \"Perplexity\"\n    },\n    {\n      \"title\": \"Send message on Slack\",\n      \"action\": \"Slack\"\n    }],\n  \"api_used\": [\"Perplexity\", \"Slack\"],\n  \"frequency\": [\"Daily 7:00AM\"]\n}"
            },
            {
                role: "user",
                content: `User's answer: "${prompt}". \nAPI list: ["Gmail", "Slack", "Google Calendar", "Perplexity", "Runway"]`
            },
        ],
        response_format: {
            "type": "json_object"
        },
        temperature: 0.75,
        max_tokens: 1024,
    });

    return response.choices[0].message.content as string;
}