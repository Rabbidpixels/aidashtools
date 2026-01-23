-- Add slug column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add slug column to tools table
ALTER TABLE tools ADD COLUMN IF NOT EXISTS slug TEXT;

-- Generate slugs from existing names for categories
UPDATE categories
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
WHERE slug IS NULL;

-- Generate slugs from existing names for tools
UPDATE tools
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
WHERE slug IS NULL;

-- Make slug NOT NULL and UNIQUE after populating
ALTER TABLE categories ALTER COLUMN slug SET NOT NULL;
ALTER TABLE tools ALTER COLUMN slug SET NOT NULL;

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
