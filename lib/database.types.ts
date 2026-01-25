// TypeScript types for Supabase database schema

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  featured: boolean;
  visible: boolean;
  created_at: string;
}

export interface Tool {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  link: string | null;
  info_link: string | null; // Manual override for "More Info" button
  featured: boolean;
  visible: boolean;
  display_order?: number; // Optional until migration is run
  created_at: string;
}

export interface Ad {
  id: string;
  location: string;
  code_snippet: string | null;
  active: boolean;
  created_at: string;
}

export interface ToolClick {
  id: string;
  tool_id: string;
  clicked_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ToolPage {
  id: string;
  tool_id: string;
  slug: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryPage {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Database schema type
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
      };
      tools: {
        Row: Tool;
        Insert: Omit<Tool, 'id' | 'created_at'>;
        Update: Partial<Omit<Tool, 'id' | 'created_at'>>;
      };
      ads: {
        Row: Ad;
        Insert: Omit<Ad, 'id' | 'created_at'>;
        Update: Partial<Omit<Ad, 'id' | 'created_at'>>;
      };
      tool_clicks: {
        Row: ToolClick;
        Insert: Omit<ToolClick, 'id' | 'clicked_at'>;
        Update: Partial<Omit<ToolClick, 'id' | 'clicked_at'>>;
      };
      settings: {
        Row: Setting;
        Insert: Omit<Setting, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Setting, 'id' | 'created_at' | 'updated_at'>>;
      };
      pages: {
        Row: Page;
        Insert: Omit<Page, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Page, 'id' | 'created_at' | 'updated_at'>>;
      };
      tool_pages: {
        Row: ToolPage;
        Insert: Omit<ToolPage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ToolPage, 'id' | 'created_at' | 'updated_at'>>;
      };
      category_pages: {
        Row: CategoryPage;
        Insert: Omit<CategoryPage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CategoryPage, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
