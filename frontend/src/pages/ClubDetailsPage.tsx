import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, Instagram, Linkedin, Globe, Heart, Sparkles, UserCheck } from 'lucide-react';
import { api } from '../services/api';
import { ClubDetail } from '../types';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useClubSelection } from '../hooks/useClubSelection';
import { getClubAccent } from '../utils/categoryIcons';
import { RegistrationProgress } from '../components/registration/RegistrationProgress';
import { getLogoUrl } from '../utils/logoHelper';

export const ClubDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [club, setClub] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const { isSelected, toggleClub } = useClubSelection();

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
      setError(err.message || 'Club profile unavailable.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading club profile..." />;

  if (error || !club) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center portal-bg min-h-screen">
        <div className="glass-card p-8 rounded-3xl">
          <h2 className="font-display font-bold text-xl text-[#FFE5F1]">Club Not Found</h2>
          <p className="mt-2 text-sm text-[#FFE5F1]/70">{error || 'The requested club profile does not exist.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-full btn-primary-gradient text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const selected = isSelected(club.slug);
  const accent = getClubAccent(club.category, club.name);

  return (
    <div className="portal-bg min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Registration Flow Progress Bar */}
        <RegistrationProgress currentStep={1} />

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#FFE5F1]/70 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </button>

        {/* Product Card Inspired Editorial Layout Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#7226FF]/30 space-y-8 relative overflow-hidden">
          {/* Ambient Lighting Backdrop */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#7226FF]/15 via-[#F042FF]/10 to-transparent blur-3xl pointer-events-none" />

          {/* 1. LARGE CLUB VISUAL / MEDIA AREA (Hero Card Visual Area) */}
          <div className={`w-full h-56 sm:h-72 rounded-3xl bg-gradient-to-br ${accent.gradientBg} border border-[#7226FF]/30 p-6 flex flex-col justify-between relative shadow-[0_0_30px_rgba(114,38,255,0.2)] overflow-hidden group`}>
            {/* Ambient lighting effect inside media */}
            <div className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full bg-[#F042FF]/20 blur-2xl pointer-events-none" />

            {/* Top Row: Category & Heart Favorite Toggle */}
            <div className="flex items-center justify-between z-10">
              <span className={`font-mono text-xs font-bold border px-3 py-1 rounded-full uppercase tracking-wider ${accent.badgeClass}`}>
                {accent.categoryLabel}
              </span>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2.5 rounded-full backdrop-blur-md border border-white/20 transition ${
                  isLiked ? 'bg-[#F042FF] text-white border-[#F042FF]' : 'bg-black/30 text-[#FFE5F1]/80 hover:text-white'
                }`}
                title="Favorite"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
              </button>
            </div>
            {/* Bottom Row inside Media: Logo & SVEC Brand */}
            <div className="flex items-center gap-4 z-10">
              <div className="w-16 h-16 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center overflow-hidden shadow-lg">
                {getLogoUrl(club.logo) ? (
                  <img src={getLogoUrl(club.logo)} alt={club.name} className="w-full h-full object-contain rounded-xl" />
                ) : (
                  accent.icon
                )}
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-[#87F5F5] uppercase tracking-wider block">
                  Sri Vasavi Engineering College
                </span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#FFE5F1]">
                  {club.name}
                </h2>
              </div>
            </div>
          </div>

          {/* 2. CLUB IDENTITY & PRIMARY JOIN CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#7226FF]/20">
            <div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#FFE5F1]">
                {club.name}
              </h1>
              {club.tagline && (
                <p className="text-sm text-[#FFE5F1]/80 font-sans mt-1">
                  {club.tagline}
                </p>
              )}
            </div>

            {/* Join Button (Primary CTA with Gradient & Glow) */}
            <div className="w-full sm:w-auto shrink-0">
              {!club.registration_open ? (
                <span className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-wider">
                  Registration Closed
                </span>
              ) : (
                <button
                  onClick={() => toggleClub(club)}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm transition shadow-lg ${
                    selected
                      ? 'bg-[#87F5F5] text-[#010030] shadow-cyanGlow font-mono'
                      : 'btn-primary-gradient'
                  }`}
                >
                  {selected ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      Selected for Registration
                    </>
                  ) : (
                    '+ Join This Club'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* 3. ABOUT DESCRIPTION */}
          {club.description && (
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-[#FFE5F1]">
                About {club.name}
              </h3>
              <p className="text-sm text-[#FFE5F1]/80 leading-relaxed whitespace-pre-line font-sans">
                {club.description}
              </p>
            </div>
          )}

          {/* 4. WHAT WE DO (Interactive Compact Cards) */}
          {club.what_we_do && club.what_we_do.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display font-bold text-lg text-[#FFE5F1]">What We Do</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {club.what_we_do.map((act, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-3 p-3.5 rounded-2xl bg-[#160078]/60 border border-[#7226FF]/30 text-xs font-semibold text-[#FFE5F1] hover:border-[#7226FF] hover:bg-[#1E009C]/80 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(114,38,255,0.3)] transition-all duration-200"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#87F5F5] group-hover:bg-[#F042FF] transition-colors shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. DOMAINS & FOCUS AREAS (Hashtag Pills) */}
          {club.domains && club.domains.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-[#FFE5F1]">Domains & Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {club.domains.map((dom, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-full bg-[#160078]/80 border border-[#7226FF]/30 text-xs font-mono font-medium text-[#FFE5F1]/80 hover:border-[#F042FF] hover:text-[#FFE5F1] hover:shadow-[0_0_15px_rgba(240,66,255,0.25)] transition-all"
                  >
                    #{dom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 6. FACULTY COORDINATOR & LEADS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#7226FF]/20">
            {club.faculty_coordinator && (
              <div className="p-4 rounded-2xl bg-[#160078]/60 border border-[#7226FF]/30">
                <span className="font-mono text-[10px] font-semibold text-[#87F5F5] uppercase tracking-wider block mb-1">
                  Faculty Coordinator
                </span>
                <div className="font-display font-bold text-sm text-[#FFE5F1]">{club.faculty_coordinator}</div>
              </div>
            )}

            {club.leads && club.leads.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#160078]/60 border border-[#7226FF]/30">
                <span className="font-mono text-[10px] font-semibold text-[#87F5F5] uppercase tracking-wider block mb-2">
                  Student Leads & Office Bearers
                </span>
                <div className="space-y-1.5">
                  {club.leads.map((lead, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#FFE5F1]">{lead.name}</span>
                      {lead.role && <span className="font-mono text-[#FFE5F1]/70">{lead.role}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 7. SOCIAL LINKS */}
          <div className="pt-4 border-t border-[#7226FF]/20 flex flex-wrap gap-4">
            <a
              href={club.instagram && club.instagram.startsWith('http') ? club.instagram : "https://www.instagram.com/sves_official_info?igsi=MW80ZXQzZzNoY24zaQ=="}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#160078] border border-[#7226FF]/40 text-xs font-semibold text-[#FFE5F1] hover:border-[#F042FF] hover:shadow-[0_0_15px_rgba(240,66,255,0.3)] transition-all"
            >
              <Instagram className="w-4 h-4 text-[#F042FF]" />
              Instagram
            </a>
            <a
              href={club.website && club.website.startsWith('http') ? club.website : "https://srivasaviengg.ac.in/"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#160078] border border-[#7226FF]/40 text-xs font-semibold text-[#FFE5F1] hover:border-[#87F5F5] transition-all"
            >
              <Globe className="w-4 h-4 text-[#87F5F5]" />
              College Website
            </a>
            {club.linkedin && (
              <a
                href={club.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#160078] border border-[#7226FF]/40 text-xs font-semibold text-[#FFE5F1] hover:border-[#7226FF] transition-all"
              >
                <Linkedin className="w-4 h-4 text-[#7226FF]" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
