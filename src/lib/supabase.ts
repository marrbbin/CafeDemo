import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Business, Category, MenuItem, Reservation } from '../types/database';
import { SEED_BUSINESSES, SEED_CATEGORIES, SEED_MENU_ITEMS, INITIAL_RESERVATIONS } from './mockData';

// Storage keys for local fallback and runtime credentials
const STORAGE_KEYS = {
  CUSTOM_URL: 'sandbox_custom_supabase_url',
  CUSTOM_KEY: 'sandbox_custom_supabase_anon_key',
  BUSINESSES: 'sandbox_cafe_businesses_data',
  CATEGORIES: 'sandbox_cafe_categories_data',
  MENU_ITEMS: 'sandbox_cafe_menu_items_data',
  RESERVATIONS: 'sandbox_cafe_reservations_data',
};

// Retrieve credentials from localStorage first, then from environment
export function getSupabaseCredentials(): { url: string; key: string; isConfigured: boolean; source: 'env' | 'custom' | 'none' } {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem(STORAGE_KEYS.CUSTOM_URL);
    const customKey = localStorage.getItem(STORAGE_KEYS.CUSTOM_KEY);
    if (customUrl && customKey && !customUrl.includes('placeholder')) {
      return { url: customUrl.trim(), key: customKey.trim(), isConfigured: true, source: 'custom' };
    }
  }

  const env = import.meta.env as Record<string, string | undefined>;
  const url = (env.VITE_SUPABASE_URL || env.SUPABASE_URL || '').trim();
  const key = (env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || env.SUPABASE_KEY || '').trim();

  const isConfigured = Boolean(
    url && 
    key && 
    url !== 'https://your-project.supabase.co' &&
    !url.includes('placeholder')
  );

  return {
    url,
    key,
    isConfigured,
    source: isConfigured ? 'env' : 'none'
  };
}

// Current credentials state
let creds = getSupabaseCredentials();

// Active Supabase client
export let supabase: SupabaseClient = createClient(
  creds.isConfigured ? creds.url : 'https://dummy-instance.supabase.co',
  creds.isConfigured ? creds.key : 'dummy-anon-key'
);

export let isSupabaseConfigured = creds.isConfigured;

// Update credentials dynamically from UI modal
export function setCustomSupabaseCredentials(url: string, key: string) {
  if (typeof window === 'undefined') return;
  const cleanUrl = url.trim();
  const cleanKey = key.trim();

  if (cleanUrl && cleanKey) {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_URL, cleanUrl);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_KEY, cleanKey);
    creds = { url: cleanUrl, key: cleanKey, isConfigured: true, source: 'custom' };
    supabase = createClient(cleanUrl, cleanKey);
    isSupabaseConfigured = true;
  } else {
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_URL);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_KEY);
    creds = getSupabaseCredentials();
    supabase = createClient(
      creds.isConfigured ? creds.url : 'https://dummy-instance.supabase.co',
      creds.isConfigured ? creds.key : 'dummy-anon-key'
    );
    isSupabaseConfigured = creds.isConfigured;
  }
}

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
  } else {
    // Sync coordinates if still holding old coordinates
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || '[]');
      if (existing.length > 0 && (existing[0].longitude === 125.15 || existing[0].latitude === 10.833333)) {
        localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(SEED_BUSINESSES));
      }
    } catch {
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(SEED_BUSINESSES));
    }
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
  const currentCreds = getSupabaseCredentials();

  if (currentCreds.isConfigured) {
    try {
      // 1. Try case-insensitive slug match
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .ilike('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return data as Business;
      }

      // 2. If not found by exact slug, check if any business exists in user's Supabase database
      const { data: firstBiz, error: firstErr } = await supabase
        .from('businesses')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!firstErr && firstBiz) {
        return firstBiz as Business;
      }
    } catch (err) {
      console.warn('Network error reaching Supabase, using fallback data:', err);
    }
  }

  // Guarantee SandBox Cafe is returned so the site always displays
  return SEED_BUSINESSES[0];
}

/**
 * Fetch categories belonging to a specific business_id
 */
export async function getCategoriesByBusinessId(businessId: string): Promise<Category[]> {
  const currentCreds = getSupabaseCredentials();

  if (currentCreds.isConfigured) {
    try {
      // 1. Try matching by business_id
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('business_id', businessId)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }

      // 2. If none match businessId, fetch all categories in the database
      const { data: allDbCats } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (allDbCats && allDbCats.length > 0) {
        return allDbCats as Category[];
      }
    } catch (err) {
      console.warn('Error reaching Supabase categories:', err);
    }
  }

  // Guaranteed fallback categories
  return SEED_CATEGORIES.map((cat) => ({
    ...cat,
    business_id: businessId
  }));
}

/**
 * Fetch menu items belonging to a specific business_id
 */
export async function getMenuItemsByBusinessId(businessId: string): Promise<MenuItem[]> {
  const currentCreds = getSupabaseCredentials();

  if (currentCreds.isConfigured) {
    try {
      // 1. Try matching by business_id
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('business_id', businessId);

      if (!error && data && data.length > 0) {
        return data as MenuItem[];
      }

      // 2. If none match businessId, fetch all menu items in the database
      const { data: allDbItems } = await supabase
        .from('menu_items')
        .select('*');

      if (allDbItems && allDbItems.length > 0) {
        return allDbItems as MenuItem[];
      }
    } catch (err) {
      console.warn('Error reaching Supabase menu_items:', err);
    }
  }

  // Guaranteed fallback menu items (so the website is NEVER blank)
  return SEED_MENU_ITEMS.map((item) => ({
    ...item,
    business_id: businessId
  }));
}

/**
 * Submit a table reservation via Supabase INSERT
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

  const currentCreds = getSupabaseCredentials();

  if (currentCreds.isConfigured) {
    try {
      // 1. Ensure business exists in Supabase so foreign key constraint is satisfied
      const { data: existingBiz } = await supabase
        .from('businesses')
        .select('id')
        .eq('id', payload.business_id)
        .maybeSingle();

      if (!existingBiz) {
        const { data: anyBiz } = await supabase
          .from('businesses')
          .select('id')
          .limit(1)
          .maybeSingle();

        if (anyBiz) {
          payload.business_id = anyBiz.id;
        } else {
          // Insert SandBox Cafe into businesses table first
          await supabase
            .from('businesses')
            .upsert([SEED_BUSINESSES[0] as any], { onConflict: 'slug' });
        }
      }

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

      // Also save locally as mirror
      saveReservationLocally(data as Reservation);
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
    id: res.id || `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
  };
  reservations.unshift(newRes);
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  return newRes;
}

/**
 * Get reservations for developer drawer / confirmation lookup
 */
export async function getReservationsByBusinessId(businessId: string): Promise<Reservation[]> {
  const currentCreds = getSupabaseCredentials();

  if (currentCreds.isConfigured) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
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

/**
 * Diagnostic tool: Check remote table row counts
 */
export async function checkRemoteTableStatus(): Promise<{
  connected: boolean;
  error?: string;
  counts: {
    businesses: number;
    categories: number;
    menu_items: number;
    reservations: number;
  };
}> {
  const currentCreds = getSupabaseCredentials();
  if (!currentCreds.isConfigured) {
    return {
      connected: false,
      error: 'Supabase URL and Anon key are not provided yet.',
      counts: { businesses: 0, categories: 0, menu_items: 0, reservations: 0 }
    };
  }

  try {
    const [bizRes, catRes, menuRes, resRes] = await Promise.all([
      supabase.from('businesses').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('menu_items').select('*', { count: 'exact', head: true }),
      supabase.from('reservations').select('*', { count: 'exact', head: true }),
    ]);

    if (bizRes.error) {
      return {
        connected: false,
        error: bizRes.error.message,
        counts: { businesses: 0, categories: 0, menu_items: 0, reservations: 0 }
      };
    }

    return {
      connected: true,
      counts: {
        businesses: bizRes.count || 0,
        categories: catRes.count || 0,
        menu_items: menuRes.count || 0,
        reservations: resRes.count || 0,
      }
    };
  } catch (err: any) {
    return {
      connected: false,
      error: err.message || 'Failed to connect to Supabase.',
      counts: { businesses: 0, categories: 0, menu_items: 0, reservations: 0 }
    };
  }
}

/**
 * One-click browser helper to seed SandBox Cafe directly into remote Supabase
 */
export async function seedLiveSupabaseDirectly(): Promise<{ success: boolean; message: string }> {
  const currentCreds = getSupabaseCredentials();
  if (!currentCreds.isConfigured) {
    return { success: false, message: 'Please enter your Supabase URL & Anon Key first.' };
  }

  try {
    // 1. Insert or update SandBox Cafe business
    const biz = SEED_BUSINESSES[0];
    const { error: bizErr } = await supabase
      .from('businesses')
      .upsert([biz as any], { onConflict: 'slug' });

    if (bizErr) throw new Error(`Businesses insert error: ${bizErr.message}`);

    // 2. Insert Categories
    const { error: catErr } = await supabase
      .from('categories')
      .upsert(SEED_CATEGORIES as any[], { onConflict: 'id' });

    if (catErr) throw new Error(`Categories insert error: ${catErr.message}`);

    // 3. Insert Menu Items
    const { error: menuErr } = await supabase
      .from('menu_items')
      .upsert(SEED_MENU_ITEMS as any[], { onConflict: 'id' });

    if (menuErr) throw new Error(`Menu Items insert error: ${menuErr.message}`);

    // 4. Insert Initial Reservation
    const { error: resErr } = await supabase
      .from('reservations')
      .upsert(INITIAL_RESERVATIONS as any[], { onConflict: 'id' });

    if (resErr) throw new Error(`Reservation insert error: ${resErr.message}`);

    return { success: true, message: 'SandBox Cafe data seeded successfully into your Supabase database!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Seeding failed. Please check RLS policies or run the SQL script in SQL Editor.' };
  }
}
