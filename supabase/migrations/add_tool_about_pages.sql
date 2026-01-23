-- Create tool_pages table for "About Tool" pages
-- These pages provide detailed information about specific tools
-- URL pattern: /tool/{slug}

CREATE TABLE IF NOT EXISTS tool_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tool_pages_tool_id ON tool_pages(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_pages_slug ON tool_pages(slug);

-- Enable Row Level Security
ALTER TABLE tool_pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on tool_pages"
  ON tool_pages FOR SELECT
  USING (true);
