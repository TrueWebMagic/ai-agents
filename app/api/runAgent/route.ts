import { runAgent } from '@/app/utils/runAgent';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    console.log(request);
    runAgent("59")
    return NextResponse.json({ message: 'hi' });
}

export async function POST(request: Request) {
    console.log(request);
    runAgent("59")
    return NextResponse.json({ message: 'hi' });
}