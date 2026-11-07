'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Server, Activity, ArrowUpRight, Play, RefreshCw } from 'lucide-react';

interface ClusterNode {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  activeAntibodies: number;
  latency: string;
  status: 'Inoculated' | 'Propagating' | 'Synthesizing';
  shieldedRequests: string;
  provider: string;
}

const clusterNodes: ClusterNode[] = [
  {
    id: 'tokyo-01',
    name: 'Tokyo Cluster AP-1',
    region: 'ap-northeast-1',
    lat: 35.6762,
    lng: 139.6503,
    x: 82,
    y: 38,
    activeAntibodies: 7,
    latency: '0.34ms',
    status: 'Inoculated',
    shieldedRequests: '142,500/hr',
    provider: 'Stripe, Line Pay',
  },
  {
    id: 'frankfurt-04',
    name: 'Frankfurt Grid EU-1',
    region: 'eu-central-1',
    lat: 50.1109,
    lng: 8.6821,
    x: 52,
    y: 30,
    activeAntibodies: 7,
    latency: '0.29ms',
    status: 'Inoculated',
    shieldedRequests: '310,200/hr',
    provider: 'Adyen, SAP S/4HANA',
  },
  {
    id: 'newyork-02',
    name: 'New York Sovereign NY-1',
    region: 'us-east-1',
    lat: 40.7128,
    lng: -74.006,
    x: 28,
    y: 34,
    activeAntibodies: 7,
    latency: '0.31ms',
    status: 'Inoculated',
    shieldedRequests: '890,400/hr',
    provider: 'Plaid, Twilio, AWS',
  },
  {
    id: 'london-03',
    name: 'London Sovereign UK-1',
    region: 'eu-west-2',
    lat: 51.5074,
    lng: -0.1278,
    x: 48,
    y: 28,
    activeAntibodies: 7,
    latency: '0.36ms',
    status: 'Inoculated',
    shieldedRequests: '240,100/hr',
    provider: 'Revolut, Stripe, GitHub',
  },
  {
    id: 'singapore-05',
    name: 'Singapore Hub SG-1',
    region: 'ap-southeast-1',
    lat: 1.3521,
    lng: 103.8198,
    x: 75,
    y: 56,
    activeAntibodies: 7,
    latency: '0.41ms',
    status: 'Inoculated',
    shieldedRequests: '190,000/hr',
    provider: 'Grab, DBS Bank, Twilio',
  },
  {
    id: 'saopaulo-06',
    name: 'São Paulo Grid SA-1',
    region: 'sa-east-1',
    lat: -23.5505,
    lng: -46.6333,
    x: 35,
    y: 72,
    activeAntibodies: 7,
    latency: '0.45ms',
    status: 'Inoculated',
    shieldedRequests: '85,400/hr',
    provider: 'Nubank, MercadoPago',
  },
  {
    id: 'zurich-07',
    name: 'Zurich Vault CH-1',
    region: 'europe-west6',
    lat: 47.3769,
    lng: 8.5417,
    x: 53,
    y: 33,
    activeAntibodies: 7,
    latency: '0.22ms',
    status: 'Inoculated',
    shieldedRequests: '54,000/hr',
    provider: 'Swiss Interbank Clearing',
  },
];

export default function GlobalHerdImmunity() {
  const [selectedNode, setSelectedNode] = useState<ClusterNode>(clusterNodes[2]); // Default New York
  const [activeSimulationNode, setActiveSimulationNode] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);

  const [tickerEvents, setTickerEvents] = useState<string[]>([
    'Tokyo ➔ Frankfurt: Antibody #ATB-8921 synchronized via Ed25519 gossip mesh (2.1ms)',
    'New York US-East-1: Pre-emptively shielded against Stripe v2026 schema mutation',
    'Zurich Sovereign Vault: Ephemeral sandbox verified zero regression across 84 core APIs',
    'Singapore SG-1: In-flight socket bridge handled 18,400 checkout calls with 0ms downtime',
  ]);

  useEffect(() => {
    const stream = [
      'London UK-1: WASM translation rule applied in-flight for Salesforce v59 drift',
      'São Paulo SA-1: Received vaccine update from Tokyo; cluster fully inoculated in 3.4ms',
      'Frankfurt EU-1: Zero socket stall across 32 Kubernetes production pods',
      'New York NY-1: AST Codemod generated PR #289 with 100% CI green passing rate',
    ];

    const timer = setInterval(() => {
      const randomEvent = stream[Math.floor(Math.random() * stream.length)];
      setTickerEvents((prev) => [randomEvent, ...prev.slice(0, 3)]);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const triggerWorldwideWave = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    const sequence = [
      { id: 'tokyo-01', text: '[0.0ms] Tokyo AP-1: Synthesized antibody #ATB-8921 from live Stripe webhook mutation' },
      { id: 'singapore-05', text: '[1.2ms] Singapore SG-1: Inoculated via Ed25519 gossip broadcast' },
      { id: 'frankfurt-04', text: '[2.1ms] Frankfurt EU-1: Inoculated. eBPF socket bridge active' },
      { id: 'zurich-07', text: '[2.3ms] Zurich Vault CH-1: Inoculated. Zero financial transaction stall' },
      { id: 'london-03', text: '[2.8ms] London UK-1: Inoculated. Pre-emptively shielded' },
      { id: 'newyork-02', text: '[3.4ms] New York NY-1: Inoculated hours before US rollout reaches region' },
      { id: 'saopaulo-06', text: '[3.8ms] São Paulo SA-1: Worldwide herd immunity complete (14,280 clusters)' },
    ];

    sequence.forEach((step, index) => {
      setTimeout(() => {
        setActiveSimulationNode(step.id);
        setSimulationStatus(step.text);
        setTickerEvents((prev) => [step.text, ...prev.slice(0, 3)]);

        if (index === sequence.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            setActiveSimulationNode(null);
            setSimulationStatus('✓ Global Herd Immunity Complete: 14,280 clusters inoculated in 3.8ms.');
          }, 800);
        }
      }, index * 450);
    });
  };

  return (
    <section id="herd-immunity" className="py-24 bg-[#0B0B0C] text-white relative overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-[#D4AF37]/15 via-[#997D25]/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" /> Peer-to-Peer Immune Mesh
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-white">
            Global Herd Immunity
          </h2>
          <p className="mt-4 text-white/70 text-base sm:text-lg leading-relaxed">
            When a single cluster anywhere in the world synthesizes an antibody against upstream API drift, 
            the verified vaccine is broadcasted across all 14,280 nodes in under 4 milliseconds.
          </p>
        </div>

        {/* Global Topology & Active Node Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive Topology Canvas Visual */}
          <div className="lg:col-span-8 bg-[#141416] rounded-3xl border border-[#D4AF37]/40 p-6 shadow-2xl relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10 mb-6 gap-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                <span className="text-white font-bold">14,280 CLUSTERS SYNCHRONIZED</span>
              </div>

              {/* Simulation Trigger Button */}
              <button
                onClick={triggerWorldwideWave}
                disabled={isSimulating}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0B0B0C] font-mono font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Inoculating Worldwide...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Fire Tokyo ➔ World Wave
                  </>
                )}
              </button>
            </div>

            {/* Simulated World Map Topology Canvas with Connection Beams */}
            <div className="relative w-full h-[360px] sm:h-[420px] bg-black/60 rounded-2xl border border-white/10 overflow-hidden luxury-grid-dark flex items-center justify-center">
              {/* Background abstract continent outlines SVG */}
              <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28%" cy="34%" r="90" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="3 3" />
                <circle cx="52%" cy="30%" r="90" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="3 3" />
                <circle cx="82%" cy="38%" r="90" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="3 3" />
                {/* Vectors connecting nodes */}
                <line x1="28%" y1="34%" x2="48%" y2="28%" stroke={isSimulating ? '#10B981' : '#D4AF37'} strokeWidth={isSimulating ? 2 : 1.2} strokeOpacity="0.6" />
                <line x1="48%" y1="28%" x2="52%" y2="30%" stroke={isSimulating ? '#10B981' : '#D4AF37'} strokeWidth={isSimulating ? 2 : 1.2} strokeOpacity="0.6" />
                <line x1="52%" y1="30%" x2="53%" y2="33%" stroke={isSimulating ? '#10B981' : '#D4AF37'} strokeWidth={isSimulating ? 2 : 1.2} strokeOpacity="0.6" />
                <line x1="52%" y1="30%" x2="82%" y2="38%" stroke={isSimulating ? '#10B981' : '#D4AF37'} strokeWidth={isSimulating ? 2 : 1.2} strokeOpacity="0.6" />
                <line x1="82%" y1="38%" x2="75%" y2="56%" stroke={isSimulating ? '#10B981' : '#D4AF37'} strokeWidth={isSimulating ? 2 : 1.2} strokeOpacity="0.6" />
                <line x1="28%" y1="34%" x2="35%" y2="72%" stroke={isSimulating ? '#10B981' : '#D4AF37'} strokeWidth={isSimulating ? 2 : 1.2} strokeOpacity="0.6" />
              </svg>

              {/* Node Points on Map */}
              {clusterNodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const isWaveActive = activeSimulationNode === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                  >
                    <div className="relative flex items-center justify-center">
                      {/* Pulse circle */}
                      <span
                        className={`absolute rounded-full transition-all ${
                          isWaveActive
                            ? 'w-12 h-12 bg-[#10B981]/80 animate-ping'
                            : isSelected
                            ? 'w-9 h-9 bg-[#D4AF37]/40 animate-ping'
                            : 'w-6 h-6 bg-[#10B981]/30 group-hover:bg-[#D4AF37]/40'
                        }`}
                      />
                      {/* Core point */}
                      <span
                        className={`relative w-4 h-4 rounded-full border-2 transition-transform ${
                          isWaveActive
                            ? 'bg-[#10B981] border-white scale-150 shadow-[0_0_20px_#10B981]'
                            : isSelected
                            ? 'bg-[#D4AF37] border-white scale-125 shadow-[0_0_15px_#D4AF37]'
                            : 'bg-[#10B981] border-black group-hover:scale-110'
                        }`}
                      />
                      {/* Label badge */}
                      <span
                        className={`absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                          isWaveActive
                            ? 'bg-[#10B981] text-black font-extrabold'
                            : isSelected
                            ? 'bg-[#D4AF37] text-[#0B0B0C]'
                            : 'bg-black/80 text-white/80 border border-white/20'
                        }`}
                      >
                        {node.name.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}

              <div className="absolute bottom-3 left-4 text-[10px] font-mono text-white/40">
                P2P GOSSIP CONSENSUS: ED25519 SOVEREIGN ROOT
              </div>
              <div className="absolute bottom-3 right-4 text-[10px] font-mono text-[#10B981] font-bold">
                GLOBAL MESH RESILIENCE: 100%
              </div>
            </div>

            {/* Live Vaccine Distribution Feed */}
            <div className="mt-4 p-4 rounded-2xl bg-black/80 border border-white/10 text-xs font-mono space-y-2">
              <div className="text-[#D4AF37] font-bold flex items-center justify-between pb-1 border-b border-white/10 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#10B981]" /> Live Inoculation Stream
                </span>
                <span className="text-white/40">Global Gossip Bus</span>
              </div>

              {simulationStatus && (
                <div className="p-2 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] font-bold animate-in fade-in">
                  {simulationStatus}
                </div>
              )}

              {tickerEvents.map((evt, idx) => (
                <div key={idx} className="text-white/80 flex items-center gap-2 truncate">
                  <span className="text-[#D4AF37]">▶</span>
                  <span>{evt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Node Inspector Panel */}
          <div className="lg:col-span-4 bg-gradient-to-b from-[#1C1C1F] to-[#0B0B0C] rounded-3xl border border-[#D4AF37]/50 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-base text-white">{selectedNode.name}</h4>
                  <div className="text-[11px] font-mono text-[#D4AF37]">{selectedNode.region}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-[#10B981] text-[10px] font-mono font-bold">
                {selectedNode.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between">
                <span className="text-white/60">Mean Socket Latency:</span>
                <span className="text-[#D4AF37] font-bold text-sm">{selectedNode.latency}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between">
                <span className="text-white/60">Active Antibodies:</span>
                <span className="text-white font-bold">{selectedNode.activeAntibodies} Inoculations</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between">
                <span className="text-white/60">Shielded Throughput:</span>
                <span className="text-[#10B981] font-bold">{selectedNode.shieldedRequests}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10">
                <span className="text-white/60 block mb-1">Protected Upstream APIs:</span>
                <span className="text-white font-semibold">{selectedNode.provider}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-white/80 leading-relaxed text-[11px]">
                <strong className="text-[#D4AF37] block mb-1">Kernel eBPF Probe Status:</strong>
                Active kprobe hooks attached to socket ring buffer. Zero packet drop, 100% SLA maintained.
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#break-my-api"
                className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0B0B0C] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Test Sabotage on this Node</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
