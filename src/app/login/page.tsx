'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, ArrowRight, Sparkles, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenNotice, setTokenNotice] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Sovereign enterprise authentication simulation
    setTimeout(() => {
      if (email.trim() && password.trim()) {
        const session = {
          user: email,
          role: 'Principal SRE & Infrastructure Architect',
          tenant: 'Sovereign Core Holdings',
          tier: 'Enterprise Grid',
          token: `imx_session_${Date.now()}`,
          authenticatedAt: new Date().toISOString(),
        };
        localStorage.setItem('vaxix_session', JSON.stringify(session));
        router.push('/dashboard');
      } else {
        setError('Please enter both email and sovereign credential.');
        setIsLoading(false);
      }
    }, 700);
  };

  const handleDemoAutofill = () => {
    setEmail('cto@sovereign-holdings.ch');
    setPassword('SovereignPasskey_2026');
    setTokenNotice('Demo CTO passkey credentials populated.');
    setTimeout(() => setTokenNotice(null), 4000);
  };

  const handleHardwareTokenAutofill = () => {
    setEmail('ciso-yubikey@sovereign-holdings.ch');
    setPassword('yubikey-fips-sovereign-9921');
    setTokenNotice('FIPS 140-3 YubiKey Authenticator detected & synchronized.');
    setTimeout(() => setTokenNotice(null), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black">
      {/* Top Bar */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#0B0B0C] border border-[#D4AF37] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-wider text-[#0B0B0C] font-display">VAXIX</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#D4AF37]/10 text-[#997D25] border border-[#D4AF37]/30 font-mono font-bold">2.4</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#6E6E73] font-medium -mt-0.5">Sovereign Mesh Console</span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-mono font-bold text-[#6E6E73] hover:text-[#0B0B0C] transition-colors"
        >
          ← Return to Public Arena
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(212,175,55,0.12)] relative">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#997D25] text-[11px] font-mono font-bold uppercase tracking-widest mb-3">
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" /> Zero-Knowledge Gateway
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B0B0C] font-display">
              Enterprise Sign In
            </h1>
            <p className="mt-2 text-xs text-[#6E6E73]">
              Access cluster telemetry, active wire antibodies, and global herd immunity metrics.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#0B0B0C] mb-1.5">
                Corporate Email Address:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sre@company.com"
                required
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-xl border border-black/15 bg-[#FBFBF9] text-xs font-mono text-[#0B0B0C] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono font-bold text-[#0B0B0C]">
                  Sovereign Passkey / Password:
                </label>
                <button
                  type="button"
                  onClick={handleHardwareTokenAutofill}
                  className="text-[11px] text-[#997D25] font-mono hover:underline cursor-pointer flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3 text-[#D4AF37]" />
                  <span>Hardware Token?</span>
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                required
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-xl border border-black/15 bg-[#FBFBF9] text-xs font-mono text-[#0B0B0C] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>

            {tokenNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{tokenNotice}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              suppressHydrationWarning
              className="w-full py-4 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] font-bold text-xs uppercase tracking-wider hover:bg-black hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Verifying Hardware Session...</span>
              ) : (
                <>
                  <span>Authenticate to Console</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill */}
          <div className="mt-6 pt-6 border-t border-black/10 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleDemoAutofill}
              suppressHydrationWarning
              className="w-full py-2.5 rounded-xl bg-[#FBFBF9] border border-[#D4AF37]/40 text-[#997D25] text-xs font-mono font-bold hover:bg-white hover:border-[#D4AF37] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Autofill Demo CTO Credentials</span>
            </button>

            <div className="text-center text-[10px] text-[#6E6E73] font-mono">
              SOC2 Type II • NIST SP 800-207 Zero Trust Architecture
            </div>
          </div>

        </div>
      </main>

      {/* Footer Strip */}
      <footer className="p-6 text-center text-xs text-[#6E6E73] font-mono">
        © 2026 VAXIX Network, Inc. Sovereign Cloud Standard.
      </footer>
    </div>
  );
}
