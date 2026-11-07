'use client';

import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  Sparkles,
  Copy,
  Check,
  Terminal,
  Download,
  Zap,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type TierKey = 'open-core' | 'growth' | 'enterprise-grid' | 'sovereign-mesh';

export interface PlanConfig {
  id: TierKey;
  name: string;
  badge: string;
  price: string;
  period: string;
  amountUsd: number;
  rpm: number;
  description: string;
  features: string[];
}

export const PLANS: Record<TierKey, PlanConfig> = {
  'open-core': {
    id: 'open-core',
    name: 'Open Core Sentinel',
    badge: 'COMMUNITY',
    price: '$0',
    period: 'forever',
    amountUsd: 0,
    rpm: 600,
    description: 'Local development wire proxy and deterministic AST codemod engine.',
    features: ['Single-node local proxy', 'Local mock verification', 'Standard GitHub PRs', '600 RPM local rate'],
  },
  growth: {
    id: 'growth',
    name: 'Growth Cluster',
    badge: 'SCALEUP',
    price: '$199',
    period: 'per month',
    amountUsd: 199,
    rpm: 6000,
    description: 'Continuous production immunity for scaleups with mission-critical SaaS.',
    features: ['Sub-0.8ms wire antibody hot-patching', 'Zero-downtime 3:00 AM SLA', '6,000 RPM capacity', 'Automated GitHub PRs'],
  },
  'enterprise-grid': {
    id: 'enterprise-grid',
    name: 'Enterprise Grid Defense',
    badge: 'RECOMMENDED',
    price: '$2,500',
    period: 'per month',
    amountUsd: 2500,
    rpm: 60000,
    description: 'Full Global Herd Immunity mesh with live unmocked sandbox execution.',
    features: ['Global Herd Immunity sync', '60,000 RPM capacity', 'Live ephemeral sandbox probe', 'SOC2 / ISO 27001 audit logs'],
  },
  'sovereign-mesh': {
    id: 'sovereign-mesh',
    name: 'Sovereign Mesh Custom',
    badge: 'AIR-GAPPED',
    price: '$10,000',
    period: 'per month',
    amountUsd: 10000,
    rpm: 500000,
    description: 'Air-gapped private sovereign cluster with zero-downtime financial SLA warranty.',
    features: ['Financial loss SLA warranty', '500,000 RPM dedicated pool', 'Zurich/Geneva vault hosting', 'Custom WASM / eBPF filters'],
  },
};

interface AccessPassData {
  tenant_id: string;
  tenant_name: string;
  tenant_slug: string;
  tier: string;
  master_api_key: string;
  key_prefix: string;
  rate_limit_rpm: number;
  access_pass_id: string;
  cluster_url: string;
  license_certificate: string;
  helm_deployment_command: string;
  curl_verification_command: string;
  created_at: string;
}

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: TierKey | string;
  onOpenConsole?: () => void;
}

export default function StripeCheckoutModal({
  isOpen,
  onClose,
  initialTier = 'enterprise-grid',
  onOpenConsole,
}: StripeCheckoutModalProps) {
  // Normalize tier
  const normalizeTier = (tier: string): TierKey => {
    const lower = tier.toLowerCase();
    if (lower.includes('open') || lower.includes('sentinel')) return 'open-core';
    if (lower.includes('growth')) return 'growth';
    if (lower.includes('sovereign')) return 'sovereign-mesh';
    return 'enterprise-grid';
  };

  const [selectedTier, setSelectedTier] = useState<TierKey>(normalizeTier(initialTier));
  const [company, setCompany] = useState('Acme Sovereign Financial Corp');
  const [email, setEmail] = useState('ciso@acme-sovereign.ch');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [postalCode, setPostalCode] = useState('8001');

  // Checkout states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [accessPass, setAccessPass] = useState<AccessPassData | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedHelm, setCopiedHelm] = useState(false);
  const [showFullKey, setShowFullKey] = useState(false);

  if (!isOpen) return null;

  const currentPlan = PLANS[selectedTier];

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExp('12/28');
    setCardCvc('999');
    setPostalCode('94103');
  };

  const handleExecuteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !email.trim()) {
      setCheckoutError('Please provide company name and billing email.');
      return;
    }

    setIsProcessing(true);
    setCheckoutError(null);

    try {
      setProcessingStage('1/3: Negotiating 256-bit TLS handshake with Stripe Gateway...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStage('2/3: Authorizing sovereign subscription & minting cryptographic certificate...');
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selectedTier,
          company,
          email,
          simulateCard: {
            last4: cardNumber.replace(/\D/g, '').slice(-4) || '4242',
            exp: cardExp,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Payment gateway authorization declined');
      }

      setProcessingStage('3/3: Granting immediate sovereign access pass...');
      await new Promise((r) => setTimeout(r, 500));

      setAccessPass(data.access_pass);

      // Trigger luxury confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F3E5AB', '#997D25', '#10B981', '#FFFFFF'],
        });
      } catch {
        // Safe fallback
      }

      // Store provisioned key in localStorage for immediate live console session
      if (data.access_pass?.master_api_key) {
        try {
          localStorage.setItem('immunix_master_key', data.access_pass.master_api_key);
          localStorage.setItem('immunix_tenant_slug', data.access_pass.tenant_slug);
        } catch {
          // Ignore storage quota
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout processing failed';
      setCheckoutError(msg);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const copyToClipboard = (text: string, type: 'key' | 'helm') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    } else {
      setCopiedHelm(true);
      setTimeout(() => setCopiedHelm(false), 2500);
    }
  };

  const handleDownloadCertificate = () => {
    if (!accessPass) return;
    const certData = {
      issuer: 'IMMUNIX SOVEREIGN AUTONOMOUS NETWORK',
      protocol: 'Ed25519-Byzantine-Consensus-v2',
      pass_id: accessPass.access_pass_id,
      tenant: {
        id: accessPass.tenant_id,
        name: accessPass.tenant_name,
        slug: accessPass.tenant_slug,
        tier: accessPass.tier,
      },
      quota: {
        rate_limit_rpm: accessPass.rate_limit_rpm,
        cluster_endpoint: accessPass.cluster_url,
      },
      cryptographic_signature: accessPass.license_certificate,
      issued_at: accessPass.created_at,
    };

    const blob = new Blob([JSON.stringify(certData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `immunix-license-${accessPass.tenant_slug}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white border border-[#D4AF37]/50 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.5)] overflow-hidden text-[#0B0B0C] flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sovereign Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#D4AF37]/20 bg-gradient-to-r from-[#0B0B0C] via-[#1C1C1F] to-[#0B0B0C] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                  Stripe Sovereign Gateway
                </span>
                <span className="text-xs text-[#6E6E73] font-mono">256-Bit PCI-DSS Level 1</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white mt-0.5">
                {accessPass ? 'Sovereign Access Pass Issued' : 'Sovereign License Provisioning'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            suppressHydrationWarning
            className="p-2 text-[#6E6E73] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white">
          {!accessPass ? (
            /* ============================================================ */
            /* STEP 1: PAYMENT & TIER SELECTION                             */
            /* ============================================================ */
            <form onSubmit={handleExecuteCheckout} className="space-y-6">
              {/* Plan Picker Tabs */}
              <div>
                <label className="block text-xs font-mono font-bold tracking-wider uppercase text-[#6E6E73] mb-3">
                  1. Select Sovereign Tier
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {(Object.keys(PLANS) as TierKey[]).map((key) => {
                    const p = PLANS[key];
                    const isSelected = selectedTier === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedTier(key)}
                        suppressHydrationWarning
                        className={`text-left p-4 rounded-2xl border transition-all relative ${
                          isSelected
                            ? 'bg-[#FBFBF9] border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.2)] ring-2 ring-[#D4AF37]/20'
                            : 'bg-white border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <span className="w-2 h-2 rounded-full bg-[#D4AF37] block animate-pulse" />
                          </div>
                        )}
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#997D25]">
                          {p.badge}
                        </span>
                        <div className="text-sm font-bold text-[#0B0B0C] mt-1">{p.name}</div>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className="text-xl font-black text-[#0B0B0C]">{p.price}</span>
                          <span className="text-[10px] text-[#6E6E73] font-mono">/{p.period}</span>
                        </div>
                        <div className="mt-1 text-[11px] font-mono text-[#10B981]">
                          {p.rpm.toLocaleString()} RPM
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Company & Billing Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono font-bold tracking-wider uppercase text-[#6E6E73] mb-2">
                    Enterprise Organization Name
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    suppressHydrationWarning
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm font-medium bg-[#FBFBF9]"
                    placeholder="e.g. JPMorgan Sovereign Cloud / Stripe Press"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold tracking-wider uppercase text-[#6E6E73] mb-2">
                    CISO / Work Billing Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    suppressHydrationWarning
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm font-medium bg-[#FBFBF9]"
                    placeholder="ciso@organization.com"
                  />
                </div>
              </div>

              {/* Stripe Payment Card Section (If paid plan) */}
              {currentPlan.amountUsd > 0 ? (
                <div className="p-5 rounded-2xl bg-[#0B0B0C] text-white border border-[#D4AF37]/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                        Stripe Payment Authorization
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleFillTestCard}
                      suppressHydrationWarning
                      className="text-[11px] font-mono text-[#D4AF37] hover:underline flex items-center gap-1 px-2.5 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 transition-colors hover:bg-[#D4AF37]/20"
                    >
                      <Zap className="w-3 h-3 text-[#D4AF37]" />
                      ⚡ Autofill Test Card (4242)
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#6E6E73] mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                        suppressHydrationWarning
                        className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1F] border border-white/10 text-white font-mono text-sm focus:border-[#D4AF37] focus:outline-none"
                        placeholder="4242 •••• •••• 4242"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-[#6E6E73] mb-1">
                          Expires
                        </label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          required
                          suppressHydrationWarning
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-white/10 text-white font-mono text-xs focus:border-[#D4AF37] focus:outline-none"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#6E6E73] mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          required
                          suppressHydrationWarning
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-white/10 text-white font-mono text-xs focus:border-[#D4AF37] focus:outline-none"
                          placeholder="888"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#6E6E73] mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          required
                          suppressHydrationWarning
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-white/10 text-white font-mono text-xs focus:border-[#D4AF37] focus:outline-none"
                          placeholder="8001"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-[#6E6E73]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Instant sandbox clearing active. Real Stripe charge simulated if test credentials are used.</span>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-[#FBFBF9] border border-[#10B981]/30 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B0B0C]">Zero-Cost Sovereign Provisioning</h4>
                    <p className="text-xs text-[#6E6E73] mt-0.5">
                      Open Core requires no payment method. Your Master API Key and local node helm configuration will be provisioned instantly.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {checkoutError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Order Summary & Pay Button */}
              <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[#6E6E73]">Total Due Today:</div>
                  <div className="text-2xl font-black text-[#0B0B0C] flex items-baseline gap-1">
                    <span>{currentPlan.price}</span>
                    <span className="text-xs font-mono text-[#6E6E73]">USD / {currentPlan.period}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  suppressHydrationWarning
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#0B0B0C] font-bold text-sm tracking-wide shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#0B0B0C] border-t-transparent rounded-full animate-spin" />
                      <span>{processingStage || 'Authorizing with Stripe...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{currentPlan.amountUsd > 0 ? `Authorize ${currentPlan.price} via Stripe` : 'Deploy Open Core Node ($0)'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ============================================================ */
            /* STEP 2: SOVEREIGN ACCESS GRANTED (ACCESS PASS ISSUED)        */
            /* ============================================================ */
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              {/* Verification Hero Badge */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B0B0C] via-[#1C1C1F] to-[#0B0B0C] border-2 border-[#D4AF37] text-white relative overflow-hidden shadow-[0_15px_40px_rgba(212,175,55,0.25)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#10B981] px-2 py-0.5 rounded bg-[#10B981]/15 border border-[#10B981]/30">
                          Payment Cleared • Inoculated
                        </span>
                        <span className="text-xs text-[#D4AF37] font-mono font-semibold">
                          {accessPass.access_pass_id}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black font-display text-white mt-1">
                        Sovereign Access Granted
                      </h3>
                      <p className="text-xs text-[#6E6E73] mt-0.5 font-mono">
                        Organization: <span className="text-zinc-200 font-bold">{accessPass.tenant_name}</span> ({accessPass.tenant_slug})
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-[10px] uppercase tracking-wider text-[#6E6E73]">Allocated Throughput</div>
                    <div className="text-xl font-bold text-[#D4AF37]">
                      {accessPass.rate_limit_rpm.toLocaleString()} RPM
                    </div>
                    <div className="text-[10px] text-[#10B981]">Tier: {accessPass.tier}</div>
                  </div>
                </div>
              </div>

              {/* Master Sovereign API Key Box */}
              <div className="p-5 rounded-2xl bg-[#FBFBF9] border border-[#D4AF37]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#997D25]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B0B0C]">
                      Production Master Sovereign Key
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFullKey(!showFullKey)}
                    suppressHydrationWarning
                    className="text-[11px] font-mono text-[#997D25] hover:underline"
                  >
                    {showFullKey ? 'Hide Secret' : 'Reveal Secret'}
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-[#0B0B0C] p-3 rounded-xl border border-white/10">
                  <code className="text-xs sm:text-sm font-mono text-[#D4AF37] flex-1 select-all overflow-x-auto">
                    {showFullKey ? accessPass.master_api_key : accessPass.key_prefix}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(accessPass.master_api_key, 'key')}
                    suppressHydrationWarning
                    className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0B0B0C] font-mono text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    {copiedKey ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#0B0B0C]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Key</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-[#6E6E73] font-mono">
                  🔒 Zero-Knowledge Storage: This key is displayed only once. Please store it in your AWS Secrets Manager / HashiCorp Vault.
                </p>
              </div>

              {/* Ready-to-Run Cluster Deployment Command */}
              <div className="p-5 rounded-2xl bg-[#0B0B0C] text-white border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#10B981]" />
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Kubernetes / Helm Deployment Command
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(accessPass.helm_deployment_command, 'helm')}
                    suppressHydrationWarning
                    className="text-[11px] font-mono text-[#D4AF37] hover:underline flex items-center gap-1"
                  >
                    {copiedHelm ? (
                      <>
                        <Check className="w-3 h-3 text-[#10B981]" />
                        <span className="text-[#10B981]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Helm Snippet</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="text-xs font-mono text-[#10B981] bg-black/60 p-3 rounded-xl overflow-x-auto border border-white/5">
                  {accessPass.helm_deployment_command}
                </pre>
              </div>

              {/* Action Buttons: Launch Live Console & Download Cert */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenConsole?.();
                  }}
                  suppressHydrationWarning
                  className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#997D25] text-[#0B0B0C] font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Launch Sovereign Console &gt;_</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCertificate}
                  suppressHydrationWarning
                  className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#FBFBF9] hover:bg-zinc-100 border border-zinc-300 text-[#0B0B0C] font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#997D25]" />
                  <span>Download License (.json)</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  suppressHydrationWarning
                  className="w-full sm:w-auto py-3 px-6 rounded-xl border border-zinc-200 text-[#6E6E73] hover:text-[#0B0B0C] text-xs font-medium transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
