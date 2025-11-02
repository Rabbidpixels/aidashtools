-- Migration: Add Analytics Tracking
-- Run this in your Supabase SQL Editor if you already have the database set up

-- Tool Clicks Table (for analytics)
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

-- Allow anyone to insert click tracking (for analytics)
CREATE POLICY "Allow public insert on tool_clicks"
  ON tool_clicks FOR INSERT
  WITH CHECK (true);
