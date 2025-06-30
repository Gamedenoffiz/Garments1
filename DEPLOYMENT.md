# Deployment to Vercel Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)
3. **Supabase Project**: Make sure your Supabase project is set up

## Step-by-Step Deployment

### 1. Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### 2. Prepare Environment Variables
Make sure you have these environment variables ready from your Supabase project:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### 3. Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Import Project"
   - Connect your Git provider (GitHub, GitLab, etc.)
   - Select your repository

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build:client`
   - **Output Directory**: `dist/spa`
   - **Install Command**: `npm install`

3. **Set Environment Variables**:
   - In the Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add these variables:
     ```
     VITE_SUPABASE_URL = your_supabase_project_url
     VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
     ```

4. **Deploy**: Click "Deploy" and wait for the build to complete

### 4. Deploy via Vercel CLI (Alternative)

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables**:
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

4. **Deploy with Environment Variables**:
   ```bash
   vercel --prod
   ```

## Build Configuration

The project includes these configuration files for Vercel:

- `vercel.json` - Vercel-specific configuration
- `vite.config.ts` - Vite build configuration
- `.env.example` - Environment variables template

## Troubleshooting

### Common Issues:

1. **Build Failures**: 
   - Check that all dependencies are in `package.json`
   - Ensure environment variables are set correctly

2. **Runtime Errors**:
   - Verify Supabase credentials are correct
   - Check browser console for errors

3. **Routing Issues**:
   - The project uses React Router, which should work with Vercel's SPA handling

### Build Locally First:
```bash
npm run build:client
```

This will create a `dist/spa` folder that should contain your built application.

## Environment Variables Needed

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbG...` |

## Post-Deployment

After successful deployment:

1. **Test Core Features**:
   - User registration/login
   - Product browsing
   - Cart functionality
   - Admin features (if applicable)

2. **Set Up Custom Domain** (Optional):
   - In Vercel dashboard, go to project settings
   - Navigate to "Domains"
   - Add your custom domain

3. **Monitor Performance**:
   - Use Vercel Analytics
   - Monitor Supabase usage

## Support

If you encounter issues:
- Check Vercel deployment logs
- Review Supabase project status
- Ensure all environment variables are correctly set
