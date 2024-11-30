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

    await saveAgent(
        agentName,
        "active",
        parsedWorkflow["api_used"],
        parsedWorkflow["workflow_elements"],
        frequencies,
        agentPrompt
    )

    for (let i = 0; i < frequencies.length; i++) {
        // try {
        //     const response = await axios.post('/api/create-scheduler', {
        //         "jobName": "my-first-job",
        //         "schedule": "*/5 * * * *",
        //         "url": "https://your-endpoint.com/api/trigger-job"
        //     }, {
        //         // headers: {
        //         //     'Authorization': `Bearer ${apiKey}`,
        //         //     'Content-Type': 'application/json'
        //         // }
        //     });

        //     return response.data.choices[0].message.content;
        // } catch (error: unknown) {
        //     console.error('Error calling Perplexity API:', error);
        //     if (axios.isAxiosError(error)) {
        //         const axiosError = error as AxiosError;
        //         alert("Error when calling Perplexity API. Details: " + axiosError.message)
        //         return 'Error'
        //     } else if (error instanceof Error) {
        //         return `Error: ${error.message}`;
        //     } else {
        //         return 'An unknown error occurred.';
        //     }

        // }
    }

    redirect('/agents')
}