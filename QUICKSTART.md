# Quick Start Guide

Get AidashTools up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- GitHub account

## Step-by-Step Setup

### 1. Environment Setup (2 minutes)

Your `.env.local` needs these values. Some are already filled in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kiliacldtbyibhypqqhz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=                    # ← Get this from Supabase
SUPABASE_SERVICE_ROLE_KEY=[already configured]
ADMIN_EMAIL=                                       # ← Your email
```

**Get your anon key:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **anon public** key
5. Paste it in `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Set your admin email:**
1. Choose the email you'll use to log in
2. Add it as `ADMIN_EMAIL` in `.env.local`

### 2. Create Database Tables (1 minute)

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Open `supabase/schema.sql` in this project
4. Copy the entire SQL content
5. Paste into Supabase SQL Editor
6. Click **Run**
7. You should see "Success. No rows returned"

### 3. Enable Authentication (1 minute)

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Email** and click to enable it
3. **Optional**: Disable "Confirm email" for easier testing
4. Click **Save**

### 4. Create Your Admin User (1 minute)

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter your email (same as `ADMIN_EMAIL`)
4. Enter a password (save it!)
5. Click **Create user**

### 5. Test It! (30 seconds)

```bash
npm run dev
```

**Test the admin dashboard:**
1. Visit `http://localhost:3000/login`
2. Sign in with your email and password
3. You should see the admin dashboard
4. Try creating a category!

**Test the public site:**
1. Visit `http://localhost:3000`
2. You should see the public homepage
3. (It will be empty until you add data)

## Add Sample Data (Optional)

Try this to see how it looks:

### Create Categories

1. Go to `/admin/categories`
2. Click "Add Category"
3. Create these:
   - **AI Writing** - "Tools for content creation and writing"
   - **Image Generation** - "Create images with AI"
   - **Code Assistants** - "AI-powered coding help"

### Create Tools

1. Go to `/admin/tools`
2. Add some tools:
   - **ChatGPT** (AI Writing, Featured, https://chat.openai.com)
   - **DALL-E** (Image Generation, Featured, https://openai.com/dall-e)
   - **GitHub Copilot** (Code Assistants, https://github.com/copilot)

### View Your Site

1. Visit `http://localhost:3000`
2. You should see your featured tools and categories!

## Common Issues

### "Invalid API Key"
- Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set correctly
- Make sure you're using the **anon public** key, not service_role

### "Unauthorized" after login
- Verify your email in Supabase matches `ADMIN_EMAIL` exactly
- Check for typos (case-sensitive)

### Can't see data on public site
- Make sure you created categories and tools in admin
- Check that tools are assigned to categories
- Refresh the page (data updates every 60 seconds)

### Database errors
- Ensure you ran the SQL schema in Supabase
- Go to **Table Editor** and verify tables exist
- Check **Database** → **Tables** shows: categories, tools, ads

## Next Steps

1. ✅ **Replace the logo**: Add your `logo.svg` to `public/` folder
2. ✅ **Add more tools**: Build out your directory
3. ✅ **Test ads**: Create a test ad placement
4. ✅ **Customize**: Update colors, text, and branding
5. ✅ **Deploy**: Push to GitHub and deploy to Vercel

## Deploy to Vercel (5 minutes)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial AidashTools setup"
   git push
   ```

2. **Deploy:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repo
   - Add environment variables (same as `.env.local`)
   - Click "Deploy"

3. **Done!** Your site is live 🎉

## Getting Help

- **Admin Dashboard**: See `ADMIN_SETUP.md`
- **Public Site**: See `PUBLIC_SITE.md`
- **Database**: See `supabase/README.md`
- **Full Docs**: See `README.md`

## Checklist

- [ ] Environment variables set in `.env.local`
- [ ] Database tables created in Supabase
- [ ] Email authentication enabled
- [ ] Admin user created
- [ ] Logged into admin dashboard
- [ ] Created at least one category
- [ ] Created at least one tool
- [ ] Viewed public site
- [ ] Ready to deploy!

---

**Estimated total time: 5-10 minutes**

If everything works, you're ready to build out your AI tools directory! 🚀
