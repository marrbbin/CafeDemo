/**
 * Supabase Database Entity Definitions & Schemas
 */

export interface Business {
  id: string;
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  tagline?: string;
  hero_title?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  business_id: string;
  name: string;
  display_order?: number;
  created_at?: string;
}

export interface MenuItem {
  id: string;
  business_id: string;
  category_id?: string | null;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  created_at?: string;
}

export interface Reservation {
  id?: string;
  business_id: string;
  customer_name: string;
  contact_number: string;
  reservation_time: string;
  status?: string;
  party_size?: number;
  special_notes?: string;
  created_at?: string;
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: Business;
        Insert: Partial<Business> & { slug: string; name: string; latitude: number; longitude: number };
        Update: Partial<Business>;
      };
      categories: {
        Row: Category;
        Insert: Partial<Category> & { business_id: string; name: string };
        Update: Partial<Category>;
      };
      menu_items: {
        Row: MenuItem;
        Insert: Partial<MenuItem> & { business_id: string; name: string; price: number };
        Update: Partial<MenuItem>;
      };
      reservations: {
        Row: Reservation;
        Insert: Partial<Reservation> & { business_id: string; customer_name: string; contact_number: string; reservation_time: string };
        Update: Partial<Reservation>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
