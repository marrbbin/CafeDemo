import React from 'react';
import { Business } from '../types/database';
import { Coffee, Award, Heart, Compass } from 'lucide-react';

interface AboutSectionProps {
  business: Business;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ business }) => {
  return (
    <section id="about" className="py-16 md:py-24 bg-[#F2EDE4]/60 relative border-y border-[#7A4B3A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Atmospheric Editorial Image with Leaf Radiuses */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-2xl rounded-bl-2xl overflow-hidden shadow-lg bg-[#E7E0D3]">
              <img
                src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80"
                alt="Cafe Interior and Roasting"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase font-serif tracking-widest text-[#F9F6F0]/90">
                  Craft Roastery
                </span>
                <p className="font-serif text-lg text-white font-medium">
                  Small-batch roasting with slow morning extraction
                </p>
              </div>
            </div>

            {/* Decorative organic leaf accent */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-[#7A4B3A]/15 blur-2xl pointer-events-none" />
          </div>

          {/* Right Column: Editorial Philosophy & Pillars */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7A4B3A]/10 text-[#7A4B3A] text-xs font-serif uppercase tracking-widest">
              <span>Our Sanctuary</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#231F20] font-normal leading-tight">
              Where Slow Coffee Meets Timeless Tranquility
            </h2>

            <p className="font-sans text-[#231F20]/80 text-sm sm:text-base leading-relaxed">
              At <strong>SandBox Cafe</strong>, coffee is an art of slow living. Located in <strong>Cadiz City, Philippines</strong>, we celebrate ethically sourced micro-lot harvests, temperature-calibrated extractions, and artisanal roasted beans crafted into moments of peace.
            </p>

            <p className="font-sans text-[#231F20]/75 text-sm sm:text-base leading-relaxed">
              Whether you are savoring our signature Dalgona Velvet Crema, an ice-cold slow drip in the afternoon breeze, or settling in for deep conversation, our doors welcome you to your local haven.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
              <div className="bg-white/80 p-5 rounded-2xl border border-[#7A4B3A]/15 shadow-xs">
                <Award className="w-5 h-5 text-[#7A4B3A] mb-2" />
                <h4 className="font-serif text-base text-[#231F20] font-medium mb-1">Direct Trade</h4>
                <p className="text-xs text-[#231F20]/70 leading-relaxed font-sans">
                  Sourced transparently from micro-lot estates and heirloom growers.
                </p>
              </div>

              <div className="bg-white/80 p-5 rounded-2xl border border-[#7A4B3A]/15 shadow-xs">
                <Coffee className="w-5 h-5 text-[#7A4B3A] mb-2" />
                <h4 className="font-serif text-base text-[#231F20] font-medium mb-1">Artisan Roasts</h4>
                <p className="text-xs text-[#231F20]/70 leading-relaxed font-sans">
                  Profiled gently to preserve floral, citrus, and sweet honey top notes.
                </p>
              </div>

              <div className="bg-white/80 p-5 rounded-2xl border border-[#7A4B3A]/15 shadow-xs">
                <Heart className="w-5 h-5 text-[#7A4B3A] mb-2" />
                <h4 className="font-serif text-base text-[#231F20] font-medium mb-1">Quiet Warmth</h4>
                <p className="text-xs text-[#231F20]/70 leading-relaxed font-sans">
                  A serene space designed for relaxation, work, and community connection.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
