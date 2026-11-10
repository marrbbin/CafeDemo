import React, { useState } from 'react';
import { MenuItem, Category } from '../types/database';
import { ChevronLeft, ChevronRight, Plus, Eye, Sparkles } from 'lucide-react';

interface ProductShowcaseProps {
  items: MenuItem[];
  categories: Category[];
  businessName: string;
  onBookItem: (item: MenuItem) => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  items,
  categories,
  businessName,
  onBookItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);

  // Filter items based on category selection
  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter((item) => {
        // match category id or general filter
        return item.category_id === selectedCategory;
      });

  // Calculate leaf mask styling based on item index to mirror reference design's floral curvature
  const getLeafMaskClass = (index: number) => {
    // In reference: first 3 items curve top-left & bottom-right; items 4 & 5 curve top-right & bottom-left
    if (index % 5 >= 3) {
      return 'rounded-tr-[3.5rem] rounded-bl-[3.5rem] rounded-tl-xl rounded-br-xl';
    }
    return 'rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-xl rounded-bl-xl';
  };

  const scrollContainer = (direction: 'left' | 'right') => {
    const el = document.getElementById('product-scroll-track');
    if (el) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="products" className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-4 border-b border-[#7A4B3A]/10">
          <div>
            <span className="text-xs font-serif italic text-[#7A4B3A] tracking-wider block mb-1">
              Hand-Poured & Slow-Roasted
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#231F20] font-normal">
              Signature Collection
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#7A4B3A] text-white shadow-sm'
                  : 'bg-white/80 text-[#231F20]/75 hover:bg-white hover:text-[#7A4B3A] border border-[#7A4B3A]/15'
              }`}
            >
              All Items ({items.length})
            </button>

            {categories
              .filter((c) => !c.name.toLowerCase().includes('all'))
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-[#7A4B3A] text-white shadow-sm'
                      : 'bg-white/80 text-[#231F20]/75 hover:bg-white hover:text-[#7A4B3A] border border-[#7A4B3A]/15'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
          </div>

          {/* Scroll Nav Controls (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => scrollContainer('left')}
              aria-label="Scroll left"
              className="p-2.5 rounded-full bg-white hover:bg-[#7A4B3A] text-[#231F20] hover:text-white border border-[#7A4B3A]/15 transition-colors shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollContainer('right')}
              aria-label="Scroll right"
              className="p-2.5 rounded-full bg-white hover:bg-[#7A4B3A] text-[#231F20] hover:text-white border border-[#7A4B3A]/15 transition-colors shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            CRITICAL DIRECTIVE: Horizontal Flex Row / Grid with Asymmetrical Leaf Mask
            Tailwind classes: rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-md rounded-bl-md
            Strictly replicating reference image!
            ========================================================================= */}
        <div 
          id="product-scroll-track"
          className="flex gap-6 sm:gap-7 overflow-x-auto pb-8 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {filteredItems.map((item, index) => {
            const leafMask = getLeafMaskClass(index);
            const formattedPrice = `₱${Number(item.price).toFixed(2)}`;

            return (
              <div
                key={item.id}
                className="group shrink-0 w-[240px] sm:w-[270px] md:w-[290px] snap-center flex flex-col cursor-pointer"
                onClick={() => setSelectedItemForModal(item)}
              >
                {/* Image Container with Exact Leaf Mask */}
                <div 
                  className={`relative aspect-[3/4] w-full overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500 bg-[#EFE9DF] ${leafMask}`}
                >
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                  />

                  {/* Subtle dark gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white text-xs font-serif tracking-widest uppercase flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </span>
                  </div>

                  {/* Floating Price Pill */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-[#7A4B3A]/10 text-xs font-serif font-bold text-[#7A4B3A]">
                    {formattedPrice}
                  </div>
                </div>

                {/* Card Information */}
                <div className="mt-4 px-2 flex flex-col flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-lg text-[#231F20] font-medium tracking-tight group-hover:text-[#7A4B3A] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  {item.description && (
                    <p className="text-xs text-[#231F20]/70 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-3 pt-3 border-t border-[#7A4B3A]/10 flex items-center justify-between">
                    <span className="text-sm font-serif font-semibold text-[#7A4B3A]">
                      {formattedPrice}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookItem(item);
                      }}
                      className="text-[11px] font-sans font-medium tracking-wider uppercase text-[#7A4B3A] hover:text-[#633A2C] flex items-center gap-1 underline underline-offset-4 decoration-[#7A4B3A]/40 hover:decoration-[#7A4B3A]"
                    >
                      Book for Table &rarr;
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick mobile instruction hint */}
        <div className="text-center mt-2 lg:hidden text-xs text-[#231F20]/50 font-sans italic">
          Swipe horizontally to explore more brews &bull; Tap item to preview
        </div>

      </div>

      {/* Product Detail Modal */}
      {selectedItemForModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedItemForModal(null)}
        >
          <div 
            className="bg-[#F9F6F0] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#7A4B3A]/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full overflow-hidden bg-[#EAE3D6]">
              <img
                src={selectedItemForModal.image_url}
                alt={selectedItemForModal.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedItemForModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-widest font-serif text-[#7A4B3A] font-semibold">
                  Handcrafted Special
                </span>
                <span className="font-serif text-2xl font-bold text-[#7A4B3A]">
                  ₱{Number(selectedItemForModal.price).toFixed(2)}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#231F20] font-normal mb-3">
                {selectedItemForModal.name}
              </h3>

              <p className="text-sm text-[#231F20]/80 leading-relaxed mb-6 font-sans">
                {selectedItemForModal.description || 
                  'Expertly extracted using freshly roasted single-origin beans, balanced to perfection with velvety micro-foam and artisanal sweetness.'}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const item = selectedItemForModal;
                    setSelectedItemForModal(null);
                    onBookItem(item);
                  }}
                  className="flex-1 bg-[#7A4B3A] hover:bg-[#633A2C] text-white py-3.5 px-6 rounded-2xl font-serif text-sm tracking-widest uppercase transition-all shadow-md text-center"
                >
                  Reserve Table for this Brew
                </button>
                <button
                  onClick={() => setSelectedItemForModal(null)}
                  className="py-3.5 px-5 rounded-2xl border border-[#7A4B3A]/25 text-[#231F20] hover:bg-[#7A4B3A]/10 text-sm font-sans transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
