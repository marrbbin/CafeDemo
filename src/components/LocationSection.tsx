import React from 'react';
import { Business } from '../types/database';
import { MapPin, Navigation, Clock, Phone, Compass, ExternalLink } from 'lucide-react';

interface LocationSectionProps {
  business: Business;
  onBookClick: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ business, onBookClick }) => {
  // CRITICAL FUNCTIONAL REQUIREMENT:
  // Deep link format: https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`;

  return (
    <section id="contact" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-serif tracking-widest text-[#7A4B3A] font-semibold block mb-2">
            Visit Our Sanctuary
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#231F20] font-normal mb-3">
            Find {business.name}
          </h2>
          <p className="text-sm text-[#231F20]/75">
            Conveniently nestled for quiet mornings and restorative evenings. Drop by or reserve your favorite nook in advance.
          </p>
        </div>

        {/* Location & Interactive Directions Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#7A4B3A]/15 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Details */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#7A4B3A]/10 text-[#7A4B3A] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#231F20] font-medium">Cadiz City, Philippines</h4>
                  <p className="text-xs sm:text-sm text-[#231F20]/80 mt-0.5">
                    Approximately 10°50&apos;N Latitude, 125°09&apos;E Longitude
                  </p>
                  <p className="text-xs text-[#231F20]/60 mt-1 font-mono">
                    GPS Coordinates: {Number(business.latitude).toFixed(6)}, {Number(business.longitude).toFixed(6)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#7A4B3A]/10 text-[#7A4B3A] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#231F20] font-medium">Direct Inquiries</h4>
                  <p className="text-xs sm:text-sm text-[#231F20]/80 mt-0.5 font-mono">
                    +63 917 842 9102
                  </p>
                  <p className="text-xs text-[#231F20]/60 mt-0.5">
                    Mobile hotline &bull; Inquiries &amp; Table assistance
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#7A4B3A]/10 text-[#7A4B3A] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#231F20] font-medium">Opening Hours</h4>
                  <p className="text-xs sm:text-sm text-[#231F20]/75 mt-0.5">
                    Monday – Friday: 07:00 AM – 10:00 PM (PHT)
                  </p>
                  <p className="text-xs sm:text-sm text-[#231F20]/75">
                    Saturday – Sunday: 08:00 AM – 11:00 PM (PHT)
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3.5">
              {/* Critical requirement: Get Directions button triggering deep link */}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#7A4B3A] hover:bg-[#633A2C] text-white px-7 py-3.5 rounded-2xl font-serif text-xs uppercase tracking-widest transition-all shadow-md active:scale-98"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <button
                onClick={onBookClick}
                className="inline-flex items-center justify-center gap-2 border border-[#7A4B3A]/30 text-[#7A4B3A] hover:bg-[#7A4B3A]/10 px-6 py-3.5 rounded-2xl text-xs font-serif uppercase tracking-widest transition-colors"
              >
                Reserve a Table
              </button>
            </div>

            <div className="text-[11px] text-[#231F20]/50 font-mono">
              Deep link: <span className="underline break-all">{directionsUrl}</span>
            </div>

          </div>

          {/* Right Map Preview Graphic with Asymmetrical Leaf Curves */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-xl rounded-bl-xl overflow-hidden shadow-inner border border-[#7A4B3A]/15 bg-[#EAE2D5]">
              {/* Stylized warm map background image */}
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80"
                alt="Map Background"
                className="w-full h-full object-cover opacity-85 contrast-105"
              />
              <div className="absolute inset-0 bg-[#7A4B3A]/20 backdrop-contrast-125 mix-blend-multiply" />

              {/* Pulsing Pin Badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-[#7A4B3A] opacity-35" />
                    <div className="w-12 h-12 rounded-full bg-[#7A4B3A] text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <MapPin className="w-6 h-6 fill-white" />
                    </div>
                  </div>
                  <div className="mt-2 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md text-xs font-serif font-bold text-[#231F20] border border-[#7A4B3A]/20 whitespace-nowrap flex items-center gap-1">
                    <span>{business.name}</span>
                    <Navigation className="w-3 h-3 text-[#7A4B3A]" />
                  </div>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
