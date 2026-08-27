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
  ];
  
  const allCategories = Array.from(new Set([...defaultList, ...categories]));

  return (
    <div className="sticky top-[57px] sm:top-[65px] z-30 bg-[#090D16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-2.5 sm:py-3 relative">
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#090D16] to-transparent pointer-events-none z-10" />

      <div className="flex gap-2 sm:gap-2.5 overflow-x-auto overflow-y-hidden flex-nowrap whitespace-nowrap no-scrollbar scroll-smooth max-w-[1600px] mx-auto pr-6">
        {allCategories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = categoryCounts[cat];

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600'
              }`}
            >
              <span>{cat}</span>
              {count !== undefined && count > 0 && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-700/80 text-slate-300'
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
