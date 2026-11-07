'use client';

import React, { useState } from 'react';
import { ShieldCheck, Calculator, Download, ArrowRight } from 'lucide-react';

interface FinancialLossCalculatorProps {
  onOpenAudit: () => void;
}

// Deterministic Indian locale formatter matching requirement
const inFormatter = new Intl.NumberFormat('en-IN');

function formatNumber(val: number): string {
  return inFormatter.format(Math.round(val));
}

export default function FinancialLossCalculator({ onOpenAudit }: FinancialLossCalculatorProps) {
  const [monthlyVolumeMillions, setMonthlyVolumeMillions] = useState<number>(45); // $45M / mo
  const [incidentMttrHours, setIncidentMttrHours] = useState<number>(3.5); // 3.5 hours MTTR
  const [incidentsPerYear, setIncidentsPerYear] = useState<number>(4); // 4 upstream breaking changes / yr

  // Calculations
  const hourlyTransactionVolume = (monthlyVolumeMillions * 1000000) / (30 * 24);
  const directRevenueAtRiskPerIncident = hourlyTransactionVolume * incidentMttrHours * 0.35;
  const totalAnnualLossPrevented = directRevenueAtRiskPerIncident * incidentsPerYear;
  const engineeringHoursSaved = incidentsPerYear * incidentMttrHours * 6;
  const immunixAnnualCost = 24000;
  const roiMultiplier = Math.round((totalAnnualLossPrevented / immunixAnnualCost) * 10) / 10;

  const downloadAuditReport = () => {
    const reportText = `IMMUNIX SOVEREIGN RESILIENCE FINANCIAL IMPACT AUDIT
===================================================
Generated: 2026-11-07
Classification: Enterprise Confidential

INPUT PARAMETERS:
- Monthly Processed API Transaction Volume: $${formatNumber(monthlyVolumeMillions)},000,000
- Average Industry MTTR for Silent Schema Drift: ${incidentMttrHours} Hours
- Frequency of Unannounced Upstream Schema Drift: ${incidentsPerYear} Incidents / Year

PREDICTED LOSS PREVENTION & ROI:
- Direct Transaction Revenue Protected: $${formatNumber(totalAnnualLossPrevented)} / year
- Incident Engineering War-Room Hours Saved: ${engineeringHoursSaved} Engineer-Hours
- Estimated SLA Penalty Avoidance: $${formatNumber(totalAnnualLossPrevented * 0.15)}
- IMMUNIX Projected ROI Multiplier: ${roiMultiplier}x
- Underwritten Financial Loss Warranty: $5,000,000 Sovereign Indemnity

IMMUNIX Sovereign Defense Labs
https://immunix.network
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `immunix-financial-roi-audit-${monthlyVolumeMillions}M.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="financial-loss-calculator" className="py-24 bg-[#FBFBF9] border-t border-[#D4AF37]/25 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#997D25] text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <Calculator className="w-3.5 h-3.5 text-[#D4AF37]" /> Executive Financial Model
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-[#0B0B0C] tracking-tight">
            Downtime Financial Loss Estimator
          </h2>
          <p className="mt-4 text-[#6E6E73] text-base sm:text-lg leading-relaxed">
            Quantify the precise financial exposure of 3:00 AM upstream contract drift versus autonomous 0.4ms wire-time inoculation.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls: Sliders */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-white border border-[#D4AF37]/30 shadow-md space-y-6">
            <h3 className="font-heading font-black text-xl text-[#0B0B0C]">
              Your Organization&apos;s Transaction Velocity
            </h3>

            {/* Slider 1: Monthly API Volume */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#6E6E73]">Monthly Processed Transaction Volume:</span>
                <span className="text-sm font-bold text-[#0B0B0C]">${monthlyVolumeMillions} Million / mo</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={monthlyVolumeMillions}
                onChange={(e) => setMonthlyVolumeMillions(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#6E6E73]">
                <span>$5M</span>
                <span>$100M</span>
                <span>$250M+</span>
              </div>
            </div>

            {/* Slider 2: MTTR Hours */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#6E6E73]">Mean Time to Recover (MTTR) without IMMUNIX:</span>
                <span className="text-sm font-bold text-[#0B0B0C]">{incidentMttrHours} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={incidentMttrHours}
                onChange={(e) => setIncidentMttrHours(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#6E6E73]">
                <span>1.0 hr (Fast)</span>
                <span>3.5 hrs (Avg)</span>
                <span>8.0 hrs (Critical)</span>
              </div>
            </div>

            {/* Slider 3: Upstream Incidents per Year */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#6E6E73]">Upstream Silent Mutations per Year:</span>
                <span className="text-sm font-bold text-[#0B0B0C]">{incidentsPerYear} Events / yr</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={incidentsPerYear}
                onChange={(e) => setIncidentsPerYear(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#6E6E73]">
                <span>1 (Minimal)</span>
                <span>4 (Standard)</span>
                <span>12 (High Drift)</span>
              </div>
            </div>

            <div className="pt-4 p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-mono text-[#997D25]">
              <strong>Biological Analogy:</strong> Traditional monitoring detects fever hours after infection. IMMUNIX produces antibodies at the socket boundary in 0.38ms, extinguishing outages before revenue is lost.
            </div>
          </div>

          {/* Results: Executive Metrics Display */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-[#0B0B0C] border border-[#D4AF37]/50 shadow-2xl text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                  Sovereign Protection Audit
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-[#10B981] font-bold">
                  VERIFIED PREVENTATIVE
                </span>
              </div>

              {/* Huge Top Metric */}
              <div className="mt-6 mb-8">
                <div className="text-xs font-mono text-white/50 uppercase">Total Revenue Loss Prevented</div>
                <div className="text-4xl sm:text-5xl font-heading font-black text-white mt-1">
                  ${formatNumber(totalAnnualLossPrevented)}
                  <span className="text-sm font-mono text-[#D4AF37] font-normal ml-2">/ year</span>
                </div>
                <div className="text-xs font-mono text-[#10B981] mt-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Zero-downtime wire inception applied on 100% of socket egress.
                </div>
              </div>

              {/* Sub Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[11px] font-mono text-white/50">Engineering Hours Saved</div>
                  <div className="text-2xl font-bold font-mono text-[#D4AF37] mt-1">
                    {engineeringHoursSaved} hrs
                  </div>
                  <div className="text-[10px] font-mono text-white/40">Zero incident bridges</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[11px] font-mono text-white/50">Projected Defense ROI</div>
                  <div className="text-2xl font-bold font-mono text-[#10B981] mt-1">
                    {roiMultiplier}x
                  </div>
                  <div className="text-[10px] font-mono text-white/40">Enterprise Grid Basis</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={downloadAuditReport}
                className="w-full sm:w-auto flex-1 py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/20"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Export Audit Summary</span>
              </button>

              <button
                onClick={onOpenAudit}
                className="w-full sm:w-auto flex-1 py-3.5 px-4 rounded-2xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0B0B0C] font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.35)]"
              >
                <span>Request $5M SLA Brief</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
