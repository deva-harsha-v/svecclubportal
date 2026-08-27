import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Power, CheckCircle, XCircle, Search, Trash2, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';
import { ClubDetail } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { getClubAccent } from '../../utils/categoryIcons';
import { getLogoUrl } from '../../utils/logoHelper';

export const ClubManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<ClubDetail[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Permanent Delete Modal state
  const [clubToDelete, setClubToDelete] = useState<ClubDetail | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminClubs();
      setClubs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch clubs.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRegistration = async (club: ClubDetail) => {
    try {
      const updated = await api.updateClub(club.slug, {
        ...club,
        registration_open: !club.registration_open,
      });
      setClubs(clubs.map((c) => (c.slug === club.slug ? updated : c)));
    } catch (err: any) {
      alert(err.message || 'Failed to toggle registration.');
    }
  };

  const handleConfirmPermanentDelete = async () => {
    if (!clubToDelete) return;
    setDeleting(true);
    try {
      await api.deleteClubPermanent(clubToDelete.slug);
      setClubs(clubs.filter((c) => c.slug !== clubToDelete.slug));
      setClubToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete club.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredClubs = clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-100">Club Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage student club modules, toggle registration status, edit media, or permanently remove clubs.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/clubs/new')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Create New Club
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search modules by name, slug, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition"
        />
      </div>

      {error && <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">{error}</div>}

      {loading ? (
        <LoadingSpinner label="Loading club modules..." />
      ) : filteredClubs.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-slate-300 font-medium">No matching club modules found.</p>
        </div>
      ) : (
        /* Module / Card Grid (Replaces traditional table) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club) => {
            const accent = getClubAccent(club.category, club.name);
            const logoUrl = getLogoUrl(club.logo);

            return (
              <div
                key={club.slug}
                className={`bg-slate-900 border rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition ${
                  club.is_active ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/50 opacity-60'
                }`}
              >
                {/* Module Header: Logo + Title + Slug */}
                <div className="flex items-start gap-3">
                  {/* Direct Transparent Logo Rendering (No extra circular frame or container background) */}
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={club.name}
                      className="w-10 h-10 object-contain shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 text-indigo-400 shrink-0 flex items-center justify-center">
                      {accent.icon}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-base text-slate-100 truncate">
                      {club.name}
                    </h3>
                    <div className="text-[11px] text-slate-400 truncate">
                      /clubs/{club.slug}
                    </div>
                  </div>
                </div>

                {/* Module Metadata Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded-md">
                    {club.category}
                  </span>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {club.registration_count || 0} Registrations
                  </span>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      club.registration_open
                        ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
                        : 'text-amber-400 bg-amber-950/40 border-amber-800/40'
                    }`}
                  >
                    {club.registration_open ? 'Open' : 'Closed'}
                  </span>
                </div>

                {/* Module Compact Actions Row */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => navigate(`/admin/clubs/${club.slug}/edit`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-semibold transition"
                      title="Edit Club Details"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Edit</span>
                    </button>

                    {/* Registration Toggle Button */}
                    <button
                      onClick={() => handleToggleRegistration(club)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        club.registration_open
                          ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300 hover:bg-emerald-900/40'
                          : 'bg-amber-950/30 border-amber-800/50 text-amber-300 hover:bg-amber-900/40'
                      }`}
                      title={club.registration_open ? 'Close Registrations' : 'Open Registrations'}
                    >
                      {club.registration_open ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Reg Open</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reg Closed</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Permanent Delete Button */}
                  <button
                    onClick={() => setClubToDelete(club)}
                    className="p-1.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-400 hover:bg-red-900/60 transition"
                    title="Permanently Delete Club"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {clubToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-800/60 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-100">Permanently Delete Club?</h3>
                <p className="text-xs text-red-400 font-medium">Destructive Action — Irreversible</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">"{clubToDelete.name}"</strong>?
              This will permanently remove the club module, its media assets, and all associated registration records from the database.
            </p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setClubToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmPermanentDelete}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
