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
      <div className="glass-panel bg-[#160078]/90 backdrop-blur-2xl border border-[#7226FF]/40 rounded-2xl p-4 sm:px-6 shadow-[0_0_30px_rgba(114,38,255,0.3)] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Counter & Selected Club Chips */}
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-7 h-7 rounded-full bg-[#F042FF]/20 text-[#F042FF] flex items-center justify-center font-mono font-bold text-xs border border-[#F042FF]/40">
              {selectedClubs.length}
            </div>
            <span className="font-display font-bold text-sm text-[#FFE5F1]">
              {selectedClubs.length === 1 ? 'club selected' : 'clubs selected'}
            </span>
          </div>

          <div className="h-5 w-px bg-[#7226FF]/30 hidden sm:block" />

          {/* Chips preview */}
          <div className="flex gap-2">
            {selectedClubs.map((club) => (
              <span
                key={club.slug}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#87F5F5]/15 text-[#87F5F5] border border-[#87F5F5]/30 text-xs font-mono font-semibold whitespace-nowrap"
              >
                {club.name}
                <button
                  onClick={() => onRemoveClub(club.slug)}
                  className="p-0.5 rounded-full hover:bg-[#87F5F5]/30 transition"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <button
            onClick={onClear}
            className="text-xs font-mono text-[#FFE5F1]/70 hover:text-white underline whitespace-nowrap transition"
          >
            Clear all
          </button>

          <button
            onClick={() => navigate('/register')}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full btn-primary-gradient font-bold text-xs sm:text-sm shadow-magentaGlow transition-all duration-200"
          >
            <span>Continue to Register</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
