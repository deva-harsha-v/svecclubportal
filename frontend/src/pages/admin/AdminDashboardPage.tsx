import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ClipboardList,
  Building2,
  Activity,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import { AdminStats, SystemHealth } from '../../types';
import { StatCard } from '../../components/ui/StatCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, healthData] = await Promise.all([
        api.getStats(),
        api.getHealth(),
      ]);
      setStats(statsData);
      setHealth(healthData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard operational data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading operational dashboard..." />;

  return (
    <div className="space-y-8 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="font-mono text-xs font-semibold text-cyanAcc bg-cyanAcc/10 border border-cyanAcc/20 px-3 py-1 rounded-full uppercase tracking-wider">
            SVEC Campus Operations
          </span>
          <h1 className="font-display font-bold text-3xl text-slate-100 mt-2">
            Administrator Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-white/15 text-xs font-semibold text-subtext hover:text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={() => api.exportExcel()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-gold to-amber-500 text-ink font-bold text-xs hover:brightness-110 transition shadow-goldGlow"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Multi-Sheet Excel
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Registered Students"
            value={stats.total_students}
            subtitle="Unique student roll numbers"
            icon={<Users className="w-5 h-5 text-primary" />}
          />
          <StatCard
            title="Total Registrations"
            value={stats.total_registrations}
            subtitle="Cumulative club submissions"
            variant="teal"
            icon={<ClipboardList className="w-5 h-5 text-cyanAcc" />}
          />
          <StatCard
            title="Active Clubs"
            value={stats.total_clubs}
            subtitle={`${stats.open_clubs} currently open for registration`}
            variant="gold"
            icon={<Building2 className="w-5 h-5 text-gold" />}
          />
          <StatCard
            title="Global Registration"
            value={stats.global_registration_enabled ? 'ENABLED' : 'DISABLED'}
            subtitle={stats.global_registration_enabled ? 'Public portal active' : 'Overridden OFF'}
            variant={stats.global_registration_enabled ? 'default' : 'danger'}
            icon={<Activity className="w-5 h-5" />}
          />
        </div>
      )}

      {/* System Health Section */}
      {health && (
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-cyanAcc" />
              <h2 className="font-display font-bold text-lg text-slate-100">
                System Health & Operational Status
              </h2>
            </div>
            <span className="font-mono text-[11px] text-muted">
              Updated: {new Date(health.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-surface/60 border border-white/10 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyanAcc shrink-0" />
              <div>
                <div className="font-mono text-[10px] uppercase text-muted font-semibold">API Server</div>
                <div className="text-xs font-bold text-slate-100 uppercase">{health.status}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface/60 border border-white/10 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyanAcc shrink-0" />
              <div>
                <div className="font-mono text-[10px] uppercase text-muted font-semibold">Database (Supabase Postgres)</div>
                <div className="text-xs font-bold text-slate-100">{health.database}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface/60 border border-white/10 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyanAcc shrink-0" />
              <div>
                <div className="font-mono text-[10px] uppercase text-muted font-semibold">Storage Service</div>
                <div className="text-xs font-bold text-slate-100 uppercase">{health.storage}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface/60 border border-white/10 flex items-center gap-3">
              {health.global_registration_enabled ? (
                <CheckCircle2 className="w-5 h-5 text-cyanAcc shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <div>
                <div className="font-mono text-[10px] uppercase text-muted font-semibold">Global Switch</div>
                <div className="text-xs font-bold text-slate-100">
                  {health.global_registration_enabled ? 'ACTIVE (Accepting)' : 'DISABLED (Halted)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Popularity & Branch Distribution */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Club Popularity */}
          <div className="glass-panel rounded-3xl p-6 shadow-xl">
            <h3 className="font-display font-bold text-lg text-slate-100 mb-4">
              Club Popularity Breakdown
            </h3>
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
              {stats.by_club.map((item, idx) => (
                <div key={item.slug} className="flex items-center justify-between p-3.5 rounded-xl bg-surface/60 border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-muted w-5">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-xs text-slate-100">{item.club}</div>
                      <div className="font-mono text-[10px] text-muted">{item.slug}</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-xs text-cyanAcc bg-cyanAcc/15 px-3 py-1 rounded-full border border-cyanAcc/30">
                    {item.registrations} {item.registrations === 1 ? 'reg' : 'regs'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Branch Distribution */}
          <div className="glass-panel rounded-3xl p-6 shadow-xl">
            <h3 className="font-display font-bold text-lg text-slate-100 mb-4">
              Branch Distribution
            </h3>
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
              {stats.by_branch.map((b) => (
                <div key={b.branch} className="p-3.5 rounded-xl bg-surface/60 border border-white/10">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-semibold text-slate-200">
                    <span className="truncate pr-2">{b.branch}</span>
                    <span className="font-mono text-cyanAcc">{b.count} students</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-purpleAcc h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(5, (b.count / (stats.total_students || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
