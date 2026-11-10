import React, { useState } from 'react';
import { Business } from '../types/database';
import { 
  MapPin, Navigation, Clock, Phone, ExternalLink, Car, 
  Bike, Footprints, Sparkles, Compass, CheckCircle2, Route, ShieldCheck 
} from 'lucide-react';

interface LocationSectionProps {
  business: Business;
  onBookClick: () => void;
}

type TravelMode = 'driving' | 'two-wheeler' | 'walking';

export const LocationSection: React.FC<LocationSectionProps> = ({ business, onBookClick }) => {
  const [travelMode, setTravelMode] = useState<TravelMode>('driving');
  const [activeMapView, setActiveMapView] = useState<'embed' | 'route-guide'>('embed');

  // Exact coordinates for Portside, Cadiz City (Plus code: X82C+7X8)
  const lat = Number(business.latitude) || 10.950625;
  const lng = Number(business.longitude) || 123.322375;
  const addressText = "Portside, X82C+7X8, Port, Cadiz City, 6121 Negros Occidental";

  // Google Maps Deep Link configured to automatically calculate route and highlight the road
  // Using destination coords, travelmode, and dir_action=navigate for turn-by-turn road highlighting
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${travelMode}&dir_action=navigate`;

  // Alternate direct location link
  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`;

  // Public Google Maps Embed URL centered on Portside, Cadiz City with exact pin
  const embedMapUrl = `https://maps.google.com/maps?q=${lat},${lng}+(${encodeURIComponent('SandBox Cafe - Portside Cadiz City')})&t=&z=16&ie=UTF8&iwloc=B&output=embed`;

  return (
    <section id="contact" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A4B3A]/10 text-[#7A4B3A] text-xs font-serif font-semibold tracking-widest uppercase mb-3">
            <Compass className="w-3.5 h-3.5 text-[#7A4B3A]" />
            <span>Portside Cadiz City Location</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#231F20] font-normal mb-3">
            Find SandBox Cafe
          </h2>
          <p className="text-sm text-[#231F20]/75 leading-relaxed">
            Seaside views, fresh sea breeze, and specialty slow-poured coffee right along the port waters of Cadiz City.
          </p>
        </div>

        {/* Location & Interactive Directions Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#7A4B3A]/15 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Details */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-4">
              {/* Address card */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#F9F6F0] border border-[#7A4B3A]/10">
                <div className="w-10 h-10 rounded-xl bg-[#7A4B3A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-serif text-base text-[#231F20] font-medium">Portside Sanctuary</h4>
                    <span className="text-[10px] font-mono uppercase bg-[#7A4B3A]/10 text-[#7A4B3A] px-2 py-0.5 rounded-full">
                      Cadiz City Port
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#231F20]/90 font-medium mt-1">
                    {addressText}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] font-mono text-[#7A4B3A]">
                    <span className="bg-white px-2 py-0.5 rounded-md border border-[#7A4B3A]/15">
                      Plus Code: <strong>X82C+7X8</strong>
                    </span>
                    <span className="bg-white px-2 py-0.5 rounded-md border border-[#7A4B3A]/15">
                      GPS: {lat.toFixed(6)}, {lng.toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Inquiries */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#7A4B3A]/10 text-[#7A4B3A] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#231F20] font-medium">Direct Hotline</h4>
                  <p className="text-xs sm:text-sm text-[#231F20]/90 mt-0.5 font-mono font-medium">
                    +63 917 842 9102
                  </p>
                  <p className="text-xs text-[#231F20]/60 mt-0.5">
                    Philippine mobile inquiries &bull; Table bookings &amp; Harbor arrivals
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#7A4B3A]/10 text-[#7A4B3A] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#231F20] font-medium">Portside Hours</h4>
                  <p className="text-xs sm:text-sm text-[#231F20]/75 mt-0.5">
                    Monday – Friday: 07:00 AM – 10:00 PM (PHT)
                  </p>
                  <p className="text-xs sm:text-sm text-[#231F20]/75">
                    Saturday – Sunday: 08:00 AM – 11:00 PM (PHT)
                  </p>
                </div>
              </div>
            </div>

            {/* Travel Mode Selector to Customize Road Route */}
            <div className="pt-2 border-t border-[#7A4B3A]/10">
              <label className="block text-xs font-serif text-[#7A4B3A] font-semibold uppercase tracking-wider mb-2">
                Select Your Travel Mode for Road Highlighting:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTravelMode('driving')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    travelMode === 'driving'
                      ? 'bg-[#7A4B3A] text-white shadow-xs'
                      : 'bg-[#F9F6F0] text-[#231F20]/80 hover:bg-[#F0EAE1] border border-[#7A4B3A]/15'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Car / Taxi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTravelMode('two-wheeler')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    travelMode === 'two-wheeler'
                      ? 'bg-[#7A4B3A] text-white shadow-xs'
                      : 'bg-[#F9F6F0] text-[#231F20]/80 hover:bg-[#F0EAE1] border border-[#7A4B3A]/15'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Motor / Trike</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTravelMode('walking')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    travelMode === 'walking'
                      ? 'bg-[#7A4B3A] text-white shadow-xs'
                      : 'bg-[#F9F6F0] text-[#231F20]/80 hover:bg-[#F0EAE1] border border-[#7A4B3A]/15'
                  }`}
                >
                  <Footprints className="w-3.5 h-3.5" />
                  <span>Walking</span>
                </button>
              </div>
            </div>

            {/* Primary Action Button: Triggers Google Maps with Road Highlighting */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2.5 bg-[#7A4B3A] hover:bg-[#633A2C] text-white px-7 py-4 rounded-2xl font-serif text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg active:scale-98 group"
                >
                  <Navigation className="w-4 h-4 transition-transform group-hover:rotate-45 duration-200" />
                  <span>Get Directions &amp; Highlight Road</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <button
                  onClick={onBookClick}
                  className="inline-flex items-center justify-center gap-2 border border-[#7A4B3A]/30 text-[#7A4B3A] hover:bg-[#7A4B3A]/10 px-6 py-4 rounded-2xl text-xs font-serif uppercase tracking-widest transition-colors shrink-0"
                >
                  Reserve a Table
                </button>
              </div>

              {/* Road Highlighting Note */}
              <div className="flex items-center gap-2 text-[11px] text-[#7A4B3A] bg-[#7A4B3A]/8 p-2.5 rounded-xl border border-[#7A4B3A]/15">
                <Route className="w-4 h-4 text-[#7A4B3A] shrink-0" />
                <span>
                  <strong>Automatic Road Highlighting:</strong> Tapping the button opens Google Maps from your current location and highlights the road in bright blue with turn-by-turn guidance.
                </span>
              </div>
            </div>

          </div>

          {/* Right Map Card with Asymmetrical Leaf Curves */}
          <div className="lg:col-span-6 w-full space-y-3">
            
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMapView('embed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-colors ${
                    activeMapView === 'embed'
                      ? 'bg-[#7A4B3A] text-white font-medium'
                      : 'bg-[#F9F6F0] text-[#231F20]/70 hover:text-[#7A4B3A]'
                  }`}
                >
                  Interactive Portside Map
                </button>
                <button
                  onClick={() => setActiveMapView('route-guide')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-colors ${
                    activeMapView === 'route-guide'
                      ? 'bg-[#7A4B3A] text-white font-medium'
                      : 'bg-[#F9F6F0] text-[#231F20]/70 hover:text-[#7A4B3A]'
                  }`}
                >
                  Road Access Guide
                </button>
              </div>

              <a
                href={directMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#7A4B3A] hover:underline flex items-center gap-1 font-mono"
              >
                <span>View Full Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Asymmetrical Leaf Mask Map Container */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-xl rounded-bl-xl overflow-hidden shadow-md border-2 border-[#7A4B3A]/20 bg-[#EAE2D5]">
              
              {activeMapView === 'embed' ? (
                <div className="w-full h-full relative">
                  <iframe
                    title="SandBox Cafe Portside Location"
                    src={embedMapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full filter saturate-110 contrast-105"
                  />
                  {/* Floating Action Badge directly on the map */}
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 left-4 right-4 sm:right-auto bg-[#1C1816]/95 hover:bg-[#7A4B3A] text-white backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-white/10 text-xs font-serif flex items-center justify-between sm:justify-start gap-2.5 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-medium">SandBox Cafe &bull; Portside Cadiz</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#D4A373] group-hover:text-white uppercase tracking-wider flex items-center gap-1">
                      <span>Navigate</span>
                      <Navigation className="w-3 h-3 text-white" />
                    </span>
                  </a>
                </div>
              ) : (
                /* Road Access Guide Step-by-Step Preview */
                <div className="w-full h-full p-6 sm:p-8 bg-[#F9F6F0] flex flex-col justify-between overflow-y-auto">
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-[#7A4B3A]/15 pb-2">
                      <span className="text-xs font-serif uppercase tracking-widest text-[#7A4B3A] font-semibold flex items-center gap-1.5">
                        <Route className="w-4 h-4" /> Road Access Route
                      </span>
                      <span className="text-xs font-mono text-stone-500">Cadiz City Port</span>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#7A4B3A] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          1
                        </span>
                        <div>
                          <strong className="text-[#231F20] block">Cadiz City Town Center / Banquerohan</strong>
                          <span className="text-[#231F20]/70">Take the main Banquerohan thoroughfare heading towards the coastal district.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#7A4B3A] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          2
                        </span>
                        <div>
                          <strong className="text-[#231F20] block">Portside Coastal Boulevard</strong>
                          <span className="text-[#231F20]/70">Follow Bougainvilla towards the main Port terminal and Cadiz harbor wharf.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          3
                        </span>
                        <div>
                          <strong className="text-[#231F20] block">SandBox Cafe Sanctuary</strong>
                          <span className="text-[#231F20]/70">Located directly on Portside (Plus code: X82C+7X8) overlooking the boats.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#7A4B3A]/15">
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#7A4B3A] hover:bg-[#633A2C] text-white py-2.5 px-4 rounded-xl text-xs font-serif uppercase tracking-widest text-center flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Highlight This Road on Google Maps</span>
                    </a>
                  </div>
                </div>
              )}

            </div>

            <div className="text-[11px] text-[#231F20]/60 flex items-center justify-between font-mono px-1">
              <span>Portside, X82C+7X8, Cadiz City</span>
              <span className="text-[#7A4B3A]">Lat: {lat.toFixed(4)} | Lng: {lng.toFixed(4)}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
