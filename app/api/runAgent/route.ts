import { runAgent } from '@/app/utils/runAgent';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();

    await runAgent("59")

    console.log('Received data:', body);

    return NextResponse.json({ success: true });
}