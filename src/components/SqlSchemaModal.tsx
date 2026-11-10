import React, { useState, useEffect } from 'react';
import { Business, Reservation } from '../types/database';
import { 
  getSupabaseCredentials, 
  setCustomSupabaseCredentials, 
  checkRemoteTableStatus, 
  seedLiveSupabaseDirectly,
  getReservationsByBusinessId 
} from '../lib/supabase';
import { 
  X, Copy, Check, Database, ShieldCheck, Terminal, Layers, RefreshCw, 
  ExternalLink, Key, CheckCircle2, AlertCircle, Play, Server, ArrowRight 
} from 'lucide-react';

interface SqlSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business;
  onNavigateSlug: (slug: string) => void;
  onRefreshData?: () => void;
}

const SEED_ONLY_SQL = `-- ==============================================================================
-- RUN THIS IN SUPABASE SQL EDITOR TO INSERT SANDBOX CAFE INTO YOUR TABLES
-- ==============================================================================

-- 1. Insert SandBox Cafe Business
INSERT INTO businesses (id, slug, name, latitude, longitude, tagline, hero_title)
VALUES (
    'b2222222-2222-4222-8222-222222222222',
    'sandbox-cafe',
    'SandBox Cafe',
    10.833333,
    125.150000,
    'Discover tranquility at SandBox Cafe in Cadiz City, a warm sanctuary for unwinding, where your days are perfected with relaxation and rich handcrafted brews.',
    'Enjoy Your Coffee with SandBox Cafe'
)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude;

-- 2. Insert Categories
INSERT INTO categories (id, business_id, name, display_order)
VALUES 
    ('c1111111-0000-4000-8000-000000000001', 'b2222222-2222-4222-8222-222222222222', 'Signature Whipped', 1),
    ('c1111111-0000-4000-8000-000000000002', 'b2222222-2222-4222-8222-222222222222', 'Iced & Cold Brew', 2),
    ('c1111111-0000-4000-8000-000000000003', 'b2222222-2222-4222-8222-222222222222', 'Espresso & Latte', 3)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Menu Items (Prices in Philippine Pesos)
INSERT INTO menu_items (id, business_id, category_id, name, price, image_url, description)
VALUES
    (
        'm1111111-0000-4000-8000-000000000001',
        'b2222222-2222-4222-8222-222222222222',
        'c1111111-0000-4000-8000-000000000001',
        'Dalgona Velvet Crema',
        195.00,
        'https://images.unsplash.com/photo-1587080413959-06b859fb107d?auto=format&fit=crop&w=800&q=80',
        'Golden whipped coffee crema layered over silky chilled fresh milk with organic muscovado sugar.'
    ),
    (
        'm1111111-0000-4000-8000-000000000002',
        'b2222222-2222-4222-8222-222222222222',
        'c1111111-0000-4000-8000-000000000002',
        'Iced Caramel Macchiato',
        185.00,
        'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
        'Fresh milk stained with double espresso shots and buttery artisanal caramel syrup over ice.'
    ),
    (
        'm1111111-0000-4000-8000-000000000003',
        'b2222222-2222-4222-8222-222222222222',
        'c1111111-0000-4000-8000-000000000002',
        'Nitro Cold Brew on Slate',
        190.00,
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        'Single-origin slow-steeped 16-hour cold brew served with glass straw on volcanic dark slate.'
    ),
    (
        'm1111111-0000-4000-8000-000000000004',
        'b2222222-2222-4222-8222-222222222222',
        'c1111111-0000-4000-8000-000000000003',
        'Spanish Sun Rosetta Latte',
        175.00,
        'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
        'Velvety steamed milk with sweet condensed milk base and hand-poured rosetta leaf art in ceramic.'
    ),
    (
        'm1111111-0000-4000-8000-000000000005',
        'b2222222-2222-4222-8222-222222222222',
        'c1111111-0000-4000-8000-000000000003',
        'Artisan Flat White Saucer',
        165.00,
        'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
        'Rich micro-foam delicately folded over double ristretto espresso, served on porcelain saucer.'
    )
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Sample Reservation
INSERT INTO reservations (id, business_id, customer_name, contact_number, reservation_time, status, party_size, special_notes)
VALUES (
    'r1111111-0000-4000-8000-000000000001',
    'b2222222-2222-4222-8222-222222222222',
    'Maria Santos',
    '+63 917 842 9102',
    NOW() + INTERVAL '2 days',
    'confirmed',
    2,
    'Corner table in Cadiz City sanctuary'
)
ON CONFLICT (id) DO NOTHING;
`;

export const SqlSchemaModal: React.FC<SqlSchemaModalProps> = ({
  isOpen,
  onClose,
  business,
  onNavigateSlug,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'quick-seed' | 'connect' | 'reservations'>('connect');
  const [copied, setCopied] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);

  // Connection State
  const initialCreds = getSupabaseCredentials();
  const [inputUrl, setInputUrl] = useState(initialCreds.url);
  const [inputKey, setInputKey] = useState(initialCreds.key);
  const [isSaved, setIsSaved] = useState(false);

  // Diagnostic table status
  const [tableStatus, setTableStatus] = useState<{
    loading: boolean;
    connected: boolean;
    error?: string;
    counts: { businesses: number; categories: number; menu_items: number; reservations: number };
  }>({
    loading: false,
    connected: false,
    counts: { businesses: 0, categories: 0, menu_items: 0, reservations: 0 }
  });

  const [seedingStatus, setSeedingStatus] = useState<{ loading: boolean; message?: string; success?: boolean }>({
    loading: false
  });

  useEffect(() => {
    if (isOpen) {
      loadReservations();
      refreshTableStatus();
    }
  }, [isOpen, business.id]);

  const loadReservations = async () => {
    setLoadingReservations(true);
    try {
      const data = await getReservationsByBusinessId(business.id);
      setReservations(data);
    } finally {
      setLoadingReservations(false);
    }
  };

  const refreshTableStatus = async () => {
    setTableStatus((prev) => ({ ...prev, loading: true }));
    const res = await checkRemoteTableStatus();
    setTableStatus({
      loading: false,
      connected: res.connected,
      error: res.error,
      counts: res.counts
    });
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomSupabaseCredentials(inputUrl, inputKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
    refreshTableStatus();
    if (onRefreshData) onRefreshData();
  };

  const handleSeedDatabase = async () => {
    setSeedingStatus({ loading: true });
    const res = await seedLiveSupabaseDirectly();
    setSeedingStatus({ loading: false, message: res.message, success: res.success });
    refreshTableStatus();
    loadReservations();
    if (onRefreshData) onRefreshData();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const creds = getSupabaseCredentials();

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#1C1816] text-[#F9F6F0] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-white/10 relative my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7A4B3A] flex items-center justify-center text-white shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl text-white font-medium">
                Supabase Database &amp; Live Sync
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                SandBox Cafe &bull; Cadiz City Multi-Tenant RLS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-4 mb-4 border-b border-white/10 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('connect')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'connect'
                ? 'bg-[#7A4B3A] text-white font-medium'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>1. Connect Live Supabase</span>
            {creds.isConfigured && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>

          <button
            onClick={() => setActiveTab('quick-seed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'quick-seed'
                ? 'bg-[#7A4B3A] text-white font-medium'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>2. Seed SandBox Cafe SQL</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('reservations');
              loadReservations();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'reservations'
                ? 'bg-[#7A4B3A] text-white font-medium'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. View Live Reservations ({reservations.length})</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: CONNECT SUPABASE & LIVE STATUS
            ========================================================================= */}
        {activeTab === 'connect' && (
          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            
            {/* Explanation of why tables were empty */}
            <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/90 space-y-1.5">
              <strong className="block text-amber-300 font-serif text-sm">
                Why your Supabase tables currently show 0 rows:
              </strong>
              <p>
                1. <strong>Tables are created, but empty:</strong> Running the table setup creates the structure (<code className="text-white">businesses</code>, <code className="text-white">categories</code>, etc.), but the data hasn&apos;t been inserted yet.
              </p>
              <p>
                2. <strong>Connecting this app to your Supabase project:</strong> Paste your Supabase Project URL and Anon Key below so reservations made in the app are sent directly to your database!
              </p>
            </div>

            {/* Live Table Row Count Dashboard */}
            <div className="bg-black/40 rounded-2xl p-4 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-stone-300 flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${tableStatus.connected ? 'bg-emerald-400' : 'bg-stone-500'}`} />
                  <span>
                    {tableStatus.connected
                      ? `Connected to Supabase (${creds.url.slice(0, 30)}...)`
                      : 'Not connected to remote Supabase yet (Using local fallback client)'}
                  </span>
                </span>
                <button
                  onClick={refreshTableStatus}
                  disabled={tableStatus.loading}
                  className="text-xs text-stone-400 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${tableStatus.loading ? 'animate-spin' : ''}`} />
                  <span>Refresh Count</span>
                </button>
              </div>

              {/* Table Count Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-stone-400 font-mono uppercase block">businesses</span>
                  <span className="text-lg font-mono font-bold text-white">{tableStatus.counts.businesses}</span>
                  <span className="text-[10px] text-stone-500 block">rows</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-stone-400 font-mono uppercase block">categories</span>
                  <span className="text-lg font-mono font-bold text-white">{tableStatus.counts.categories}</span>
                  <span className="text-[10px] text-stone-500 block">rows</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-stone-400 font-mono uppercase block">menu_items</span>
                  <span className="text-lg font-mono font-bold text-white">{tableStatus.counts.menu_items}</span>
                  <span className="text-[10px] text-stone-500 block">rows</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-stone-400 font-mono uppercase block">reservations</span>
                  <span className="text-lg font-mono font-bold text-amber-300">{tableStatus.counts.reservations}</span>
                  <span className="text-[10px] text-stone-500 block">rows</span>
                </div>
              </div>

              {/* One-click seed button if connected */}
              {tableStatus.connected && (
                <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-stone-400">
                    Tables empty? Populate SandBox Cafe rows in one click:
                  </span>
                  <button
                    onClick={handleSeedDatabase}
                    disabled={seedingStatus.loading}
                    className="bg-[#7A4B3A] hover:bg-[#633A2C] disabled:bg-[#7A4B3A]/50 text-white px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    {seedingStatus.loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Seeding Supabase...
                      </span>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Populate SandBox Cafe Data</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {seedingStatus.message && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${seedingStatus.success ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-200' : 'bg-red-950/60 border border-red-500/30 text-red-200'}`}>
                  {seedingStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
                  <span>{seedingStatus.message}</span>
                </div>
              )}
            </div>

            {/* Credentials Input Form */}
            <form onSubmit={handleSaveCredentials} className="bg-black/40 rounded-2xl p-5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm text-white font-medium flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#D4A373]" />
                  <span>Enter Your Supabase Credentials</span>
                </h4>
                {creds.source === 'custom' && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomSupabaseCredentials('', '');
                      setInputUrl('');
                      setInputKey('');
                      refreshTableStatus();
                    }}
                    className="text-[11px] text-stone-400 hover:text-red-400 underline"
                  >
                    Disconnect / Reset
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1">
                  Project URL (e.g., https://xyzcompany.supabase.co)
                </label>
                <input
                  type="url"
                  required
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-[#7A4B3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-400 mb-1">
                  Anon / Public API Key
                </label>
                <input
                  type="password"
                  required
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-[#7A4B3A]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-stone-500">
                  Find in your Supabase Dashboard &rarr; Project Settings &rarr; API.
                </span>
                <button
                  type="submit"
                  className="bg-[#7A4B3A] hover:bg-[#633A2C] text-white px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved &amp; Connected!</span>
                    </>
                  ) : (
                    <>
                      <Server className="w-3.5 h-3.5" />
                      <span>Save &amp; Connect Live</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        )}

        {/* =========================================================================
            TAB 2: QUICK SEED SQL FOR SUPABASE SQL EDITOR
            ========================================================================= */}
        {activeTab === 'quick-seed' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5 text-xs">
              <span className="text-stone-300">
                Copy this SQL &rarr; Open Supabase SQL Editor &rarr; Paste &rarr; Click <strong>Run</strong>
              </span>
              <button
                onClick={() => handleCopy(SEED_ONLY_SQL)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7A4B3A] hover:bg-[#633A2C] text-white text-xs font-sans transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied SQL!' : 'Copy Seed SQL'}</span>
              </button>
            </div>

            <div className="relative rounded-2xl bg-black/60 p-4 font-mono text-xs text-stone-200 overflow-x-auto border border-white/10 leading-relaxed max-h-[360px]">
              <pre>{SEED_ONLY_SQL}</pre>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-2xl text-xs text-emerald-200 space-y-1">
              <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>What this inserts into your Supabase Database:</span>
              </p>
              <ul className="list-disc pl-5 space-y-0.5 text-stone-300 text-[11px]">
                <li><code className="text-white">businesses</code>: SandBox Cafe with Cadiz City GPS coordinates (10.833333, 125.150000)</li>
                <li><code className="text-white">categories</code>: Signature Whipped, Iced &amp; Cold Brew, Espresso &amp; Latte</li>
                <li><code className="text-white">menu_items</code>: 5 handcrafted coffee items with PHP pricing (₱165 - ₱195)</li>
                <li><code className="text-white">reservations</code>: 1 sample reservation for Maria Santos (+63 917 842 9102)</li>
              </ul>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: VIEW RESERVATIONS
            ========================================================================= */}
        {activeTab === 'reservations' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div className="flex items-center justify-between text-xs text-stone-300">
              <span>
                Tenant: <strong className="text-white">{business.name}</strong> ({business.slug})
              </span>
              <button
                onClick={loadReservations}
                disabled={loadingReservations}
                className="flex items-center gap-1 text-stone-400 hover:text-white text-xs cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingReservations ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {reservations.length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-xs bg-black/30 rounded-2xl border border-white/5">
                No reservations found yet. Click &ldquo;Book a Table&rdquo; in the app to test creating a live reservation!
              </div>
            ) : (
              <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-black/30">
                {reservations.map((res, i) => (
                  <div key={res.id || i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-medium text-white text-sm">{res.customer_name}</div>
                      <div className="text-stone-400 mt-0.5 font-mono">Contact: {res.contact_number}</div>
                      {res.special_notes && (
                        <div className="text-stone-400 italic mt-1 text-[11px]">&ldquo;{res.special_notes}&rdquo;</div>
                      )}
                    </div>
                    <div className="sm:text-right">
                      <div className="text-stone-300 font-mono">
                        {new Date(res.reservation_time).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-900/60 text-emerald-200 border border-emerald-500/20">
                        {res.status || 'pending'} &bull; {res.party_size || 2} guests
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
          <span>Database: <code className="text-stone-300">Supabase + PostgreSQL RLS</code></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-sans transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
