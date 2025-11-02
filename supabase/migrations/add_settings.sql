-- Add settings table for site-wide configuration

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow public to read settings
CREATE POLICY "Settings are viewable by everyone"
  ON settings FOR SELECT
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Insert default footer settings
INSERT INTO settings (key, value) VALUES
('footer_copyright', '© 2025 AI Dashboard. Site created by RabbidPixelsLLC. All rights reserved.'),
('footer_disclosure', 'Some links on this website are affiliate links. This means we may earn a commission if you click on the link and make a purchase, at no additional cost to you. We only recommend products and services that we believe will add value to our readers. Your support helps us maintain this free resource.'),
('footer_tiktok_url', 'https://www.tiktok.com/@YOUR_TIKTOK_USERNAME'),
('footer_facebook_url', 'https://www.facebook.com/YOUR_FACEBOOK_PAGE')
ON CONFLICT (key) DO NOTHING;

-- Comment
COMMENT ON TABLE settings IS 'Site-wide configuration settings including footer content';
