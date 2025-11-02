-- Migration: Add Pages Table for Editable Legal Pages
-- Creates a table to store editable content for Terms, Privacy, Disclaimer, etc.

CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view pages
CREATE POLICY "Pages are viewable by everyone"
  ON pages FOR SELECT
  USING (true);

-- Only authenticated users can insert/update/delete pages
CREATE POLICY "Authenticated users can insert pages"
  ON pages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update pages"
  ON pages FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete pages"
  ON pages FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert default pages
INSERT INTO pages (slug, title, content) VALUES
('terms', 'Terms of Service', 'Please update this page with your Terms of Service.

This is a placeholder page. You can edit this content from the Admin Panel under Pages.'),
('privacy', 'Privacy Policy', 'Please update this page with your Privacy Policy.

This is a placeholder page. You can edit this content from the Admin Panel under Pages.'),
('disclaimer', 'Disclaimer', 'Please update this page with your Disclaimer.

This is a placeholder page. You can edit this content from the Admin Panel under Pages.'),
('affiliate-disclosure', 'Affiliate Disclosure', 'Please update this page with your Affiliate Disclosure.

This is a placeholder page. You can edit this content from the Admin Panel under Pages.'),
('contact', 'Contact Us', 'Please update this page with your Contact information.

This is a placeholder page. You can edit this content from the Admin Panel under Pages.')
ON CONFLICT (slug) DO NOTHING;
