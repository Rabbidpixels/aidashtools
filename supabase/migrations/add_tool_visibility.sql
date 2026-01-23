-- Add visible column to tools table for controlling tool visibility on the main site
-- Hidden tools remain manageable in admin but don't appear on the public site

ALTER TABLE tools ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_tools_visible ON tools(visible);

-- Ensure all existing tools are visible by default
UPDATE tools SET visible = true WHERE visible IS NULL;
