export async function GET(request: Request) {
    console.log(request)
    return new Response('hi')
}

export async function POST(request: Request) {
    console.log(request)
    return new Response('hi')
}