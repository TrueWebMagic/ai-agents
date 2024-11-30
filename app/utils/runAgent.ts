'use server'

import { getPerplexityResponse } from "../actions/actions-api/perplexity";
import { sendMessageToSlack } from "../actions/actions-api/slack";
import { generateAPIMessageContent } from "../actions/generateAPIMessageContent";
import { generatePromptForLLMStep } from "../actions/generatePromptForLLMStep";
import { getAgentForRun } from "../actions/getAgentForRun";
import { llm } from "../actions/llm";
import { logAgent } from "../actions/logAgent";

export const runAgent = async (agent_id: string) => {
    const stepsAndResults: { [key: string]: string } = {}
    const workflow_arguments: string[] = []
    const agent = await getAgentForRun(agent_id)
    const workflow = agent.workflow
    const agentPrompt = agent.prompt

    for (let i = 0; i < workflow.length; i++) {
        const action = workflow[i]["action"];
        if (action == "LLM") {
            const llm_prompt = await generatePromptForLLMStep(agentPrompt, (`Step ${i + 1}: ` + workflow[i]["title"]), JSON.stringify(stepsAndResults))
            workflow_arguments.push(llm_prompt)
            const result = await llm(llm_prompt)
            stepsAndResults[`Step ${i + 1} (${workflow[i]["action"]}): ${workflow[i]["title"]}`] = result
        } else if (action == "Perplexity") {
            const api_prompt = await generatePromptForLLMStep(agentPrompt, (`Step ${i + 1}: ` + workflow[i]["title"]), JSON.stringify(stepsAndResults))
            workflow_arguments.push(api_prompt)
            const result = await getPerplexityResponse(api_prompt)
            stepsAndResults[`Step ${i + 1} (${workflow[i]["action"]}): ${workflow[i]["title"]}`] = result
        } else if (action == "Slack") {
            const message_content = await generateAPIMessageContent(agentPrompt, (`Step ${i + 1}: ` + workflow[i]["title"]), JSON.stringify(stepsAndResults))
            workflow_arguments.push(message_content)
            const result = await sendMessageToSlack(message_content)
            stepsAndResults[`Step ${i + 1} (${workflow[i]["action"]}): ${workflow[i]["title"]}`] = result == true ? "Message sent" : "Error sending message"
        }
    }

    await logAgent(agent_id, { ...stepsAndResults }, [...workflow_arguments])
};