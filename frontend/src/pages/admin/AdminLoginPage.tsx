import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import { authService } from '../../services/auth';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.login(usernameOrEmail, password);
      authService.setSession(response);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or account is inactive.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel bg-[#160078]/80 rounded-3xl p-8 shadow-2xl border border-[#7226FF]/40">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#010030] border border-[#7226FF]/40 p-1.5 flex items-center justify-center mx-auto mb-3 shadow-md">
            <img src="/svec_logo.png" alt="SVEC Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-display font-bold text-2xl text-[#FFE5F1]">SVEC Admin Portal Access</h1>
          <p className="text-xs text-[rgba(255,229,241,0.68)] font-mono mt-1">
            Sri Vasavi Engineering College Portal Administration Login
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-[#87F5F5] mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(255,229,241,0.45)]" />
              <input
                type="text"
                required
                placeholder="admin@sves.org.in or admin"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#010030]/80 border border-[#7226FF]/35 text-[#FFE5F1] placeholder:text-[rgba(255,229,241,0.4)] text-sm focus:outline-none focus:border-[#F042FF] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#87F5F5] mb-1.5">
              Password / Access Key
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(255,229,241,0.45)]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#010030]/80 border border-[#7226FF]/35 text-[#FFE5F1] placeholder:text-[rgba(255,229,241,0.4)] text-sm focus:outline-none focus:border-[#F042FF] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full btn-primary-gradient font-bold text-sm shadow-magentaGlow disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#7226FF]/20 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[rgba(255,229,241,0.68)] hover:text-[#FFE5F1] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Student Portal
          </button>
        </div>
      </div>
    </div>
  );
};
