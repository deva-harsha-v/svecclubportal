import React, { useState, useEffect } from 'react';
import { Power, Link as LinkIcon } from 'lucide-react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const list = await api.getSettings();
      const map: Record<string, string> = {};
      list.forEach((s) => {
        map[s.key] = s.value || '';
      });
      setSettings(map);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGlobalRegistration = async () => {
    const current = settings['registration_enabled'] !== 'false';
    const nextVal = current ? 'false' : 'true';
    setSaving(true);
    try {
      await api.updateSetting('registration_enabled', nextVal);
      setSettings({ ...settings, registration_enabled: nextVal });
      setMsg(`Global event registration switch updated to: ${nextVal.toUpperCase()}`);
    } catch (err: any) {
      alert(err.message || 'Failed to update setting.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFallbackUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSetting('fallback_registration_url', settings['fallback_registration_url'] || '');
      setMsg('Event fallback URL updated successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to save fallback URL.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading system settings..." />;

  const isRegistrationEnabled = settings['registration_enabled'] !== 'false';

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-[#FFE5F1]">System Settings</h1>
        <p className="text-xs text-[rgba(255,229,241,0.68)] font-mono mt-0.5">
          Configure event-day global controls and fallback options
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-[#87F5F5]/10 border border-[#87F5F5]/30 text-[#87F5F5] text-xs font-semibold">
          {msg}
        </div>
      )}

      {/* Global Registration Override Switch */}
      <div className="glass-panel rounded-3xl border border-[#7226FF]/35 bg-[#160078]/60 p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Power className="w-5 h-5 text-[#F042FF]" />
              <h2 className="font-display font-bold text-lg text-[#FFE5F1]">
                Global Event Registration Switch
              </h2>
            </div>
            <p className="text-xs text-[rgba(255,229,241,0.7)] mt-1 max-w-lg leading-relaxed">
              When toggled OFF, registration is immediately halted campus-wide across all clubs, overriding individual club registration settings.
            </p>
          </div>

          <button
            onClick={handleToggleGlobalRegistration}
            disabled={saving}
            className={`px-6 py-2.5 rounded-full font-mono text-xs font-bold transition shadow-md whitespace-nowrap ${
              isRegistrationEnabled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
            }`}
          >
            {isRegistrationEnabled ? 'GLOBAL ON (Accepting)' : 'GLOBAL OFF (Halted)'}
          </button>
        </div>
      </div>

      {/* Fallback Registration URL */}
      <div className="glass-panel rounded-3xl border border-[#7226FF]/35 bg-[#160078]/60 p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <LinkIcon className="w-5 h-5 text-[#87F5F5]" />
          <h2 className="font-display font-bold text-lg text-[#FFE5F1]">
            Event-Day Fallback Link Configuration
          </h2>
        </div>
        <p className="text-xs text-[rgba(255,229,241,0.7)] mb-4">
          Specify an emergency fallback registration link (e.g. Google Form or secondary link) to display if campus infrastructure experiences outages.
        </p>

        <form onSubmit={handleSaveFallbackUrl} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-[#87F5F5] mb-1.5">
              Fallback Registration URL
            </label>
            <input
              type="url"
              placeholder="https://forms.gle/your-fallback-form"
              value={settings['fallback_registration_url'] || ''}
              onChange={(e) => setSettings({ ...settings, fallback_registration_url: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#010030]/80 border border-[#7226FF]/35 text-[#FFE5F1] placeholder:text-[rgba(255,229,241,0.4)] text-xs font-mono focus:outline-none focus:border-[#F042FF]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-full btn-primary-gradient font-bold text-xs shadow-magentaGlow"
            >
              Save Fallback URL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
