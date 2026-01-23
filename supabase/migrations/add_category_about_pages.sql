-- Create category_pages table for "About Category" pages
-- These pages provide detailed information about specific categories
-- URL pattern: /category/{slug}

CREATE TABLE IF NOT EXISTS category_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_category_pages_category_id ON category_pages(category_id);
CREATE INDEX IF NOT EXISTS idx_category_pages_slug ON category_pages(slug);

-- Enable Row Level Security
ALTER TABLE category_pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on category_pages"
  ON category_pages FOR SELECT
  USING (true);
