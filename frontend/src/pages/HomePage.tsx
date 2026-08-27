import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ClubSummary } from '../types';
import { ClubCard } from '../components/club/ClubCard';
import { SelectionTray } from '../components/club/SelectionTray';
import { useClubSelection } from '../hooks/useClubSelection';
import { FloatingShowcase } from '../components/club/FloatingShowcase';
import { PublicPortalSkeleton } from '../components/ui/PublicPortalSkeleton';

export const HERO_VIDEO_PATH = '/assets/hero-campus.mp4';

export const HomePage: React.FC = () => {
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<boolean>(false);

  const { selectedClubs, toggleClub, isSelected, removeClub, clearSelection } = useClubSelection();

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getClubs('', 'All');
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

  return (
    <div className="portal-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 px-4 sm:px-8 lg:px-12 border-b border-slate-800/80 overflow-hidden bg-[#090D16]">
        
        {/* DESKTOP BACKGROUND VIDEO (Substantially visible background visual) */}
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

        {/* DESKTOP LIGHTER OVERLAY FOR CLEAR VIDEO VISIBILITY */}
        <div
          className="hidden lg:block absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(9, 13, 22, 0.65) 0%, rgba(15, 23, 42, 0.35) 50%, rgba(9, 13, 22, 0.60) 100%)',
          }}
        />

        {/* HERO CONTAINER */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column / Mobile Headline Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* MOBILE VIDEO ZONE */}
            <div className="lg:hidden relative p-5 sm:p-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/80 shadow-xl">
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
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-900/40 to-slate-950/60 z-0 pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    SVEC Orientation 2026
                  </span>
                </div>

                <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-100 tracking-tight leading-[1.08]">
                  Find your community.<br />
                  Join the clubs you're <span className="text-indigo-400">curious about.</span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Explore SVEC student organisations across technology, performing arts, music, photography, and media — then submit all your selections in one registration.
                </p>
              </div>
            </div>

            {/* DESKTOP HEADLINE CONTENT */}
            <div className="hidden lg:block space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  SVEC Orientation 2026
                </span>
              </div>

              <h1 className="font-display font-bold text-4xl lg:text-5xl text-slate-100 tracking-tight leading-[1.08] max-w-[650px]">
                Find your community.<br />
                Join the clubs you're <span className="text-indigo-400">curious about.</span>
              </h1>

              <p className="text-base text-slate-300 leading-relaxed max-w-xl">
                Explore SVEC student organisations across technology, performing arts, music, photography, and media — then submit all your selections in one registration.
              </p>
            </div>

            {/* MOBILE FEATURED CLUB ZONE */}
            <div className="block lg:hidden pt-2">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
                <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                  Spotlight Clubs
                </div>
                <FloatingShowcase clubs={clubs} />
              </div>
            </div>

          </div>

          {/* Right Column / Desktop Featured Showcase */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <FloatingShowcase clubs={clubs} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Clubs Grid Section */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-0">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-100">
              Explore SVEC Clubs
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Select any club to inspect full details or add to your registration cart
            </p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
            {clubs.length} {clubs.length === 1 ? 'Club' : 'Clubs'}
          </span>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm">
            {error}
          </div>
        )}

        {clubs.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <p className="text-slate-300 font-medium">No clubs found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {clubs.map((club) => (
              <ClubCard
                key={club.slug}
                club={club}
                isSelected={isSelected(club.slug)}
                onToggleSelect={toggleClub}
              />
            ))}
          </div>
        )}
      </section>

      {/* Sticky Bottom Cart Tray */}
      <SelectionTray
        selectedClubs={selectedClubs}
        onRemoveClub={removeClub}
        onClear={clearSelection}
      />
    </div>
  );
};
