import React from 'react';
import { Business } from '../types/database';
import { MapPin, Calendar, Heart, Terminal, ArrowUp } from 'lucide-react';

interface FooterProps {
  business: Business;
  onOpenBooking: () => void;
  onOpenSchema: () => void;
}

export const Footer: React.FC<FooterProps> = ({ business, onOpenBooking, onOpenSchema }) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#211C1A] text-[#F9F6F0] pt-16 pb-12 border-t border-[#7A4B3A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10 items-start">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center overflow-hidden shadow-xs border border-white/20">
                <img
                  src="/assets/aistudio/Gemini_Generated_Image_8n272q8n272q8n27_a97246e9.jpg"
                  alt="SandBox Cafe Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider text-white uppercase">
                  SandBox Cafe
                </span>
                <span className="block text-[10px] tracking-widest text-[#D4A373] uppercase -mt-0.5 font-sans">
                  Cadiz City &bull; Coffee &amp; Roastery
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 max-w-sm leading-relaxed font-sans">
              Discover tranquility at SandBox Cafe in Cadiz City, Philippines. A warm sanctuary for slow-crafted coffee, peaceful afternoons, and community connection.
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#7A4B3A] hover:bg-[#633A2C] text-white px-4 py-2 rounded-xl text-xs font-serif uppercase tracking-wider transition-colors shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Get Directions (Cadiz City)</span>
              </a>

              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-serif uppercase tracking-wider transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Table</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3 font-sans text-xs">
            <h4 className="font-serif text-sm text-white uppercase tracking-wider mb-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <a href="#products" className="hover:text-[#D4A373] transition-colors">Products &amp; Brews</a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#D4A373] transition-colors">About Our Roastery</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#D4A373] transition-colors">Customer Reviews</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#D4A373] transition-colors">Find Location &amp; Hours</a>
              </li>
            </ul>
          </div>

          {/* Tenant & Architecture Details */}
          <div className="md:col-span-4 space-y-3 font-sans text-xs">
            <h4 className="font-serif text-sm text-white uppercase tracking-wider mb-2">
              System Architecture
            </h4>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-2 text-stone-300">
              <div className="flex justify-between">
                <span className="text-stone-500">Tenant Slug:</span>
                <span className="font-mono text-amber-300">/b/{business.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Database:</span>
                <span className="font-mono text-emerald-400">Supabase + PostgreSQL RLS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Coordinates:</span>
                <span className="font-mono text-xs">{business.latitude.toFixed(4)}, {business.longitude.toFixed(4)}</span>
              </div>
              <button
                onClick={onOpenSchema}
                className="w-full mt-2 py-2 px-3 bg-white/10 hover:bg-white/15 text-stone-200 text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>View SQL Schema &amp; Policies</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} {business.name}. Built with React, Tailwind CSS &amp; Supabase.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
