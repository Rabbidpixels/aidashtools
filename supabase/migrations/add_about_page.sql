-- Add About Us page to the pages table

INSERT INTO pages (id, slug, title, content, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'about',
  'About Us',
  '## About AI Dash Tools

AI Dash Tools was created with one simple goal: make useful AI tools easy to find, easy to use, and actually helpful.

There''s no shortage of AI out there — but most of it is either locked behind paywalls, buried in complicated platforms, or overloaded with features nobody asked for. We built AI Dash Tools to cut through that noise.

Our focus is on practical tools that help people get things done faster, whether that''s writing, brainstorming, analyzing, generating ideas, or solving everyday problems. No fluff. No unnecessary friction. Just tools that work.

## Why We Built This

We noticed a pattern:

- People want AI help, but don''t want to learn a new platform every time
- Many AI sites push subscriptions before proving value
- Simple tools are often scattered across dozens of sites

AI Dash Tools brings those tools together in one place, with a clean interface and straightforward results.

## What You Can Expect

⚡ Fast, lightweight AI tools

🧠 Clear inputs and useful outputs

🔧 No overcomplicated dashboards

📱 Tools that work across devices

We''re constantly refining existing tools and adding new ones based on real use, not trends.

## Built to Grow

AI Dash Tools is actively evolving. New tools, improvements, and refinements are added over time as AI capabilities expand and user needs change.

Our philosophy is simple:

**If a tool isn''t useful, it doesn''t belong here.**

## Looking Ahead

This is just the beginning. AI Dash Tools will continue to grow into a practical hub for AI-powered utilities — focused on accessibility, speed, and real-world value.

Thanks for checking it out and being part of the journey.',
  now(),
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = now();
