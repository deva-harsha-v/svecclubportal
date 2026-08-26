import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { api } from '../../services/api';
import { AuditLog } from '../../types';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 100;

  useEffect(() => {
    fetchLogs();
  }, [search, offset]);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAuditLogs(search, limit, offset);
      setLogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-[#FFE5F1]">Administrative Audit Trail</h1>
        <p className="text-xs text-[rgba(255,229,241,0.68)] font-mono mt-0.5">
          Immutable log of operational actions, club edits, setting changes, and exports
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(255,229,241,0.45)]" />
        <input
          type="text"
          placeholder="Filter by action or user..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOffset(0);
          }}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#010030]/80 border border-[#7226FF]/35 text-[#FFE5F1] placeholder:text-[rgba(255,229,241,0.4)] text-xs focus:outline-none focus:border-[#F042FF]"
        />
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}

      {loading ? (
        <LoadingSpinner label="Loading audit trail..." />
      ) : (
        <div className="glass-panel rounded-3xl border border-[#7226FF]/35 bg-[#160078]/60 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>User</th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="text-[rgba(255,229,241,0.6)]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td>
                      <span className="font-bold text-[#F042FF] bg-[#F042FF]/15 border border-[#F042FF]/25 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="text-[#87F5F5]">
                      {log.user_email || log.user_id || 'System'}
                    </td>
                    <td className="text-[rgba(255,229,241,0.85)] max-w-md truncate font-sans">
                      {log.details}
                    </td>
                    <td className="text-[rgba(255,229,241,0.5)]">
                      {log.ip_address || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination offset={offset} limit={limit} onPageChange={setOffset} />
        </div>
      )}
    </div>
  );
};
