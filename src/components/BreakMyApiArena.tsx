'use client';

import React, { useState } from 'react';
import { Skull, RefreshCw, Play, CheckCircle2 } from 'lucide-react';

export default function BreakMyApiArena() {
  const [selectedSabotage, setSelectedSabotage] = useState<'rename' | 'delete' | 'timestamp'>('rename');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'System standby. Select an API sabotage scenario above and click "Simulate 3:00 AM API Mutation".',
  ]);
  const [outcome, setOutcome] = useState<'idle' | 'success'>('idle');

  const runSimulation = () => {
    setIsRunning(true);
    setOutcome('idle');
    setLogs(['[03:14:02 AM] Initializing simulated upstream Stripe PaymentIntent mutation...']);

    setTimeout(() => {
      if (selectedSabotage === 'rename') {
        setLogs((prev) => [
          ...prev,
          '[03:14:02.102] 💥 UPSTREAM SNEEZE: Stripe renames `amount_cents` -> `amount` without notice.',
          '[03:14:02.104] ⚠️ ANTIGEN DETECTED: Downstream microservice payload validation failure (HTTP 400).',
          '[03:14:02.105] 🛡️ SPEED 1 IN-FLIGHT RESCUE: Active Antibody synthesized in 0.62ms.',
          '[03:14:02.106] 🚀 PAYLOAD MUTATED ON WIRE: `amount` mapped back to `amount_cents` in-flight.',
          '[03:14:02.107] ✅ CONSUMER RESPONSE: HTTP 200 OK delivered. Zero customer checkouts lost.',
          '[03:14:02.320] 🧬 SPEED 2 AST CODER: ts-morph refactoring caller TypeScript AST in ephemeral sandbox.',
          '[03:14:02.890] 📦 GITHUB PULL REQUEST OPENED: PR #42 with verified cryptographic green certificate.',
          '[03:14:03.110] 🌐 HERD IMMUNITY BROADCAST: Inoculation vaccine deployed to Tokyo, London, and Frankfurt.',
        ]);
      } else if (selectedSabotage === 'delete') {
        setLogs((prev) => [
          ...prev,
          '[03:14:02.102] 💥 UPSTREAM SNEEZE: Twilio deprecates `/v1/Messages` -> enforces `/v2/Dispatches`.',
          '[03:14:02.105] 🛡️ SPEED 1 WIRE RELOCATION: Request URL dynamically rerouted with zero packet loss.',
          '[03:14:02.107] ✅ CONSUMER RESPONSE: HTTP 200 OK delivered (0ms user-facing downtime).',
          '[03:14:02.940] 📦 GITHUB PULL REQUEST OPENED: Permanent URL migration patch ready for engineering review.',
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          '[03:14:02.102] 💥 UPSTREAM SNEEZE: Salesforce shifts timestamp from UNIX epoch integers to ISO 8601 strings.',
          '[03:14:02.105] 🛡️ SPEED 1 WIRE TRANSFORMATION: In-flight epoch serialization injected.',
          '[03:14:02.107] ✅ CONSUMER RESPONSE: HTTP 200 OK delivered.',
          '[03:14:02.810] 📦 GITHUB PULL REQUEST OPENED: Codebase types safely updated.',
        ]);
      }
      setIsRunning(false);
      setOutcome('success');
    }, 1200);
  };

  return (
    <section id="break-my-api" className="py-24 bg-[#FBFBF9] relative border-y border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D4AF37]/40 text-xs font-mono font-bold text-[#997D25] uppercase mb-4">
            Interactive Sabotage Arena
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0B0B0C] font-display">
            Sabotage an API. Watch IMMUNIX Heal It in 0.8ms.
          </h2>
          <p className="mt-4 text-[#6E6E73] text-lg">
            Experience the world’s first autonomous dual-speed immune reaction. Simulate an upstream vendor mutation that would normally crash production and trigger PagerDuty.
          </p>
        </div>

        {/* Console Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Attack Configuration */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B0B0C] font-mono mb-4 flex items-center gap-2">
              <Skull className="w-4 h-4 text-[#D4AF37]" />
              Select 3:00 AM Mutation
            </h3>

            <div className="space-y-3">
              <button
                suppressHydrationWarning
                onClick={() => setSelectedSabotage('rename')}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedSabotage === 'rename'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-sm'
                    : 'border-black/10 hover:border-[#D4AF37]/40 bg-[#FBFBF9]'
                }`}
              >
                <div className="font-bold text-sm text-[#0B0B0C]">Stripe: Field Rename Mutation</div>
                <div className="text-xs text-[#6E6E73] mt-1 font-mono">`amount_cents` → `amount`</div>
              </button>

              <button
                suppressHydrationWarning
                onClick={() => setSelectedSabotage('delete')}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedSabotage === 'delete'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-sm'
                    : 'border-black/10 hover:border-[#D4AF37]/40 bg-[#FBFBF9]'
                }`}
              >
                <div className="font-bold text-sm text-[#0B0B0C]">Twilio: Endpoint Deprecation</div>
                <div className="text-xs text-[#6E6E73] mt-1 font-mono">`/v1/Messages` → `/v2/Dispatches`</div>
              </button>

              <button
                suppressHydrationWarning
                onClick={() => setSelectedSabotage('timestamp')}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedSabotage === 'timestamp'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-sm'
                    : 'border-black/10 hover:border-[#D4AF37]/40 bg-[#FBFBF9]'
                }`}
              >
                <div className="font-bold text-sm text-[#0B0B0C]">Salesforce: Timestamp Shift</div>
                <div className="text-xs text-[#6E6E73] mt-1 font-mono">UNIX Epoch Int → ISO 8601 String</div>
              </button>
            </div>

            <button
              suppressHydrationWarning
              onClick={runSimulation}
              disabled={isRunning}
              className="mt-6 w-full py-4 rounded-2xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] font-bold text-xs uppercase tracking-wider hover:bg-black hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  <span>Synthesizing Antibody...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                  <span>Simulate 3:00 AM API Mutation</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Live Terminal Output */}
          <div className="lg:col-span-8 bg-[#0B0B0C] rounded-3xl p-6 border border-[#D4AF37]/40 shadow-2xl text-white font-mono text-xs overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="ml-2 text-white/50 text-[11px]">immunix-wire-sentry://live-kernel-telemetry</span>
              </div>
              <span className="text-[10px] text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                0.8ms SLA Active
              </span>
            </div>

            <div className="space-y-2.5 min-h-[300px] max-h-[360px] overflow-y-auto pr-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`leading-relaxed ${
                    log.includes('💥')
                      ? 'text-[#EF4444]'
                      : log.includes('🛡️') || log.includes('✅')
                      ? 'text-[#10B981] font-bold'
                      : log.includes('📦') || log.includes('🧬')
                      ? 'text-[#D4AF37]'
                      : 'text-white/70'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>

            {outcome === 'success' && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[#10B981] text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>Outage Averted: 0ms Downtime • PR #42 Created • Herd Inoculated</span>
                </div>
                <span className="text-white/40">Lat: 0.62ms</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
