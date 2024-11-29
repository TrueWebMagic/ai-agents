// import { runAgent } from '@/app/utils/runAgent';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//     const body = await req.json();

//     await runAgent("59")

//     console.log('Received data:', body);

//     return NextResponse.json({ success: true });
// }

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Handle the request and generate a response
    // const data = await fetch('https://example.com/api/data');
    // const response = await data.json();

    res.status(200).json({ success: true });
}