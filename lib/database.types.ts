// TypeScript types for Supabase database schema

export interface Category {
  id: string;
  name: string;
  description: string | null;
  featured: boolean;
  created_at: string;
}

export interface Tool {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  link: string | null;
  featured: boolean;
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
    };
  };
}
