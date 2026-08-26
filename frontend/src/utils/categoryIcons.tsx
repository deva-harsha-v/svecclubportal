import React from 'react';
import {
  Code2,
  Drama,
  Camera,
  Radio,
  Music,
  Compass
} from 'lucide-react';

export interface ClubAccent {
  icon: React.ReactNode;
  accentClass: string;
  badgeClass: string;
  borderHoverClass: string;
  categoryLabel: string;
  gradientBg: string;
  glowShadow: string;
}

export function getClubAccent(category: string, clubName: string = ''): ClubAccent {
  const catLower = (category || '').toLowerCase();
  const nameLower = (clubName || '').toLowerCase();

  if (nameLower.includes('sakala') || nameLower.includes('dance') || nameLower.includes('anchor')) {
    return {
      icon: <Drama className="w-5 h-5 text-[#F042FF]" />,
      accentClass: 'text-[#F042FF]',
      badgeClass: 'bg-[#F042FF]/15 border-[#F042FF]/30 text-[#F042FF]',
      borderHoverClass: 'hover:border-[#F042FF]/60',
      categoryLabel: 'Performing Arts',
      gradientBg: 'from-[#7226FF] via-[#F042FF] to-[#010030]',
      glowShadow: 'rgba(240, 66, 255, 0.35)',
    };
  }

  if (nameLower.includes('beats') || nameLower.includes('music') || nameLower.includes('sing')) {
    return {
      icon: <Music className="w-5 h-5 text-[#7226FF]" />,
      accentClass: 'text-[#7226FF]',
      badgeClass: 'bg-[#7226FF]/20 border-[#7226FF]/40 text-[#FFE5F1]',
      borderHoverClass: 'hover:border-[#7226FF]/60',
      categoryLabel: 'Music',
      gradientBg: 'from-[#160078] via-[#7226FF] to-[#010030]',
      glowShadow: 'rgba(114, 38, 255, 0.35)',
    };
  }

  if (nameLower.includes('photo') || nameLower.includes('camera')) {
    return {
      icon: <Camera className="w-5 h-5 text-[#87F5F5]" />,
      accentClass: 'text-[#87F5F5]',
      badgeClass: 'bg-[#87F5F5]/15 border-[#87F5F5]/30 text-[#87F5F5]',
      borderHoverClass: 'hover:border-[#87F5F5]/50',
      categoryLabel: 'Photography',
      gradientBg: 'from-[#160078] via-[#87F5F5]/40 to-[#010030]',
      glowShadow: 'rgba(135, 245, 245, 0.35)',
    };
  }

  if (nameLower.includes('ace') || nameLower.includes('radio') || nameLower.includes('media') || nameLower.includes('magazine')) {
    return {
      icon: <Radio className="w-5 h-5 text-[#F042FF]" />,
      accentClass: 'text-[#F042FF]',
      badgeClass: 'bg-[#F042FF]/15 border-[#F042FF]/30 text-[#F042FF]',
      borderHoverClass: 'hover:border-[#F042FF]/50',
      categoryLabel: 'Media',
      gradientBg: 'from-[#7226FF] via-[#F042FF]/60 to-[#010030]',
      glowShadow: 'rgba(240, 66, 255, 0.35)',
    };
  }

  if (catLower.includes('tech') || nameLower.includes('geek') || nameLower.includes('code')) {
    return {
      icon: <Code2 className="w-5 h-5 text-[#87F5F5]" />,
      accentClass: 'text-[#87F5F5]',
      badgeClass: 'bg-[#7226FF]/20 border-[#87F5F5]/30 text-[#87F5F5]',
      borderHoverClass: 'hover:border-[#7226FF]/60',
      categoryLabel: 'Technical',
      gradientBg: 'from-[#160078] via-[#7226FF] to-[#87F5F5]/30',
      glowShadow: 'rgba(114, 38, 255, 0.35)',
    };
  }

  return {
    icon: <Compass className="w-5 h-5 text-[#87F5F5]" />,
    accentClass: 'text-[#87F5F5]',
    badgeClass: 'bg-[#7226FF]/20 border-[#7226FF]/30 text-[#FFE5F1]',
    borderHoverClass: 'hover:border-[#7226FF]/50',
    categoryLabel: category || 'General',
    gradientBg: 'from-[#160078] to-[#010030]',
    glowShadow: 'rgba(114, 38, 255, 0.25)',
  };
}
