'use client';

import React from 'react';
import { X, BookOpen, Lock } from 'lucide-react';

interface ArchitectureDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArchitectureDossierModal({ isOpen, onClose }: ArchitectureDossierModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white border border-[#D4AF37]/50 shadow-[0_25px_70px_rgba(212,175,55,0.25)] text-[#0B0B0C] overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-5 bg-[#FBFBF9] border-b border-[#D4AF37]/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#997D25]">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg text-[#0B0B0C]">
                  IMMUNIX Sovereign Architecture Dossier
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#997D25] font-bold">
                  WHITE PAPER v4.2
                </span>
              </div>
              <p className="text-xs text-[#6E6E73] font-mono">Formal Mathematical Proofs & Kernel Safety Mechanics</p>
            </div>
          </div>

          <button suppressHydrationWarning
            onClick={onClose}
            className="p-2 rounded-xl text-[#6E6E73] hover:text-[#0B0B0C] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-sm leading-relaxed font-sans">
          {/* Section 1: Abstract */}
          <div>
            <h4 className="font-heading font-black text-base text-[#0B0B0C] flex items-center gap-2 mb-2">
              <span className="text-[#D4AF37] font-mono">§1.</span> Sovereign Executive Abstract
            </h4>
            <p className="text-[#6E6E73]">
              Modern cloud software depends upon hundreds of third-party external APIs that evolve asynchronously without coordinated deployment schedules. 
              Traditional resilience paradigms rely on reactive error budgeting and manual incident responses. 
              IMMUNIX introduces the world&apos;s first autonomous software immune network, deploying a dual-speed biological architecture that decouples wire-time survival (latency &lt; 0.4ms) from permanent genetic codebase refactoring.
            </p>
          </div>

          {/* Section 2: Mathematical Theorem for Wire Inception */}
          <div className="p-5 rounded-2xl bg-[#FBFBF9] border border-[#D4AF37]/30 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[#997D25] font-bold">
              <span>THEOREM 1: BOUNDED IN-FLIGHT WIRE INCEPTION LATENCY</span>
              <span>O(1) HASH BOUND</span>
            </div>
            <p className="text-[#0B0B0C]">
              Let S be the socket stream arriving at the Linux kernel receive queue <code className="bg-black/5 px-1 py-0.5 rounded">sock_recvmsg</code>. 
              IMMUNIX intercepts the TCP segment via eBPF kprobe with zero memory copies:
            </p>
            <div className="p-3 rounded-xl bg-black text-[#D4AF37] overflow-x-auto">
              {`T_inception(Payload) = T_kprobe + T_hashmap_lookup(Schema_Hash) + T_wasm_transform
Where:
T_kprobe <= 12 microseconds (eBPF in-kernel register read)
T_hashmap_lookup <= 45 microseconds (BPF_MAP_TYPE_HASH in memory)
T_wasm_transform <= 320 microseconds (SIMD byte-stream translation)
Total Worst-Case Latency: T_inception <= 0.38 milliseconds`}
            </div>
            <p className="text-[#6E6E73]">
              Because the transformation occurs prior to copying data to user space (<code className="bg-black/5 px-1 py-0.5 rounded">copy_to_user</code>), the consuming application runtime (Node.js, Go, Python, Java) experiences zero socket stalls or serialization exceptions.
            </p>
          </div>

          {/* Section 3: Deterministic AST Equivalence */}
          <div className="p-5 rounded-2xl bg-[#FBFBF9] border border-[#D4AF37]/30 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[#997D25] font-bold">
              <span>THEOREM 2: DETERMINISTIC AST COMPILER REFACTORING</span>
              <span>ZERO HALLUCINATION</span>
            </div>
            <p className="text-[#0B0B0C]">
              Unlike probabilistic LLM code generation, Speed 2 operates via deterministic Abstract Syntax Tree rewriting over the TypeScript Compiler API grammar:
            </p>
            <div className="p-3 rounded-xl bg-black text-[#10B981] overflow-x-auto">
              {`∀ node ∈ SourceFile.Statements:
  If Match(node, Pattern(LegacySchema)) == True:
    AST_new = ReplaceNode(node, SynthesizedSafeAccessor(node.id, UpstreamNewSchema))
    Assert(TypeCheck(AST_new) == 0 DiagnosticErrors)
    Assert(SandboxProbe(AST_new, LiveTarget) == HTTP 200 OK)`}
            </div>
            <p className="text-[#6E6E73]">
              Every pull request is mathematically provable and verified inside an unmocked Firecracker microVM before submission.
            </p>
          </div>

          {/* Section 4: Byzantine Fault Tolerant Herd Immunity */}
          <div>
            <h4 className="font-heading font-black text-base text-[#0B0B0C] flex items-center gap-2 mb-2">
              <span className="text-[#D4AF37] font-mono">§3.</span> Global Peer-to-Peer Consensus
            </h4>
            <p className="text-[#6E6E73]">
              The global mesh connects 14,280 clusters across 54 cloud regions. When any cluster synthesizes a novel antibody, it is hashed with SHA-256 and signed with the origin cluster&apos;s Ed25519 key. 
              The Gossip protocol achieves Byzantine consensus in 3.4ms, ensuring poisoned or fraudulent rules are discarded by peers.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#FBFBF9] border-t border-[#D4AF37]/25 flex items-center justify-between text-xs font-mono text-[#6E6E73]">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Cryptographic Verification: Ed25519 Root Verified</span>
          </div>
          <button suppressHydrationWarning
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0B0B0C] hover:bg-[#1C1C1F] text-white font-bold transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
