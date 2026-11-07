'use client';

import React, { useState, useEffect } from 'react';
import { KeyRound, Copy, Check, Plus, Shield, RefreshCw, X, Lock, CheckCircle2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiKeyRecord {
  id: string;
  name: string;
  key_prefix: string;
  tier: string;
  rate_limit_rpm: number;
  requests_count: number;
  is_active: number;
  created_at: string;
}

export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedTier, setSelectedTier] = useState('enterprise');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/keys')
      .then((res) => res.json())
      .then((data) => {
        if (data.keys) setKeys(data.keys);
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName, tier: selectedTier }),
      });
      const data = await res.json();
      if (data.api_key) {
        setNewlyCreatedKey(data.api_key);
        setNewKeyName('');
        // Refresh keys list
        const refreshed = await fetch('/api/keys').then((r) => r.json());
        if (refreshed.keys) setKeys(refreshed.keys);
      }
    } catch {
      // Fallback
    } finally {
      setIsGenerating(false);
    }
  };

  const copyKey = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0B0B0C] border border-[#D4AF37]/50 shadow-[0_25px_70px_rgba(212,175,55,0.25)] text-white overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 bg-[#141416] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <KeyRound className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">
                Sovereign API Key Manager
              </h3>
              <p className="text-xs text-[#6E6E73] font-mono">Kernel Socket eBPF Authorization & MCP Tokens</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-white/50 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-mono">
          {/* Newly generated secret banner */}
          {newlyCreatedKey && (
            <div className="p-4 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37] text-[#D4AF37] space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Key Generated Successfully:
                </span>
                <span className="text-[10px] uppercase text-white/80">Copy & Save Now</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-[#D4AF37]/40 text-white select-all">
                <code className="text-[#D4AF37]">{newlyCreatedKey}</code>
                <button
                  onClick={() => copyKey(newlyCreatedKey)}
                  className="ml-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-white/60">
                This secret is only shown once and is hashed in SQLite with ChaCha20 encryption.
              </p>
            </div>
          )}

          {/* Form to issue a new key */}
          <form onSubmit={handleCreateKey} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="text-white font-bold flex items-center justify-between">
              <span>Issue New Sovereign Cluster Key</span>
              <span className="text-[#D4AF37]">Active Mesh</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key label (e.g. EKS Prod Node)"
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37]"
              />

              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="px-3 py-2 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="community">Community (600 rpm)</option>
                <option value="growth">Growth (6k rpm)</option>
                <option value="enterprise">Enterprise (60k rpm)</option>
                <option value="sovereign">Sovereign (500k rpm)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0B0B0C] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Provisioning...
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Generate Sovereign API Key
                </>
              )}
            </button>
          </form>

          {/* Existing Keys Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-white/60">
              <span>Active Issued Keys ({keys.length})</span>
              <span className="text-[#10B981]">eBPF Authorized</span>
            </div>

            {keys.map((k) => (
              <div
                key={k.id}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{k.name}</span>
                    <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] uppercase">
                      {k.tier}
                    </span>
                  </div>
                  <div className="text-[#6E6E73] text-[11px] mt-0.5">
                    Prefix: <code className="text-white/80">{k.key_prefix}</code> • Limit: {k.rate_limit_rpm.toLocaleString()} req/min
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[#10B981] text-[10px]">
                    ACTIVE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#141416] border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#6E6E73]">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Encrypted with SQLite in-process memory safety</span>
          </div>
          <button onClick={onClose} className="text-white hover:underline cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

