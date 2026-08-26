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
      className={`group relative rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between text-left min-h-[190px] sm:min-h-[210px] glass-card ${
        isSelected
          ? '!border-[#F042FF] !bg-[rgba(114,38,255,0.22)] shadow-[0_0_25px_rgba(240,66,255,0.3)] scale-[1.01]'
          : accent.borderHoverClass
      }`}
      style={{
        background: isSelected ? 'rgba(114, 38, 255, 0.22)' : 'rgba(22, 0, 120, 0.42)',
        borderColor: isSelected ? 'rgba(240, 66, 255, 0.60)' : 'rgba(135, 245, 245, 0.12)',
      }}
    >
      {/* Selection Check Indicator */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(club, e);
        }}
        className={`absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full font-mono text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5 transition-all duration-200 ${
          isSelected
            ? 'btn-primary-gradient shadow-magentaGlow text-[#FFE5F1] scale-100 opacity-100'
            : 'bg-black/30 border border-[rgba(135,245,245,0.2)] text-[rgba(255,229,241,0.68)] hover:border-[#F042FF] hover:text-[#FFE5F1]'
        }`}
      >
        <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-white stroke-[3]' : 'text-[rgba(255,229,241,0.68)]'}`} />
        <span>{isSelected ? 'Selected' : 'Select'}</span>
      </div>

      <div>
        {/* Top Icon & Category Row */}
        <div className="flex items-center gap-3 mb-3 pr-20">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#010030]/60 border border-[rgba(135,245,245,0.15)] p-1 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shrink-0 shadow-inner">
            {logoUrl ? (
              <img src={logoUrl} alt={club.name} className="w-full h-full object-contain rounded-lg" />
            ) : (
              accent.icon
            )}
          </div>
          <div>
            <span className={`font-mono text-[10px] font-bold tracking-wider uppercase block border px-2 py-0.5 rounded-full ${accent.badgeClass}`}>
              {accent.categoryLabel}
            </span>
          </div>
        </div>

        {/* Club Title */}
        <h3 className="font-display text-base font-bold text-[#FFE5F1] group-hover:text-[#87F5F5] transition-colors line-clamp-1">
          {club.name}
        </h3>

        {/* Tagline / Overview */}
        {club.tagline && (
          <p className="mt-1 text-xs text-[rgba(255,229,241,0.68)] line-clamp-2 leading-relaxed font-sans">
            {club.tagline}
          </p>
        )}
      </div>

      {/* Footer Status */}
      <div className="mt-4 pt-3 border-t border-[rgba(135,245,245,0.1)] flex items-center justify-between">
        {!club.registration_open ? (
          <span className="font-mono text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">
            Registration Closed
          </span>
        ) : (
          <span className="font-mono text-[10px] font-semibold text-[#87F5F5] bg-[#87F5F5]/10 border border-[#87F5F5]/20 px-2.5 py-0.5 rounded-full">
            Open for Joining
          </span>
        )}

        <span className="text-[11px] font-mono text-[rgba(255,229,241,0.45)] group-hover:text-[#F042FF] transition-colors">
          View details →
        </span>
      </div>
    </div>
  );
};
