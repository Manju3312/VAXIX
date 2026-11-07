'use client';

import React, { useState } from 'react';
import { Check, Shield, Zap, Sparkles, Building2, ArrowRight } from 'lucide-react';

// Helper for deterministic locale-independent format
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

interface PricingProps {
  onSelectTier: (tierName: string) => void;
  onOpenConsole: () => void;
}

export default function Pricing({ onSelectTier, onOpenConsole }: PricingProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: 'Community Edition',
      badge: 'OPEN CORE',
      priceMonthly: 0,
      priceAnnual: 0,
      description: 'For independent developers and single repos needing local AST codemods.',
      features: [
        'Local CLI AST Codemod Engine',
        'Single-Repository GitHub PR Generator',
        'Standard Schema Diff Parser',
        'Local Docker MicroVM Sandbox',
        'Community Discord Support',
      ],
      cta: 'Install Open Core',
      highlighted: false,
      action: 'console',
    },
    {
      name: 'Growth Cluster',
      badge: 'PRODUCTION READY',
      priceMonthly: 199,
      priceAnnual: 159,
      description: 'Sub-millisecond wire-time interception for growing fintechs & SaaS apps.',
      features: [
        'Speed 1: Wire Inception Interceptor (< 0.4ms)',
        'Up to 5,000,000 Shielded Requests / mo',
        'Up to 3 Production Kubernetes Clusters',
        'Automated Deterministic PR Generation',
        'Slack & PagerDuty Instant Inoculation Alerts',
        'Standard Email & Ticket SLA (4 hrs)',
      ],
      cta: 'Deploy Growth Cluster',
      highlighted: false,
      action: 'audit',
    },
    {
      name: 'Enterprise Grid',
      badge: 'MOST POPULAR • SOVEREIGN',
      priceMonthly: 2500,
      priceAnnual: 2000,
      description: 'Global Herd Immunity sync, unmocked ephemeral probes, and SOC2 compliance.',
      features: [
        'All Growth Cluster capabilities',
        'Global Herd Immunity Sync (14,280 Clusters)',
        'Up to 50,000,000 Shielded Requests / mo',
        'Unmocked Live Ephemeral Sandbox Validation',
        'Model Context Protocol (MCP) Server Access',
        'SOC2 Type II, ISO27001 & HIPAA Compliant',
        'Zero-Payload Retention Policy Verified',
        'Dedicated Solutions Architect (1 hr SLA)',
      ],
      cta: 'Deploy Enterprise Grid',
      highlighted: true,
      action: 'audit',
    },
    {
      name: 'Sovereign Mesh',
      badge: 'AIR-GAPPED HIGH FINANCE',
      priceMonthly: 4166,
      priceAnnual: 3333,
      annualBilledText: '$50,000 / year',
      description: 'Dedicated air-gapped VPC deployment with $5,000,000 underwritten financial loss warranty.',
      features: [
        'All Enterprise Grid capabilities',
        'Air-Gapped Private VPC / On-Prem Deployment',
        'Unlimited Shielded Request Volume',
        '$5,000,000 Financial Loss Outage SLA Warranty',
        'Custom AST Rewrite Grammar Rules',
        'Ed25519 Private Root Key Sovereignty',
        '24/7 Dedicated Defense Operations Engineer',
        'FedRAMP High Ready Architecture',
      ],
      cta: 'Request Sovereign Access',
      highlighted: false,
      action: 'audit',
    },
  ];

  return (
    <section id="enterprise-pricing" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#997D25] text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" /> Sovereign Pricing Matrix
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-[#0B0B0C] tracking-tight">
            Predictable Defense, Sovereign SLA
          </h2>
          <p className="mt-4 text-[#6E6E73] text-base sm:text-lg leading-relaxed">
            Never pay for incident bridge hours or catastrophic 3:00 AM API downtime again. 
            Choose the tier matching your global transaction velocity.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-xs font-mono font-bold ${!isAnnual ? 'text-[#0B0B0C]' : 'text-[#6E6E73]'}`}>
              Billed Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 rounded-full bg-[#FBFBF9] border border-[#D4AF37] p-1 transition-colors cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full bg-[#D4AF37] shadow-md transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${isAnnual ? 'text-[#0B0B0C]' : 'text-[#6E6E73]'}`}>
              Billed Annually
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {tiers.map((tier) => {
            const price = isAnnual ? tier.priceAnnual : tier.priceMonthly;
            return (
              <div
                key={tier.name}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-white border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(212,175,55,0.22)] lg:-translate-y-2'
                    : 'bg-[#FBFBF9] border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 hover:shadow-lg'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D4AF37] text-[#0B0B0C] text-[10px] font-mono font-extrabold uppercase tracking-widest shadow-md whitespace-nowrap">
                    {tier.badge}
                  </div>
                )}

                <div>
                  {!tier.highlighted && (
                    <div className="text-[10px] font-mono font-bold tracking-wider text-[#997D25] uppercase mb-2">
                      {tier.badge}
                    </div>
                  )}

                  <h3 className="font-heading font-black text-xl text-[#0B0B0C]">{tier.name}</h3>
                  <p className="mt-2 text-xs text-[#6E6E73] leading-relaxed min-h-[36px]">
                    {tier.description}
                  </p>

                  <div className="mt-6 mb-6 pb-6 border-b border-[#D4AF37]/20">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-heading font-black text-[#0B0B0C]" suppressHydrationWarning>
                        ${formatNumber(price)}
                      </span>
                      {price > 0 && (
                        <span className="text-xs font-mono text-[#6E6E73]">
                          / month
                        </span>
                      )}
                    </div>
                    {isAnnual && tier.priceAnnual > 0 && (
                      <div className="text-[11px] font-mono text-[#997D25] mt-1 font-semibold" suppressHydrationWarning>
                        Billed annually ({tier.annualBilledText || `$${formatNumber(tier.priceAnnual * 12)}/yr`})
                      </div>
                    )}
                  </div>

                  {/* Feature List */}
                  <div className="space-y-3 mb-8">
                    <div className="text-[11px] font-mono font-bold text-[#0B0B0C] uppercase tracking-wider">
                      Included Capabilities:
                    </div>
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#0B0B0C]">
                        <Check className="w-4 h-4 text-[#997D25] shrink-0 mt-0.5 stroke-[2.5]" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div>
                  <button
                    onClick={() => {
                      if (tier.action === 'console') {
                        onOpenConsole();
                      } else {
                        onSelectTier(tier.name);
                      }
                    }}
                    className={`w-full py-3.5 px-4 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      tier.highlighted
                        ? 'bg-[#0B0B0C] hover:bg-[#1C1C1F] text-white border border-[#D4AF37] shadow-[0_8px_25px_rgba(212,175,55,0.25)]'
                        : 'bg-white hover:bg-[#FBFBF9] text-[#0B0B0C] border border-[#D4AF37]/50 hover:border-[#D4AF37]'
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

