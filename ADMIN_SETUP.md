# Admin Dashboard Setup

Your secure admin dashboard is ready! Here's what was created:

## Features

- **Supabase Authentication** - Email/password login with hardcoded admin email verification
- **Protected Routes** - Middleware ensures only authenticated admin can access `/admin/*`
- **Full CRUD Operations** - Create, Read, Update, Delete for all three tables
- **Toggle Switches** - Quick featured/active status updates
- **Delete Confirmations** - Modal dialogs prevent accidental deletions
- **Responsive Design** - Built with Shadcn UI and Tailwind CSS

## Pages Created

### Login
- **Route**: `/login`
- **File**: `app/login/page.tsx`
- Email/password authentication form

### Admin Dashboard
All admin pages are protected by authentication middleware:

1. **Categories** (`/admin/categories`)
   - Create, edit, delete categories
   - Toggle featured status
   - View all categories in a table

2. **Tools** (`/admin/tools`)
   - Create, edit, delete tools
   - Assign tools to categories
   - Add links and descriptions
   - Toggle featured status

3. **Ads** (`/admin/ads`)
   - Create, edit, delete ad placements
   - Add location and code snippets
   - Toggle active status

## Project Structure

```
app/
├── admin/
│   ├── layout.tsx          # Admin layout with navigation & logout
│   ├── categories/
│   │   └── page.tsx        # Categories CRUD
│   ├── tools/
│   │   └── page.tsx        # Tools CRUD
│   └── ads/
│       └── page.tsx        # Ads CRUD
├── login/
│   └── page.tsx            # Login page
└── unauthorized/
    └── page.tsx            # Unauthorized access page

components/
├── ui/                     # Shadcn UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── switch.tsx
│   └── table.tsx
└── delete-confirmation-dialog.tsx  # Reusable delete modal

lib/
├── supabase/
│   ├── server.ts           # Server-side Supabase client
│   └── client.ts           # Client-side Supabase client
├── supabase.ts             # Admin Supabase client (Service Role Key)
├── database.types.ts       # TypeScript types for database
└── utils.ts                # Utility functions (cn)

middleware.ts               # Route protection middleware
```

## Setup Instructions

### 1. Complete Environment Variables

Update `.env.local` with these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kiliacldtbyibhypqqhz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=[already set]
ADMIN_EMAIL=your_email@example.com
```

**Where to find these:**
- Supabase Dashboard → **Settings** → **API**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = "anon public" key
- `ADMIN_EMAIL` = your admin email address

### 2. Set Up Supabase

Follow the instructions in `supabase/README.md`:

1. Run the SQL schema to create tables
2. Enable email authentication
3. Create your admin user
4. Test the connection

### 3. Run the App

```bash
npm run dev
```

Visit `http://localhost:3000/login` and sign in with your admin credentials.

## Security Features

- **Middleware Protection**: All `/admin/*` routes require authentication
- **Email Verification**: Only the email in `ADMIN_EMAIL` can access admin pages
- **Row Level Security**: Supabase RLS enabled for public read-only access
- **Service Role Key**: Admin operations bypass RLS using service role key
- **Session Management**: Automatic session refresh via Supabase SSR

## Usage

### Creating Categories
1. Navigate to `/admin/categories`
2. Click "Add Category"
3. Fill in name, description (optional), and featured status
4. Click "Create"

### Creating Tools
1. Navigate to `/admin/tools`
2. Click "Add Tool"
3. Select a category, add name, description, link, and featured status
4. Click "Create"

### Managing Ads
1. Navigate to `/admin/ads`
2. Click "Add Ad"
3. Specify location (e.g., "header", "sidebar")
4. Paste ad code snippet (Google AdSense, etc.)
5. Toggle active status
6. Click "Create"

## Next Steps

- Add sample data to test the admin dashboard
- Build the public-facing site
- Add more features (search, filtering, pagination)
- Deploy to Vercel

## Troubleshooting

**Can't login?**
- Check that you created a user in Supabase Authentication
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set correctly
- Check browser console for errors

**"Unauthorized" page?**
- Verify your email matches `ADMIN_EMAIL` in `.env.local`
- Check that the user email in Supabase matches exactly

**Database errors?**
- Ensure you ran the SQL schema in Supabase
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check Supabase logs for errors
