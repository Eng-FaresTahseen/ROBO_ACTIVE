# Vercel Web Analytics Setup

This project is configured to use Vercel Web Analytics for tracking page views and user interactions.

## Setup Instructions

### 1. Install Dependencies

The `@vercel/analytics` package has been added to the project dependencies:

```bash
npm install
```

### 2. Enable Analytics in Vercel Dashboard

To activate Web Analytics for this project:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (robo-active)
3. Navigate to the **Analytics** tab in the left sidebar
4. Click **Enable Web Analytics**
5. Deploy your project to Vercel

### 3. Verify Analytics

After deployment, you can verify that analytics are working:

1. Visit your deployed site
2. Open browser DevTools (F12)
3. Go to the Network tab
4. Look for requests to `/_vercel/insights/*`
5. Navigate between pages to see tracking events

### 4. View Analytics Data

Once enabled and deployed:

1. Return to the Analytics tab in your Vercel Dashboard
2. View metrics including:
   - Page views
   - Unique visitors
   - Top pages
   - Referrers
   - Geographic data
   - And more

## Implementation Details

- **analytics.js**: Initializes the Vercel Analytics queue
- **index.html**: Includes the analytics script in the `<head>` section
- **package.json**: Contains the `@vercel/analytics` dependency

## How It Works

For static HTML sites, Vercel automatically injects the analytics tracking script when:

1. Web Analytics is enabled in the dashboard
2. The site is deployed to Vercel

The `analytics.js` file prepares the page for tracking by initializing the analytics queue (`window.va`), which Vercel's injected script will use to collect analytics data.

## Privacy

Vercel Web Analytics is privacy-friendly and:

- Doesn't use cookies
- Doesn't track users across sites
- Doesn't collect personal information
- Is GDPR compliant

## Documentation

For more information, see the [Vercel Web Analytics Documentation](https://vercel.com/docs/analytics).
