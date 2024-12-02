import { runAgent } from '@/app/utils/runAgent';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const agentId = body.agentId;

        runAgent(agentId);
        return NextResponse.json({ message: 'hi POST', agentId });
    } catch (error) {
        console.error("Error parsing request body", error);
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}