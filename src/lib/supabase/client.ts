import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

/**
 * Supabase client for browser-side operations
 * Uses the anonymous key for public access
 */
export const supabase = createClient(
  env.supabase.url,
  env.supabase.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/**
 * Database types (to be generated from Supabase)
 * For now, we define them manually
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      lists: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          is_public: boolean;
          share_code: string;
          category: string;
          cover_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          is_public?: boolean;
          share_code: string;
          category: string;
          cover_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          is_public?: boolean;
          share_code?: string;
          category?: string;
          cover_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      places: {
        Row: {
          id: string;
          google_place_id: string | null;
          name: string;
          address: string;
          lat: number;
          lng: number;
          cuisine_type: string[];
          tags: string[];
          cultural_context: string | null;
          image_url: string | null;
          rating: number | null;
          price_level: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          google_place_id?: string | null;
          name: string;
          address: string;
          lat: number;
          lng: number;
          cuisine_type?: string[];
          tags?: string[];
          cultural_context?: string | null;
          image_url?: string | null;
          rating?: number | null;
          price_level?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          google_place_id?: string | null;
          name?: string;
          address?: string;
          lat?: number;
          lng?: number;
          cuisine_type?: string[];
          tags?: string[];
          cultural_context?: string | null;
          image_url?: string | null;
          rating?: number | null;
          price_level?: number | null;
          created_at?: string;
        };
      };
      list_places: {
        Row: {
          list_id: string;
          place_id: string;
          position: number;
          note: string | null;
        };
        Insert: {
          list_id: string;
          place_id: string;
          position: number;
          note?: string | null;
        };
        Update: {
          list_id?: string;
          place_id?: string;
          position?: number;
          note?: string | null;
        };
      };
    };
  };
}
