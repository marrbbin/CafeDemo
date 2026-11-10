import React, { useState, useEffect, useCallback } from 'react';
import { Business, Category, MenuItem, Reservation } from './types/database';
import { 
  getBusinessBySlug, 
  getCategoriesByBusinessId, 
  getMenuItemsByBusinessId, 
  isSupabaseConfigured 
} from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductShowcase } from './components/ProductShowcase';
import { AboutSection } from './components/AboutSection';
import { LocationSection } from './components/LocationSection';
import { TestimonialSection } from './components/TestimonialSection';
import { Footer } from './components/Footer';
import { ReservationModal } from './components/ReservationModal';
import { SqlSchemaModal } from './components/SqlSchemaModal';
import { Coffee, MapPin, Calendar, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Extract business slug from /b/:slug
  const getSlugFromUrl = (): string => {
    if (typeof window === 'undefined') return 'sandbox-cafe';
    const path = window.location.pathname;
    const match = path.match(/\/b\/([^/]+)/);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
    return '';
  };

  const [currentSlug, setCurrentSlug] = useState<string>(() => {
    const slug = getSlugFromUrl();
    if (!slug) {
      // Direct requirement: Do NOT build an index or directory page.
      // Automatically route to direct business URL /b/sandbox-cafe
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/b/sandbox-cafe');
      }
      return 'sandbox-cafe';
    }
    return slug;
  });

  const [business, setBusiness] = useState<Business | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals & UI State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);
  const [preselectedItem, setPreselectedItem] = useState<MenuItem | null>(null);
  const [activeSection, setActiveSection] = useState('hero');

  // Load tenant data based on current slug
  const loadTenantData = useCallback(async (slug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch business by its slug
      const biz = await getBusinessBySlug(slug);
      if (!biz) {
        setError(`Business with identifier "/b/${slug}" could not be located.`);
        setIsLoading(false);
        return;
      }

      setBusiness(biz);

      // 2. Fetch associated categories and menu items using the business_id
      const [cats, items] = await Promise.all([
        getCategoriesByBusinessId(biz.id),
        getMenuItemsByBusinessId(biz.id)
      ]);

      setCategories(cats);
      setMenuItems(items);

      // Sync document title with business name
      document.title = `${biz.name} — Digital Menu & Table Booking`;
    } catch (err: any) {
      console.error('Failed to load tenant data:', err);
      setError(err.message || 'Unable to load menu data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen to browser navigation changes (popstate)
  useEffect(() => {
    const handleLocationChange = () => {
      const slug = getSlugFromUrl();
      if (slug && slug !== currentSlug) {
        setCurrentSlug(slug);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [currentSlug]);

  // Load data whenever currentSlug changes
  useEffect(() => {
    loadTenantData(currentSlug);
  }, [currentSlug, loadTenantData]);

  // Navigate to different slug (e.g. from developer tester) without directory index
  const navigateToSlug = (newSlug: string) => {
    const cleanSlug = newSlug.toLowerCase().trim();
    window.history.pushState({}, '', `/b/${cleanSlug}`);
    setCurrentSlug(cleanSlug);
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (item?: MenuItem) => {
    setPreselectedItem(item || null);
    setIsBookingOpen(true);
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex flex-col items-center justify-center p-6 text-[#231F20]">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-sm border border-[#7A4B3A]/15 p-2.5 flex items-center justify-center mb-4 overflow-hidden animate-pulse">
          <img
            src="/assets/aistudio/logo_0a74d961.jpg"
            alt="SandBox Cafe"
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="font-serif text-2xl text-[#231F20] font-normal tracking-wide">
          Preparing Fresh Brews...
        </h2>
      </div>
    );
  }

  // Error Screen
  if (error || !business) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex flex-col items-center justify-center p-6 text-[#231F20]">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#7A4B3A]/20 shadow-md text-center">
          <AlertCircle className="w-12 h-12 text-[#7A4B3A] mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-[#231F20] mb-2">Cafe Not Found</h2>
          <p className="text-xs sm:text-sm text-[#231F20]/75 mb-6">
            {error || 'No direct tenant found matching this URL.'}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigateToSlug('sandbox-cafe')}
              className="w-full bg-[#7A4B3A] hover:bg-[#633A2C] text-white py-3 rounded-xl font-serif text-xs uppercase tracking-wider transition-colors"
            >
              Go to /b/sandbox-cafe
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#231F20] flex flex-col selection:bg-[#7A4B3A]/20 selection:text-[#7A4B3A]">
      
      {/* Top Navigation */}
      <Navbar
        business={business}
        onOpenBooking={() => handleOpenBooking()}
        onOpenSchema={() => setIsSchemaOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigateSection}
      />

      <main className="flex-1">
        {/* Hero Section replicating reference */}
        <Hero
          business={business}
          onExploreClick={() => handleNavigateSection('products')}
          onBookClick={() => handleOpenBooking()}
        />

        {/* Product Display with asymmetrical leaf mask */}
        <ProductShowcase
          items={menuItems}
          categories={categories}
          businessName={business.name}
          onBookItem={(item) => handleOpenBooking(item)}
        />

        {/* About Sanctuary & Roastery Craft */}
        <AboutSection business={business} />

        {/* Guest Testimonial */}
        <TestimonialSection />

        {/* Location & Directions Deep Link */}
        <LocationSection
          business={business}
          onBookClick={() => handleOpenBooking()}
        />
      </main>

      {/* Footer */}
      <Footer
        business={business}
        onOpenBooking={() => handleOpenBooking()}
        onOpenSchema={() => setIsSchemaOpen(true)}
      />

      {/* Booking Modal */}
      <ReservationModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setPreselectedItem(null);
        }}
        business={business}
        preselectedItem={preselectedItem}
      />

      {/* SQL & Architecture Modal */}
      <SqlSchemaModal
        isOpen={isSchemaOpen}
        onClose={() => setIsSchemaOpen(false)}
        business={business}
        onNavigateSlug={navigateToSlug}
        onRefreshData={() => loadTenantData(currentSlug)}
      />

      {/* Floating Quick Action Badge */}
      <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2">
        <button
          onClick={() => setIsSchemaOpen(true)}
          className="bg-[#231F20] text-stone-200 hover:text-white px-3.5 py-2 rounded-full text-xs font-mono shadow-lg border border-white/10 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
          title="Inspect Supabase SQL & RLS policies"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Supabase SQL</span>
        </button>

        <button
          onClick={() => handleOpenBooking()}
          className="bg-[#7A4B3A] hover:bg-[#633A2C] text-white px-4 py-2 rounded-full text-xs font-serif uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Book Table</span>
        </button>
      </div>

    </div>
  );
}
