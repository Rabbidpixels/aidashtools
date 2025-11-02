-- Add display_order column to tools table for custom ordering within categories

ALTER TABLE tools ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create index for faster sorting
CREATE INDEX IF NOT EXISTS idx_tools_category_order ON tools(category_id, display_order, created_at);

-- Update existing tools to have sequential order within their categories
WITH ordered_tools AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY featured DESC, created_at ASC) as new_order
  FROM tools
)
UPDATE tools
SET display_order = ordered_tools.new_order
FROM ordered_tools
WHERE tools.id = ordered_tools.id;

-- Comment
COMMENT ON COLUMN tools.display_order IS 'Custom sort order within category. Featured tools appear first, then sorted by this value.';
