# AidashTools

A curated AI tools directory built with Next.js 15 and Supabase. Features a public-facing site to showcase AI tools and a secure admin dashboard for content management.

## Features

### Public Site
- 🎯 Featured tools section
- 📂 Tools organized by categories
- 🚀 Fast-loading, server-side rendered
- 📱 Fully responsive design
- 💰 Ad placement support (header, sidebar, footer)
- ⚡ Optimized for SEO

### Admin Dashboard
- 🔐 Secure authentication (Supabase Auth)
- ✏️ Full CRUD operations for categories, tools, and ads
- 📊 Analytics dashboard with click tracking
- 🎨 Clean UI with Shadcn components
- 🔄 Real-time updates
- ⭐ Toggle featured/active status
- 🗑️ Delete confirmations

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://kiliacldtbyibhypqqhz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_EMAIL=your_email@example.com
```

### 3. Set Up Supabase

Follow the instructions in `supabase/README.md`:
1. Run the SQL schema to create tables
2. Enable email authentication
3. Create your admin user

### 4. Run Development Server
```bash
npm run dev
```

Visit:
- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/login`

## Project Structure

```
aidashtools/
├── app/
│   ├── page.tsx                    # Public homepage
│   ├── login/                      # Admin login page
│   ├── admin/                      # Admin dashboard
│   │   ├── categories/            # Categories CRUD
│   │   ├── tools/                 # Tools CRUD
│   │   └── ads/                   # Ads CRUD
│   └── layout.tsx                 # Root layout
├── components/
│   ├── ui/                        # Shadcn UI components
│   ├── header.tsx                 # Public site header
│   ├── footer.tsx                 # Public site footer
│   ├── tool-card.tsx             # Tool display card
│   ├── ad-placement.tsx          # Ad component
│   └── delete-confirmation-dialog.tsx
├── lib/
│   ├── supabase/                 # Supabase clients
│   ├── database.types.ts         # TypeScript types
│   └── utils.ts                  # Utilities
├── supabase/
│   ├── schema.sql                # Database schema
│   └── README.md                 # Setup instructions
├── public/
│   └── logo.svg                  # Site logo
├── middleware.ts                  # Route protection
├── ADMIN_SETUP.md                # Admin docs
└── PUBLIC_SITE.md                # Public site docs
```

## Database Schema

### Categories
- id, name, description, featured, created_at

### Tools
- id, category_id, name, description, link, featured, created_at

### Ads
- id, location, code_snippet, active, created_at

### Tool Clicks (Analytics)
- id, tool_id, clicked_at

## Documentation

- **Admin Dashboard**: See `ADMIN_SETUP.md`
- **Public Site**: See `PUBLIC_SITE.md`
- **Analytics Feature**: See `ANALYTICS_SETUP.md`
- **Database Setup**: See `supabase/README.md`

## Usage

### Managing Content

1. **Login**: Visit `/login` and sign in with your admin credentials
2. **Add Categories**: Create categories to organize tools
3. **Add Tools**: Add tools and assign them to categories
4. **Feature Tools**: Toggle the "Featured" switch to highlight tools
5. **Add Ads**: Create ad placements with custom HTML/scripts
6. **View Public Site**: Visit homepage to see your changes

### Ad Placements

Create ads with these locations:
- `header` - Below navigation
- `sidebar` - Between sections
- `footer` - Above footer

## Deployment

### Deploy to Vercel

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Add these in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features Not Yet Implemented

These are planned for future phases:
- Search functionality
- Advanced analytics (time-based filtering, charts, geographic data)
- Category filtering
- Tool ratings/reviews
- User submissions
- Newsletter

## Support

For setup issues:
1. Check `ADMIN_SETUP.md` and `PUBLIC_SITE.md`
2. Verify environment variables
3. Ensure Supabase tables are created
4. Check browser console for errors

## License

All rights reserved.
