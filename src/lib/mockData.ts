import { Business, Category, MenuItem, Reservation } from '../types/database';

export const SEED_BUSINESSES: Business[] = [
  {
    id: 'b2222222-2222-4222-8222-222222222222',
    slug: 'sandbox-cafe',
    name: 'SandBox Cafe',
    // Portside, X82C+7X8, Port, Cadiz City, 6121 Negros Occidental
    latitude: 10.950625,
    longitude: 123.322375,
    hero_title: 'Enjoy Your Coffee with SandBox Cafe',
    tagline: 'Discover tranquility at SandBox Cafe at Portside, Cadiz City, a warm sanctuary for unwinding, where your days are perfected with seaside breezes and rich handcrafted brews.',
    created_at: new Date().toISOString()
  }
];

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'c1111111-0000-4000-8000-000000000001',
    business_id: 'b2222222-2222-4222-8222-222222222222',
    name: 'Signature Whipped',
    display_order: 1
  },
  {
    id: 'c1111111-0000-4000-8000-000000000002',
    business_id: 'b2222222-2222-4222-8222-222222222222',
    name: 'Iced & Cold Brew',
    display_order: 2
  },
  {
    id: 'c1111111-0000-4000-8000-000000000003',
    business_id: 'b2222222-2222-4222-8222-222222222222',
    name: 'Espresso & Latte',
    display_order: 3
  }
];

export const SEED_MENU_ITEMS: MenuItem[] = [
  // Signature items with leaf-curved presentation and PHP currency
  {
    id: 'd1111111-0000-4000-8000-000000000001',
    business_id: 'b2222222-2222-4222-8222-222222222222',
    category_id: 'c1111111-0000-4000-8000-000000000001',
    name: 'Dalgona Velvet Crema',
    price: 195.00,
    image_url: 'https://images.unsplash.com/photo-1587080413959-06b859fb107d?auto=format&fit=crop&w=800&q=80',
    description: 'Golden whipped coffee crema layered over silky chilled fresh milk with organic muscovado sugar.'
  },
  {
    id: 'd1111111-0000-4000-8000-000000000002',
    business_id: 'b2222222-2222-4222-8222-222222222222',
    category_id: 'c1111111-0000-4000-8000-000000000002',
    name: 'Iced Caramel Macchiato',
    price: 185.00,
    image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh milk stained with double espresso shots and buttery artisanal caramel syrup over ice.'
  },
  {
    id: 'd1111111-0000-4000-8000-000000000003',
    business_id: 'b2222222-2222-4222-8222-222222222222',
    category_id: 'c1111111-0000-4000-8000-000000000002',
    name: 'Nitro Cold Brew on Slate',
    price: 190.00,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    description: 'Single-origin slow-steeped 16-hour cold brew served with glass straw on volcanic dark slate.'
  },
  {
    id: 'd1111111-0000-4000-8000-000000000004',
    business_id: 'b2222222-2222-4222-8222-222222222222',
    category_id: 'c1111111-0000-4000-8000-000000000003',
    name: 'Spanish Sun Rosetta Latte',
    price: 175.00,
    image_url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
    description: 'Velvety steamed milk with sweet condensed milk base and hand-poured rosetta leaf art in ceramic.'
  },
  {
    id: 'd1111111-0000-4000-8000-000000000005',
    business_id: 'b2222222-2222-4222-8222-222222222222',
    category_id: 'c1111111-0000-4000-8000-000000000003',
    name: 'Artisan Flat White Saucer',
    price: 165.00,
    image_url: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
    description: 'Rich micro-foam delicately folded over double ristretto espresso, served on porcelain saucer.'
  },
  {
    id: 'd1111111-0000-4000-8000-000000000006',
    business_id: 'b2222222-2222-4222-8222-222222222222',
    category_id: 'c1111111-0000-4000-8000-000000000003',
    name: 'SandBox Single-Origin Cortado',
    price: 160.00,
    image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    description: 'Equal ratio of double extracted espresso and velvety textured milk in a classic Gibraltar glass.'
  },
  {
    id: 'd1111111-0000-4000-8000-000000000007',
    business_id: 'b2222222-2222-4222-8222-222222222222',
    category_id: 'c1111111-0000-4000-8000-000000000001',
    name: 'Ceremonial Matcha Cloud',
    price: 210.00,
    image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    description: 'Stone-ground Uji ceremonial matcha whisked fresh and layered over silky oat milk with wild honey.'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'e1111111-0000-4000-8000-000000000001',
    business_id: 'b2222222-2222-4222-8222-222222222222',
    customer_name: 'Maria Santos',
    contact_number: '+63 917 842 9102',
    reservation_time: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'confirmed',
    party_size: 2,
    special_notes: 'Corner window table for quiet coffee tasting'
  }
];
