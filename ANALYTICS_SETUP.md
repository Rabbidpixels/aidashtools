# Analytics Feature Setup

The analytics dashboard tracks how many times each tool link is clicked by users.

## What Was Added

### Database
- **New Table**: `tool_clicks` - Stores click events for each tool
- **Columns**:
  - `id` (UUID, primary key)
  - `tool_id` (UUID, foreign key to tools)
  - `clicked_at` (timestamp)

### Features
- **Click Tracking**: Automatically tracks when users click "Try It" on tool cards
- **Analytics Dashboard**: View click statistics at `/admin/analytics`
- **Summary Cards**: Total clicks, total tools, and most popular tool
- **Performance Table**: Ranked list of tools by click count

## Setup Instructions

### For New Installations

The `tool_clicks` table is already included in `supabase/schema.sql`. Just run the full schema when setting up your database.

### For Existing Installations

If you already have the database set up, run the migration:

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase/migrations/add_analytics.sql`
4. Paste and click **Run**

## How It Works

### Click Tracking Flow

1. User clicks "Try It" button on a tool card
2. ToolCard component (now a client component) intercepts the click
3. Sends a POST request to `/api/track-click` with the tool ID
4. API route inserts a record into `tool_clicks` table
5. Tool link opens in a new tab
6. Analytics dashboard queries the `tool_clicks` table to show statistics

### Privacy & Performance

- **Minimal Data**: Only stores tool ID and timestamp (no user data)
- **Fire and Forget**: Click tracking doesn't block the user experience
- **Public Insert**: RLS policy allows anyone to insert clicks (for tracking)
- **Indexed**: Database indexes on `tool_id` and `clicked_at` for fast queries

## Using the Analytics Dashboard

### Accessing Analytics

1. Log in to admin dashboard
2. Click **Analytics** in the sidebar navigation
3. View your tool performance metrics

### Metrics Shown

**Summary Cards:**
- **Total Clicks**: All-time clicks across all tools
- **Total Tools**: Number of tools being tracked
- **Most Popular**: Tool with the most clicks

**Performance Table:**
- Rank (sorted by clicks)
- Tool name
- Category ID (abbreviated)
- Total clicks
- Featured status

### Understanding the Data

- Tools are ranked by total clicks (most clicked first)
- Click counts are cumulative (all-time)
- New tools start with 0 clicks
- Deleting a tool also deletes its click history (CASCADE)

## API Endpoint

### POST `/api/track-click`

**Request Body:**
```json
{
  "toolId": "uuid-of-the-tool"
}
```

**Response:**
```json
{
  "success": true
}
```

**Errors:**
- `400`: Missing tool ID
- `500`: Database error

## Technical Details

### Files Modified/Created

**Database:**
- `supabase/schema.sql` - Added tool_clicks table
- `supabase/migrations/add_analytics.sql` - Migration for existing setups
- `lib/database.types.ts` - Added ToolClick interface

**API:**
- `app/api/track-click/route.ts` - API endpoint for tracking clicks

**Components:**
- `components/tool-card.tsx` - Now client component with click tracking

**Admin:**
- `app/admin/analytics/page.tsx` - Analytics dashboard
- `app/admin/layout.tsx` - Added Analytics to navigation

### Performance Considerations

**Database Indexes:**
```sql
CREATE INDEX idx_tool_clicks_tool_id ON tool_clicks(tool_id);
CREATE INDEX idx_tool_clicks_clicked_at ON tool_clicks(clicked_at);
```

These indexes make aggregation queries fast, even with thousands of clicks.

**Query Optimization:**
The analytics page fetches all tools and all clicks in two separate queries, then aggregates in JavaScript. For very large datasets (100k+ clicks), consider using SQL aggregation:

```sql
SELECT tool_id, COUNT(*) as click_count
FROM tool_clicks
GROUP BY tool_id;
```

## Future Enhancements

Potential features to add later:

- **Time-based filtering**: Show clicks by day/week/month
- **Chart visualization**: Line charts showing click trends over time
- **Click-through rate**: Compare views vs clicks
- **Geographic data**: Track clicks by country (requires IP geolocation)
- **Referrer tracking**: See where users come from
- **Export data**: Download analytics as CSV
- **Real-time updates**: Use Supabase Realtime for live dashboard

## Security Notes

- Click data is public (anyone can insert)
- Only admin users can view analytics (protected by middleware)
- No personally identifiable information (PII) is collected
- Consider adding rate limiting to prevent spam clicks

## Troubleshooting

### Clicks Not Being Tracked

1. Check browser console for errors
2. Verify `/api/track-click` endpoint is accessible
3. Check Supabase logs for database errors
4. Ensure RLS policy is set correctly

### Analytics Page Shows Zero Clicks

1. Verify `tool_clicks` table exists in Supabase
2. Check that tools have been clicked on the public site
3. Run query in Supabase to verify data:
   ```sql
   SELECT * FROM tool_clicks LIMIT 10;
   ```

### Migration Errors

If migration fails:
1. Check if table already exists
2. Verify foreign key constraint (tools table must exist)
3. Check Supabase error logs for details

## Testing

To test analytics:

1. Visit your public site
2. Click "Try It" on a few tools
3. Go to `/admin/analytics`
4. Verify clicks are showing up

You can also insert test data directly:

```sql
INSERT INTO tool_clicks (tool_id)
VALUES ('your-tool-id-here');
```

---

**Questions or Issues?**

Check the main README.md or PUBLIC_SITE.md for additional context.
