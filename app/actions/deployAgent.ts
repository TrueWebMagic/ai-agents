'use server';

// import axios from 'axios';
import { llm } from './llm';
import { saveAgent } from './saveAgent';
import { redirect } from 'next/navigation';

export const deployAgent = async (generatedWorkflow: string, agentPrompt: string) => {
    const parsedWorkflow = JSON.parse(generatedWorkflow);

    const agentName = await llm(`Create a very short and concise name for an AI agent that does this: "${agentPrompt}". Separate words with spaces. Make it friendly. Don't add quotes or backticks.`, 'gpt-4o-mini')
    const frequency_cron = await llm(`Turn this array of frequencies into array of cron frequencies. Don't add quotes or backticks. Array: ${parsedWorkflow["frequency"]}`, 'gpt-4o')

    const frequencies: string[] = []
    const frequencies_list = frequency_cron.toString().replace('[', '').replace(']', '').replace('"', '').replace("'", "").split(',');
    for (let i = 0; i < frequencies_list.length; i++) {
        frequencies.push(frequencies_list[i]);
    }

    const agentId = await saveAgent(
        agentName,
        "active",
        parsedWorkflow["api_used"],
        parsedWorkflow["workflow_elements"],
        frequencies,
        agentPrompt
    )

    for (let i = 0; i < frequencies.length; i++) {
        try {
            const res = await fetch('/api/create-scheduler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobName: `${agentName} - ${frequencies[i]}`,
                    schedule: frequencies[i],
                    agentId: agentId,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log(`Job created successfully: ${JSON.stringify(data.job)}`);
            } else {
                console.log(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Request failed:', error);
            console.log('Request failed. Please try again.');
        }
    }

    redirect('/agents')
}