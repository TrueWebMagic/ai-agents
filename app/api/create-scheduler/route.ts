import { NextResponse } from 'next/server';
import { CloudSchedulerClient } from '@google-cloud/scheduler';

export async function POST(request: Request) {
    try {
        const { jobName, schedule, url, agentId } = await request.json();

        if (!jobName || !schedule || !url || !agentId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const client = new CloudSchedulerClient({
            keyFilename: 'secret.json',
        });

        const projectId = process.env.GOOGLE_PROJECT_ID!;
        const location = process.env.GOOGLE_LOCATION!;

        const parent = `projects/${projectId}/locations/${location}`;

        console.log(client)
        console.log(parent)

        // const job: protos.google.cloud.scheduler.v1.IJob = {
        //     name: `${parent}/jobs/${jobName}`,
        //     schedule,
        //     timeZone: 'UTC',
        //     httpTarget: {
        //         uri: url,
        //         httpMethod: protos.google.cloud.scheduler.v1.HttpMethod.POST,
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: Buffer.from(JSON.stringify({ agentId: agentId })).toString('base64'),
        //     },
        // };

        // const [createdJob] = await client.createJob({ parent, job });

        // return NextResponse.json({ success: true, job: createdJob });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error creating Cloud Scheduler job:', error);
        return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }
}