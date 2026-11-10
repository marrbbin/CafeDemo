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

  // Directions deep link according to critical requirement:
  // https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        
        {/* Left: Brand Identity with SandBox Cafe logo badge */}
        <div 
          onClick={() => handleLinkClick('hero')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-[#7A4B3A]/15 flex items-center justify-center p-1.5 overflow-hidden transition-transform group-hover:scale-105 duration-300">
            {/* User-provided SandBox Cafe cup & shovel icon mark */}
            <img
              src="/assets/aistudio/logo_0a74d961.jpg"
              alt="SandBox Cafe Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-wider text-[#231F20] uppercase group-hover:text-[#7A4B3A] transition-colors">
              SandBox Cafe
            </span>
            <span className="block text-[10px] tracking-widest text-[#7A4B3A] font-medium uppercase -mt-1 font-sans">
              Cadiz City &bull; Coffee &amp; Roastery
            </span>
          </div>
        </div>

        {/* Center: Minimal Text Links matching reference image */}
        <nav className="hidden md:flex items-center space-x-9">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`text-sm tracking-wide transition-colors font-sans capitalize ${
                activeSection === link.id
                  ? 'text-[#7A4B3A] font-semibold border-b-2 border-[#7A4B3A] pb-1'
                  : 'text-[#231F20]/75 hover:text-[#7A4B3A]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions, Search, Direction Deep Link & Book a Table CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Deep link directions button */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Get Directions on Google Maps"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#7A4B3A] bg-[#7A4B3A]/10 hover:bg-[#7A4B3A]/15 rounded-full transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Directions</span>
          </a>

          {/* SQL / Schema Inspector modal button */}
          <button
            onClick={onOpenSchema}
            title="View Supabase Schema & SQL"
            className="p-2 text-[#231F20]/70 hover:text-[#7A4B3A] hover:bg-black/5 rounded-full transition-colors"
          >
            <Code className="w-4 h-4" />
          </button>

          {/* Book Table Button */}
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 bg-[#7A4B3A] text-white hover:bg-[#633A2C] px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all shadow-sm active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
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
