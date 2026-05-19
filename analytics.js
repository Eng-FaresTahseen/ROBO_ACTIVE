/**
 * Vercel Web Analytics initialization script
 * This script provides a lightweight tracking solution for page views
 * 
 * Note: When deployed to Vercel with Web Analytics enabled in the dashboard,
 * Vercel will automatically inject the tracking script. This file serves as
 * a placeholder and reference for the analytics setup.
 * 
 * To enable Vercel Web Analytics:
 * 1. Go to your Vercel project dashboard
 * 2. Navigate to the Analytics tab
 * 3. Click "Enable Web Analytics"
 * 4. Deploy your project to Vercel
 * 
 * The analytics will automatically track:
 * - Page views
 * - Unique visitors
 * - Top pages
 * - Referrers
 * - And more
 */

// Initialize the Vercel Analytics queue
window.va = window.va || function () { 
    (window.vaq = window.vaq || []).push(arguments); 
};
