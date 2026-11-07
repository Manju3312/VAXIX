'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Activity, Dna, Menu, X, ArrowUpRight, Terminal, Search, KeyRound, Command } from 'lucide-react';

function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

interface NavbarProps {
  onOpenConsole: () => void;
  onOpenAudit: () => void;
  onOpenKeys: () => void;
  onOpenPalette: () => void;
}

export default function Navbar({ onOpenConsole, onOpenAudit, onOpenKeys, onOpenPalette }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inoculatedCount, setInoculatedCount] = useState(14280);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Gently increment cluster count every few seconds
    const interval = setInterval(() => {
      setInoculatedCount((prev) => prev + (Math.random() > 0.4 ? 1 : 0));
    }, 6000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { label: 'BreakMyAPI', href: '#breakmyapi-arena' },
    { label: 'Dual-Speed', href: '#dual-speed-engine' },
    { label: 'Global Mesh', href: '#global-herd-immunity' },
    { label: 'Radar', href: '#vendor-health-radar' },
    { label: 'Benchmark', href: '#architectural-benchmark' },
    { label: 'MCP Agents', href: '#mcp-protocol' },
    { label: 'ROI Estimator', href: '#financial-loss-calculator' },
    { label: 'Pricing', href: '#enterprise-pricing' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-xl bg-white/90 border-b border-[#D4AF37]/25 shadow-[0_10px_30px_rgba(212,175,55,0.08)] py-3'
          : 'backdrop-blur-md bg-white/80 border-b border-[#D4AF37]/15 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0B0B0C] to-[#1C1C1F] p-[1px] shadow-[0_4px_20px_rgba(212,175,55,0.25)] transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-[15px] bg-[#0B0B0C] flex items-center justify-center border border-[#D4AF37]/50 relative overflow-hidden">
                <Dna className="w-5 h-5 text-[#D4AF37] group-hover:rotate-45 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/20 to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-heading font-black tracking-tight text-xl text-[#0B0B0C] flex items-center gap-1.5 leading-none">
                IMMUNIX
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              </span>
              <span className="text-[9px] font-mono font-bold tracking-[0.22em] text-[#997D25] uppercase mt-1">
                Autonomous Immune Mesh
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-mono font-medium text-[#6E6E73] hover:text-[#0B0B0C] transition-colors relative group py-1"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Command Palette Trigger */}
            <button
              onClick={onOpenPalette}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 border border-[#D4AF37]/20 text-xs font-mono text-[#6E6E73] hover:text-[#0B0B0C] transition-colors cursor-pointer"
              title="Search commands (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#997D25]" />
              <span className="hidden lg:inline">Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#D4AF37]/30 text-[10px] font-bold text-[#0B0B0C]">
                ⌘K
              </kbd>
            </button>

            {/* API Keys Modal Button */}
            <button
              onClick={onOpenKeys}
              className="p-2 rounded-xl bg-white border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#997D25] hover:text-[#0B0B0C] transition-colors cursor-pointer"
              title="Sovereign API Keys"
            >
              <KeyRound className="w-4 h-4" />
            </button>

            {/* Live Network Pulse */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FBFBF9] border border-[#D4AF37]/25 text-[11px] font-mono shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
              </span>
              <span className="text-[#0B0B0C] font-bold" suppressHydrationWarning>
                {formatNumber(inoculatedCount)}
              </span>
              <span className="text-[#6E6E73] hidden 2xl:inline">CLUSTERS</span>
            </div>

            {/* Launch Console Button */}
            <button
              onClick={onOpenConsole}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#0B0B0C] text-white font-mono text-xs font-bold border border-[#D4AF37] hover:border-[#F3E5AB] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all group cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Console</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenPalette}
              className="p-2 rounded-xl bg-white border border-[#D4AF37]/30 text-[#0B0B0C]"
            >
              <Search className="w-4 h-4 text-[#997D25]" />
            </button>
            <button
              onClick={onOpenKeys}
              className="p-2 rounded-xl bg-white border border-[#D4AF37]/30 text-[#997D25]"
            >
              <KeyRound className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenConsole}
              className="p-2 rounded-xl bg-[#0B0B0C] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-mono"
            >
              <Terminal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#0B0B0C] hover:bg-black/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-4 pb-6 bg-white/95 backdrop-blur-xl border-b border-[#D4AF37]/20 space-y-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FBFBF9] border border-[#D4AF37]/25 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-bold text-[#0B0B0C]" suppressHydrationWarning>
              {formatNumber(inoculatedCount)} CLUSTERS INOCULATED
            </span>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-[#0B0B0C] hover:bg-[#D4AF37]/10"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsole();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B0B0C] text-white font-mono text-xs font-bold border border-[#D4AF37] text-center"
            >
              Launch Console
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAudit();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#D4AF37] text-[#0B0B0C] font-mono text-xs font-bold text-center"
            >
              Sovereign SLA
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
