/**
 * Vercel Serverless Function to securely proxy webhook requests to n8n
 * This keeps the n8n webhook URL private and server-side
 */

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the n8n webhook URL from environment variables
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
        console.error('N8N_WEBHOOK_URL not configured');
        return res.status(500).json({ error: 'Webhook not configured' });
    }

    try {
        // Forward the request to n8n
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
            signal: AbortSignal.timeout(30000) // 30 second timeout
        });

        if (!response.ok) {
            throw new Error(`n8n webhook returned ${response.status}: ${response.statusText}`);
        }

        // Get the response from n8n
        const data = await response.json().catch(() => ({}));

        // Return success
        return res.status(200).json({
            success: true,
            message: 'Trip synced successfully',
            ...data
        });

    } catch (error) {
        console.error('Webhook proxy error:', error);

        // Return error but don't expose internal details
        return res.status(500).json({
            error: 'Failed to sync trip',
            message: error.message
        });
    }
}
