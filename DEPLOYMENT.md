# Vercel Deployment Guide

Complete step-by-step instructions to deploy AidashTools to Vercel.

## ✅ Code Status

**Repository**: https://github.com/Rabbidpixels/aidashtools.git
**Status**: ✅ All code pushed to GitHub
**Branch**: `main`

---

## 📋 Pre-Deployment Checklist

Before deploying to Vercel, ensure you've completed these steps:

- [x] ✅ Code pushed to GitHub
- [ ] 🔲 Supabase database tables created
- [ ] 🔲 Supabase authentication enabled
- [ ] 🔲 Admin user created in Supabase
- [ ] 🔲 Environment variables ready

---

## 🗄️ Step 1: Complete Supabase Setup

### 1.1 Create Database Tables

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `kiliacldtbyibhypqqhz`
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire contents of `supabase/schema.sql` from your project
6. Paste into the SQL editor
7. Click **Run**
8. You should see: "Success. No rows returned"

**Verify Tables Created:**
- Go to **Table Editor**
- You should see: `categories`, `tools`, `ads`, `tool_clicks`

### 1.2 Enable Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Email** provider
3. Toggle it to **Enabled**
4. **IMPORTANT**: Disable "Confirm email" for easier admin login
5. Click **Save**

### 1.3 Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - Email: `rabbidpixels@yahoo.com`
   - Password: (choose a secure password)
4. Click **Create user**
5. **Save your password** - you'll need it to log in!

---

## 🚀 Step 2: Deploy to Vercel

### 2.1 Go to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **Add New...** → **Project**

### 2.2 Import Your Repository

1. Find `Rabbidpixels/aidashtools` in the list
2. Click **Import**
3. You'll see the project configuration screen

### 2.3 Configure Project Settings

**Framework Preset**: Next.js (auto-detected ✅)
**Root Directory**: `./` (leave as default)
**Build Command**: `npm run build` (auto-detected ✅)
**Output Directory**: `.next` (auto-detected ✅)

### 2.4 Add Environment Variables

Click **Environment Variables** and add these **3 required variables**:

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://kiliacldtbyibhypqqhz.supabase.co
Environment: Production, Preview, Development (select all)
```

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpbGlhY2xkdGJ5aWJoeXBxcWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjY3MzksImV4cCI6MjA3NzYwMjczOX0.8GZdtpVT3pUIE6tH4vasVg5L6oX38otWvbyZ-Hbe9G0
Environment: Production, Preview, Development (select all)
```

#### Variable 3: SUPABASE_SERVICE_ROLE_KEY
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpbGlhY2xkdGJ5aWJoeXBxcWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjAyNjczOSwiZXhwIjoyMDc3NjAyNzM5fQ.Pme6Nyy2_-0DdKs5f-12FMSqHumrOD48r1R1cCgDB6M
Environment: Production, Preview, Development (select all)
```

#### Variable 4: ADMIN_EMAIL
```
Key: ADMIN_EMAIL
Value: rabbidpixels@yahoo.com
Environment: Production, Preview, Development (select all)
```

**⚠️ IMPORTANT**: Make sure to select **all three environments** (Production, Preview, Development) for each variable!

### 2.5 Deploy

1. Click **Deploy**
2. Wait 2-3 minutes for the build to complete
3. You'll see "Congratulations!" when it's done
4. Click **Visit** to see your live site

---

## 🔒 Step 3: Verify Security

### 3.1 Test Public Site

1. Visit your Vercel deployment URL (e.g., `aidashtools.vercel.app`)
2. You should see the public homepage
3. It will be empty (no tools yet) - this is expected

### 3.2 Test Admin Access

1. Click **Admin** in the header, or visit `/login`
2. Enter your credentials:
   - Email: `rabbidpixels@yahoo.com`
   - Password: (the password you created in Supabase)
3. You should be redirected to `/admin/categories`

### 3.3 Verify Protection

**Test 1: Try accessing admin without login**
- In an incognito window, visit `your-site.vercel.app/admin/categories`
- You should be redirected to `/login` ✅

**Test 2: Try logging in with wrong email**
- Log out if logged in
- Try logging in with a different email
- You should see "Unauthorized" or be redirected ✅

**Security Confirmed!** ✅ Only your email can access the admin dashboard.

---

## 🔄 Step 4: Enable Auto-Deploys

Auto-deploys are **already enabled by default** when you import from GitHub!

**What this means:**
- Every time you push to the `main` branch, Vercel automatically deploys
- You'll receive an email notification for each deployment
- Preview deployments are created for pull requests

**To verify auto-deploy is enabled:**
1. Go to your project in Vercel
2. Click **Settings** → **Git**
3. Ensure **Production Branch** is set to `main` ✅
4. **Deploy Hooks** section shows GitHub integration ✅

---

## 🎉 Step 5: Add Your First Content

Now that everything is deployed, add some content!

### 5.1 Create Categories

1. Go to `/admin/categories`
2. Click **Add Category**
3. Create a few categories:
   - AI Writing Tools
   - Image Generation
   - Code Assistants

### 5.2 Add Tools

1. Go to `/admin/tools`
2. Click **Add Tool**
3. Add some tools (examples):
   - **ChatGPT**: AI Writing Tools, https://chat.openai.com, Featured ✅
   - **DALL-E**: Image Generation, https://openai.com/dall-e, Featured ✅
   - **GitHub Copilot**: Code Assistants, https://github.com/copilot

### 5.3 View Public Site

1. Go back to your homepage
2. You should now see:
   - Featured tools section (for featured tools)
   - Category sections with tools listed

---

## 🎨 Step 6: Customize Your Site

### Replace Logo

1. Create or download your logo
2. Save as `logo.svg` or `logo.png`
3. In your local project, replace `public/logo.svg`
4. If using PNG, update `components/header.tsx` line 12
5. Commit and push:
   ```bash
   git add public/logo.svg
   git commit -m "Update logo"
   git push
   ```
6. Vercel will automatically redeploy! 🎉

### Add Ads (Optional)

1. Go to `/admin/ads`
2. Click **Add Ad**
3. Create ad placements:
   - **Location**: `header`
   - **Code Snippet**: Paste your ad code (Google AdSense, etc.)
   - **Active**: Toggle on ✅

---

## 🌐 Step 7: Add Custom Domain (Optional)

### 7.1 Add Domain in Vercel

1. Go to your project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `aidashtools.com`)
4. Click **Add**

### 7.2 Configure DNS

Vercel will show you DNS records to add. Typically:

**A Record:**
```
Name: @
Value: 76.76.21.21
```

**CNAME Record:**
```
Name: www
Value: cname.vercel-dns.com
```

Add these records in your domain registrar's DNS settings.

### 7.3 Wait for Verification

- DNS propagation takes 24-48 hours
- Vercel will automatically verify and issue SSL certificate
- You'll receive an email when it's ready

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Built-in)

1. Go to your project → **Analytics**
2. View page views, top pages, and performance metrics
3. Free tier includes basic analytics

### Tool Click Analytics

Your built-in analytics dashboard tracks tool clicks:
1. Visit `/admin/analytics`
2. View total clicks, most popular tools, and rankings
3. Data updates in real-time as users click tools

---

## 🔧 Troubleshooting

### Build Fails

**Error**: Missing environment variables
- **Solution**: Double-check all 4 environment variables are added in Vercel

**Error**: Type errors during build
- **Solution**: This is expected - the build may show warnings but should still succeed

### Can't Login

**Error**: Invalid credentials
- **Solution**: Verify the user exists in Supabase → Authentication → Users

**Error**: Unauthorized page
- **Solution**: Ensure `ADMIN_EMAIL` in Vercel matches your Supabase user email exactly

### Public Site is Empty

**This is normal!**
- The site starts with no content
- Add categories and tools in the admin dashboard
- Public site updates immediately

### Analytics Not Tracking

1. Check browser console for errors
2. Verify `tool_clicks` table exists in Supabase
3. Run the analytics migration if you skipped it:
   - Supabase → SQL Editor
   - Run `supabase/migrations/add_analytics.sql`

---

## 📝 Summary Checklist

- [ ] ✅ Supabase database tables created
- [ ] ✅ Authentication enabled in Supabase
- [ ] ✅ Admin user created
- [ ] ✅ Project deployed to Vercel
- [ ] ✅ All 4 environment variables added
- [ ] ✅ Admin login tested and working
- [ ] ✅ Security verified (admin routes protected)
- [ ] ✅ Auto-deploy enabled (GitHub → Vercel)
- [ ] ✅ First categories and tools added
- [ ] ✅ Public site showing content
- [ ] 🔲 Logo customized (optional)
- [ ] 🔲 Custom domain added (optional)

---

## 🎯 Next Steps

Your AidashTools site is now live! Here's what to do next:

1. **Add more tools**: Build out your directory
2. **Customize branding**: Update logo, colors, and text
3. **Set up ads**: Add ad placements to monetize
4. **Monitor analytics**: Track which tools are most popular
5. **Share your site**: Promote it on social media, forums, etc.

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Project Docs**: See `README.md`, `ADMIN_SETUP.md`, `PUBLIC_SITE.md`
- **Analytics**: See `ANALYTICS_SETUP.md`

---

## 🚀 Deployment URL

After deployment, your site will be available at:
- **Production**: `https://aidashtools.vercel.app` (or your custom domain)
- **Admin Login**: `https://aidashtools.vercel.app/login`
- **Admin Dashboard**: `https://aidashtools.vercel.app/admin/categories`

**Security Status**: 🔒 Admin routes are protected by middleware and email verification

---

**Congratulations! Your AidashTools site is live!** 🎉
