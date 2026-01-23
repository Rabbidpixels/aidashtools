-- AidashTools Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tools Table
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  link TEXT,
  featured BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ads Table
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  code_snippet TEXT,
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tool Clicks Table (for analytics)
CREATE TABLE IF NOT EXISTS tool_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tool Pages Table (for "About Tool" pages)
CREATE TABLE IF NOT EXISTS tool_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Category Pages Table (for "About Category" pages)
CREATE TABLE IF NOT EXISTS category_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Pages Table (for footer pages like Contact, Privacy, etc.)
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tools_category_id ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(featured);
CREATE INDEX IF NOT EXISTS idx_tools_visible ON tools(visible);
CREATE INDEX IF NOT EXISTS idx_categories_featured ON categories(featured);
CREATE INDEX IF NOT EXISTS idx_ads_active ON ads(active);
CREATE INDEX IF NOT EXISTS idx_ads_location ON ads(location);
CREATE INDEX IF NOT EXISTS idx_tool_clicks_tool_id ON tool_clicks(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_clicks_clicked_at ON tool_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_tool_pages_tool_id ON tool_pages(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_pages_slug ON tool_pages(slug);
CREATE INDEX IF NOT EXISTS idx_category_pages_category_id ON category_pages(category_id);
CREATE INDEX IF NOT EXISTS idx_category_pages_slug ON category_pages(slug);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed)
CREATE POLICY "Allow public read access on categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on tools"
  ON tools FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on ads"
  ON ads FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on tool_pages"
  ON tool_pages FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on category_pages"
  ON category_pages FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on pages"
  ON pages FOR SELECT
  USING (true);

-- Allow anyone to insert click tracking (for analytics)
CREATE POLICY "Allow public insert on tool_clicks"
  ON tool_clicks FOR INSERT
  WITH CHECK (true);

-- Note: For write operations, you'll use the Service Role Key
-- which bypasses RLS, or you can add specific policies for authenticated users
