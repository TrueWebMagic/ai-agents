import { runAgent } from "@/app/utils/runAgent";

export async function POST(req: Request) {
    try {
        const { agent_id } = await req.json();

        if (!agent_id) {
            return new Response(
                JSON.stringify({ error: 'Missing agent_id' }),
                { status: 400 }
            );
        }

        await runAgent(agent_id);

        return new Response(
            JSON.stringify({ message: `Agent ${agent_id} ran successfully` }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error running agent:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to run agent' }),
            { status: 500 }
        );
    }
}