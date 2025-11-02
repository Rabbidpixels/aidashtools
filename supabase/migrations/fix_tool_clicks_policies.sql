-- Migration: Fix tool_clicks RLS Policies
-- Ensures that tool_clicks table exists with proper policies for tracking and viewing analytics

-- Create tool_clicks table if it doesn't exist
CREATE TABLE IF NOT EXISTS tool_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tool_clicks_tool_id ON tool_clicks(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_clicks_clicked_at ON tool_clicks(clicked_at);

-- Enable Row Level Security (RLS)
ALTER TABLE tool_clicks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert on tool_clicks" ON tool_clicks;
DROP POLICY IF EXISTS "Allow authenticated users to view all clicks" ON tool_clicks;

-- Allow anyone to insert click tracking (for analytics)
CREATE POLICY "Allow public insert on tool_clicks"
  ON tool_clicks FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to view all clicks (for admin analytics)
CREATE POLICY "Allow authenticated users to view all clicks"
  ON tool_clicks FOR SELECT
  USING (auth.role() = 'authenticated');
