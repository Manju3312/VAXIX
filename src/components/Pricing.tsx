'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface PricingProps {
  onSelectTier?: (tierName: string) => void;
  onOpenConsole?: () => void;
}

export default function Pricing({ onSelectTier, onOpenConsole }: PricingProps = {}) {
  const tiers = [
    {
      name: 'Open Core Sentinel',
      price: '$0',
      period: 'forever free',
      description: 'Single-developer local proxy and AST codemod engine for development clusters.',
      features: [
        'Local in-memory wire proxy',
        'Deterministic ts-morph AST engine',
        'Standard GitHub Pull Request creation',
        'Local mock sandbox verification',
      ],
      cta: 'Install Open Core',
      highlight: false,
      action: () => onOpenConsole?.(),
    },
    {
      name: 'Growth Cluster',
      price: '$199',
      period: 'per month',
      description: 'Continuous production immunity for scaleups running mission-critical SaaS integrations.',
      features: [
        'Sub-0.8ms wire antibody hot-patching',
        'Zero-downtime 3:00 AM SLA protection',
        'Automated GitHub PRs with sandbox certificates',
        'Up to 2,500,000 requests/month',
        'Standard email & Slack alerts',
      ],
      cta: 'Start 14-Day Free Trial',
      highlight: false,
      action: () => onSelectTier?.('Growth Cluster'),
    },
    {
      name: 'Enterprise Grid',
      price: '$2,500',
      period: 'per cluster / mo',
      description: 'Full Global Herd Immunity mesh for distributed global infrastructure.',
      features: [
        'Global Herd Immunity real-time network sync',
        'Unmocked live ephemeral sandbox probe engine',
        'Multi-repository polyglot taint graph',
        'Custom Envoy / Cloudflare WASM filters',
        'SOC2 Type II & ISO 27001 audit logs',
        'Dedicated 24/7 SRE immune response desk',
      ],
      cta: 'Deploy Enterprise Grid',
      highlight: true,
      action: () => onSelectTier?.('Enterprise Grid'),
    },
    {
      name: 'Sovereign Mesh',
      price: 'Custom',
      period: 'annual contract',
      description: 'Air-gapped private immune networks for global banks and sovereign clouds.',
      features: [
        'Zero-downtime financial loss SLA warranty',
        'Air-gapped on-premise Kubernetes DaemonSet',
        'Private internal microservice cross-mesh',
        'Custom proprietary AST codemod rules',
        'Dedicated Solutions Architect team',
      ],
      cta: 'Contact Sovereign Desk',
      highlight: false,
      action: () => onSelectTier?.('Sovereign Mesh'),
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#FBFBF9] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#997D25] text-xs font-mono font-bold tracking-widest uppercase">Predictable Scalability</span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0B0B0C] mt-2 font-display">Sovereign Enterprise Plans</h2>
          <p className="mt-4 text-[#6E6E73] text-lg">Invest in digital immunity that pays for itself on your very first averted 3:00 AM outage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                tier.highlight
                  ? 'bg-white border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(212,175,55,0.25)] ring-4 ring-[#D4AF37]/10'
                  : 'bg-white border border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-sm hover:shadow-md'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D4AF37] text-[#0B0B0C] text-[10px] font-mono font-black uppercase tracking-widest shadow-md">
                  Most Popular Grid
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-[#0B0B0C]">{tier.name}</h3>
                <p className="mt-2 text-xs text-[#6E6E73] min-h-[36px]">{tier.description}</p>
                <div className="mt-6 mb-8 pb-6 border-b border-[#D4AF37]/15">
                  <span className="text-4xl font-black text-[#0B0B0C] font-mono">{tier.price}</span>
                  <span className="text-xs text-[#6E6E73] ml-2 font-mono">/ {tier.period}</span>
                </div>

                <ul className="space-y-3.5 text-xs text-[#0B0B0C]">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#997D25] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 pt-4">
                <button
                  onClick={tier.action}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    tier.highlight
                      ? 'bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] hover:bg-black hover:shadow-lg'
                      : 'bg-[#FBFBF9] text-[#0B0B0C] border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-white'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
