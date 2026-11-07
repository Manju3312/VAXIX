'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowUpRight, Search } from 'lucide-react';

interface VendorStatus {
  id: string;
  name: string;
  category: string;
  currentVersion: string;
  inoculationStatus: '100% Inoculated' | 'Active Monitoring';
  meanLatency: string;
  activeAntibodiesCount: number;
  latestMutationCaught: string;
  shieldedRequests24h: string;
}

const vendors: VendorStatus[] = [
  {
    id: 'stripe',
    name: 'Stripe Payments',
    category: 'Payment Infrastructure',
    currentVersion: 'v2026-03-01',
    inoculationStatus: '100% Inoculated',
    meanLatency: '0.34ms',
    activeAntibodiesCount: 3,
    latestMutationCaught: 'Renamed customer_email ➔ email_address',
    shieldedRequests24h: '4,120,000 reqs',
  },
  {
    id: 'openai',
    name: 'OpenAI Platform',
    category: 'AI Inference Egress',
    currentVersion: 'v1.48.2 (Responses API)',
    inoculationStatus: '100% Inoculated',
    meanLatency: '0.28ms',
    activeAntibodiesCount: 4,
    latestMutationCaught: 'Encapsulated usage metrics inside nested object',
    shieldedRequests24h: '18,400,000 reqs',
  },
  {
    id: 'salesforce',
    name: 'Salesforce CRM',
    category: 'Enterprise Data Graph',
    currentVersion: 'REST API v59.0',
    inoculationStatus: '100% Inoculated',
    meanLatency: '0.42ms',
    activeAntibodiesCount: 2,
    latestMutationCaught: 'Route relocated /v1/charges ➔ /v2/checkout/pay',
    shieldedRequests24h: '1,890,000 reqs',
  },
  {
    id: 'twilio',
    name: 'Twilio Cloud',
    category: 'Telecom & SMS Egress',
    currentVersion: 'API 2010-04-01',
    inoculationStatus: '100% Inoculated',
    meanLatency: '0.31ms',
    activeAntibodiesCount: 2,
    latestMutationCaught: 'Mutated amount from integer 25000 to string "25000"',
    shieldedRequests24h: '3,200,000 reqs',
  },
  {
    id: 'plaid',
    name: 'Plaid Core Banking',
    category: 'Fintech Interbank',
    currentVersion: 'v2020-09-14 (Modern)',
    inoculationStatus: '100% Inoculated',
    meanLatency: '0.36ms',
    activeAntibodiesCount: 1,
    latestMutationCaught: 'Added strict ISO8601 millisecond timestamp precision',
    shieldedRequests24h: '940,000 reqs',
  },
  {
    id: 'github',
    name: 'GitHub Webhooks',
    category: 'Developer Operations',
    currentVersion: 'REST v3 / Webhooks',
    inoculationStatus: '100% Inoculated',
    meanLatency: '0.29ms',
    activeAntibodiesCount: 2,
    latestMutationCaught: 'Deprecated repository.owner.name string format',
    shieldedRequests24h: '6,450,000 reqs',
  },
];

export default function VendorHealthRadar() {
  const [filter, setFilter] = useState('');

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(filter.toLowerCase()) ||
      v.category.toLowerCase().includes(filter.toLowerCase()) ||
      v.latestMutationCaught.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section id="vendor-health-radar" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#997D25] text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <Activity className="w-3.5 h-3.5 text-[#D4AF37]" /> Live Global Upstream Telemetry
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-[#0B0B0C] tracking-tight">
            Upstream Vendor Health Radar
          </h2>
          <p className="mt-4 text-[#6E6E73] text-base sm:text-lg leading-relaxed">
            Real-time telemetry monitoring third-party cloud APIs across our global 14,280-node mesh. 
            All observed schema drifts are intercepted and neutralized in-flight.
          </p>

          {/* Filter input */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-[#997D25] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              suppressHydrationWarning
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by vendor (e.g. Stripe, OpenAI, Plaid)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-[#D4AF37]/30 bg-[#FBFBF9] text-xs font-mono text-[#0B0B0C] focus:outline-none focus:border-[#D4AF37] shadow-sm"
            />
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="p-6 rounded-3xl bg-[#FBFBF9] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-[0_12px_35px_rgba(212,175,55,0.14)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
                  <div>
                    <h3 className="font-heading font-black text-lg text-[#0B0B0C]">{vendor.name}</h3>
                    <div className="text-[11px] font-mono text-[#6E6E73]">{vendor.category}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {vendor.inoculationStatus}
                  </span>
                </div>

                <div className="mt-4 space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#6E6E73]">Contract Version:</span>
                    <span className="text-[#0B0B0C] font-semibold">{vendor.currentVersion}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#6E6E73]">Mean Socket Latency:</span>
                    <span className="text-[#997D25] font-bold">{vendor.meanLatency}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#6E6E73]">Shielded Volume (24h):</span>
                    <span className="text-[#10B981] font-bold">{vendor.shieldedRequests24h}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-[#D4AF37]/25 text-[11px] mt-2">
                    <span className="text-[#997D25] font-bold block mb-0.5">Latest Neutralized Drift:</span>
                    <span className="text-[#0B0B0C] leading-snug">{vendor.latestMutationCaught}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs font-mono">
                <span className="text-[#6E6E73]">Antibodies: {vendor.activeAntibodiesCount} Active</span>
                <Link
                  href={`/arena?provider=${vendor.id}`}
                  className="text-[#997D25] hover:text-[#0B0B0C] font-bold flex items-center gap-1 transition-colors"
                >
                  Simulate <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

