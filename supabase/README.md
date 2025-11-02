# Supabase Setup Guide

## Step 1: Create Tables

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `schema.sql` from this directory
5. Click **Run** to execute the SQL

This will create:
- `categories` table
- `tools` table (with foreign key to categories)
- `ads` table
- Indexes for better performance
- Row Level Security (RLS) policies for public read access

## Step 2: Get Your API Keys

Your `.env.local` file already has the correct configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kiliacldtbyibhypqqhz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[already configured]
```

### Where to Find Keys (for reference):

In your Supabase dashboard:
1. Go to **Settings** → **API**
2. Under **Project API Keys**, you'll find:
   - **anon/public key** (for client-side, public access)
   - **service_role key** (for server-side, bypasses RLS) ✓ This is what you're using

## Step 3: Verify Setup

After running the schema, verify your tables were created:

1. Go to **Table Editor** in Supabase dashboard
2. You should see three tables: `categories`, `tools`, and `ads`

## Database Schema Overview

### Categories
```
- id: UUID (auto-generated)
- name: Text (required)
- description: Text (optional)
- featured: Boolean (default: false)
- created_at: Timestamp (auto-generated)
```

### Tools
```
- id: UUID (auto-generated)
- category_id: UUID (links to categories.id)
- name: Text (required)
- description: Text (optional)
- link: Text (optional)
- featured: Boolean (default: false)
- created_at: Timestamp (auto-generated)
```

### Ads
```
- id: UUID (auto-generated)
- location: Text (required)
- code_snippet: Text (optional)
- active: Boolean (default: false)
- created_at: Timestamp (auto-generated)
```

## Row Level Security (RLS)

The schema enables RLS with public read access for all tables. This means:
- ✅ Anyone can read data
- ❌ Only authenticated/authorized users can write data
- 🔑 Your Service Role Key bypasses RLS for server-side operations

## Step 4: Set Up Authentication

To enable admin login, you need to:

1. **Enable Email Authentication** in Supabase:
   - Go to **Authentication** → **Providers** in your Supabase dashboard
   - Enable **Email** provider
   - Disable email confirmation if you want (for admin-only access)

2. **Create Your Admin User**:
   - Go to **Authentication** → **Users**
   - Click **Add user** → **Create new user**
   - Enter your email and password
   - Click **Create user**

3. **Add Required Environment Variables**:

Update your `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
ADMIN_EMAIL=your_admin_email@example.com
```

Find your anon key at: **Settings** → **API** → **Project API Keys** → **anon public**

4. **Test Your Login**:
   - Run `npm run dev`
   - Visit `http://localhost:3000/login`
   - Log in with your admin credentials
   - You should be redirected to `/admin/categories`

## Next Steps

After setting up the database and authentication:
1. Test the admin dashboard by creating some categories, tools, and ads
2. Build out your public-facing site
3. Deploy to Vercel
