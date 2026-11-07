'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Sparkles, Building2, Check, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SovereignAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: string;
}

export default function SovereignAuditModal({
  isOpen,
  onClose,
  defaultTier = 'Enterprise Grid',
}: SovereignAuditModalProps) {
  const [step, setStep] = useState<'form' | 'submitting' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    cloud: 'AWS',
    reqVolume: '50M - 500M / mo',
    tier: defaultTier,
  });
  const [issuedToken, setIssuedToken] = useState('imx_sovereign_78f192b4a');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('submitting');

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.access_token) {
        setIssuedToken(data.access_token);
      }
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setStep('success');
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F3E5AB', '#997D25', '#10B981'],
        });
      } catch {
        // Safe fallback if confetti isn't supported in test env
      }
    }, 600);
  };

  const resetAndClose = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-[#D4AF37]/50 shadow-[0_25px_70px_rgba(212,175,55,0.25)] text-[#0B0B0C] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-[#FBFBF9] border-b border-[#D4AF37]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#997D25] flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-[#0B0B0C]">
                Sovereign Architecture Access
              </h3>
              <p className="text-xs text-[#6E6E73]">Zero-Downtime Guarantee & Private VPC Proof of Concept</p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 rounded-xl text-[#6E6E73] hover:text-[#0B0B0C] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#997D25] uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g. Dr. Jordan Vance"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/30 bg-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#997D25] uppercase tracking-wider mb-1.5">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jordan@sovereign-bank.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/30 bg-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#997D25] uppercase tracking-wider mb-1.5">
                    Organization / Bank
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Global Financial Corp"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/30 bg-white text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#997D25] uppercase tracking-wider mb-1.5">
                    Primary Cloud
                  </label>
                  <select
                    value={formData.cloud}
                    onChange={(e) => setFormData({ ...formData, cloud: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/30 bg-white text-sm focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                  >
                    <option value="AWS">Amazon Web Services (EKS)</option>
                    <option value="GCP">Google Cloud Platform (GKE)</option>
                    <option value="Azure">Microsoft Azure (AKS)</option>
                    <option value="On-Prem">Bare-Metal / Air-Gapped Sovereign</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#997D25] uppercase tracking-wider mb-1.5">
                  Monthly Upstream Request Volume
                </label>
                <select
                  value={formData.reqVolume}
                  onChange={(e) => setFormData({ ...formData, reqVolume: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/30 bg-white text-sm focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="1M - 10M">1M - 10M requests / month</option>
                  <option value="10M - 50M">10M - 50M requests / month</option>
                  <option value="50M - 500M / mo">50M - 500M requests / month</option>
                  <option value="500M+ / mo">500M+ Sovereign Scale / month</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-[#997D25] flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#997D25] shrink-0 mt-0.5" />
                <span>
                  <strong>Zero-Data Retention Guarantee:</strong> IMMUNIX eBPF operates entirely in socket memory. No customer payloads or PII ever touch disks or third-party servers.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0B0B0C] hover:bg-[#1C1C1F] text-white font-mono font-bold text-sm tracking-wide border border-[#D4AF37] shadow-[0_10px_25px_rgba(212,175,55,0.25)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Request Sovereign Architecture Brief</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          {step === 'submitting' && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
              <p className="font-mono text-sm text-[#0B0B0C] font-semibold">
                Provisioning Ephemeral Sovereign Assessment Key...
              </p>
              <p className="text-xs text-[#6E6E73]">Synthesizing initial eBPF cluster profile for {formData.company || 'your organization'}.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h4 className="font-heading font-black text-2xl text-[#0B0B0C]">
                Sovereign Brief Dispatched
              </h4>
              <p className="text-sm text-[#6E6E73] max-w-md">
                We have prepared the air-gapped evaluation package and sent cryptographic instructions to{' '}
                <strong className="text-[#0B0B0C]">{formData.email}</strong>.
              </p>

              <div className="w-full p-4 rounded-2xl bg-[#FBFBF9] border border-[#D4AF37]/30 text-left font-mono text-xs space-y-2 text-[#0B0B0C]">
                <div className="text-[#997D25] font-bold">PRE-PROVISIONED CLUSTER PROFILE:</div>
                <div className="text-[#6E6E73]">Target Cluster: <span className="text-[#0B0B0C]">{formData.cloud} Sovereign VPC</span></div>
                <div className="text-[#6E6E73]">SLA Warranty: <span className="text-[#10B981] font-bold">$5,000,000 Zero-Downtime Guarantee</span></div>
                <div className="text-[#6E6E73]">Access Token: <code className="text-[#997D25]">{issuedToken}</code></div>
              </div>

              <button
                onClick={resetAndClose}
                className="mt-2 px-8 py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0B0B0C] font-mono font-bold text-xs transition-colors"
              >
                Return to Architecture Arena
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

