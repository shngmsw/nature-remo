# Deployment Guide

This guide covers deploying the Nature Remo monitoring application to Vercel with Supabase integration.

## Prerequisites

- GitHub account
- Vercel account
- Supabase account
- Nature Remo device and API access token

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `nature-remo-monitor`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

### 1.2 Set Up Database Schema

1. In your Supabase dashboard, go to "SQL Editor"
2. Copy the contents of `supabase-schema.sql`
3. Paste and execute the SQL commands
4. Verify the `sensor_data` table was created

### 1.3 Get API Credentials

1. Go to "Settings" → "API"
2. Copy the following values:
   - Project URL (starts with `https://`)
   - Anon public key (starts with `eyJ`)

## Step 2: Vercel Setup (Recommended Method)

### 2.1 Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 2.2 Configure Environment Variables

In your Vercel project settings:

1. Go to "Settings" → "Environment Variables"
2. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NATURE_REMO_ACCESS_TOKEN` | Your Nature Remo token | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
| `NATURE_REMO_API_ENDPOINT` | `https://api.nature.global/1` | Production, Preview, Development |
| `DATA_REFRESH_INTERVAL` | `300000` | Production, Preview, Development |

### 2.3 Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at the provided URL

## Step 3: GitHub Actions Setup (Optional)

The repository includes a CI/CD pipeline that runs tests and builds on every push. For automatic deployments, use Vercel's built-in GitHub integration instead of manual GitHub Actions.

### 3.1 Enable Vercel GitHub Integration

1. In Vercel dashboard, go to your project
2. Go to "Settings" → "Git"
3. Ensure "Deploy Hooks" are enabled
4. Vercel will automatically deploy on every push to main branch

### 3.2 GitHub Secrets (Only if using manual deployment)

If you want to use manual GitHub Actions deployment, add these secrets to your GitHub repository:

1. Go to "Settings" → "Secrets and variables" → "Actions"
2. Add the following secrets:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

**Note:** The current workflow only runs tests and builds. For deployment, use Vercel's automatic deployment feature.

## Step 4: Nature Remo Setup

### 4.1 Get Access Token

1. Go to [home.nature.global](https://home.nature.global)
2. Sign in to your account
3. Go to "Settings" → "Developer"
4. Generate a new access token
5. Copy the token (starts with `Bearer`)

### 4.2 Add Token to Vercel

Add the token to your Vercel environment variables as `NATURE_REMO_ACCESS_TOKEN`.

## Step 5: Testing

### 5.1 Test Data Collection

1. Visit your deployed app
2. Check if sensor data is being displayed
3. Test the data saving functionality

### 5.2 Monitor Supabase

1. Go to your Supabase dashboard
2. Check "Table Editor" → "sensor_data"
3. Verify data is being inserted

### 5.3 Check Vercel Logs

1. In Vercel dashboard, go to "Functions"
2. Check for any errors in API routes
3. Monitor function execution times

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Ensure all required variables are set in Vercel
   - Check variable names match exactly

2. **Supabase Connection Errors**
   - Verify project URL and anon key
   - Check if RLS is enabled (disable for testing)

3. **Nature Remo API Errors**
   - Verify access token is valid
   - Check if device is online

4. **Build Failures**
   - Check Vercel build logs
   - Ensure all dependencies are in package.json

5. **GitHub Actions Failures**
   - The current workflow only runs tests
   - For deployment, use Vercel's automatic deployment
   - Check if required secrets are set

### Debug Commands

```bash
# Test Supabase connection locally
npm run dev

# Check environment variables
echo $NATURE_REMO_ACCESS_TOKEN

# Test API endpoints
curl -X GET https://your-app.vercel.app/api/temperature
```

## Monitoring and Maintenance

### 1. Data Retention

- Monitor Supabase storage usage
- Consider implementing data cleanup policies
- Set up alerts for storage limits

### 2. Performance Monitoring

- Use Vercel Analytics
- Monitor API response times
- Check Supabase query performance

### 3. Security

- Regularly rotate access tokens
- Monitor for unusual API usage
- Keep dependencies updated

## Cost Optimization

### Vercel Free Tier Limits

- 100GB bandwidth/month
- 100GB storage
- 100GB function execution time

### Supabase Free Tier Limits

- 500MB database
- 2GB bandwidth
- 50,000 monthly active users

### Optimization Tips

1. Implement data aggregation
2. Use efficient queries
3. Cache frequently accessed data
4. Monitor usage regularly 