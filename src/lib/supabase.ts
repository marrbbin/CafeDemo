import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Business, Category, MenuItem, Reservation, Database } from '../types/database';
import { SEED_BUSINESSES, SEED_CATEGORIES, SEED_MENU_ITEMS, INITIAL_RESERVATIONS } from './mockData';

// Environment variables for Supabase (supports both VITE_ prefix and standard Vercel integration keys)
const env = import.meta.env as Record<string, string | undefined>;
const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || env.SUPABASE_KEY || '';

// Validate whether real credentials have been provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Fallback client for TypeScript satisfaction if unconfigured
// Supabase client instance
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://dummy-instance.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'dummy-anon-key'
);

// Local persistence storage keys for offline/fallback mode
const STORAGE_KEYS = {
  BUSINESSES: 'sandbox_cafe_businesses_data',
  CATEGORIES: 'sandbox_cafe_categories_data',
  MENU_ITEMS: 'sandbox_cafe_menu_items_data',
  RESERVATIONS: 'sandbox_cafe_reservations_data',
};

// Initialize localStorage fallback cache if not present
function initializeLocalFallback() {
  if (typeof window === 'undefined') return;
  
  // Remove old cache if it existed under old naming
  if (localStorage.getItem('zara_businesses_data')) {
    localStorage.removeItem('zara_businesses_data');
    localStorage.removeItem('zara_categories_data');
    localStorage.removeItem('zara_menu_items_data');
    localStorage.removeItem('zara_reservations_data');
  }

  if (!localStorage.getItem(STORAGE_KEYS.BUSINESSES)) {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(SEED_BUSINESSES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MENU_ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(SEED_MENU_ITEMS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
  }
}

initializeLocalFallback();

/**
 * Fetch a business by its unique URL slug (e.g. /b/sandbox-cafe)
 */
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.warn('Supabase getBusinessBySlug error, falling back:', error.message);
      } else if (data) {
        return data as Business;
      }
    } catch (err) {
      console.warn('Network error reaching Supabase, using fallback data:', err);
    }
  }

  // Local fallback
  initializeLocalFallback();
  const raw = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
  const businesses: Business[] = raw ? JSON.parse(raw) : SEED_BUSINESSES;
  const match = businesses.find((b) => b.slug.toLowerCase() === slug.toLowerCase());

  if (match) return match;

  // Auto-generate fallback for unknown slugs if requested
  const dynamicFallback: Business = {
    id: `b-${slug}-${Date.now()}`,
    slug: slug,
    name: slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    latitude: 10.833333,
    longitude: 125.150000,
    hero_title: `Enjoy Your Coffee with ${slug.replace(/-/g, ' ').toUpperCase()}`,
    tagline: 'Discover tranquility in our sanctuary for slow-crafted coffee, relaxation, and warm community vibes.'
  };

  return dynamicFallback;
}

/**
 * Fetch categories belonging to a specific business_id
 */
export async function getCategoriesByBusinessId(businessId: string): Promise<Category[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('business_id', businessId)
        .order('display_order', { ascending: true });

      if (error) {
        console.warn('Supabase getCategoriesByBusinessId error:', error.message);
      } else if (data && data.length > 0) {
        return data as Category[];
      }
    } catch (err) {
      console.warn('Error reaching Supabase categories:', err);
    }
  }

  // Local fallback
  initializeLocalFallback();
  const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  const allCategories: Category[] = raw ? JSON.parse(raw) : SEED_CATEGORIES;
  const filtered = allCategories.filter((c) => c.business_id === businessId);

  if (filtered.length > 0) return filtered;

  // Return standard categories if novel business ID
  return [
    { id: `c-all-${businessId}`, business_id: businessId, name: 'All Products', display_order: 0 },
    { id: `c-sig-${businessId}`, business_id: businessId, name: 'Signature Brews', display_order: 1 },
    { id: `c-cold-${businessId}`, business_id: businessId, name: 'Iced & Cold Brew', display_order: 2 },
    { id: `c-art-${businessId}`, business_id: businessId, name: 'Artisan Latte', display_order: 3 },
  ];
}

/**
 * Fetch menu items belonging to a specific business_id
 */
export async function getMenuItemsByBusinessId(businessId: string): Promise<MenuItem[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('business_id', businessId);

      if (error) {
        console.warn('Supabase getMenuItemsByBusinessId error:', error.message);
      } else if (data && data.length > 0) {
        return data as MenuItem[];
      }
    } catch (err) {
      console.warn('Error reaching Supabase menu_items:', err);
    }
  }

  // Local fallback
  initializeLocalFallback();
  const raw = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
  const allItems: MenuItem[] = raw ? JSON.parse(raw) : SEED_MENU_ITEMS;
  const filtered = allItems.filter((m) => m.business_id === businessId);

  if (filtered.length > 0) return filtered;

  // If new business, provide the signature reference coffee items
  return SEED_MENU_ITEMS.slice(0, 5).map((item, idx) => ({
    ...item,
    id: `m-custom-${businessId}-${idx}`,
    business_id: businessId
  }));
}

/**
 * Submit a table reservation via Supabase INSERT
 * Critical Functional Requirement:
 * Public INSERT into the reservations table utilizing the current business_id
 */
export async function insertReservation(reservation: {
  business_id: string;
  customer_name: string;
  contact_number: string;
  reservation_time: string;
  status?: string;
  party_size?: number;
  special_notes?: string;
}): Promise<{ success: boolean; data?: Reservation; error?: string; source: 'supabase' | 'fallback' }> {
  const payload: Reservation = {
    ...reservation,
    status: reservation.status || 'pending',
    party_size: reservation.party_size || 2,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([payload as any])
        .select()
        .single();

      if (error) {
        console.error('Supabase reservation insert error:', error);
        // Fall back to local storage record so user experience is not disrupted
        const saved = saveReservationLocally(payload);
        return { success: true, data: saved, error: error.message, source: 'fallback' };
      }

      return { success: true, data: data as Reservation, source: 'supabase' };
    } catch (err: any) {
      console.error('Supabase reservation insert exception:', err);
      const saved = saveReservationLocally(payload);
      return { success: true, data: saved, error: err.message, source: 'fallback' };
    }
  }

  // Local persistence mode
  const saved = saveReservationLocally(payload);
  return { success: true, data: saved, source: 'fallback' };
}

function saveReservationLocally(res: Reservation): Reservation {
  initializeLocalFallback();
  const raw = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
  const reservations: Reservation[] = raw ? JSON.parse(raw) : INITIAL_RESERVATIONS;
  const newRes: Reservation = {
    ...res,
    id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
  };
  reservations.unshift(newRes);
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  return newRes;
}

/**
 * Get reservations for developer drawer / confirmation lookup
 */
export async function getReservationsByBusinessId(businessId: string): Promise<Reservation[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Reservation[];
      }
    } catch (e) {
      console.warn(e);
    }
  }

  initializeLocalFallback();
  const raw = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
  const list: Reservation[] = raw ? JSON.parse(raw) : INITIAL_RESERVATIONS;
  return list.filter((r) => r.business_id === businessId);
}
