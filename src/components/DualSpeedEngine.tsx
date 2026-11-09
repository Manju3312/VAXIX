'use client';

import React, { useState } from 'react';
import {
  Zap,
  Dna,
  Cpu,
  CheckCircle2,
  UserCheck,
  Shield,
  GitPullRequest,
  Box,
} from 'lucide-react';

export default function DualSpeedEngine() {
  const [activeSpeed, setActiveSpeed] = useState<'speed1' | 'speed2' | 'herd'>('speed1');

  return (
    <section id="dual-speed-engine" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#997D25] text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" /> Core Sovereign Architecture
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-[#0B0B0C] tracking-tight">
            The Autonomous Immune Architecture
          </h2>
          <p className="mt-4 text-[#6E6E73] text-base sm:text-lg leading-relaxed">
            Why traditional API monitoring fails: alerts only tell you that production has crashed. 
            VAXIX pairs zero-leak sensor telemetry with deterministic compiler AST refactoring and mandatory human review.
          </p>
        </div>

        {/* Speed Selector Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#FBFBF9] border border-[#D4AF37]/30 shadow-md">
            <button
              suppressHydrationWarning
              onClick={() => setActiveSpeed('speed1')}
              className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSpeed === 'speed1'
                  ? 'bg-[#0B0B0C] text-white shadow-[0_4px_15px_rgba(212,175,55,0.25)]'
                  : 'text-[#6E6E73] hover:text-[#0B0B0C]'
              }`}
            >
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              <span>Layer 1: Sensor Proxy &amp; Redaction (&lt; 1ms)</span>
            </button>

            <button
              suppressHydrationWarning
              onClick={() => setActiveSpeed('speed2')}
              className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSpeed === 'speed2'
                  ? 'bg-[#0B0B0C] text-white shadow-[0_4px_15px_rgba(212,175,55,0.25)]'
                  : 'text-[#6E6E73] hover:text-[#0B0B0C]'
              }`}
            >
              <Dna className="w-4 h-4 text-[#D4AF37]" />
              <span>Layer 2: Deterministic AST Repair</span>
            </button>

            <button
              suppressHydrationWarning
              onClick={() => setActiveSpeed('herd')}
              className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSpeed === 'herd'
                  ? 'bg-[#0B0B0C] text-white shadow-[0_4px_15px_rgba(212,175,55,0.25)]'
                  : 'text-[#6E6E73] hover:text-[#0B0B0C]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Layer 3: Mandatory Human Review Gate</span>
            </button>
          </div>
        </div>

        {/* Dynamic Architecture Display */}
        <div className="rounded-3xl border border-[#D4AF37]/30 bg-[#FBFBF9] p-8 lg:p-12 shadow-xl">
          {activeSpeed === 'speed1' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] font-mono text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                  &lt; 1.0ms Local Inspection Overhead
                </div>
                <h3 className="text-3xl font-heading font-black text-[#0B0B0C]">
                  Zero-Leak Sensor Proxy &amp; Telemetry
                </h3>
                <p className="text-[#6E6E73] text-sm leading-relaxed">
                  Attached within the microservice process or local sidecar, the VAXIX Sensor wraps outbound HTTP/TLS calls. 
                  It inspects unencrypted structural shapes before transmission and upon response receipt, detecting RFC 8594 Sunset/Deprecation headers while redacting all secrets and PII.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Safety-First Principle:</strong>
                      <p className="text-xs text-[#6E6E73]">Live payment traffic is never modified in-flight. Requests proceed unmodified to upstream SaaS APIs.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Zero-Leak Secret Redaction:</strong>
                      <p className="text-xs text-[#6E6E73]">Stripe keys, JWT tokens, credit card PANs, and customer PII are scrubbed prior to log persistence.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">RFC 8594 Header Sentry:</strong>
                      <p className="text-xs text-[#6E6E73]">Extracts Deprecation and Sunset headers to catch pending migrations months before vendor endpoints shut down.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wire Interception Visual Card */}
              <div className="lg:col-span-6 bg-[#0B0B0C] rounded-2xl p-6 border border-[#D4AF37]/40 text-white font-mono text-xs shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[#D4AF37]">
                  <span className="font-bold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#10B981]" /> SENSOR INTERCEPTION TELEMETRY
                  </span>
                  <span className="text-[10px] text-white/50">NODE.JS / PYTHON PROXY</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="text-white/40">{`// Outbound Client Request`}</div>
                  <div className="text-white p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-emerald-400 font-bold">POST</span> https://api.stripe.com/v1/payment_intents<br />
                    <span className="text-white/60">Headers: Authorization: Bearer [REDACTED_STRIPE_KEY]</span><br />
                    <span className="text-white/60">Body: {`{ "amount": 2500, "customer_email": "user@acme.com" }`}</span>
                  </div>

                  <div className="text-white/40 pt-2">{`// Vendor Upstream Sentry (RFC 8594 Deprecation Header Detected)`}</div>
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200">
                    <span className="text-amber-400 font-bold">HTTP 400 Bad Request</span><br />
                    <span>Sunset: Wed, 01 Jan 2026 00:00:00 GMT</span><br />
                    <span className="text-amber-300">Message: &quot;Field &apos;customer_email&apos; deprecated. Use &apos;email_address&apos;.&quot;</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[10px]">
                    ✓ Pathogen Event Emitted ➔ Handed off to Deterministic AST Repair Engine
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSpeed === 'speed2' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-600 font-mono text-xs font-bold">
                  <Dna className="w-3.5 h-3.5 text-blue-500" />
                  Deterministic Codebase Repair
                </div>
                <h3 className="text-3xl font-heading font-black text-[#0B0B0C]">
                  Compiler AST Code Surgeon
                </h3>
                <p className="text-[#6E6E73] text-sm leading-relaxed">
                  Instead of unreliable LLM prompt generation, VAXIX performs deterministic compiler surgery. 
                  Using <code>ts-morph</code> (TypeScript) and <code>LibCST</code> (Python), our engine visits syntax tree nodes directly, refactoring deprecated fields across all caller files with 0.0% hallucinations.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Zero LLM Hallucinations:</strong>
                      <p className="text-xs text-[#6E6E73]">AST transformations are mathematically deterministic and validated by the compiler before being staged.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Isolated Docker Container Verification:</strong>
                      <p className="text-xs text-[#6E6E73]">The patch is compiled and tested inside an isolated container runner against vendor sandboxes. Zero bare-metal KVM dependency.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Cryptographic Attestation:</strong>
                      <p className="text-xs text-[#6E6E73]">Sandbox test passes are stamped with an Ed25519 cryptographic certificate accompanying the Pull Request.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic Flow Visual */}
              <div className="lg:col-span-6 bg-[#0B0B0C] rounded-2xl p-6 border border-[#D4AF37]/40 text-white font-mono text-xs shadow-2xl space-y-4">
                <div className="text-[#D4AF37] font-bold pb-2 border-b border-white/10 flex justify-between">
                  <span>DETERMINISTIC AST SURGERY</span>
                  <span className="text-[#10B981]">COMPILER VERIFIED</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="text-[#D4AF37] font-bold">1. ts-morph / LibCST traverses repository:</div>
                  <div className="text-white/60 text-[11px] pl-3">
                    • <code>demo-app/src/billing.ts (Call site refactored)</code><br />
                    • <code>source: token ➔ payment_method: token</code>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="text-blue-400 font-bold flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5" /> 2. Isolated Container Sandbox:
                  </div>
                  <div className="text-white/60 text-[11px] pl-3">
                    • Runs customer test suite in container runner (2.29ms)<br />
                    • Vendor sandbox probe: 3/3 Tests Passed (HTTP 200 OK)<br />
                    • Ed25519 attestation certificate generated
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2">
                  <div className="text-amber-400 font-bold flex items-center gap-1.5">
                    <GitPullRequest className="w-3.5 h-3.5" /> 3. GitHub PR Opened (Human Review Required):
                  </div>
                  <div className="text-white/70 text-[11px] pl-3">
                    • PR #414: <code>fix(stripe): adopt required schema</code><br />
                    • Status: <strong>OPEN • Zero Auto-Merge Enforced</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSpeed === 'herd' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 font-mono text-xs font-bold">
                  <UserCheck className="w-3.5 h-3.5" />
                  Supply-Chain Security Firewall
                </div>
                <h3 className="text-3xl font-heading font-black text-[#0B0B0C]">
                  Mandatory Human Review Gate
                </h3>
                <p className="text-[#6E6E73] text-sm leading-relaxed">
                  Automated self-healing without human oversight creates a severe poisoned-fix supply-chain risk. 
                  In VAXIX, every synthesized antibody MUST be reviewed and approved by an authorized engineer before it can merge into production.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Zero Auto-Merge Policy:</strong>
                      <p className="text-xs text-[#6E6E73]">Pull requests remain in OPEN status until a human reviewer inspects the AST diff and signs off.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Plain-English Explanations:</strong>
                      <p className="text-xs text-[#6E6E73]">PRs include upstream vendor error reproduction, unified diff, and sandbox verification output.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-mono text-[#0B0B0C]">Tamper-Evident Immune Log:</strong>
                      <p className="text-xs text-[#6E6E73]">Once merged, every action is logged into PostgreSQL / SQLite WAL with cryptographic hash chains.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Human Approval Visual Card */}
              <div className="lg:col-span-6 bg-[#0B0B0C] rounded-2xl p-6 border border-amber-500/50 text-white font-mono text-xs shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-amber-400">
                  <span className="font-bold flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-400" /> HUMAN GOVERNANCE FIREWALL
                  </span>
                  <span className="text-[10px] text-amber-300">STRICT HUMAN REVIEW</span>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs space-y-2">
                  <div className="font-bold text-amber-400">🛡️ Anti-Poisoning Supply Chain Rule:</div>
                  <p className="text-[11px] leading-relaxed text-amber-100/80">
                    Fix rules cannot become active in production code without human authorization. The PR bot provides full visibility, and your CI/CD enforces branch protection.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="text-white font-bold flex items-center justify-between">
                    <span>Audit Trail Record:</span>
                    <span className="text-[#10B981] text-[10px]">VERIFIED_AND_SIGNED</span>
                  </div>
                  <div className="text-white/60 text-[11px] space-y-1">
                    <div>• Reviewer: <code>cto@sovereign-holdings.ch</code></div>
                    <div>• Action: <code>MERGED_TO_MAIN (Squash &amp; Merge)</code></div>
                    <div>• Certificate: <code>ed25519_cert_93fb6d_verified</code></div>
                    <div>• Primary Storage: <code>PostgreSQL / SQLite WAL</code></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
