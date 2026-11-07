'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Terminal, Lock, Cpu } from 'lucide-react';

interface FooterProps {
  onOpenConsole?: () => void;
  onOpenAudit?: () => void;
}

export default function Footer({ onOpenConsole }: FooterProps = {}) {
  return (
    <footer className="bg-[#0B0B0C] text-white pt-20 pb-12 border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top: MCP & CLI Protocols */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="w-4 h-4 text-[#0B0B0C]" />
              </div>
              <span className="font-black text-xl tracking-wider text-white font-display">IMMUNIX</span>
            </Link>

            <p className="text-[#6E6E73] text-sm leading-relaxed max-w-sm">
              The world’s first autonomous immune network for cloud software. Protecting the global digital economy from upstream contract entropy.
            </p>

            <div className="mt-6 flex items-center gap-4 text-xs text-[#6E6E73] font-mono">
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#D4AF37]" /> SOC2 Type II Certified</span>
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-[#10B981]" /> eBPF Native Kernel</span>
            </div>
          </div>

          {/* Model Context Protocol (MCP) Server Definition */}
          <div className="lg:col-span-7 bg-[#1C1C1F] p-6 rounded-2xl border border-[#D4AF37]/30 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[#D4AF37] mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>IMMUNIX MODEL CONTEXT PROTOCOL (MCP)</span>
              </div>
              <span className="text-[10px] text-white/40">mcp-server-immunix v2.0</span>
            </div>

            <p className="text-white/70 text-xs mb-3">AI Agents can query and control the immune network via standard MCP tools:</p>

            <div className="space-y-1.5 text-[11px] text-[#F3E5AB]">
              <div>• <span className="font-bold text-[#D4AF37]">whats_changed</span>(provider: &quot;stripe&quot;) ── Diff between runtime wire vs latest spec</div>
              <div>• <span className="font-bold text-[#D4AF37]">inoculate_cluster</span>(antigen_id: &quot;ant_84f9...&quot;) ── Deploy hot-patch to Envoy sidecar</div>
              <div>• <span className="font-bold text-[#D4AF37]">probe_sandbox</span>(pr_number: 42) ── Execute unmocked synthetic verification probe</div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-white/40">Quick inspect: Press `~` backtick anywhere</span>
              <div className="flex items-center gap-2">
                {onOpenConsole && (
                  <button
                    suppressHydrationWarning
                    onClick={onOpenConsole}
                    className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/20 text-[#6E6E73] hover:text-white text-[11px] transition-colors cursor-pointer"
                  >
                    Quick HUD
                  </button>
                )}
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 rounded-lg bg-[#0B0B0C] border border-[#D4AF37]/40 text-[#D4AF37] hover:border-[#D4AF37] text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1.5 font-bold"
                >
                  Enterprise Dashboard &gt;_
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Legal & Sovereign Grid */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6E6E73] font-sans">
          <div>© 2026 IMMUNIX Network, Inc. Sovereign Cloud Standard. All rights reserved.</div>
          <div className="flex items-center gap-6 mt-4 sm:mt-0 font-medium">
            <a href="#sovereign-compliance" className="hover:text-white transition-colors">Security Disclosures</a>
            <a href="#sovereign-compliance" className="hover:text-white transition-colors">Zero-Knowledge Policy</a>
            <a href="#sovereign-compliance" className="hover:text-white transition-colors">Privacy</a>
            <a href="#sovereign-compliance" className="hover:text-white transition-colors">Terms of Mesh</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
