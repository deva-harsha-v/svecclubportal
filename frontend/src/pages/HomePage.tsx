import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ClubSummary } from '../types';
import { ClubCard } from '../components/club/ClubCard';
import { CategoryFilter } from '../components/club/CategoryFilter';
import { SelectionTray } from '../components/club/SelectionTray';
import { useClubSelection } from '../hooks/useClubSelection';
import { FloatingShowcase } from '../components/club/FloatingShowcase';
import { PublicPortalSkeleton } from '../components/ui/PublicPortalSkeleton';

// Expected local video file path: /assets/hero-campus.mp4 (in frontend/public/assets/hero-campus.mp4)
export const HERO_VIDEO_PATH = '/assets/hero-campus.mp4';

export const HomePage: React.FC = () => {
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<boolean>(false);

  const { selectedClubs, toggleClub, isSelected, removeClub, clearSelection } = useClubSelection();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [activeCategory]);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchClubs = async () => {
    setLoading(true);
    setError(null);
    try {
      let queryCategory = activeCategory;
      if (activeCategory === 'Dance & Drama' || activeCategory === 'Performing Arts') queryCategory = 'Cultural';
      if (activeCategory === 'Media & Creative' || activeCategory === 'Media') queryCategory = 'Media';
      if (activeCategory === 'Music & Performing Arts') queryCategory = 'Cultural';

      const data = await api.getClubs('', activeCategory === 'All' ? 'All' : queryCategory);
      setClubs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load clubs.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PublicPortalSkeleton />;
  }

  // Dynamic Category Counts
  const categoryCounts: Record<string, number> = { All: clubs.length };
  clubs.forEach((c) => {
    const cat = c.category;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    const nameLower = c.name.toLowerCase();
    if (nameLower.includes('sakala') || nameLower.includes('dance')) {
      categoryCounts['Performing Arts'] = (categoryCounts['Performing Arts'] || 0) + 1;
      categoryCounts['Dance & Drama'] = (categoryCounts['Dance & Drama'] || 0) + 1;
    }
    if (nameLower.includes('beats') || nameLower.includes('sing')) {
      categoryCounts['Music'] = (categoryCounts['Music'] || 0) + 1;
      categoryCounts['Music & Performing Arts'] = (categoryCounts['Music & Performing Arts'] || 0) + 1;
    }
    if (nameLower.includes('photo')) {
      categoryCounts['Photography'] = (categoryCounts['Photography'] || 0) + 1;
    }
    if (nameLower.includes('ace') || nameLower.includes('radio') || nameLower.includes('media')) {
      categoryCounts['Media'] = (categoryCounts['Media'] || 0) + 1;
      categoryCounts['Media & Creative'] = (categoryCounts['Media & Creative'] || 0) + 1;
    }
  });

  return (
    <div className="portal-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative py-6 sm:py-10 px-4 sm:px-8 lg:px-12 border-b border-[#7226FF]/20 overflow-hidden">
        
        {/* DESKTOP BACKGROUND VIDEO ARCHITECTURE (Visible only on lg screens) */}
        {!videoError && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
            className="hidden lg:block absolute inset-0 w-full h-full object-cover z-0 opacity-80 pointer-events-none transition-opacity duration-1000"
          >
            <source src={HERO_VIDEO_PATH} type="video/mp4" />
          </video>
        )}

        {/* DESKTOP DARK BLEND OVERLAY */}
        <div
          className="hidden lg:block absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(1, 0, 48, 0.75) 0%, rgba(22, 0, 120, 0.55) 45%, rgba(114, 38, 255, 0.40) 100%)',
          }}
        />
        <div className="hidden lg:block absolute inset-0 bg-[radial-gradient(rgba(135,245,245,0.05)_1px,transparent_1px)] [background-size:24px_24px] z-0 pointer-events-none" />

        {/* Ambient Environmental Lighting Blobs */}
        <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-[#7226FF]/20 blur-3xl z-0 pointer-events-none" />
        <div className="absolute bottom-10 right-1/3 w-64 h-64 rounded-full bg-[#F042FF]/15 blur-2xl z-0 pointer-events-none" />
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#87F5F5]/10 blur-3xl z-0 pointer-events-none" />

        {/* HERO CONTAINER */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column / Mobile Headline Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* MOBILE VIDEO ZONE */}
            <div className="lg:hidden relative p-5 rounded-3xl overflow-hidden border border-[#7226FF]/30 shadow-2xl bg-[#010030]">
              {!videoError && (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onError={() => setVideoError(true)}
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-75 pointer-events-none"
                >
                  <source src={HERO_VIDEO_PATH} type="video/mp4" />
                </video>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#010030]/85 via-[#160078]/70 to-[#7226FF]/50 z-0 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(rgba(135,245,245,0.05)_1px,transparent_1px)] [background-size:24px_24px] z-0 pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-100 tracking-tight leading-[1.02]">
                  Find your people.<br />
                  Join the clubs you're{' '}
                  <span className="bg-gradient-to-r from-[#7226FF] via-[#F042FF] to-[#87F5F5] bg-clip-text text-transparent">
                    curious about.
                  </span>
                </h1>

                <p className="text-xs sm:text-base text-[rgba(255,229,241,0.8)] font-sans leading-relaxed">
                  Explore SVEC clubs across technology, performing arts, music, photography, and student media — then submit all your selections in one registration.
                </p>
              </div>
            </div>

            {/* DESKTOP HEADLINE CONTENT (Visible on lg screens) */}
            <div className="hidden lg:block space-y-6">
              <h1 className="font-display font-extrabold text-5xl lg:text-6xl text-slate-100 tracking-tight leading-[1.02] max-w-[650px]">
                Find your people.<br />
                Join the clubs you're{' '}
                <span className="bg-gradient-to-r from-[#7226FF] via-[#F042FF] to-[#87F5F5] bg-clip-text text-transparent">
                  curious about.
                </span>
              </h1>

              <p className="text-base text-[rgba(255,229,241,0.8)] font-sans leading-relaxed max-w-xl">
                Explore SVEC clubs across technology, performing arts, music, photography, and student media — then submit all your selections in one registration.
              </p>
            </div>

            {/* MOBILE FEATURED CLUB ZONE (Clean, Opaque High-Contrast Surface) */}
            <div className="block lg:hidden pt-2">
              <div className="p-4 sm:p-6 rounded-3xl bg-[#010030] border border-[#7226FF]/35 shadow-2xl relative overflow-hidden">
                <div className="font-mono text-[10px] font-semibold text-[#87F5F5] uppercase tracking-widest mb-3">
                  FEATURED CLUBS
                </div>
                <FloatingShowcase clubs={clubs} />
              </div>
            </div>
          </div>

          {/* Right Column / Desktop Showcase (Visible on screens >= lg) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="font-mono text-[10px] font-semibold text-[#87F5F5] uppercase tracking-widest mb-2 text-center lg:text-left">
              FEATURED CLUBS
            </div>
            <FloatingShowcase clubs={clubs} />
          </div>
        </div>
      </section>

      {/* Category Filter Sticky Bar */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        categoryCounts={categoryCounts}
        onSelectCategory={setActiveCategory}
      />

      {/* Main Full-Width Grid Section */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Clean Results Header */}
        <div className="mb-6 pb-3 border-b border-[#7226FF]/20">
          <h2 className="font-display font-bold text-lg sm:text-xl text-[#FFE5F1]">Explore SVEC Clubs</h2>
          <p className="font-mono text-[11px] sm:text-xs text-[rgba(255,229,241,0.68)] mt-0.5">
            Select any club to inspect full details or add to your registration cart
          </p>
        </div>

        {clubs.length === 0 ? (
          <div className="text-center py-16 px-4 glass-card rounded-3xl max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted mx-auto mb-3 text-2xl font-mono">
              ?
            </div>
            <h3 className="font-display text-lg font-bold text-[#FFE5F1]">No matching clubs found</h3>
            <p className="text-xs text-[rgba(255,229,241,0.68)] mt-1 max-w-xs mx-auto">
              Try switching category filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {clubs.map((club) => (
              <ClubCard
                key={club.slug}
                club={club}
                isSelected={isSelected(club.slug)}
                onToggleSelect={(c) => toggleClub(c)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating Glassmorphic Selection Tray */}
      <SelectionTray
        selectedClubs={selectedClubs}
        onRemoveClub={removeClub}
        onClear={clearSelection}
      />
    </div>
  );
};
