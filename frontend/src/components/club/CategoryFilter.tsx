import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  categoryCounts?: Record<string, number>;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  categoryCounts = {},
  onSelectCategory,
}) => {
  const defaultList = [
    'All',
    'Technical',
    'Performing Arts',
    'Music',
    'Photography',
    'Media',
    'Dance & Drama',
    'Media & Creative',
    'Music & Performing Arts'
  ];
  
  // Single deduplicated list with 'All' first
  const allCategories = Array.from(new Set([...defaultList, ...categories]));

  return (
    <div className="sticky top-[53px] sm:top-[65px] z-30 bg-[#070B1F]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-2.5 sm:py-3 shadow-md relative">
      {/* Right Edge Fade Overlay for visual scroll indicator */}
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#070B1F] to-transparent pointer-events-none z-10" />

      <div className="flex gap-2 sm:gap-3 overflow-x-auto overflow-y-hidden flex-nowrap whitespace-nowrap no-scrollbar scroll-smooth max-w-[1600px] mx-auto pr-6">
        {allCategories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = categoryCounts[cat];

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-purpleAcc text-white shadow-glow scale-[1.02]'
                  : 'bg-surface/80 border border-white/10 text-subtext hover:border-white/25 hover:text-white hover:bg-surface-hover'
              }`}
            >
              <span>{cat}</span>
              {count !== undefined && count > 0 && (
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-muted'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
