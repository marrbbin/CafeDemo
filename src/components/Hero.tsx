import React from 'react';
import { Business } from '../types/database';
import { ArrowDownRight, Sparkles } from 'lucide-react';

interface HeroProps {
  business: Business;
  onExploreClick: () => void;
  onBookClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ business, onExploreClick, onBookClick }) => {
  return (
    <section id="hero" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Subtle organic coffee bean ambiance in background */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#7A4B3A]/5 blur-3xl"
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-[#7A4B3A]/5 blur-3xl"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        
        {/* Subtle pill tag with Portside Cadiz City location */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A4B3A]/8 text-[#7A4B3A] text-xs font-medium tracking-widest uppercase mb-6">
          <span>Portside Cadiz City &bull; Specialty Roastery &bull; Philippines</span>
        </div>

        {/* Hero Title (Strictly matching reference styling: "Enjoy Your Coffee with SandBox Cafe") */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] text-[#231F20] tracking-tight leading-[1.12] mb-6 font-normal">
          {business.hero_title || `Enjoy Your Coffee with SandBox Cafe`}
        </h1>

        {/* Subtitle Paragraph (Strictly matching reference text) */}
        <p className="font-sans text-[#231F20]/75 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          {business.tagline || 
            `Discover tranquility at ${business.name} a sanctuary for unwinding, where your evenings are perfected with relaxation and rich flavors.`}
        </p>

        {/* Brown CTA Button matching reference: "EXPLORE PRODUCT ↘" */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExploreClick}
            className="group relative inline-flex items-center justify-center gap-2.5 bg-[#7A4B3A] text-white hover:bg-[#633A2C] px-8 sm:px-10 py-4 rounded-2xl md:rounded-[1.25rem] transition-all duration-300 shadow-md hover:shadow-lg active:scale-98"
          >
            <span className="font-serif text-sm tracking-widest uppercase font-medium">
              Explore Product
            </span>
            <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 duration-200" />
          </button>

          <button
            onClick={onBookClick}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl md:rounded-[1.25rem] border border-[#7A4B3A]/30 text-[#7A4B3A] hover:bg-[#7A4B3A]/8 transition-colors text-sm font-medium tracking-wider uppercase font-sans"
          >
            Reserve Table
          </button>
        </div>

      </div>
    </section>
  );
};
