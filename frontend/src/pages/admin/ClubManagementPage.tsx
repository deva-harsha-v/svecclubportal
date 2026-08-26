import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Power, CheckCircle, XCircle, Search } from 'lucide-react';
import { api } from '../../services/api';
import { ClubDetail } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const ClubManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<ClubDetail[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleDeactivate = async (slug: string, name: string) => {
    if (!window.confirm(`Deactivate club "${name}"? It will be hidden from public view while preserving historical registration data.`)) {
      return;
    }
    try {
      await api.deactivateClub(slug);
      fetchClubs();
    } catch (err: any) {
      alert(err.message || 'Failed to deactivate club.');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#FFE5F1]">Club Management</h1>
          <p className="text-xs text-[rgba(255,229,241,0.68)] font-mono mt-0.5">
            Add, edit, open/close registrations, or deactivate clubs dynamically
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/clubs/new')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-primary-gradient text-[#FFE5F1] font-bold text-xs shadow-magentaGlow transition"
        >
          <Plus className="w-4 h-4" />
          Create New Club
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(255,229,241,0.45)]" />
        <input
          type="text"
          placeholder="Filter clubs by name or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#010030]/80 border border-[#7226FF]/35 text-[#FFE5F1] placeholder:text-[rgba(255,229,241,0.4)] text-xs focus:outline-none focus:border-[#F042FF]"
        />
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}

      {loading ? (
        <LoadingSpinner label="Loading clubs list..." />
      ) : (
        <div className="glass-panel rounded-3xl border border-[#7226FF]/35 bg-[#160078]/60 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Club Name & Slug</th>
                  <th>Category</th>
                  <th>Registrations</th>
                  <th>Reg Status</th>
                  <th>Active Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClubs.map((club) => (
                  <tr key={club.slug} className={!club.is_active ? 'opacity-50' : ''}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#010030] border border-[#7226FF]/30 flex items-center justify-center text-sm overflow-hidden shrink-0">
                          {club.logo && club.logo.startsWith('http') ? (
                            <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-mono text-[#87F5F5]">⌘</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#FFE5F1] text-sm">{club.name}</div>
                          <div className="font-mono text-[10px] text-[rgba(255,229,241,0.6)]">/clubs/{club.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-[10px] font-semibold text-[#87F5F5] bg-[#87F5F5]/10 border border-[#87F5F5]/25 px-2.5 py-0.5 rounded-full">
                        {club.category}
                      </span>
                    </td>
                    <td className="font-mono font-bold text-[#87F5F5]">
                      {club.registration_count || 0}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleRegistration(club)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] font-semibold transition ${
                          club.registration_open
                            ? 'bg-[#87F5F5]/15 text-[#87F5F5] border border-[#87F5F5]/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {club.registration_open ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Open
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Closed
                          </>
                        )}
                      </button>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                          club.is_active
                            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                            : 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                        }`}
                      >
                        {club.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/clubs/${club.slug}/edit`)}
                          className="p-1.5 rounded-lg bg-[#010030] border border-[#7226FF]/35 text-[#87F5F5] hover:border-[#F042FF] transition"
                          title="Edit Club"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {club.is_active && (
                          <button
                            onClick={() => handleDeactivate(club.slug, club.name)}
                            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition"
                            title="Deactivate Club"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
