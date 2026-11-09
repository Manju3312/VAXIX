'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Zap,
  Terminal,
  Shield,
  Radio,
  FileCode,
  DollarSign,
  X,
  ArrowRight,
  Sparkles,
  Cpu,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsole: () => void;
  onOpenAudit: () => void;
  onOpenDossier: () => void;
  onOpenCheckout?: (tier?: string) => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onOpenConsole,
  onOpenAudit,
  onOpenDossier,
  onOpenCheckout,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open palette
          const event = new CustomEvent('open-command-palette');
          window.dispatchEvent(event);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'arena',
      title: 'Enter BreakMyAPI Sabotage Arena',
      subtitle: 'Simulate 3:00 AM breaking changes & test 0.4ms auto-heal',
      icon: Zap,
      category: 'Simulations',
      action: () => {
        onClose();
        const el = document.getElementById('break-my-api') || document.getElementById('breakmyapi-arena');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.push('/arena');
        }
      },
    },
    {
      id: 'dashboard',
      title: 'Open Enterprise Mission Control Dashboard',
      subtitle: 'Inspect live eBPF telemetry, active antibodies, and DNA repairs',
      icon: LayoutDashboard,
      category: 'Operations',
      action: () => {
        onClose();
        router.push('/dashboard');
      },
    },
    {
      id: 'console',
      title: 'Launch Sovereign HUD Inspector',
      subtitle: 'Quick in-page diagnostics overlay (press `~` backtick anywhere)',
      icon: Terminal,
      category: 'Operations',
      action: () => {
        onClose();
        onOpenConsole();
      },
    },
    {
      id: 'mesh',
      title: 'View Global Herd Immunity Map',
      subtitle: 'Inspect 14,280 clusters and trigger worldwide P2P gossip wave',
      icon: Radio,
      category: 'Mesh',
      action: () => {
        onClose();
        (document.getElementById('herd-immunity') || document.getElementById('global-herd-immunity'))?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'deploy',
      title: 'Deploy Kubernetes / Helm / Terraform Manifest',
      subtitle: 'Generate production eBPF DaemonSet YAML in under 60 seconds',
      icon: Cpu,
      category: 'DevOps',
      action: () => {
        onClose();
        document.getElementById('cluster-deploy-wizard')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'compliance',
      title: 'View Sovereign Compliance & Audits',
      subtitle: 'SOC2 Type II, ISO/IEC 27001, and Zero-Knowledge governance',
      icon: ShieldCheck,
      category: 'Security',
      action: () => {
        onClose();
        document.getElementById('sovereign-compliance')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'mcp',
      title: 'Open Model Context Protocol (MCP) Simulator',
      subtitle: 'Query whats_changed, inoculate_cluster, and probe_sandbox via JSON-RPC',
      icon: FileCode,
      category: 'AI Agents',
      action: () => {
        onClose();
        document.getElementById('mcp-protocol')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'calculator',
      title: 'Calculate Financial Downtime ROI',
      subtitle: 'Estimate loss prevented for your specific transaction volume',
      icon: DollarSign,
      category: 'Executive',
      action: () => {
        onClose();
        document.getElementById('financial-loss-calculator')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'radar',
      title: 'Vendor Schema Health Radar',
      subtitle: 'Live telemetry tracking Stripe, OpenAI, Twilio, Plaid drift',
      icon: Radio,
      category: 'Telemetry',
      action: () => {
        onClose();
        document.getElementById('vendor-health-radar')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'dossier',
      title: 'Read Sovereign Architecture Whitepaper',
      subtitle: 'Review O(1) in-flight socket theorems and deterministic AST proofs',
      icon: Shield,
      category: 'Whitepaper',
      action: () => {
        onClose();
        onOpenDossier();
      },
    },
    {
      id: 'checkout',
      title: 'Provision Sovereign License & Key (Stripe Gateway)',
      subtitle: 'Subscribe to Enterprise Grid or Sovereign Mesh and mint live master API keys',
      icon: CreditCard,
      category: 'Billing',
      action: () => {
        onClose();
        onOpenCheckout?.('enterprise-grid');
      },
    },
    {
      id: 'audit',
      title: 'Request Sovereign VPC / SLA Warranty ($5M)',
      subtitle: 'Book private air-gapped deployment audit',
      icon: Sparkles,
      category: 'Sovereign',
      action: () => {
        onClose();
        onOpenAudit();
      },
    },
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0B0B0C] border border-[#D4AF37]/50 shadow-[0_25px_70px_rgba(212,175,55,0.25)] text-white overflow-hidden font-sans">
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-4 border-b border-white/10 bg-[#141416]">
          <Search className="w-5 h-5 text-[#D4AF37] mr-3 shrink-0" />
          <input suppressHydrationWarning
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search sovereign capabilities... (e.g. Stripe, eBPF, K8s, ROI)"
            className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none font-mono"
          />
          <div className="flex items-center gap-1.5 ml-3">
            <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white/60">ESC</span>
            <button suppressHydrationWarning onClick={onClose} className="text-white/40 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Command List */}
        <div className="max-h-[380px] overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-white/40">
              No sovereign commands found matching &quot;{query}&quot;.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button suppressHydrationWarning
                  key={item.id}
                  onClick={item.action}
                  className="w-full text-left p-3.5 rounded-2xl hover:bg-white/5 border border-transparent hover:border-[#D4AF37]/30 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-heading text-white group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                        {item.title}
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/50">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6E6E73] font-mono mt-0.5">{item.subtitle}</div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#141416] flex items-center justify-between text-[11px] font-mono text-white/40">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[#D4AF37] font-semibold">VAXIX Sovereign Spotlight</span>
        </div>
      </div>
    </div>
  );
}

