import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useClubSelection } from '../hooks/useClubSelection';
import { RegistrationProgress } from '../components/registration/RegistrationProgress';

const SVEC_BRANCH_OPTIONS = [
  'Computer Science & Engineering (CSE)',
  'CSE - Artificial Intelligence & Machine Learning (AIML)',
  'CSE - Data Science (DS)',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Basic Sciences & Humanities (BSH)',
];

export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedClubs, removeClub, clearSelection } = useClubSelection();

  const [formData, setFormData] = useState({
    name: '',
    branch: SVEC_BRANCH_OPTIONS[0],
    phone: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (selectedClubs.length === 0) {
    return (
      <div className="portal-bg min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-4 bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-indigo-950 border border-indigo-800/50 text-indigo-400 flex items-center justify-center text-xl font-bold mx-auto">
            !
          </div>
          <h2 className="font-display font-bold text-xl text-slate-100">No Clubs Selected</h2>
          <p className="text-sm text-slate-400">
            Please select at least one club from the directory before completing your student registration entry.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Club Directory
          </button>
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
      // Auto-generated identifiers for backend compatibility (No roll number asked)
      const uniqueStudentId = `STUDENT-${Date.now().toString().slice(-6)}`;
      const response = await api.submitRegistration({
        student: {
          name: formData.name.trim(),
          roll_number: uniqueStudentId,
          branch: formData.branch,
          phone: formData.phone.trim(),
          email: `${formData.phone.trim()}@sves.org.in`,
          section: '',
        },
        clubs: selectedClubs.map((c) => c.slug),
      });

      clearSelection();
      navigate('/success', { state: { response, studentData: formData } });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please verify your phone number and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-bg min-h-screen py-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <RegistrationProgress currentStep={2} />

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-100 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </button>

        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-5">
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 px-2.5 py-1 rounded-md uppercase tracking-wider">
              Student Information
            </span>
            <h1 className="font-display font-bold text-2xl text-slate-100 mt-2.5">
              Orientation 2026 Registration
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter your basic contact details. All {selectedClubs.length} selected clubs will be registered together.
            </p>
          </div>

          {/* Selected Clubs Summary Chips */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-300">
              Selected Organisations ({selectedClubs.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedClubs.map((club) => (
                <span
                  key={club.slug}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs text-slate-200"
                >
                  <span className="font-medium">{club.name}</span>
                  <button
                    type="button"
                    onClick={() => removeClub(club.slug)}
                    className="p-0.5 rounded text-slate-400 hover:text-slate-200 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Simplified Registration Form: Name, Branch, Phone ONLY */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter your complete full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Engineering Branch / Department <span className="text-red-400">*</span>
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-sans"
              >
                {SVEC_BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b} className="bg-slate-900 text-slate-100">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                10-Digit Mobile Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                pattern="[0-9]{10}"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-sans"
              />
            </div>

            <div className="pt-5 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm disabled:opacity-50 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? 'Registering...' : 'Submit Registration →'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
