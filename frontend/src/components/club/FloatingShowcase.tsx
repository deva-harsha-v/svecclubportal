import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { ClubSummary } from '../../types';
import { getClubAccent } from '../../utils/categoryIcons';
import { getLogoUrl } from '../../utils/logoHelper';

interface FloatingShowcaseProps {
  clubs?: ClubSummary[];
}

const FEATURED_CLUBS = [
  {
    slug: 'sakala-dance-dramatic-club',
    name: 'SAKALA',
    fullName: 'SAKALA Dance & Dramatic Club',
    category: 'Performing Arts',
    descriptor: 'Dance • Drama • Stage Expression',
  },
  {
    slug: 'beats-of-hearts-singers-club',
    name: 'BEATS OF HEARTS',
    fullName: 'Beats of Hearts Singers Club',
    category: 'Music',
    descriptor: 'Vocal Performance • Instrumental Harmony',
  },
  {
    slug: 'sves-photography-club',
    name: 'PHOTOGRAPHY',
    fullName: 'SVES Photography Club',
    category: 'Photography',
    descriptor: 'Visual Storytelling • Campus Lens',
  },
  {
    slug: 'ace-club',
    name: 'ACE CLUB',
    fullName: 'ACE Club',
    category: 'Media',
    descriptor: 'Campus Radio • Media & Editorial',
  },
];

export const FloatingShowcase: React.FC<FloatingShowcaseProps> = ({ clubs = [] }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURED_CLUBS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + FEATURED_CLUBS.length) % FEATURED_CLUBS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % FEATURED_CLUBS.length);
  };

  const handleCardClick = (slug: string) => {
    const matched = clubs.find((c) => c.slug.includes(slug) || slug.includes(c.slug));
    if (matched) {
      navigate(`/clubs/${matched.slug}`);
    } else {
      navigate(`/clubs/${slug}`);
    }
  };

  const currentItem = FEATURED_CLUBS[activeIndex];
  const accent = getClubAccent(currentItem.category, currentItem.name);
  const realClub = clubs?.find((c) => c.slug.includes(currentItem.slug) || currentItem.slug.includes(c.slug));
  const logoUrl = getLogoUrl(realClub?.logo);
  const bannerUrl = getLogoUrl(realClub?.banner);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Editorial Header Row */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
            Spotlight Club
          </h2>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition"
              title="Previous"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition"
              title="Next"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Editorial Card */}
      <div
        onClick={() => handleCardClick(currentItem.slug)}
        className="group relative rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer overflow-hidden transition-all duration-200 hover:border-slate-700 shadow-lg"
      >
        {/* Large Prominent Hero Image */}
        <div className="relative w-full h-44 sm:h-52 aspect-[3072/1560] bg-slate-950 overflow-hidden">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt={currentItem.fullName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="eager"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${accent.gradientBg} flex items-center justify-center opacity-70`}>
              <div className="w-16 h-16 text-slate-200">
                {accent.icon}
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Top Left Badge */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-semibold tracking-wider uppercase shadow-sm">
              Spotlight
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md">
              {accent.categoryLabel}
            </span>
          </div>

          {/* Raw Logo rendering directly without container boxes, borders or backgrounds */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2.5">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={currentItem.name}
                className="w-9 h-9 object-contain shrink-0"
              />
            ) : (
              <div className="w-8 h-8 text-indigo-400 shrink-0">{accent.icon}</div>
            )}
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase block truncate tracking-wider">
                SVEC Organisation
              </span>
              <span className="font-display font-bold text-xs text-slate-100 block truncate">
                {currentItem.name}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-100 group-hover:text-indigo-400 transition-colors truncate">
              {currentItem.fullName}
            </h3>
            <p className="text-xs text-slate-400 mt-1 truncate">
              {currentItem.descriptor}
            </p>
          </div>

          {/* Action Row & Pagination Dots */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {FEATURED_CLUBS.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeIndex ? 'bg-indigo-500 w-4' : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 group-hover:text-indigo-400 transition">
              <span>View spotlight profile</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
