'use client';

import React, { useState } from 'react';
import { Bot, Zap, Play, Copy, Check, Code2, Sparkles } from 'lucide-react';

interface McpTool {
  name: string;
  description: string;
  inputSchema: object;
  sampleArgs: object;
  sampleResponse: object;
}

const mcpTools: McpTool[] = [
  {
    name: 'whats_changed',
    description: 'Inspects live upstream API egress against deployed client contracts, detecting subtle runtime serialization drift and breaking property mutations.',
    inputSchema: {
      type: 'object',
      properties: {
        target_service: { type: 'string', description: 'Upstream vendor identifier (e.g. stripe, twilio)' },
        endpoint: { type: 'string', description: 'API route to inspect' },
        cluster_id: { type: 'string', description: 'Target cluster id' },
      },
      required: ['target_service', 'endpoint'],
    },
    sampleArgs: {
      target_service: 'stripe',
      endpoint: '/v1/charges',
      cluster_id: 'aws-us-east-1',
    },
    sampleResponse: {
      status: 'DRIFT_DETECTED',
      severity: 'BREAKING',
      drift_count: 1,
      mutations: [
        {
          type: 'FIELD_RENAMED',
          legacy_field: 'customer_email',
          upstream_field: 'email_address',
          sample_value: 'patron@sovereign-holdings.ch',
          affected_call_sites: 3,
        },
      ],
      suggested_antibody: 'ATB-8921',
      latency_impact_ms: 0.38,
    },
  },
  {
    name: 'inoculate_cluster',
    description: 'Deploys an in-flight eBPF/WASM synthetic translation rule to target cluster socket ring buffer with 0.4ms latency penalty and zero downtime.',
    inputSchema: {
      type: 'object',
      properties: {
        antibody_id: { type: 'string', description: 'ID of verified vaccine rule' },
        cluster_id: { type: 'string', description: 'Kubernetes namespace or cluster target' },
        strategy: { type: 'string', enum: ['FIELD_ALIAS', 'SOCKET_REDIRECT', 'TYPE_COERCE'] },
      },
      required: ['antibody_id', 'cluster_id'],
    },
    sampleArgs: {
      antibody_id: 'ATB-8921',
      cluster_id: 'production-us-east-1',
      strategy: 'FIELD_ALIAS',
    },
    sampleResponse: {
      status: 'INOCULATION_CONFIRMED',
      cluster_id: 'production-us-east-1',
      active_probes: 16,
      interception_layer: 'sensor_proxy_v2.4',
      latency_overhead_ms: 0.28,
      outage_risk_mitigated: '100%',
      global_herd_propagation: '14,280 clusters notified',
    },
  },
  {
    name: 'probe_sandbox',
    description: 'Spins up an ephemeral container sandbox, generates deterministic AST patch, and validates HTTP 200 contract against live upstream staging.',
    inputSchema: {
      type: 'object',
      properties: {
        git_repo: { type: 'string', description: 'Target repository URL' },
        mutation_ref: { type: 'string', description: 'Upstream mutation ID' },
        create_pull_request: { type: 'boolean', description: 'Auto-open GitHub PR if green' },
      },
      required: ['git_repo', 'mutation_ref'],
    },
    sampleArgs: {
      git_repo: 'github.com/enterprise/billing-core',
      mutation_ref: 'stripe_v2026_03',
      create_pull_request: true,
    },
    sampleResponse: {
      status: 'PROBE_PASSED',
      sandbox_id: 'vm_ephemeral_882a',
      test_suite: {
        total: 48,
        passed: 48,
        failed: 0,
      },
      live_staging_response: 'HTTP 200 OK (Contract Verified)',
      pull_request: {
        number: 204,
        url: 'https://github.com/enterprise/billing-core/pull/204',
        title: 'fix(stripe): adopt email_address contract alias',
        files_modified: ['src/services/billing/stripeWebhook.ts'],
      },
    },
  },
];

export default function McpProtocolSection() {
  const [selectedTool, setSelectedTool] = useState<McpTool>(mcpTools[0]);
  const [activeJsonTab, setActiveJsonTab] = useState<'request' | 'response' | 'schema'>('request');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executedResponse, setExecutedResponse] = useState<object | null>(null);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const executeToolCall = async () => {
    setIsExecuting(true);
    setExecutedResponse(null);

    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: selectedTool.name,
            arguments: selectedTool.sampleArgs,
          },
          id: 42,
        }),
      });
      const data = await res.json();
      setExecutedResponse(data.result || data);
      setActiveJsonTab('response');
    } catch {
      setExecutedResponse(selectedTool.sampleResponse);
      setActiveJsonTab('response');
    } finally {
      setIsExecuting(false);
    }
  };

  const copyConfigSnippet = () => {
    const config = JSON.stringify(
      {
        mcpServers: {
          immunix: {
            command: 'npx',
            args: ['-y', '@immunix/mcp-server', '--cluster=production'],
            env: {
              IMMUNIX_API_KEY: 'imx_live_sec_99182a0b',
            },
          },
        },
      },
      null,
      2
    );
    navigator.clipboard.writeText(config);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <section id="mcp-protocol" className="py-24 bg-[#FBFBF9] border-y border-[#D4AF37]/25 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#997D25] text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <Bot className="w-3.5 h-3.5 text-[#D4AF37]" /> Agentic Sovereign Protocol
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-black text-[#0B0B0C] tracking-tight">
            Model Context Protocol (MCP) Server
          </h2>
          <p className="mt-4 text-[#6E6E73] text-base sm:text-lg leading-relaxed">
            Equip your autonomous AI coding agents (Claude, Cursor, Antigravity) with sovereign immune primitives. 
            Agents can query live cluster drift, inoculate production pods, and execute unmocked ephemeral probes directly via JSON-RPC.
          </p>
        </div>

        {/* Interactive MCP Tool Playground */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tool Selector List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#997D25]">
                Available MCP Tool Primitives:
              </span>
              <span className="text-[11px] font-mono text-[#6E6E73]">JSON-RPC 2.0</span>
            </div>

            {mcpTools.map((tool) => {
              const isSelected = selectedTool.name === tool.name;
              return (
                <button suppressHydrationWarning
                  key={tool.name}
                  onClick={() => {
                    setSelectedTool(tool);
                    setExecutedResponse(null);
                    setActiveJsonTab('request');
                  }}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#D4AF37] shadow-[0_10px_30px_rgba(212,175,55,0.2)] ring-1 ring-[#D4AF37]'
                      : 'bg-white/80 hover:bg-white border-[#D4AF37]/30 hover:border-[#D4AF37]/60 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold font-mono text-[#0B0B0C] flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-[#997D25]" />
                      {tool.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#997D25] font-bold">
                      MCP TOOL
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#6E6E73] leading-relaxed">
                    {tool.description}
                  </p>
                </button>
              );
            })}

            {/* Quick config card */}
            <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0B0B0C] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Agent Integration Config
                </span>
                <button suppressHydrationWarning
                  onClick={copyConfigSnippet}
                  className="text-[11px] font-mono text-[#997D25] hover:text-[#0B0B0C] flex items-center gap-1 cursor-pointer font-bold"
                >
                  {copiedConfig ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10B981]" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy JSON
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#6E6E73] font-mono">
                Paste into your agent&apos;s MCP config file to unlock zero-prompt autonomous cluster inoculation.
              </p>
            </div>
          </div>

          {/* JSON-RPC Playground Console */}
          <div className="lg:col-span-7 bg-[#0B0B0C] rounded-3xl border border-[#D4AF37]/50 shadow-2xl overflow-hidden font-mono text-xs flex flex-col min-h-[500px]">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#141416]">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-white font-bold text-xs">
                  MCP Client Simulator — {selectedTool.name}
                </span>
              </div>

              <button suppressHydrationWarning
                onClick={executeToolCall}
                disabled={isExecuting}
                className="px-4 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-[#0B0B0C] font-mono font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isExecuting ? (
                  <>
                    <Zap className="w-3.5 h-3.5 animate-spin" /> Calling MCP...
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" /> Execute MCP Call
                  </>
                )}
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-5 pt-3 border-b border-white/10 bg-[#0E0E10] text-[11px]">
              <button suppressHydrationWarning
                onClick={() => setActiveJsonTab('request')}
                className={`pb-2.5 px-2 border-b-2 font-bold transition-all ${
                  activeJsonTab === 'request'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                Request Payload
              </button>
              <button suppressHydrationWarning
                onClick={() => setActiveJsonTab('response')}
                className={`pb-2.5 px-2 border-b-2 font-bold transition-all ${
                  activeJsonTab === 'response'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                Response Output {executedResponse && '✓'}
              </button>
              <button suppressHydrationWarning
                onClick={() => setActiveJsonTab('schema')}
                className={`pb-2.5 px-2 border-b-2 font-bold transition-all ${
                  activeJsonTab === 'schema'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                Tool JSON Schema
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto">
              {activeJsonTab === 'request' && (
                <div className="space-y-3">
                  <div className="text-white/50 text-[11px]">
                    Standard Model Context Protocol JSON-RPC 2.0 invocation parameters:
                  </div>
                  <pre className="p-4 rounded-2xl bg-black border border-white/10 text-[#D4AF37] overflow-x-auto leading-relaxed">
                    {JSON.stringify(
                      {
                        jsonrpc: '2.0',
                        method: `tools/call`,
                        params: {
                          name: selectedTool.name,
                          arguments: selectedTool.sampleArgs,
                        },
                        id: 42,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}

              {activeJsonTab === 'response' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-white/50">
                    <span>
                      {executedResponse ? 'Live JSON-RPC response result:' : 'Run execute above to view live response.'}
                    </span>
                    {executedResponse && (
                      <span className="text-[#10B981] font-bold">200 OK (0.38ms)</span>
                    )}
                  </div>
                  <pre className="p-4 rounded-2xl bg-black border border-emerald-500/30 text-emerald-300 overflow-x-auto leading-relaxed">
                    {JSON.stringify(
                      {
                        jsonrpc: '2.0',
                        result: executedResponse || selectedTool.sampleResponse,
                        id: 42,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}

              {activeJsonTab === 'schema' && (
                <div className="space-y-3">
                  <div className="text-white/50 text-[11px]">
                    Declared input validation schema conforming to Model Context Protocol specification:
                  </div>
                  <pre className="p-4 rounded-2xl bg-black border border-white/10 text-white/80 overflow-x-auto leading-relaxed">
                    {JSON.stringify(selectedTool.inputSchema, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/10 bg-[#141416] flex items-center justify-between text-[11px] text-[#6E6E73]">
              <span>Transport: stdio / SSE</span>
              <span className="text-[#D4AF37]">MCP Spec v1.1.0 Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

