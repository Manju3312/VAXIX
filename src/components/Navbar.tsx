'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Zap, ArrowRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenConsole?: () => void;
  onOpenAudit?: () => void;
  onOpenKeys?: () => void;
  onOpenPalette?: () => void;
}

export default function Navbar({ onOpenConsole, onOpenPalette }: NavbarProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Keyboard shortcut for power users: Cmd+K / Ctrl+K opens palette; backtick opens console
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenPalette?.();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '`') {
        e.preventDefault();
        onOpenConsole?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onOpenPalette, onOpenConsole]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-[0_4px_25px_rgba(212,175,55,0.08)] py-3.5'
          : 'bg-white/80 backdrop-blur-sm border-b border-[#D4AF37]/15 py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Emblem */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#0B0B0C] border border-[#D4AF37] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-wider text-[#0B0B0C] font-display">IMMUNIX</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#D4AF37]/10 text-[#997D25] border border-[#D4AF37]/30 font-mono font-bold">2.0</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#6E6E73] font-medium -mt-0.5">Autonomous Immune Mesh</span>
          </div>
        </a>

        {/* The 4-Link Standard */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#break-my-api"
            className="text-sm font-semibold text-[#0B0B0C] hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
            BreakMyAPI Arena
          </a>
          <a
            href="#herd-immunity"
            className="text-sm font-semibold text-[#6E6E73] hover:text-[#0B0B0C] transition-colors"
          >
            Herd Immunity
          </a>
          <a
            href="#benchmark"
            className="text-sm font-semibold text-[#6E6E73] hover:text-[#0B0B0C] transition-colors"
          >
            Benchmark
          </a>
          <a
            href="#pricing"
            className="text-sm font-semibold text-[#6E6E73] hover:text-[#0B0B0C] transition-colors"
          >
            Enterprise Plans
          </a>
        </nav>

        {/* Status + Single High-Conversion CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FBFBF9] border border-[#D4AF37]/25 text-[11px] font-mono text-[#0B0B0C]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            <span className="font-bold text-[#10B981]">14,280</span> INOCULATED
          </div>
          <a
            href="#break-my-api"
            className="px-5 py-2.5 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] font-semibold text-xs tracking-wider uppercase hover:bg-black hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all flex items-center gap-2"
          >
            <span>Try Arena</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          suppressHydrationWarning
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#0B0B0C] hover:text-[#D4AF37] cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#D4AF37]/30 px-6 py-4 flex flex-col gap-4 shadow-xl">
          <a
            href="#break-my-api"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold text-[#0B0B0C] flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
            BreakMyAPI Arena
          </a>
          <a
            href="#herd-immunity"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold text-[#6E6E73]"
          >
            Herd Immunity
          </a>
          <a
            href="#benchmark"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold text-[#6E6E73]"
          >
            Benchmark
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold text-[#6E6E73]"
          >
            Enterprise Plans
          </a>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FBFBF9] border border-[#D4AF37]/25 text-xs font-mono text-[#0B0B0C]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-bold text-[#10B981]">14,280</span> INOCULATED
          </div>
          <a
            href="#break-my-api"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-2.5 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] font-bold text-xs uppercase shadow-md flex items-center justify-center gap-2"
          >
            <span>Try Arena Now</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </a>
        </div>
      )}
    </header>
  );
}
