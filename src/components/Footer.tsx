'use client';

import React, { useState } from 'react';
import { Dna, Terminal, Copy, Check, Shield, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenConsole: () => void;
  onOpenAudit: () => void;
}

export default function Footer({ onOpenConsole, onOpenAudit }: FooterProps) {
  const [copiedCli, setCopiedCli] = useState(false);
  const cliCommand = 'npx immunix@latest inoculate --cluster=production';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <footer className="bg-[#0B0B0C] text-white border-t border-[#D4AF37]/30 pt-20 pb-12 relative overflow-hidden font-sans">
      {/* Top CLI Inoculation Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#1C1C1F] via-[#141416] to-[#1C1C1F] border border-[#D4AF37]/50 p-8 sm:p-10 shadow-[0_20px_60px_rgba(212,175,55,0.18)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest">
              <Terminal className="w-4 h-4" /> Sovereign Mesh Deployment CLI
            </div>
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Inoculate Your Production Kubernetes Cluster Now
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Attaches the eBPF socket interceptor to your active pod egress in seconds. Zero downtime, 0.4ms wire-time defense.
            </p>
          </div>

          {/* Copyable CLI Command Box */}
          <div className="w-full lg:w-auto flex-1 max-w-md">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black border border-[#D4AF37]/40 font-mono text-xs text-[#D4AF37]">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-white/40 select-none">$</span>
                <span className="text-white select-all">{cliCommand}</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="ml-3 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                title="Copy Command"
              >
                {copiedCli ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4 text-[#D4AF37]" />}
              </button>
            </div>
            <div className="mt-2 text-[11px] font-mono text-white/40 flex items-center justify-between px-1">
              <span>Open Source Kernel Modules</span>
              <span className="text-[#10B981]">eBPF v6.8+ Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0B0B0C] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                <Dna className="w-5 h-5" />
              </div>
              <span className="font-heading font-black text-xl text-white tracking-tight">IMMUNIX</span>
            </div>
            <p className="text-xs text-white/60 max-w-sm leading-relaxed">
              The world&apos;s first autonomous software immune network. Protecting the global API economy against breaking changes, schema mutations, and silent serialization drift.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs font-mono text-[#D4AF37]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>14,280 Global Clusters Operational</span>
            </div>
          </div>

          {/* Architecture Links */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              Architecture
            </div>
            <ul className="space-y-2 text-xs text-white/70 font-mono">
              <li>
                <a href="#dual-speed-engine" className="hover:text-white transition-colors">
                  Dual-Speed Engine
                </a>
              </li>
              <li>
                <a href="#breakmyapi-arena" className="hover:text-white transition-colors">
                  BreakMyAPI Arena
                </a>
              </li>
              <li>
                <a href="#global-herd-immunity" className="hover:text-white transition-colors">
                  Global Herd Immunity
                </a>
              </li>
              <li>
                <a href="#architectural-benchmark" className="hover:text-white transition-colors">
                  Benchmark Matrix
                </a>
              </li>
              <li>
                <button onClick={onOpenConsole} className="hover:text-white transition-colors text-left cursor-pointer">
                  eBPF Console
                </button>
              </li>
            </ul>
          </div>

          {/* Protocol & Agent Links */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              MCP Protocol
            </div>
            <ul className="space-y-2 text-xs text-white/70 font-mono">
              <li>
                <a href="#mcp-protocol" className="hover:text-white transition-colors">
                  whats_changed Tool
                </a>
              </li>
              <li>
                <a href="#mcp-protocol" className="hover:text-white transition-colors">
                  inoculate_cluster Tool
                </a>
              </li>
              <li>
                <a href="#mcp-protocol" className="hover:text-white transition-colors">
                  probe_sandbox Tool
                </a>
              </li>
              <li>
                <a href="#mcp-protocol" className="hover:text-white transition-colors">
                  Claude & Cursor Config
                </a>
              </li>
              <li>
                <a href="#mcp-protocol" className="hover:text-white transition-colors">
                  JSON-RPC Playground
                </a>
              </li>
            </ul>
          </div>

          {/* Governance & Trust */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
              Sovereign Trust
            </div>
            <ul className="space-y-2 text-xs text-white/70 font-mono">
              <li>
                <button onClick={onOpenAudit} className="hover:text-white transition-colors text-left cursor-pointer">
                  $5M Loss SLA
                </button>
              </li>
              <li>
                <button onClick={onOpenAudit} className="hover:text-white transition-colors text-left cursor-pointer">
                  Air-Gapped Deployment
                </button>
              </li>
              <li>
                <a href="#enterprise-pricing" className="hover:text-white transition-colors">
                  Enterprise Pricing
                </a>
              </li>
              <li>
                <span className="text-white/40">SOC2 Type II Attested</span>
              </li>
              <li>
                <span className="text-white/40">Zero-Data Retention</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-white/40 gap-4">
        <div>
          © 2026 IMMUNIX Sovereign Defense Labs, Inc. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Defense</a>
          <a href="#" className="hover:text-white transition-colors">Security Whitepaper</a>
          <span className="text-[#10B981] flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Status: All Systems Nominal
          </span>
        </div>
      </div>
    </footer>
  );
}

