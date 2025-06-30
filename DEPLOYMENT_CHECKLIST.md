# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Repository
- [ ] Code is committed to Git repository (GitHub, GitLab, Bitbucket)
- [ ] All latest changes are pushed to main/master branch
- [ ] Repository is accessible to Vercel

### 2. Environment Setup
- [ ] Supabase project is created and configured
- [ ] Database tables are set up with proper schemas
- [ ] RLS (Row Level Security) policies are configured if needed
- [ ] Supabase URL and keys are ready

### 3. Build Test
- [ ] Run `npm install` to ensure all dependencies work
- [ ] Run `npm run build:client` locally to verify build succeeds
- [ ] Test the built application in `dist/spa` folder
- [ ] No TypeScript errors or build warnings

### 4. Configuration Files
- [ ] `vercel.json` is configured ✅
- [ ] `package.json` has correct build scripts ✅
- [ ] `.env.example` shows required environment variables ✅
- [ ] `.gitignore` excludes `.env` files ✅

## 🌐 Deployment Steps

### Option A: Vercel Dashboard (Recommended)

1. **Connect Repository**
   - [ ] Go to [vercel.com/new](https://vercel.com/new)
   - [ ] Import your Git repository
   - [ ] Select the project folder if needed

2. **Configure Project Settings**
   - [ ] Framework: **Vite** (should auto-detect)
   - [ ] Build Command: `npm run build:client`
   - [ ] Output Directory: `dist/spa`
   - [ ] Install Command: `npm install`
   - [ ] Node.js Version: 18.x or higher

3. **Set Environment Variables**
   - [ ] Add `VITE_SUPABASE_URL` with your Supabase project URL
   - [ ] Add `VITE_SUPABASE_ANON_KEY` with your Supabase anonymous key

4. **Deploy**
   - [ ] Click "Deploy" button
   - [ ] Wait for build to complete
   - [ ] Check deployment logs for any errors

### Option B: Vercel CLI

1. **Install and Login**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   cd /path/to/your/project
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

## 🧪 Post-Deployment Testing

### Core Functionality
- [ ] Website loads correctly
- [ ] Navigation works (Hot Sales, About, Categories)
- [ ] Product listings display properly
- [ ] Images load correctly

### User Authentication
- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] Profile pages accessible

### E-commerce Features
- [ ] Product detail pages work
- [ ] Add to cart functionality
- [ ] Cart page displays items
- [ ] Checkout process (if implemented)

### Admin Features (if applicable)
- [ ] Admin login works
- [ ] Product management accessible
- [ ] All admin functions work properly

### Performance
- [ ] Page loads are reasonably fast
- [ ] No console errors in browser
- [ ] Mobile responsiveness works

## 🔧 Troubleshooting

### Common Build Issues
- **Build fails**: Check `npm run build:client` locally first
- **Missing dependencies**: Ensure all packages are in `package.json`
- **TypeScript errors**: Fix all TS errors before deployment

### Runtime Issues
- **White screen**: Check browser console for errors
- **API errors**: Verify environment variables are set correctly
- **Database errors**: Check Supabase connection and policies

### Environment Variables
```bash
# Required variables:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📝 Notes

- **Domain**: Vercel provides a `.vercel.app` domain by default
- **Custom Domain**: Can be added in project settings after deployment
- **HTTPS**: Automatically enabled by Vercel
- **Caching**: Vercel handles static asset caching automatically
- **Analytics**: Enable Vercel Analytics in project settings if desired

## 🚨 Important Security Notes

- Never commit `.env` files to Git
- Use Vercel's environment variables feature for secrets
- Ensure Supabase RLS policies are properly configured
- Review admin access controls before going live

---

**Ready to deploy? Follow the steps above and your e-commerce site will be live on Vercel! 🎉**
