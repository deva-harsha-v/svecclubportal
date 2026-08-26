import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, X } from 'lucide-react';
import { api } from '../services/api';
import { useClubSelection } from '../hooks/useClubSelection';
import { RegistrationProgress } from '../components/registration/RegistrationProgress';

const BRANCH_OPTIONS = [
  'Computer Science & Engineering (CSE)',
  'CSE (Artificial Intelligence & Machine Learning)',
  'CSE (Data Science)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Information Technology (IT)',
  'Other',
];

export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedClubs, removeClub, clearSelection } = useClubSelection();

  const [formData, setFormData] = useState({
    name: '',
    roll_number: '',
    branch: BRANCH_OPTIONS[0],
    phone: '',
    email: '',
    section: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (selectedClubs.length === 0) {
    return (
      <div className="portal-bg min-h-screen py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="glass-card p-8 rounded-3xl">
            <div className="w-12 h-12 rounded-full bg-gold/20 text-gold flex items-center justify-center font-display font-bold text-2xl mx-auto mb-4">
              ⌘
            </div>
            <h2 className="font-display font-bold text-xl text-slate-100">No Clubs Selected</h2>
            <p className="text-sm text-subtext mt-2">
              Please browse the club directory and select at least one club before filling your details.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-purpleAcc text-white text-xs font-semibold hover:brightness-110 shadow-glow transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Club Directory
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await api.submitRegistration({
        student: {
          name: formData.name,
          roll_number: formData.roll_number,
          branch: formData.branch,
          phone: formData.phone,
          email: `${formData.roll_number.toLowerCase()}@sves.org.in`,
          section: '',
        },
        clubs: selectedClubs.map((c) => c.slug),
      });

      clearSelection();
      navigate('/success', { state: { response } });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setSubmitting(false);
    }

  };

  return (
    <div className="portal-bg min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Progress step bar */}
        <RegistrationProgress currentStep={2} />

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Club Selection
        </button>

        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="border-b border-white/10 pb-6 mb-6">
            <span className="font-mono text-xs font-semibold text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full uppercase tracking-wider">
              Step 02 of 03
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100 mt-3">
              Student Registration Entry
            </h1>
            <p className="text-xs sm:text-sm text-subtext mt-1">
              Enter your student details. All {selectedClubs.length} selected clubs will be registered together in one submission.
            </p>
          </div>

          {/* Selected Clubs Summary Chips */}
          <div className="mb-6 p-4 rounded-2xl bg-surface/80 border border-white/10">
            <div className="text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-2.5">
              Selected Clubs ({selectedClubs.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedClubs.map((club) => (
                <span
                  key={club.slug}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyanAcc/15 text-cyanAcc border border-cyanAcc/30 text-xs font-mono font-semibold"
                >
                  {club.name}
                  <button
                    type="button"
                    onClick={() => removeClub(club.slug)}
                    className="p-0.5 rounded-full hover:bg-cyanAcc/30 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Simplified Form: Name, Roll Number, Branch, Phone */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-subtext mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Ananya Rao"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-white/15 text-slate-100 placeholder-muted text-sm focus:outline-none focus:border-primary focus:shadow-glow transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-subtext mb-1.5">
                Roll Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="roll_number"
                required
                placeholder="e.g. 24CS101"
                value={formData.roll_number}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-white/15 text-slate-100 placeholder-muted text-sm font-mono uppercase focus:outline-none focus:border-primary focus:shadow-glow transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-subtext mb-1.5">
                Branch <span className="text-red-400">*</span>
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#010030]/80 border border-[#7226FF]/35 text-[#FFE5F1] text-sm focus:outline-none focus:border-[#F042FF] focus:ring-1 focus:ring-[#F042FF] transition"
              >
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b} className="bg-[#010030] text-[#FFE5F1]">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-subtext mb-1.5">
                10-Digit Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-white/15 text-slate-100 placeholder-muted text-sm font-mono focus:outline-none focus:border-primary transition"
              />
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2.5 rounded-full border border-white/15 text-xs font-semibold text-subtext hover:text-white hover:bg-surface-hover transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-gold to-amber-500 text-ink font-bold text-sm hover:brightness-110 disabled:opacity-50 transition shadow-goldGlow"
              >
                {submitting ? 'Submitting Registration...' : 'Complete Registration →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
