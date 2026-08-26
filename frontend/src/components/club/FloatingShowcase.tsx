import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { ClubSummary } from '../../types';
import { getClubAccent } from '../../utils/categoryIcons';

interface FloatingShowcaseProps {
  clubs?: ClubSummary[];
}

// Restricted to EXACTLY these 4 SVEC clubs
const FEATURED_CLUBS = [
  {
    slug: 'sakala-dance-dramatic-club',
    name: 'SAKALA',
    fullName: 'SAKALA Dance & Dramatic Club',
    category: 'Performing Arts',
    descriptor: 'Dance • Drama • Expression',
    accentColor: '#F042FF',
  },
  {
    slug: 'beats-of-hearts-singers-club',
    name: 'BEATS OF HEARTS',
    fullName: 'Beats of Hearts Singers Club',
    category: 'Music',
    descriptor: 'Music • Expression • Emotion',
    accentColor: '#7226FF',
  },
  {
    slug: 'photography-club',
    name: 'SVEC Photography Club',
    fullName: 'SVEC Photography Club',
    category: 'Photography',
    descriptor: 'Visual Storytelling • Content Creation',
    accentColor: '#87F5F5',
  },
  {
    slug: 'ace-club-radio-magazine',
    name: 'ACE Club',
    fullName: 'ACE Radio & Magazine Club',
    category: 'Media / Creative',
    descriptor: 'Radio • Magazine • Creative Media',
    accentColor: '#F042FF',
  },
];

export const FloatingShowcase: React.FC<FloatingShowcaseProps> = ({ clubs = [] }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto progression timer
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURED_CLUBS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, isHovered]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + FEATURED_CLUBS.length) % FEATURED_CLUBS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % FEATURED_CLUBS.length);
  };

  const handleCardClick = (slug: string) => {
    const matched = clubs.find(
      (c) => c.slug === slug || c.name.toLowerCase().includes(slug.split('-')[0])
    );
    navigate(`/clubs/${matched ? matched.slug : slug}`);
  };

  return (
    <div
      className="relative w-full max-w-[600px] mx-auto select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient Radial Background Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-60 flex items-center justify-center">
        <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-r from-[#7226FF]/20 via-[#F042FF]/15 to-[#87F5F5]/10 blur-3xl" />
      </div>

      {/* Single Responsively Scaled Layered Cards Container (Desktop + Mobile) */}
      <div className="relative h-[290px] sm:h-[340px] flex items-center justify-center overflow-visible">
        {FEATURED_CLUBS.map((item, idx) => {
          const accent = getClubAccent(item.category, item.name);
          
          // Calculate relative position around active index (-1, 0, 1, 2)
          let offset = idx - activeIndex;
          if (offset < -1) offset += FEATURED_CLUBS.length;
          if (offset > 2) offset -= FEATURED_CLUBS.length;

          const isActive = idx === activeIndex;

          // Responsive geometry calculations for layering & depth
          let translateX = offset * 75; // Mobile offset (scaled down)
          if (typeof window !== 'undefined' && window.innerWidth >= 640) {
            translateX = offset * 115; // Desktop offset
          }

          let translateY = Math.abs(offset) * 12;
          let rotate = offset * 5;
          let scale = isActive ? 1.05 : 0.88 - Math.abs(offset) * 0.04;
          let zIndex = 30 - Math.abs(offset) * 5;
          let opacity = isActive ? 1 : 0.7 - Math.abs(offset) * 0.15;

          return (
            <div
              key={item.name}
              onClick={() => {
                if (isActive) handleCardClick(item.slug);
                else setActiveIndex(idx);
              }}
              style={{
                transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                zIndex,
                opacity,
              }}
              className={`absolute w-[68vw] max-w-[240px] sm:w-[260px] h-[240px] sm:h-[270px] rounded-3xl p-4 sm:p-5 cursor-pointer transition-all duration-500 ease-out border shadow-2xl flex flex-col justify-between ${
                isActive
                  ? 'border-[#F042FF]/80 bg-[#160078]/95 shadow-[0_0_35px_rgba(240,66,255,0.45)]'
                  : 'border-[#7226FF]/30 bg-[#160078]/70 hover:border-[#F042FF]/50'
              }`}
            >
              {/* Card Media Banner Area */}
              <div
                className={`w-full h-28 sm:h-32 rounded-2xl bg-gradient-to-br ${accent.gradientBg} border border-white/10 p-3 flex flex-col justify-between relative overflow-hidden group shadow-inner`}
              >
                <div className="flex items-center justify-between z-10">
                  <span className={`font-mono text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider ${accent.badgeClass}`}>
                    {accent.categoryLabel}
                  </span>
                  <Heart className="w-4 h-4 text-[#FFE5F1]/80" />
                </div>

                <div className="flex items-center gap-2.5 z-10">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                    {accent.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[9px] font-bold text-[#87F5F5] uppercase block truncate">
                      SVEC
                    </span>
                    <span className="font-display font-bold text-xs text-[#FFE5F1] block truncate">
                      {item.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="mt-2.5">
                <h3 className="font-display font-bold text-xs sm:text-sm text-[#FFE5F1] tracking-tight truncate">
                  {item.fullName}
                </h3>
                <p className="font-mono text-[10px] text-[#FFE5F1]/70 mt-0.5 truncate">
                  {item.descriptor}
                </p>
              </div>

              {/* Footer Action */}
              <div className="mt-2 pt-2 border-t border-[#7226FF]/25 flex items-center justify-between text-[10px] sm:text-xs font-mono">
                <span className="text-[#87F5F5] font-semibold">
                  {isActive ? 'View →' : 'Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Media Carousel Controls & Segmented Progress Bar */}
      <div className="mt-3 flex items-center justify-between max-w-sm sm:max-w-md mx-auto px-3.5 py-2 rounded-full glass-panel border border-[#7226FF]/30">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 rounded-full hover:bg-white/10 text-[#FFE5F1] transition shrink-0"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#F042FF]" /> : <Play className="w-3.5 h-3.5 text-[#87F5F5]" />}
        </button>

        {/* Progress Bar Segments */}
        <div className="flex-1 mx-3 flex items-center gap-1.5">
          {FEATURED_CLUBS.map((item, idx) => (
            <div
              key={item.name}
              onClick={() => setActiveIndex(idx)}
              className="h-1 flex-1 rounded-full cursor-pointer overflow-hidden bg-white/15 transition-all"
            >
              <div
                className={`h-full transition-all duration-300 ${
                  idx === activeIndex
                    ? 'bg-gradient-to-r from-[#7226FF] to-[#F042FF] w-full'
                    : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Arrow Controls */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-white/10 text-[#FFE5F1] transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-white/10 text-[#FFE5F1] transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
