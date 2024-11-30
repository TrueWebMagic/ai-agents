import { NextResponse } from 'next/server';
import { CloudSchedulerClient, protos } from '@google-cloud/scheduler';
// import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// let credentialsLoaded = false;

// async function loadCredentials() {
//     if (!credentialsLoaded) {
//         const client = new SecretManagerServiceClient();
//         const [accessResponse] = await client.accessSecretVersion({
//             name: 'projects/ai-agents-443121/secrets/schedulersecret/versions/latest',
//         });
//         const secretContent = accessResponse.payload?.data?.toString();
//         process.env.GOOGLE_APPLICATION_CREDENTIALS = secretContent;
//         credentialsLoaded = true;
//     }
// }

export async function POST(request: Request) {
    try {
        // await loadCredentials();

        const { jobName, schedule, url, agentId } = await request.json();

        if (!jobName || !schedule || !url || !agentId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const client = new CloudSchedulerClient({});

        const projectId = process.env.GOOGLE_PROJECT_ID!;
        const location = process.env.GOOGLE_LOCATION!;

        const parent = `projects/${projectId}/locations/${location}`;

        const job: protos.google.cloud.scheduler.v1.IJob = {
            name: `${parent}/jobs/${jobName}`,
            schedule,
            timeZone: 'UTC',
            httpTarget: {
                uri: url,
                httpMethod: protos.google.cloud.scheduler.v1.HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: Buffer.from(JSON.stringify({ agentId: agentId })).toString('base64'),
            },
        };

        const createdJob = await client.createJob({ parent, job });

        return NextResponse.json({ success: true, job: createdJob });
    } catch (error) {
        console.error('Error creating Cloud Scheduler job:', error);
        return NextResponse.json({ error: `Failed to create job: ${error}` }, { status: 500 });
    }
}