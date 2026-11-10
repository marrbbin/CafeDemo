import React, { useState } from 'react';
import { Business } from '../types/database';
import { Coffee, MapPin, Calendar, Menu as MenuIcon, X, Search, ShoppingBag, Database, Code } from 'lucide-react';

interface NavbarProps {
  business: Business;
  onOpenBooking: () => void;
  onOpenSchema: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  business,
  onOpenBooking,
  onOpenSchema,
  activeSection,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Directions deep link configured to highlight the driving road automatically
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}&travelmode=driving&dir_action=navigate`;

  const navLinks = [
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About us' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F9F6F0]/95 backdrop-blur-md transition-all border-b border-[#7A4B3A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-18 md:h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity with SandBox Cafe logo badge (NEVER truncated) */}
        <div 
          onClick={() => handleLinkClick('hero')} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white shadow-xs border border-[#7A4B3A]/15 flex items-center justify-center p-1 sm:p-1.5 overflow-hidden transition-transform group-hover:scale-105 duration-300 shrink-0">
            {/* User-provided SandBox Cafe cup & shovel icon mark */}
            <img
              src="/assets/aistudio/logo_0a74d961.jpg"
              alt="SandBox Cafe Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="shrink-0 whitespace-nowrap">
            <span className="font-serif text-lg sm:text-xl lg:text-2xl font-semibold tracking-wide text-[#231F20] uppercase group-hover:text-[#7A4B3A] transition-colors leading-tight block">
              SandBox Cafe
            </span>
            <span className="block text-[9px] sm:text-[10px] tracking-wider text-[#7A4B3A] font-medium uppercase font-sans leading-none mt-0.5">
              Cadiz City &bull; Coffee &amp; Roastery
            </span>
          </div>
        </div>

        {/* Center: Minimal Text Links matching reference image (Responsive on tablet & desktop) */}
        <nav className="hidden md:flex items-center space-x-3.5 lg:space-x-8 shrink-0">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`text-xs lg:text-sm tracking-wide transition-colors font-sans capitalize whitespace-nowrap ${
                activeSection === link.id
                  ? 'text-[#7A4B3A] font-semibold border-b-2 border-[#7A4B3A] pb-0.5'
                  : 'text-[#231F20]/75 hover:text-[#7A4B3A]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions, Search, Direction Deep Link & Book a Table CTA */}
        <div className="hidden sm:flex items-center gap-2 lg:gap-3 shrink-0">
          {/* Deep link directions button */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Get Directions on Google Maps"
            className="flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 lg:py-2 text-xs font-medium text-[#7A4B3A] bg-[#7A4B3A]/10 hover:bg-[#7A4B3A]/15 rounded-full transition-colors whitespace-nowrap"
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline">Directions</span>
          </a>

          {/* SQL / Schema Inspector modal button */}
          <button
            onClick={onOpenSchema}
            title="View Supabase Schema & SQL"
            className="p-1.5 lg:p-2 text-[#231F20]/70 hover:text-[#7A4B3A] hover:bg-black/5 rounded-full transition-colors"
          >
            <Code className="w-4 h-4" />
          </button>

          {/* Book Table Button */}
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-1.5 bg-[#7A4B3A] text-white hover:bg-[#633A2C] px-3.5 lg:px-5 py-2 lg:py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>Book a Table</span>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenBooking}
            className="bg-[#7A4B3A] text-white px-3 py-2 rounded-full text-xs font-medium uppercase tracking-wider"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#231F20] hover:text-[#7A4B3A] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F9F6F0] border-b border-[#7A4B3A]/15 px-6 py-5 shadow-lg">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="text-left text-base text-[#231F20] hover:text-[#7A4B3A] font-serif py-1"
              >
                {link.label}
              </button>
            ))}
            <hr className="border-[#7A4B3A]/15 my-2" />
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#7A4B3A] font-medium py-1"
            >
              <MapPin className="w-4 h-4" />
              Get Directions ({business.latitude.toFixed(4)}, {business.longitude.toFixed(4)})
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSchema();
              }}
              className="flex items-center gap-2 text-sm text-[#231F20]/80 font-medium py-1"
            >
              <Code className="w-4 h-4 text-[#7A4B3A]" />
              View Supabase SQL & RLS Script
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
