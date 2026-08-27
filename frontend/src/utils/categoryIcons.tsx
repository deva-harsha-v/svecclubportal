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
  bgTint: string;
  glowShadow: string;
}

export function getClubAccent(category: string, clubName: string = ''): ClubAccent {
  const catLower = (category || '').toLowerCase();
  const nameLower = (clubName || '').toLowerCase();

  if (nameLower.includes('sakala') || nameLower.includes('dance') || nameLower.includes('anchor')) {
    return {
      icon: <Drama className="w-5 h-5 text-amber-400" />,
      accentClass: 'text-amber-400',
      badgeClass: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      borderHoverClass: 'hover:border-amber-500/50',
      categoryLabel: 'Performing Arts',
      gradientBg: 'from-slate-900 via-amber-950/30 to-slate-900',
      bgTint: 'bg-amber-950/20 border-amber-500/20',
      glowShadow: 'rgba(245, 158, 11, 0.20)',
    };
  }

  if (nameLower.includes('beats') || nameLower.includes('music') || nameLower.includes('sing')) {
    return {
      icon: <Music className="w-5 h-5 text-violet-400" />,
      accentClass: 'text-violet-400',
      badgeClass: 'bg-violet-500/10 border-violet-500/30 text-violet-300',
      borderHoverClass: 'hover:border-violet-500/50',
      categoryLabel: 'Music',
      gradientBg: 'from-slate-900 via-violet-950/30 to-slate-900',
      bgTint: 'bg-violet-950/20 border-violet-500/20',
      glowShadow: 'rgba(139, 92, 246, 0.20)',
    };
  }

  if (nameLower.includes('photo') || nameLower.includes('camera')) {
    return {
      icon: <Camera className="w-5 h-5 text-sky-400" />,
      accentClass: 'text-sky-400',
      badgeClass: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
      borderHoverClass: 'hover:border-sky-500/50',
      categoryLabel: 'Photography',
      gradientBg: 'from-slate-900 via-sky-950/30 to-slate-900',
      bgTint: 'bg-sky-950/20 border-sky-500/20',
      glowShadow: 'rgba(14, 165, 233, 0.20)',
    };
  }

  if (nameLower.includes('ace') || nameLower.includes('radio') || nameLower.includes('media') || nameLower.includes('magazine')) {
    return {
      icon: <Radio className="w-5 h-5 text-emerald-400" />,
      accentClass: 'text-emerald-400',
      badgeClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      borderHoverClass: 'hover:border-emerald-500/50',
      categoryLabel: 'Media',
      gradientBg: 'from-slate-900 via-emerald-950/30 to-slate-900',
      bgTint: 'bg-emerald-950/20 border-emerald-500/20',
      glowShadow: 'rgba(16, 185, 129, 0.20)',
    };
  }

  if (catLower.includes('tech') || nameLower.includes('geek') || nameLower.includes('code')) {
    return {
      icon: <Code2 className="w-5 h-5 text-indigo-400" />,
      accentClass: 'text-indigo-400',
      badgeClass: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
      borderHoverClass: 'hover:border-indigo-500/50',
      categoryLabel: 'Technical',
      gradientBg: 'from-slate-900 via-indigo-950/30 to-slate-900',
      bgTint: 'bg-indigo-950/20 border-indigo-500/20',
      glowShadow: 'rgba(99, 102, 241, 0.20)',
    };
  }

  return {
    icon: <Compass className="w-5 h-5 text-indigo-400" />,
    accentClass: 'text-indigo-400',
    badgeClass: 'bg-slate-800/60 border-slate-700 text-slate-300',
    borderHoverClass: 'hover:border-slate-700',
    categoryLabel: category || 'General',
    gradientBg: 'from-slate-900 to-slate-950',
    bgTint: 'bg-slate-800/40 border-slate-700/50',
    glowShadow: 'rgba(99, 102, 241, 0.15)',
  };
}
