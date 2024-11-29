import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    message?: string;
    error?: string;
    result?: void;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'POST') {
        try {
            console.log('Request body:', req.body); // Log request body

            const result = await runAgent(); // Call the agent function
            console.log('Agent result:', result); // Log the result

            res.status(200).json({ message: 'Agent ran successfully', result });
        } catch (error) {
            console.error('Error while running agent:', error); // Log the error
            res.status(500).json({ error: 'Failed to run agent' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

async function runAgent() {
    // Example function that simulates running an agent
    try {
        const response = await fetch('https://external-service.com/api/agent-run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ param1: 'value1', param2: 'value2' }),
        });

        if (!response.ok) {
            throw new Error('Agent failed to run');
        }

        const data = await response.json();
        return data; // Return the result from the agent
    } catch (error) {
        console.error('Agent execution failed:', error);
        throw new Error('Failed to run agent');
    }
}
