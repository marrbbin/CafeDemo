import React from 'react';
import { Star, MessageSquareQuote, CheckCircle2 } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  review: string;
  favoriteItem: string;
}

const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    name: 'Bea Alcantara',
    location: 'Cadiz City, Negros Occidental',
    rating: 5,
    date: '2 days ago',
    review: 'Finally a true third-wave cafe in Cadiz! The Dalgona Velvet Crema is top tier not too sweet, perfectly velvety, and the coffee notes shine through. The peaceful ambiance is unmatched.',
    favoriteItem: 'Dalgona Velvet Crema'
  },
  {
    id: 'rev-2',
    name: 'Kenzo Ramirez',
    location: 'Bacolod / Cadiz Visitor',
    rating: 5,
    date: '1 week ago',
    review: 'Booked a table online before driving up from the highway. Table was ready right on time. Outstanding Spanish Latte with actual artisanal beans. Love the leaf-shaped aesthetics and chill vibe.',
    favoriteItem: 'Spanish Sun Rosetta Latte'
  },
  {
    id: 'rev-3',
    name: 'Clarisse Tan',
    location: 'Cadiz City Local',
    rating: 5,
    date: '3 weeks ago',
    review: 'My go-to sanctuary for afternoon work and coffee tasting. The Nitro Cold Brew on slate is crisp and refreshing in the tropical heat. Best spot in town to unwind.',
    favoriteItem: 'Nitro Cold Brew on Slate'
  }
];

export const TestimonialSection: React.FC = () => {
  return (
    <section id="reviews" className="py-16 md:py-24 bg-[#F5EFE6] relative overflow-hidden border-t border-[#7A4B3A]/10">
      {/* Decorative ambient blur */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-10 -right-10 w-80 h-80 rounded-full bg-[#7A4B3A]/8 blur-3xl"
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-10 -left-10 w-72 h-72 rounded-full bg-[#7A4B3A]/5 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#7A4B3A]/10 text-[#7A4B3A] text-xs font-serif uppercase tracking-widest mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Customer Reviews</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#231F20] font-normal mb-3">
            What Our Guests Say
          </h2>
          <p className="text-xs sm:text-sm text-[#231F20]/75">
            Read verified experiences from our coffee lovers and community in Cadiz City.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {REVIEWS_DATA.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white/90 backdrop-blur-xs p-7 rounded-3xl border border-[#7A4B3A]/15 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Star Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#7A4B3A]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#7A4B3A]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#231F20]/50 font-sans">{rev.date}</span>
                </div>

                {/* Review Text */}
                <p className="font-serif italic text-sm sm:text-base text-[#231F20] leading-relaxed mb-6">
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 border-t border-[#7A4B3A]/10 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#231F20] flex items-center gap-1">
                    <span>{rev.name}</span>
                    <span title="Verified Customer" className="inline-flex">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                  </h4>
                  <span className="text-[11px] text-[#231F20]/60 font-sans block">
                    {rev.location}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#7A4B3A] font-medium block">
                    Favorite Brew
                  </span>
                  <span className="text-[11px] font-medium text-[#231F20] line-clamp-1">
                    {rev.favoriteItem}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
