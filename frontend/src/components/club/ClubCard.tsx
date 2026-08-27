import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
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

  const logoUrl = getLogoUrl(club.logo);

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-xl p-4 cursor-pointer transition-all duration-150 flex flex-col justify-between text-left min-h-[160px] bg-slate-900/80 border ${
        isSelected
          ? 'border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500'
          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
      }`}
    >
      {/* Top Header: Category Tinted Emblem + Category Badge + Selection Toggle */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 sm:w-10 aspect-[3/4] rounded-lg p-0.5 flex items-center justify-center shrink-0 border transition-transform duration-150 group-hover:scale-105 ${accent.bgTint}`}>
            {logoUrl ? (
              <img src={logoUrl} alt={club.name} className="w-full h-full object-cover rounded-md" />
            ) : (
              accent.icon
            )}
          </div>
          <div>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border inline-block ${accent.badgeClass}`}>
              {accent.categoryLabel}
            </span>
          </div>
        </div>

        {/* Compact Select Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(club, e);
          }}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isSelected
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
          }`}
        >
          <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-white stroke-[3]' : 'text-slate-400'}`} />
          <span>{isSelected ? 'Selected' : 'Select'}</span>
        </button>
      </div>

      {/* Main Info */}
      <div className="my-1">
        <h3 className="font-display text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
          {club.name}
        </h3>

        {club.tagline && (
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {club.tagline}
          </p>
        )}
      </div>

      {/* Footer Status Indicator */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${club.registration_open ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          <span className="text-[11px] font-medium text-slate-400">
            {club.registration_open ? 'Open for registration' : 'Registration closed'}
          </span>
        </div>
      </div>
    </div>
  );
};
