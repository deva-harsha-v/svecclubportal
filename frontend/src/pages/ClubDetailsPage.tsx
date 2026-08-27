import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Instagram, Linkedin, Globe, Heart, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { ClubDetail } from '../types';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useClubSelection } from '../hooks/useClubSelection';
import { getClubAccent } from '../utils/categoryIcons';
import { getLogoUrl } from '../utils/logoHelper';
import { SelectionTray } from '../components/club/SelectionTray';

export const ClubDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [club, setClub] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [btnHover, setBtnHover] = useState<boolean>(false);

  const { selectedClubs, toggleClub, isSelected, removeClub, clearSelection } = useClubSelection();

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

  return (
    <div className="portal-bg min-h-screen py-6 sm:py-10 px-4 sm:px-8 relative pb-28">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </button>

        {/* Profile Card Container */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-8 relative overflow-hidden">
          
          {/* 1. HERO VISUAL AREA */}
          <div className="w-full h-56 sm:h-72 rounded-xl bg-slate-950 border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden group">
            {/* Custom Banner Cover Image if set */}
            {club.banner ? (
              <img
                src={getLogoUrl(club.banner)}
                alt={club.name}
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className={`absolute inset-0 z-0 opacity-40 bg-gradient-to-br ${accent.gradientBg}`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-0 pointer-events-none" />

            {/* Top Row: Category Badge & Favorite Toggle */}
            <div className="flex items-center justify-between z-10">
              <span className={`text-xs font-semibold border px-3 py-1 rounded-md ${accent.badgeClass}`}>
                {accent.categoryLabel}
              </span>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2.5 rounded-lg border border-slate-700 backdrop-blur-md transition ${
                  isLiked ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900/60 text-slate-300 hover:text-white'
                }`}
                title="Favorite"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Bottom Row inside Media: Logo & SVEC Brand (3:4 Instagram Portrait Ratio Box) */}
            <div className="flex items-center gap-4 z-10">
              <div className={`w-24 sm:w-28 aspect-[3/4] rounded-xl border p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-lg ${accent.bgTint}`}>
                {getLogoUrl(club.logo) ? (
                  <img src={getLogoUrl(club.logo)} alt={club.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  accent.icon
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                  Sri Vasavi Engineering College
                </span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-100">
                  {club.name}
                </h2>
              </div>
            </div>
          </div>

          {/* 2. CLUB IDENTITY & PRIMARY JOIN CTA WITH INLINE FEEDBACK */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
                {club.name}
              </h1>
              {club.tagline && (
                <p className="text-sm text-slate-300 mt-1">
                  {club.tagline}
                </p>
              )}
            </div>

            {/* Join Button with Clear Inline Feedback */}
            <div className="w-full sm:w-auto shrink-0 flex flex-col items-end gap-1.5">
              {!club.registration_open ? (
                <span className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  Registration Closed
                </span>
              ) : (
                <button
                  onClick={() => toggleClub(club)}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-150 ${
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
                        ✓ Selected for Registration
                      </>
                    )
                  ) : (
                    '+ Select This Club'
                  )}
                </button>
              )}

              {selected && club.registration_open && (
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Added to registration cart below
                </span>
              )}
            </div>
          </div>

          {/* 3. ABOUT DESCRIPTION */}
          {club.description && (
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-slate-100">
                About {club.name}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {club.description}
              </p>
            </div>
          )}

          {/* 4. WHAT WE DO */}
          {club.what_we_do && club.what_we_do.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display font-bold text-lg text-slate-100">What We Do</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {club.what_we_do.map((act, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-slate-200"
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. DOMAINS & FOCUS AREAS */}
          {club.domains && club.domains.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-slate-100">Domains & Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {club.domains.map((dom, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-md bg-slate-800/60 border border-slate-700 text-xs font-medium text-slate-300"
                  >
                    #{dom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 6. FACULTY COORDINATOR & LEADS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            {club.faculty_coordinator && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                  Faculty Coordinator
                </span>
                <div className="font-display font-bold text-sm text-slate-100">{club.faculty_coordinator}</div>
              </div>
            )}

            {club.leads && club.leads.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-2">
                  Student Leads & Office Bearers
                </span>
                <div className="space-y-1.5">
                  {club.leads.map((lead, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-100">{lead.name}</span>
                      {lead.role && <span className="text-slate-400">{lead.role}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 7. SOCIAL LINKS */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3">
            <a
              href={club.instagram && club.instagram.startsWith('http') ? club.instagram : "https://www.instagram.com/sves_official_info?igsi=MW80ZXQzZzNoY24zaQ=="}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:border-slate-600 transition"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              Instagram
            </a>
            <a
              href={club.website && club.website.startsWith('http') ? club.website : "https://srivasaviengg.ac.in/"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:border-slate-600 transition"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              College Website
            </a>
            {club.linkedin && (
              <a
                href={club.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 hover:border-slate-600 transition"
              >
                <Linkedin className="w-4 h-4 text-sky-400" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Persistent Selection Tray Bar on Club Details Page (E-commerce cart feedback) */}
      <SelectionTray
        selectedClubs={selectedClubs}
        onRemoveClub={removeClub}
        onClear={clearSelection}
      />
    </div>
  );
};
