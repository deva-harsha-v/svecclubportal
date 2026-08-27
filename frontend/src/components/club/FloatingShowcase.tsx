import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
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
    }, 4500);
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

  return (
    <section className="relative py-8 sm:py-12 px-4 sm:px-8 max-w-[1600px] mx-auto overflow-hidden">
      {/* Editorial Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Featured Clubs
            </span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
            Spotlight Organisations
          </h2>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title={isPlaying ? 'Pause Rotation' : 'Resume Rotation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 transition"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 transition"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Layered Showcase Canvas */}
      <div className="relative h-[290px] sm:h-[320px] flex items-center justify-center">
        {FEATURED_CLUBS.map((item, idx) => {
          const total = FEATURED_CLUBS.length;
          let offset = idx - activeIndex;
          if (offset < -1) offset += total;
          if (offset > 1) offset -= total;

          const isActive = idx === activeIndex;
          const accent = getClubAccent(item.category, item.name);

          let translateX = offset * 85;
          if (typeof window !== 'undefined' && window.innerWidth >= 640) {
            translateX = offset * 130;
          }

          let scale = isActive ? 1.04 : 0.88 - Math.abs(offset) * 0.05;
          let zIndex = 30 - Math.abs(offset) * 5;
          let opacity = isActive ? 1 : 0.65 - Math.abs(offset) * 0.2;

          const realClub = clubs?.find((c) => c.slug.includes(item.slug) || item.slug.includes(c.slug));
          const logoUrl = getLogoUrl(realClub?.logo);
          const bannerUrl = getLogoUrl(realClub?.banner);

          return (
            <div
              key={item.name}
              onClick={() => {
                if (isActive) handleCardClick(item.slug);
                else setActiveIndex(idx);
              }}
              style={{
                transform: `translateX(${translateX}px) scale(${scale})`,
                zIndex,
                opacity,
              }}
              className={`absolute w-[82vw] max-w-[280px] sm:w-[300px] h-[260px] sm:h-[290px] rounded-2xl p-4 cursor-pointer transition-all duration-300 ease-out border shadow-lg flex flex-col justify-between ${
                isActive
                  ? 'border-indigo-500/80 bg-slate-900/95 shadow-indigo-950/50 ring-1 ring-indigo-500/40'
                  : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              {/* Media Card Banner Container (Standard 3072x1560 Landscape Framing) */}
              <div className="w-full aspect-[3072/1560] h-32 sm:h-36 rounded-xl bg-slate-950 border border-slate-800 p-3 flex flex-col justify-between relative overflow-hidden group">
                {/* Custom Banner Cover Image */}
                {bannerUrl ? (
                  <img
                    src={bannerUrl}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-85 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className={`absolute inset-0 z-0 opacity-40 bg-gradient-to-br ${accent.gradientBg}`} />
                )}

                {/* Reserved Warm Hero Glow Overlay when Active */}
                {isActive && (
                  <div className="absolute inset-0 z-0 bg-gradient-to-tr from-amber-500/10 via-indigo-500/15 to-transparent pointer-events-none" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-0 pointer-events-none" />

                {/* Category Badge & Top Icon */}
                <div className="flex items-center justify-between z-10">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${accent.badgeClass}`}>
                    {accent.categoryLabel}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>

                {/* Emblem & Name Row (3:4 Portrait Ratio Emblem Box) */}
                <div className="flex items-center gap-2.5 z-10">
                  <div className={`w-7 sm:w-8 aspect-[3/4] rounded-lg border p-0.5 flex items-center justify-center shrink-0 overflow-hidden ${accent.bgTint}`}>
                    {logoUrl ? (
                      <img src={logoUrl} alt={item.name} className="w-full h-full object-cover rounded-md" />
                    ) : (
                      accent.icon
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase block truncate tracking-wider">
                      SVEC
                    </span>
                    <span className="font-display font-bold text-xs text-slate-100 block truncate">
                      {item.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Action Line */}
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-slate-100 truncate">
                    {item.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {item.descriptor}
                  </p>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 shrink-0 group-hover:text-indigo-400 group-hover:border-indigo-500/50 transition">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
