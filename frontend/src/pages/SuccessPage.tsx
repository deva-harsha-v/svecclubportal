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
      <div className="portal-bg min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-4 bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <h2 className="font-display font-bold text-xl text-slate-100">Registration Completed</h2>
          <p className="text-xs text-slate-400">
            Your club registration entries have been recorded.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition shadow-sm"
          >
            <Home className="w-4 h-4" />
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const { student_name, newly_registered, already_registered, closed } = response;

  return (
    <div className="portal-bg min-h-screen py-8">
      <div className="max-w-xl mx-auto px-4">
        <RegistrationProgress currentStep={3} />

        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl text-center space-y-6">
          {/* Celebration Badge */}
          <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-950/40 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-800/40">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Registration Confirmed
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
              Welcome aboard, {student_name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Your registrations have been centrally saved in the SVEC Club Portal database.
            </p>
          </div>

          {/* Results breakdown */}
          <div className="text-left space-y-3">
            {/* Newly Registered */}
            {newly_registered.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  Successfully Joined ({newly_registered.length})
                </div>
                <div className="space-y-1.5">
                  {newly_registered.map((item) => (
                    <div key={item.slug} className="flex items-center justify-between text-xs text-slate-100 font-semibold">
                      <span>{item.name}</span>
                      <span className="text-emerald-400">Confirmed</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Already Registered */}
            {already_registered.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                  Previously Registered ({already_registered.length})
                </div>
                <div className="space-y-1.5">
                  {already_registered.map((item) => (
                    <div key={item.slug} className="flex items-center justify-between text-xs text-slate-300">
                      <span>{item.name}</span>
                      <span className="text-amber-400">Already on record</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Closed */}
            {closed.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                  Registration Closed ({closed.length})
                </div>
                <div className="space-y-1.5">
                  {closed.map((item) => (
                    <div key={item.slug} className="flex items-center justify-between text-xs text-slate-300">
                      <span>{item.name}</span>
                      <span className="text-red-400">Closed</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Return Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 transition shadow-sm"
            >
              <Home className="w-4 h-4" />
              Explore Directory Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
