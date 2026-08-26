import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, RefreshCw, Users, Clock, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';
import { StatCard } from '../../components/ui/StatCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const ClubHeadDashboardPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getClubHeadDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load club dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (data?.club_slug) {
      api.exportExcel(data.club_slug);
    }
  };

  if (loading) return <LoadingSpinner label="Loading club head portal..." />;

  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-2xl border border-red-200">
        {error || 'Dashboard unavailable.'}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-semibold text-teal-dark bg-teal/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Club Head Operations · {data.category}
          </span>
          <h1 className="font-display font-bold text-3xl text-ink mt-2">
            {data.club_name} Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-line text-xs font-semibold text-slate-700 hover:bg-paper transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gold text-ink font-bold text-xs hover:bg-gold-hover transition shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export {data.club_name} Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Club Registrations"
          value={data.total_registrations}
          subtitle="Cumulative students joined"
          variant="teal"
          icon={<Users className="w-5 h-5 text-teal" />}
        />
        <StatCard
          title="Today's Registrations"
          value={data.today_registrations}
          subtitle="Registered today during orientation"
          variant="gold"
          icon={<Clock className="w-5 h-5 text-gold-hover" />}
        />
        <StatCard
          title="Registration Status"
          value={data.registration_open ? 'OPEN' : 'CLOSED'}
          subtitle={data.registration_open ? 'Accepting new members' : 'Registration paused'}
          icon={<CheckCircle className="w-5 h-5" />}
        />
      </div>

      {/* Recent Registrations Table */}
      <div className="bg-white rounded-3xl border border-line p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
          <h2 className="font-display font-bold text-lg text-ink">
            Recent Student Registrations ({data.recent_registrations?.length || 0})
          </h2>
          <span className="font-mono text-xs text-slate-400">Scoped to {data.club_name}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-paper border-b border-line font-mono uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Roll Number</th>
                <th className="px-6 py-3">Branch & Section</th>
                <th className="px-6 py-3">Contact Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.recent_registrations?.map((r: any) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-bold text-ink">{r.student_name}</td>
                  <td className="px-6 py-3 font-mono font-semibold text-slate-800">{r.roll_number}</td>
                  <td className="px-6 py-3 text-slate-700">{r.branch} {r.section ? `(${r.section})` : ''}</td>
                  <td className="px-6 py-3 font-mono text-slate-600">{r.email}</td>
                  <td className="px-6 py-3 font-mono text-slate-600">{r.phone}</td>
                  <td className="px-6 py-3 font-mono text-[11px] text-slate-400">
                    {new Date(r.registered_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
