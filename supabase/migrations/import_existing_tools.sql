-- Migration: Import Existing Tools from AidashTools.com
-- Run this AFTER running the main schema.sql

-- Insert Categories
INSERT INTO categories (name, description, featured) VALUES
('AI Chatbots', 'Conversational AI assistants and chatbots for various tasks', true),
('AI Image Creation', 'AI-powered image generation and art creation tools', true),
('AI Video Creation', 'AI video generation and editing platforms', true),
('AI Music Generation', 'AI tools for creating music and audio content', true),
('AI Programming Tools', 'AI-assisted coding and development tools', true),
('AI Web Design Tools', 'AI-powered website builders and design assistants', true),
('AI Data Analytics', 'AI-driven data analysis and visualization platforms', true);

-- Get category IDs (these will be used in tool insertions)
-- Note: Replace the UUIDs below after running the category insert

-- AI CHATBOTS (9 tools)
INSERT INTO tools (category_id, name, description, link, featured) VALUES
((SELECT id FROM categories WHERE name = 'AI Chatbots'), 'ChatGPT', 'OpenAI''s advanced conversational AI chatbot powered by GPT-4. Perfect for writing, coding, analysis, and creative tasks', 'https://chat.openai.com', true),
((SELECT id FROM categories WHERE name = 'AI Chatbots'), 'Claude', 'Anthropic''s AI assistant with advanced reasoning capabilities. Excellent for complex analysis, coding, writing', 'https://claude.ai', true),
((SELECT id FROM categories WHERE name = 'AI Chatbots'), 'Perplexity AI', 'AI-powered search engine and answer engine with source citations. Perfect for research and finding accurate information', 'https://perplexity.ai', true),
((SELECT id FROM categories WHERE name = 'AI Chatbots'), 'Google Gemini', 'Google''s multimodal AI chatbot with deep integration into Google services', 'https://gemini.google.com', false),
((SELECT id FROM categories WHERE name = 'AI Chatbots'), 'Microsoft Copilot', 'Microsoft''s AI assistant integrated with Bing and Office 365. Great for productivity and web search', 'https://copilot.microsoft.com', false),
((SELECT id FROM categories WHERE name = 'AI Chatbots'), 'Meta AI', 'Meta''s AI assistant powered by Llama models. Integrated with Facebook, Instagram, and WhatsApp', 'https://ai.meta.com', false),
((SELECT id FROM categories WHERE name = 'AI Chatbots'), 'Pi AI', 'Personal AI chatbot by Inflection AI focused on emotional intelligence and supportive conversations', 'https://pi.ai', false),
((SELECT id FROM categories WHERE name = 'AI Chatbots'), 'Character.AI', 'Create and chat with AI characters. Perfect for entertainment, roleplay, learning, and creative storytelling', 'https://character.ai', false),
((SELECT id FROM categories WHERE name = 'AI Chatbots'), 'YouChat', 'AI chatbot integrated with You.com search engine. Combines conversational AI with real-time web search', 'https://you.com', false);

-- AI IMAGE CREATION (9 tools)
INSERT INTO tools (category_id, name, description, link, featured) VALUES
((SELECT id FROM categories WHERE name = 'AI Image Creation'), 'Midjourney', 'Leading AI art generator creating stunning, high-quality images from text descriptions', 'https://midjourney.com', true),
((SELECT id FROM categories WHERE name = 'AI Image Creation'), 'DALL-E 3', 'OpenAI''s advanced image generation model with exceptional prompt understanding and photorealistic results', 'https://openai.com/dall-e-3', true),
((SELECT id FROM categories WHERE name = 'AI Image Creation'), 'Leonardo.AI', 'AI art generator with game assets focus. Perfect for creating consistent characters, items, and concept art', 'https://leonardo.ai', true),
((SELECT id FROM categories WHERE name = 'AI Image Creation'), 'Stable Diffusion', 'Open-source AI image generator with powerful customization options. Free to use and run locally', 'https://stability.ai', false),
((SELECT id FROM categories WHERE name = 'AI Image Creation'), 'Adobe Firefly', 'Adobe''s AI image generator integrated with Creative Cloud. Commercial-safe AI art generation for designers', 'https://firefly.adobe.com', false),
((SELECT id FROM categories WHERE name = 'AI Image Creation'), 'Canva AI', 'Built-in AI image generation within Canva''s design platform. Simple interface for creating custom graphics', 'https://canva.com/ai-image-generator', false),
((SELECT id FROM categories WHERE name = 'AI Image Creation'), 'Ideogram', 'AI image generator with exceptional text rendering capabilities. Great for creating logos, posters, typography art', 'https://ideogram.ai', false),
((SELECT id FROM categories WHERE name = 'AI Image Creation'), 'DreamStudio', 'Official Stable Diffusion interface by Stability AI. Advanced controls for professional AI image generation', 'https://dreamstudio.ai', false),
((SELECT id FROM categories WHERE name = 'AI Image Creation'), 'Playground AI', 'Free AI image generator with mixed image editing capabilities. Great for experimenting and creating variations', 'https://playgroundai.com', false);

-- AI VIDEO CREATION (9 tools)
INSERT INTO tools (category_id, name, description, link, featured) VALUES
((SELECT id FROM categories WHERE name = 'AI Video Creation'), 'Runway Gen-3', 'Next-generation AI video creation platform with text-to-video and image-to-video capabilities', 'https://runwayml.com', true),
((SELECT id FROM categories WHERE name = 'AI Video Creation'), 'Pika Labs', 'AI video generator creating smooth, cinematic clips from text prompts. User-friendly with impressive results', 'https://pika.art', true),
((SELECT id FROM categories WHERE name = 'AI Video Creation'), 'InVideo AI', 'AI video creation platform with templates and stock footage. Create professional videos quickly', 'https://invideo.ai', true),
((SELECT id FROM categories WHERE name = 'AI Video Creation'), 'Synthesia', 'Create professional AI videos with virtual presenters. Perfect for training videos, marketing, presentations', 'https://synthesia.io', false),
((SELECT id FROM categories WHERE name = 'AI Video Creation'), 'D-ID', 'AI video platform with talking avatar generation. Transform photos into speaking videos', 'https://d-id.com', false),
((SELECT id FROM categories WHERE name = 'AI Video Creation'), 'HeyGen', 'AI video generator for creating spokesperson videos with custom avatars. Great for marketing explainers', 'https://heygen.com', false),
((SELECT id FROM categories WHERE name = 'AI Video Creation'), 'Descript', 'AI-powered video and podcast editing with text-based editing. Edit videos as easily as editing documents', 'https://descript.com', false),
((SELECT id FROM categories WHERE name = 'AI Video Creation'), 'Pictory', 'Turn long-form content into short videos automatically. Perfect for creating social media content', 'https://pictory.ai', false),
((SELECT id FROM categories WHERE name = 'AI Video Creation'), 'Fliki', 'Convert text into videos with AI voices and visuals. Easy-to-use platform for creating video content', 'https://fliki.ai', false);

-- AI MUSIC GENERATION (9 tools)
INSERT INTO tools (category_id, name, description, link, featured) VALUES
((SELECT id FROM categories WHERE name = 'AI Music Generation'), 'Suno AI', 'Revolutionary AI music generator creating complete songs with vocals from text prompts', 'https://suno.ai', true),
((SELECT id FROM categories WHERE name = 'AI Music Generation'), 'Udio', 'Advanced AI music creation platform with exceptional audio quality and style control', 'https://udio.com', true),
((SELECT id FROM categories WHERE name = 'AI Music Generation'), 'Mubert', 'AI music generator for royalty-free tracks. Perfect for content creators, streamers, video producers', 'https://mubert.com', false),
((SELECT id FROM categories WHERE name = 'AI Music Generation'), 'AIVA', 'AI music composition assistant for creating soundtracks and background music', 'https://aiva.ai', false),
((SELECT id FROM categories WHERE name = 'AI Music Generation'), 'Soundraw', 'Customizable AI music generator with mood and tempo controls. Create unique background music', 'https://soundraw.io', false),
((SELECT id FROM categories WHERE name = 'AI Music Generation'), 'Boomy', 'Create original songs in seconds and release them to streaming platforms. Monetize AI-generated music', 'https://boomy.com', false),
((SELECT id FROM categories WHERE name = 'AI Music Generation'), 'Soundful', 'AI music generator for royalty-free tracks with extensive customization. Great for commercial use', 'https://soundful.com', false),
((SELECT id FROM categories WHERE name = 'AI Music Generation'), 'Beatoven.ai', 'Create customized royalty-free music for videos. AI adapts music to your video''s mood and pacing', 'https://beatoven.ai', false),
((SELECT id FROM categories WHERE name = 'AI Music Generation'), 'Splash Pro', 'AI music creation platform with vocal synthesis. Create complete tracks with AI-generated vocals', 'https://splashmusic.com', false);

-- AI PROGRAMMING TOOLS (9 tools)
INSERT INTO tools (category_id, name, description, link, featured) VALUES
((SELECT id FROM categories WHERE name = 'AI Programming Tools'), 'GitHub Copilot', 'AI pair programmer that suggests code completions and entire functions. Supports dozens of languages', 'https://github.com/features/copilot', true),
((SELECT id FROM categories WHERE name = 'AI Programming Tools'), 'Cursor', 'AI-first code editor with advanced code generation and editing. Built specifically for AI-assisted development', 'https://cursor.sh', true),
((SELECT id FROM categories WHERE name = 'AI Programming Tools'), 'Replit AI', 'AI-powered coding platform with instant deployment. Code, collaborate, and deploy with AI assistance', 'https://replit.com', true),
((SELECT id FROM categories WHERE name = 'AI Programming Tools'), 'Tabnine', 'AI code completion tool trained on open-source code. Privacy-focused with on-device processing options', 'https://tabnine.com', false),
((SELECT id FROM categories WHERE name = 'AI Programming Tools'), 'Codeium', 'Free AI code completion tool with support for 70+ languages. Fast autocomplete and intelligent suggestions', 'https://codeium.com', false),
((SELECT id FROM categories WHERE name = 'AI Programming Tools'), 'Amazon CodeWhisperer', 'AWS''s AI coding companion with security scanning. Optimized for AWS services and cloud development', 'https://aws.amazon.com/codewhisperer', false),
((SELECT id FROM categories WHERE name = 'AI Programming Tools'), 'Pieces for Developers', 'AI-powered code snippet manager with context-aware suggestions. Save, share, generate code snippets', 'https://pieces.app', false),
((SELECT id FROM categories WHERE name = 'AI Programming Tools'), 'Sourcegraph Cody', 'AI coding assistant with codebase understanding. Chat with your code and get contextual answers', 'https://sourcegraph.com/cody', false),
((SELECT id FROM categories WHERE name = 'AI Programming Tools'), 'v0 by Vercel', 'Generate React components from text descriptions. Create UI components with AI and copy code instantly', 'https://v0.dev', false);

-- AI WEB DESIGN TOOLS (9 tools)
INSERT INTO tools (category_id, name, description, link, featured) VALUES
((SELECT id FROM categories WHERE name = 'AI Web Design Tools'), 'Framer AI', 'AI-powered website builder with natural language design. Create complete websites from text descriptions', 'https://framer.com', true),
((SELECT id FROM categories WHERE name = 'AI Web Design Tools'), 'Webflow AI', 'Professional website builder with AI design assistance. No-code platform with powerful customization', 'https://webflow.com', true),
((SELECT id FROM categories WHERE name = 'AI Web Design Tools'), 'Wix ADI', 'Artificial Design Intelligence that creates custom websites based on your needs. Quick setup with AI guidance', 'https://wix.com', false),
((SELECT id FROM categories WHERE name = 'AI Web Design Tools'), '10Web AI Builder', 'AI-powered WordPress website builder. Create professional websites with automated hosting optimization', 'https://10web.io', false),
((SELECT id FROM categories WHERE name = 'AI Web Design Tools'), 'Durable AI', 'Build a complete website in 30 seconds with AI. Automated design, content, and images for small businesses', 'https://durable.co', false),
((SELECT id FROM categories WHERE name = 'AI Web Design Tools'), 'Hostinger AI Builder', 'AI website builder with hosting included. Create and publish websites quickly with drag-and-drop simplicity', 'https://hostinger.com', false),
((SELECT id FROM categories WHERE name = 'AI Web Design Tools'), 'Jimdo Dolphin', 'AI website assistant that builds sites through conversation. Simple setup for personal and business websites', 'https://jimdo.com', false),
((SELECT id FROM categories WHERE name = 'AI Web Design Tools'), 'Bookmark AiDA', 'AI Design Assistant for creating websites in minutes. Smart design decisions based on industry preferences', 'https://bookmark.com', false),
((SELECT id FROM categories WHERE name = 'AI Web Design Tools'), 'Teleporthq', 'AI-powered low-code platform for web development. Design to code with AI assistance and collaboration tools', 'https://teleporthq.io', false);

-- AI DATA ANALYTICS (9 tools)
INSERT INTO tools (category_id, name, description, link, featured) VALUES
((SELECT id FROM categories WHERE name = 'AI Data Analytics'), 'Tableau AI', 'Industry-leading data visualization platform with AI-powered insights. Ask questions in natural language', 'https://tableau.com', true),
((SELECT id FROM categories WHERE name = 'AI Data Analytics'), 'Power BI Copilot', 'Microsoft''s AI-enhanced business intelligence tool. Create reports and dashboards with conversational AI', 'https://powerbi.microsoft.com', true),
((SELECT id FROM categories WHERE name = 'AI Data Analytics'), 'Julius AI', 'AI data analyst that interprets and visualizes data. Upload datasets and ask questions for instant insights', 'https://julius.ai', false),
((SELECT id FROM categories WHERE name = 'AI Data Analytics'), 'Polymer', 'AI-powered data analysis platform that creates dashboards automatically. No coding required for analytics', 'https://polymersearch.com', false),
((SELECT id FROM categories WHERE name = 'AI Data Analytics'), 'MonkeyLearn', 'AI text analysis platform for customer feedback and data insights. Automated sentiment analysis', 'https://monkeylearn.com', false),
((SELECT id FROM categories WHERE name = 'AI Data Analytics'), 'DataRobot', 'Enterprise AI platform for automated machine learning and predictive analytics. Build and deploy ML models', 'https://datarobot.com', false),
((SELECT id FROM categories WHERE name = 'AI Data Analytics'), 'Akkio', 'No-code AI platform for business analytics. Build predictive models and forecasts without data science expertise', 'https://akkio.com', false),
((SELECT id FROM categories WHERE name = 'AI Data Analytics'), 'Looker Studio AI', 'Google''s free business intelligence tool with AI capabilities. Create interactive dashboards and reports', 'https://lookerstudio.google.com', false),
((SELECT id FROM categories WHERE name = 'AI Data Analytics'), 'Obviously AI', 'Build and deploy machine learning models in minutes. No-code predictive analytics for business users', 'https://obviously.ai', false);

-- Summary
-- Total: 7 categories, 72 tools (24 featured, 48 standard)
