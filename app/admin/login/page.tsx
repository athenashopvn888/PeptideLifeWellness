'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin';
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam === 'access_denied' ? 'Your account does not have admin access or has been deactivated.' : null
  );
  const [status, setStatus] = useState('');

  // Strip any leaked credentials from URL (from old form GET submission)
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('email') || url.searchParams.has('password')) {
      url.searchParams.delete('email');
      url.searchParams.delete('password');
      window.history.replaceState({}, '', url.pathname + (url.search || ''));
    }
  }, []);

  // If already logged in as admin, redirect
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();
      if (data) router.replace('/admin');
    });
  }, [router]);

  const handleLogin = async () => {
    if (loading) return;

    const loginEmail = email.trim();
    const loginPassword = password;

    if (!loginEmail || !loginPassword) {
      setError('Please enter your email and password.');
      return;
    }

    setError(null);
    setLoading(true);
    setStatus('Connecting to server...');

    try {
      const supabase = createClient();

      setStatus('Authenticating...');
      const { error: authError, data: authData } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (authError) {
        setError(`Auth failed: ${authError.message}`);
        setLoading(false);
        setStatus('');
        return;
      }

      setStatus('Checking admin role...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError('Login failed — no user returned.'); setLoading(false); setStatus(''); return; }

      const { data: roleData, error: roleError } = await supabase
        .from('admin_roles')
        .select('role, is_active')
        .eq('user_id', user.id)
        .single();

      if (roleError) {
        setError(`Role check failed: ${roleError.message}`);
        setLoading(false);
        setStatus('');
        return;
      }

      if (!roleData || !roleData.is_active) {
        await supabase.auth.signOut();
        setError('Your account does not have admin access or has been deactivated.');
        setLoading(false);
        setStatus('');
        return;
      }

      setStatus(`Welcome! Redirecting as ${roleData.role}...`);

      // Wait for cookies to fully flush before navigating
      await new Promise((r) => setTimeout(r, 500));

      window.location.href = redirectTo;
    } catch (err) {
      console.error('Login error:', err);
      setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
      setStatus('');
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="w-full max-w-sm bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-2xl">
      <h2 className="text-lg font-semibold text-white mb-6">Sign in to your account</h2>

      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
          <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5 font-medium">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="email"
            enterKeyHint="next"
            placeholder="you@peptidelifewellness.com"
            className="w-full px-4 py-3 bg-[#0a0f1c] border border-gray-700 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5 font-medium">
            Password
          </label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
              enterKeyHint="go"
              placeholder="••••••••"
              className="w-full px-4 py-3 pr-11 bg-[#0a0f1c] border border-gray-700 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-teal-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors text-sm mt-2 touch-manipulation"
        >
          {loading ? (
            <><Loader2 size={15} className="animate-spin" />Signing in…</>
          ) : (
            <><LogIn size={15} />Sign In</>
          )}
        </button>

        {status && (
          <p className="text-center text-xs text-teal-400 mt-2 animate-pulse">{status}</p>
        )}
      </div>

      <p className="text-center text-xs text-gray-600 mt-5">
        Forgot your password?{' '}
        <a
          href="mailto:admin@peptidelifewellness.com?subject=Password Reset Request"
          className="text-teal-400 hover:underline"
        >
          Contact your administrator
        </a>
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] flex flex-col items-center justify-center px-4">
      {/* Logo / Brand */}
      <div className="mb-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20">
          <span className="text-white font-black text-xl">PLW</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Peptide Life Wellness</h1>
        <p className="text-gray-500 text-sm mt-1">Admin Portal</p>
      </div>

      <Suspense fallback={
        <div className="w-full max-w-sm bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-2xl flex justify-center">
          <Loader2 size={24} className="text-teal-400 animate-spin" />
        </div>
      }>
        <LoginForm />
      </Suspense>

      <p className="text-gray-700 text-xs mt-6">
        Peptide Life Wellness — Staff Portal v2.0
      </p>
    </div>
  );
}
