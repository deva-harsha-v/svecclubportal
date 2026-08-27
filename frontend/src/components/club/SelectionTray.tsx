import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { ClubSummary } from '../../types';

interface SelectionTrayProps {
  selectedClubs: ClubSummary[];
  onRemoveClub: (slug: string) => void;
  onClear: () => void;
}

export const SelectionTray: React.FC<SelectionTrayProps> = ({
  selectedClubs,
  onRemoveClub,
  onClear,
}) => {
  const navigate = useNavigate();

  if (selectedClubs.length === 0) return null;

  return (
    <div className="fixed bottom-6 inset-x-4 z-40 max-w-4xl mx-auto animate-slideUp">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 sm:px-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Counter & Selected Club Chips */}
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              {selectedClubs.length}
            </div>
            <span className="font-display font-bold text-sm text-slate-100">
              {selectedClubs.length === 1 ? 'club selected' : 'clubs selected'}
            </span>
          </div>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          {/* Chips preview */}
          <div className="flex gap-2">
            {selectedClubs.map((club) => (
              <span
                key={club.slug}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-200"
              >
                <span className="truncate max-w-[120px] font-medium">{club.name}</span>
                <button
                  onClick={() => onRemoveClub(club.slug)}
                  className="p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-slate-200 transition"
          >
            Clear
          </button>
          <button
            onClick={() => navigate('/register')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 transition shadow-sm"
          >
            <span>Proceed to Registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
