import { NextResponse } from 'next/server';

// Define the response for a POST request
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Add your logic here
        const result = { message: "Agent executed successfully", body };

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}

// Define the response for a GET request (optional, if needed)
export async function GET() {
    return NextResponse.json({ message: "This is a GET response" });
}