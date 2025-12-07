# Secure n8n Webhook Setup

The n8n webhook URL is now securely stored server-side using environment variables. This prevents the URL from being exposed in the client-side code.

## Setup Instructions

### 1. Create a `.env.local` file

In your project root, create a file named `.env.local` (this file is git-ignored for security):

```bash
cp .env.example .env.local
```

### 2. Add your n8n webhook URL

Edit `.env.local` and replace the placeholder with your actual n8n webhook URL:

```env
N8N_WEBHOOK_URL=https://your-actual-n8n-instance.com/webhook/your-webhook-id
```

### 3. Deploy to Vercel

If deploying to Vercel, you need to add the environment variable in your Vercel dashboard:

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add a new variable:
   - **Name**: `N8N_WEBHOOK_URL`
   - **Value**: Your n8n webhook URL
   - **Environments**: Production, Preview, Development (select all)
4. Redeploy your application

### 4. Local Development

For local testing, you can use the Vercel CLI:

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Run locally with environment variables
vercel dev
```

This will start a local development server that mimics the Vercel serverless environment.

## How It Works

1. **Client Side**: Your app sends trip data to `/api/webhook` (your own API endpoint)
2. **Server Side**: The Vercel serverless function receives the request, reads the `N8N_WEBHOOK_URL` from environment variables, and forwards the data to n8n
3. **n8n**: Receives the data and processes it (e.g., saves to Google Drive)

## Security Benefits

- ✅ n8n webhook URL is never exposed in client-side code
- ✅ `.env.local` is git-ignored and never committed
- ✅ URL can be rotated without updating the app code
- ✅ Different URLs can be used for development/production environments

## Files Created

- `api/webhook.js` - Vercel serverless function that proxies requests to n8n
- `.env.example` - Template showing required environment variables
- `.gitignore` - Ensures environment files are never committed
- `WEBHOOK_SETUP.md` - This file

## Troubleshooting

**Error: "Webhook not configured"**
- Make sure `N8N_WEBHOOK_URL` is set in your environment variables (Vercel dashboard or `.env.local`)

**Error: "Failed to sync trip"**
- Check that your n8n webhook URL is correct and accessible
- Verify your n8n workflow is active
- Check the Vercel function logs for more details

**Local testing not working**
- Make sure you're running `vercel dev` instead of just opening `index.html`
- Verify `.env.local` exists and contains the correct URL
