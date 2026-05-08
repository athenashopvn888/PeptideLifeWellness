'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { Lock, Package, BarChart3, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('plw-admin-auth');
    if (saved) setAuthenticated(true);
    setChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check — real auth would use Supabase
    const adminPw = 'novapure2026';
    if (password === adminPw) {
      localStorage.setItem('plw-admin-auth', password);
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('plw-admin-auth');
    setAuthenticated(false);
    setPassword('');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-center w-14 h-14 bg-teal-500/10 rounded-xl mx-auto mb-6">
              <Lock className="text-teal-400" size={24} />
            </div>
            <h1 className="text-xl font-bold text-white text-center mb-1">Admin Access</h1>
            <p className="text-sm text-gray-500 text-center mb-6">NovaPure Labs Inventory</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-400 text-center">{error}</p>
              </div>
            )}

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 bg-[#0a0f1c] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors mb-4"
              autoFocus
              id="admin-password-input"
            />
            <button
              type="submit"
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-colors"
              id="admin-login-btn"
            >
              Authenticate
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      {/* Top Nav */}
      <nav className="bg-[#111827] border-b border-gray-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/inventory" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <Package size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-sm hidden sm:inline">NovaPure Admin</span>
            </Link>
            <div className="h-6 w-px bg-gray-700" />
            <Link
              href="/admin/inventory"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal-400 transition-colors"
            >
              <BarChart3 size={14} />
              <span className="hidden sm:inline">Inventory</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/shop" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              View Store →
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors"
              id="admin-logout-btn"
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
