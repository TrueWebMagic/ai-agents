'use server'

import { OpenAI } from "openai";

export async function generateAPIMessageContent(prompt: string, action: string, stepsAndResults: string): Promise<string> {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are expert at writing message content based on a few variables to achieve desired AI agent action, referencing specific data you were provided when necessary.",
            },
            {
                role: "user",
                content: "You will be provided a description of what the AI agent should do, an object called \"Previous steps and results\" that contains all previous steps (actions) and their results, and the current action that needs to be taken. \n\nWhen writing the message content, **always reference the specific result from the \"Previous steps and results\" object** if it is needed for the current action. Do **not** use vague terms like \"the generated programming language name\" or \"from step 1\". Instead, **explicitly include the actual value** (the result) of the step from \"Previous steps and results\" when relevant. If the object is empty, it means that it's the first step. \n\n**Formatting rules:** \n1. If the \"Agent prompt\" or \"Current action\" specifies a required format (e.g., headings, new lines, styling), adhere to those formatting instructions exactly. \n2. Ensure the message content is concise, relevant, and includes the necessary data from the \"Previous steps and results\" object. \n3. Include any stylistic elements such as titles, headings, or prefixes (e.g., \"Recent Elon Musk news:\\n\\n\") specified in the \"Agent prompt\" or implied by the \"Current action\". If the action is to send a message with a title, ensure the title is included exactly as expected. \n\n**Important:** \n\nWrite the message content for **only one step**. Do not merge multiple actions into a single message. Ensure the message content directly corresponds to the current action that needs to be taken. \n\n**Always** respond with **only the message content**, without any additional text or formatting like backticks or quotes.",
            },
            {
                role: "user",
                content: `Agent prompt: "get very short news about elon musk (one very short concise sentence) and send it to me on Slack"\n\nCurrent action: "Step 2 (Slack): Send message on Slack"\n\nPrevious steps and results:\n{"Step 1 (Perplexity): Get short news about Elon Musk": "Elon Musk, the world's richest man, has been confirmed by Donald Trump to co-lead a new government efficiency department, DOGE[4]."}`
            },
            {
                role: "assistant",
                content: `**Recent Elon Musk news:**\n\nElon Musk, the world's richest man, has been confirmed by Donald Trump to co-lead a new government efficiency department, DOGE.`
            },
            {
                role: "user",
                content: `Agent prompt: "${prompt}"\n\nCurrent action: "${action}"\n\nPrevious steps and results:\n${stepsAndResults}`
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