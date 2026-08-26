import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Home, Sparkles } from 'lucide-react';
import { RegistrationResponse } from '../types';
import { RegistrationProgress } from '../components/registration/RegistrationProgress';

export const SuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const response: RegistrationResponse | undefined = location.state?.response;

  if (!response) {
    return (
      <div className="portal-bg min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="glass-card p-8 rounded-3xl">
            <h2 className="font-display font-bold text-xl text-slate-100">Registration Completed</h2>
            <p className="text-xs text-subtext mt-2">
              Your club selection has been processed.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-glow"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { student_name, newly_registered, already_registered, closed } = response;

  return (
    <div className="portal-bg min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Step 3 Progress Bar */}
        <RegistrationProgress currentStep={3} />

        <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl text-center">
          {/* Celebration Badge */}
          <div className="w-16 h-16 rounded-full bg-cyanAcc/15 text-cyanAcc border border-cyanAcc/30 flex items-center justify-center mx-auto mb-4 shadow-cyanGlow">
            <CheckCircle2 className="w-8 h-8 text-cyanAcc" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/15 text-gold text-xs font-mono font-semibold uppercase tracking-wider mb-2 border border-gold/30">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Registration Confirmed
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
            Welcome aboard, {student_name}!
          </h1>
          <p className="text-xs sm:text-sm text-subtext mt-1 max-w-md mx-auto">
            Your registrations have been centrally stored in the SVEC Student Club Portal database.
          </p>

          {/* Results breakdown */}
          <div className="mt-8 text-left space-y-4">
            {/* Newly Registered */}
            {newly_registered.length > 0 && (
              <div className="p-4 rounded-2xl bg-cyanAcc/10 border border-cyanAcc/25">
                <div className="font-mono text-xs font-semibold text-cyanAcc uppercase tracking-wider mb-2">
                  Successfully Joined ({newly_registered.length})
                </div>
                <div className="space-y-1.5">
                  {newly_registered.map((item) => (
                    <div key={item.slug} className="flex items-center justify-between text-xs text-slate-100 font-semibold">
                      <span>{item.name}</span>
                      <span className="text-cyanAcc font-mono">Confirmed</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Already Registered */}
            {already_registered.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                <div className="font-mono text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                  Previously Registered ({already_registered.length})
                </div>
                <div className="space-y-1.5">
                  {already_registered.map((item) => (
                    <div key={item.slug} className="flex items-center justify-between text-xs text-slate-300">
                      <span>{item.name}</span>
                      <span className="text-amber-400 font-mono text-[11px]">Already on record</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Closed */}
            {closed.length > 0 && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25">
                <div className="font-mono text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                  Registration Closed ({closed.length})
                </div>
                <div className="space-y-1.5">
                  {closed.map((item) => (
                    <div key={item.slug} className="flex items-center justify-between text-xs text-slate-300">
                      <span>{item.name}</span>
                      <span className="text-red-400 font-mono text-[11px]">Closed</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Return Button */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary to-purpleAcc text-white font-bold text-xs hover:brightness-110 transition shadow-glow"
            >
              <Home className="w-4 h-4" />
              Explore More SVEC Clubs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
