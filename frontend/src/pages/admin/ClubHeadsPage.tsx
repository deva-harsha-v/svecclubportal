import React, { useState, useEffect } from 'react';
import { Plus, UserCheck, Shield, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../services/api';
import { StaffProfile, ClubDetail, Role } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const ClubHeadsPage: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffProfile[]>([]);
  const [clubs, setClubs] = useState<ClubDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'club_head' as Role,
    club_id: '' as string | number,
    user_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [staffData, clubData] = await Promise.all([
        api.getStaff(),
        api.getAdminClubs(),
      ]);
      setStaffList(staffData);
      setClubs(clubData);
    } catch (err: any) {
      setError(err.message || 'Failed to load staff profiles.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createStaff({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        club_id: formData.club_id ? Number(formData.club_id) : undefined,
        user_id: formData.user_id || formData.email.toLowerCase(),
      });
      setIsModalOpen(false);
      setFormData({ name: '', email: '', role: 'club_head', club_id: '', user_id: '' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to provision staff account.');
    }
  };

  const handleToggleActive = async (profile: StaffProfile) => {
    try {
      await api.updateStaff(profile.id, { is_active: !profile.is_active });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Staff Accounts & Club Heads</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Provision staff profiles and assign scoped access permissions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-ink font-bold text-xs hover:bg-gold-hover transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Provision Staff Account
        </button>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs">{error}</div>}

      {loading ? (
        <LoadingSpinner label="Loading staff accounts..." />
      ) : (
        <div className="bg-white rounded-3xl border border-line shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper border-b border-line font-mono uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Name & Email</th>
                  <th className="px-6 py-4">Auth User ID</th>
                  <th className="px-6 py-4">System Role</th>
                  <th className="px-6 py-4">Assigned Club</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-ink text-sm">{staff.name}</div>
                      <div className="font-mono text-[10px] text-slate-500">{staff.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700">
                      {staff.user_id}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-mono text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                        staff.role === 'admin' ? 'bg-gold/20 text-ink' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {staff.club_name || <span className="text-slate-400 font-normal">Global (All Clubs)</span>}
                    </td>
                    <td className="px-6 py-4">
                      {staff.is_active ? (
                        <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-semibold">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleActive(staff)}
                        className={`text-xs font-mono font-semibold px-3 py-1 rounded-lg border transition ${
                          staff.is_active
                            ? 'border-red-200 text-red-600 hover:bg-red-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {staff.is_active ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Provision Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision New Staff Account"
      >
        <form onSubmit={handleCreateStaff} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kabir Mehta"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-line text-xs focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="kabir@college.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-line text-xs focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supabase Auth User ID / Login Identifier (Optional)
            </label>
            <input
              type="text"
              placeholder="Supabase Auth UUID or default email prefix"
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-line text-xs font-mono focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">System Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full px-4 py-2 rounded-xl border border-line text-xs bg-white"
              >
                <option value="club_head">Club Head (Scoped)</option>
                <option value="admin">Administrator (Full Access)</option>
              </select>
            </div>

            {formData.role === 'club_head' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Club</label>
                <select
                  value={formData.club_id}
                  onChange={(e) => setFormData({ ...formData, club_id: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-line text-xs bg-white"
                >
                  <option value="">Select a Club...</option>
                  {clubs.map((c) => (
                    <option key={c.slug} value={(c as any).id}>
                      {c.name} ({c.slug})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-line flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2 rounded-full border border-line text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-gold text-ink font-bold text-xs hover:bg-gold-hover shadow-sm"
            >
              Provision Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
