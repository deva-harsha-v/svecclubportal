import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Heart, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { ClubDetail } from '../types';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { getClubAccent } from '../utils/categoryIcons';
import { getLogoUrl } from '../utils/logoHelper';
import { useClubSelection } from '../hooks/useClubSelection';

export const ClubDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [club, setClub] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [btnHover, setBtnHover] = useState<boolean>(false);

  const { selectedClubs, toggleClub, isSelected } = useClubSelection();

  useEffect(() => {
    if (slug) fetchClubDetail(slug);
  }, [slug]);

  const fetchClubDetail = async (clubSlug: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getClubBySlug(clubSlug);
      setClub(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load club details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading club profile..." />;

  if (error || !club) {
    return (
      <div className="min-h-screen portal-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4 bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <h2 className="font-display font-bold text-xl text-slate-100">Club Not Found</h2>
          <p className="text-sm text-slate-400">{error || 'The requested club profile does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const accent = getClubAccent(club.category, club.name);
  const selected = isSelected(club.slug);

  // 1. Dedicated 3:4 Portrait image asset for Club Detail page (detail_image, fallback to banner)
  const portraitImage = getLogoUrl(club.detail_image || club.banner || club.logo);

  // 2. Transparent PNG logo asset
  const logoUrl = getLogoUrl(club.logo);

  return (
    <div className="portal-bg min-h-screen py-6 sm:py-10 px-4 sm:px-8 relative pb-12">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </button>

        {/* Editorial Product Card Container */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          
          {/* 1. FULL-BLEED 3:4 PORTRAIT IMAGE AREA (Strict 3:4 Aspect Ratio) */}
          <div className="relative w-full aspect-[3/4] max-h-[500px] sm:max-h-[560px] bg-slate-950 overflow-hidden">
            {portraitImage ? (
              <img
                src={portraitImage}
                alt={club.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${accent.gradientBg} flex items-center justify-center p-8 opacity-60`}>
                <div className="w-20 h-20 text-slate-300">
                  {accent.icon}
                </div>
              </div>
            )}

            {/* Gradient Scrim for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 pointer-events-none" />

            {/* CLEAN FLOATING TRANSPARENT LOGO OVERLAY (Raw PNG Logo ONLY — NO container box, NO inner square, NO border) */}
            {logoUrl && (
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3">
                <img
                  src={logoUrl}
                  alt={`${club.name} Logo`}
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-xl shrink-0"
                />
                <div>
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                    SVEC Organisation
                  </span>
                  <span className="font-display font-bold text-sm sm:text-base text-slate-100 block drop-shadow-md">
                    {club.name}
                  </span>
                </div>
              </div>
            )}

            {/* Floating Heart Favorite Button (Top-Right of Image) */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full border flex items-center justify-center backdrop-blur-md transition-all ${
                isLiked
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-950/60 border-slate-700/60 text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : 'text-slate-300'}`} />
            </button>
          </div>

          {/* 2. FLAT CONTENT SECTION BELOW IMAGE */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Category & Registration Status Row */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 px-2.5 py-1 rounded-md">
                {accent.categoryLabel}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${club.registration_open ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span className="text-xs font-medium text-slate-400">
                  {club.registration_open ? 'Open for Joining' : 'Registration Closed'}
                </span>
              </div>
            </div>

            {/* Club Name & Short Tagline */}
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
                {club.name}
              </h1>
              {club.tagline && (
                <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                  {club.tagline}
                </p>
              )}
            </div>

            {/* Action Row: Primary Join / Select CTA Button */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-400">Status</span>
                <span className="text-sm font-medium text-slate-200">
                  {club.registration_open ? 'Available for Orientation 2026' : 'Registration Currently Closed'}
                </span>
              </div>

              <div className="flex flex-col items-stretch sm:items-end gap-1.5">
                {!club.registration_open ? (
                  <span className="px-6 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 font-semibold text-xs uppercase tracking-wider text-center">
                    Registration Closed
                  </span>
                ) : (
                  <button
                    onClick={() => toggleClub(club)}
                    onMouseEnter={() => setBtnHover(true)}
                    onMouseLeave={() => setBtnHover(false)}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-150 ${
                      selected
                        ? btnHover
                          ? 'bg-red-600 text-white border border-red-500 shadow-sm'
                          : 'bg-emerald-600 text-white border border-emerald-500 shadow-sm'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                    }`}
                  >
                    {selected ? (
                      btnHover ? (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Remove from Selection
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          Selected for Registration
                        </>
                      )
                    ) : (
                      '+ Select This Club'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
