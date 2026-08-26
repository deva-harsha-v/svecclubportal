import React, { useState, useEffect } from 'react';
import { Search, FileSpreadsheet, Filter, Download } from 'lucide-react';
import { api } from '../../services/api';
import { RegistrationOut, ClubDetail } from '../../types';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const RegistrationManagementPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationOut[]>([]);
  const [clubs, setClubs] = useState<ClubDetail[]>([]);
  const [selectedClub, setSelectedClub] = useState<string>('All');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 50;

  useEffect(() => {
    fetchRegistrationData();
  }, [selectedClub, selectedBranch, search, offset]);

  const fetchRegistrationData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getRegistrations(selectedClub, selectedBranch, search, limit, offset);
      setRegistrations(data);

      if (clubs.length === 0) {
        const clubList = await api.getAdminClubs();
        setClubs(clubList);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load registrations.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const clubParam = selectedClub !== 'All' ? selectedClub : undefined;
      await api.exportExcel(clubParam);
    } catch (err: any) {
      alert(err.message || 'Failed to download Excel file.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#FFE5F1]">Registrations & Excel Export Center</h1>
          <p className="text-xs text-[rgba(255,229,241,0.68)] font-mono mt-0.5">
            Filter by club and export dynamic Excel registration spreadsheets
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-primary-gradient font-bold text-xs shadow-magentaGlow transition"
        >
          <Download className="w-4 h-4 text-[#87F5F5]" />
          <span>
            Export {selectedClub === 'All' ? 'All Clubs' : selectedClub.toUpperCase()} Excel Sheet
          </span>
        </button>
      </div>

      {/* Dynamic Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-[#7226FF]/35 bg-[#160078]/60 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(255,229,241,0.45)]" />
            <input
              type="text"
              placeholder="Search student, roll #, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOffset(0);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#010030]/80 border border-[#7226FF]/35 text-[#FFE5F1] placeholder:text-[rgba(255,229,241,0.4)] text-xs focus:outline-none focus:border-[#F042FF]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#87F5F5]" />
            <select
              value={selectedClub}
              onChange={(e) => {
                setSelectedClub(e.target.value);
                setOffset(0);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#010030]/80 border border-[#7226FF]/35 text-[#FFE5F1] text-xs focus:outline-none focus:border-[#F042FF]"
            >
              <option value="All" className="bg-[#010030] text-[#FFE5F1]">All SVEC Clubs</option>
              {clubs.map((c) => (
                <option key={c.slug} value={c.slug} className="bg-[#010030] text-[#FFE5F1]">
                  {c.name} ({c.registration_count || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="font-mono text-xs text-[#87F5F5] font-semibold">
          Showing {registrations.length} registrations
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}

      {loading ? (
        <LoadingSpinner label="Loading registrations data..." />
      ) : (
        <div className="glass-panel rounded-3xl border border-[#7226FF]/35 bg-[#160078]/60 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student Name & Email</th>
                  <th>Roll Number</th>
                  <th>Branch & Sec</th>
                  <th>Club Joined</th>
                  <th>Registered At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>
                      <div className="font-bold text-[#FFE5F1] text-sm">{reg.student.name}</div>
                      <div className="font-mono text-[10px] text-[rgba(255,229,241,0.6)]">{reg.student.email}</div>
                    </td>
                    <td className="font-mono font-semibold text-[#87F5F5]">
                      {reg.student.roll_number}
                    </td>
                    <td className="text-[rgba(255,229,241,0.8)] font-medium">
                      {reg.student.branch} {reg.student.section ? `(${reg.student.section})` : ''}
                    </td>
                    <td>
                      <span className="font-mono text-[11px] font-bold text-[#F042FF] bg-[#F042FF]/10 border border-[#F042FF]/25 px-2.5 py-0.5 rounded-full">
                        {reg.club_name}
                      </span>
                    </td>
                    <td className="font-mono text-[11px] text-[rgba(255,229,241,0.6)]">
                      {new Date(reg.registered_at).toLocaleString()}
                    </td>
                    <td>
                      <span className="font-mono text-[10px] font-semibold text-[#87F5F5] bg-[#87F5F5]/15 border border-[#87F5F5]/30 px-2.5 py-0.5 rounded-full uppercase">
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            offset={offset}
            limit={limit}
            onPageChange={setOffset}
          />
        </div>
      )}
    </div>
  );
};
