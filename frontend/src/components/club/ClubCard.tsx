import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Check } from 'lucide-react';
import { ClubSummary } from '../../types';
import { getClubAccent } from '../../utils/categoryIcons';
import { getLogoUrl } from '../../utils/logoHelper';

interface ClubCardProps {
  club: ClubSummary;
  isSelected: boolean;
  onToggleSelect: (club: ClubSummary, e: React.MouseEvent) => void;
}

export const ClubCard: React.FC<ClubCardProps> = ({
  club,
  isSelected,
  onToggleSelect,
}) => {
  const navigate = useNavigate();
  const accent = getClubAccent(club.category, club.name);

  const handleCardClick = () => {
    navigate(`/clubs/${club.slug}`);
  };

  // 3:4 Portrait image asset (banner photo or fallback)
  const portraitImageUrl = getLogoUrl(club.banner || club.logo);
  // Transparent logo asset
  const logoUrl = getLogoUrl(club.logo);

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between text-left bg-slate-900 border overflow-hidden ${
        isSelected
          ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md'
          : 'border-slate-800 hover:border-slate-700 hover:shadow-lg'
      }`}
    >
      {/* 1. 3:4 PORTRAIT CLUB IMAGE AREA */}
      <div className="relative w-full aspect-[3/4] max-h-56 sm:max-h-60 bg-slate-950 overflow-hidden shrink-0">
        {portraitImageUrl ? (
          <img
            src={portraitImageUrl}
            alt={club.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${accent.gradientBg} flex items-center justify-center p-6 opacity-60`}>
            <div className="w-14 h-14 text-slate-300">
              {accent.icon}
            </div>
          </div>
        )}

        {/* Subtle scrim overlay at bottom for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* TRANSPARENT CLUB LOGO (Clean floating logo with NO container box, borders, or background) */}
        {logoUrl && (
          <div className="absolute bottom-3 left-3 z-10">
            <img
              src={logoUrl}
              alt={`${club.name} Logo`}
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-md shrink-0"
            />
          </div>
        )}

        {/* SUBTLE CIRCULAR FAVORITE / SELECT BUTTON (TOP RIGHT) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(club, e);
          }}
          title={isSelected ? 'Remove from selection' : 'Add to selection'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-150 ${
            isSelected
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm scale-105'
              : 'bg-slate-950/60 border-slate-700/60 text-slate-300 hover:bg-slate-900 hover:border-slate-500 hover:text-white backdrop-blur-md'
          }`}
        >
          {isSelected ? (
            <Check className="w-4 h-4 stroke-[3] text-white" />
          ) : (
            <Heart className="w-4 h-4 text-slate-300 hover:text-white" />
          )}
        </button>

        {/* Selected badge overlay on top left if active */}
        {isSelected && (
          <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-semibold shadow-sm">
            Selected
          </div>
        )}
      </div>

      {/* 2. INFORMATION SECTION (SOLID DARK SLATE SURFACE) */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Club Name */}
          <h3 className="font-display font-bold text-base sm:text-lg text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
            {club.name}
          </h3>

          {/* Understated Category Badge */}
          <div className="mt-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded-md inline-block">
              {accent.categoryLabel}
            </span>
          </div>

          {/* Short Description / Tagline */}
          {club.tagline && (
            <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {club.tagline}
            </p>
          )}
        </div>

        {/* 3. ACTION AREA & AVAILABILITY STATUS */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${club.registration_open ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            <span className="text-[11px] font-medium text-slate-400">
              {club.registration_open ? 'Open for Joining' : 'Registration Closed'}
            </span>
          </div>

          <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-indigo-400 transition">
            <span>View details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
