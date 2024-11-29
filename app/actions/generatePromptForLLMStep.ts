'use server'

import { OpenAI } from "openai";

export async function generatePromptForLLMStep(prompt: string, action: string, stepsAndResults: string): Promise<string> {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are expert at writing prompts for an LLM to achieve desired AI agent action, referencing specific data you were provided when necessary.",
            },
            {
                role: "user",
                content: "You will be provided a description of what the AI agent should do, a object called \"Previous steps and results\" that contains all previous steps (actions) and their results, and the current action that needs to be taken. \n\nWhen writing the prompt, **always reference the specific result from the \"Previous steps and results\" object** if it is needed for the current action. Do **not** use vague terms like \"the generated programming language name\" or \"from step 1\". Instead, **explicitly include the actual value** (the result) of the step from \"Previous steps and results\" when relevant. If the object is empty, it means that it's the first step. \n\n**Important:** The LLM does not have access to prior data, so you must explicitly provide it in the prompt. The system cannot assume the agent will have context or any memory of previous steps. \n\nWrite the prompt for **only one step**. Do not merge multiple actions into a single prompt. Ensure the prompt directly corresponds to the current action that needs to be taken. \n\n**Always** respond with **only the prompt**, without any additional text or formatting like backticks or quotes.",
            },
            {
                role: "user",
                content: `Agent prompt: "Shuffle letters in the sentence "I have a cat" in random order, and then make it uppercase."\n\nCurrent action: "Step 2: Convert to uppercase"\n\nPrevious steps and results:\n{"Step 1 (LLM): Shuffle letters in the sentence": "aI cta eahv"}`
            },
            {
                role: "assistant",
                content: "Convert the sentence \"aI cta eahv\" to uppercase."
            },
            {
                role: "user",
                content: `Agent prompt: "Generate a random programming language name, shuffle the letters, and make it uppercase."\n\nCurrent action: "Step 3: Convert to uppercase"\n\nPrevious steps and results:\n{"Step 1 (LLM): Generate random programming language name": "QuasarScript", "Step 2 (LLM): Shuffle letters": "tSarqiuasCrp"}`
            },
            {
                role: "assistant",
                content: "Convert the letters \"tSarqiuasCrp\" to uppercase."
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