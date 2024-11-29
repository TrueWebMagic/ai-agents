'use server';

import axios from 'axios';

export async function sendMessageToSlack(message: string): Promise<boolean> {
    const slackWebhookUrl = "https://hooks.slack.com/services/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";

    if (!slackWebhookUrl) {
        return false;
    }

    const payload = {
        text: message,
    };

    try {
        const response = await axios.post(slackWebhookUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error: unknown) {
        return false;
    }
}