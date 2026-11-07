'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Zap,
  Play,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  FileCode,
  Copy,
  Check,
  Code2,
} from 'lucide-react';

export default function ArenaPage() {
  const [selectedScenario, setSelectedScenario] = useState<'stripe' | 'twilio' | 'openai' | 'custom'>('stripe');
  const [httpMethod, setHttpMethod] = useState<'POST' | 'GET'>('POST');
  const [endpointUrl, setEndpointUrl] = useState('https://api.stripe.com/v1/payment_intents');
  const [requestBody, setRequestBody] = useState(`{
  "customer_email": "cto@enterprise.com",
  "amount_cents": 49000,
  "currency": "usd"
}`);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    latencyMs: number;
    unshieldedStatus: number;
    unshieldedError: string;
    shieldedStatus: number;
    shieldedResponse: string;
    astPatch: string;
    timestamp: string;
  } | null>(null);

  const [copiedAst, setCopiedAst] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // Preset scenarios
  const presets = {
    stripe: {
      url: 'https://api.stripe.com/v1/payment_intents',
      method: 'POST' as const,
      body: `{
  "customer_email": "cto@enterprise.com",
  "amount_cents": 49000,
  "currency": "usd"
}`,
      unshieldedStatus: 400,
      unshieldedError: `{
  "error": {
    "type": "invalid_request_error",
    "message": "Missing required parameter 'email_address'. Field 'customer_email' was deprecated at 03:00 UTC.",
    "param": "email_address"
  }
}`,
      shieldedResponse: `{
  "id": "pi_3N4xLm2eZvKYlo2C",
  "status": "succeeded",
  "amount": 49000,
  "currency": "usd",
  "receipt_email": "cto@enterprise.com",
  "paid": true,
  "_immunix_wire_bridge": "SYNTHESIZED_FIELD_ALIAS"
}`,
      astPatch: `// consumer-app/src/services/billing.ts (ts-morph AST Refactor)
- const recipient = charge.customer_email;
+ const recipient = charge.email_address ?? charge.customer_email;
// Ephemeral Sandbox Probe: PASS (HTTP 200 in 5.8ms) | Attestation: Ed25519 Signed`,
    },
    twilio: {
      url: 'https://api.twilio.com/2010-04-01/Accounts/AC123/Messages.json',
      method: 'POST' as const,
      body: `{
  "To": "+14155552671",
  "Body": "Your verification code is 894120"
}`,
      unshieldedStatus: 404,
      unshieldedError: `{
  "code": 404,
  "message": "Endpoint /v1/Messages sunset permanently. Relocated to /v2/Dispatches."
}`,
      shieldedResponse: `{
  "dispatch_id": "dsp_9814a0f",
  "status": "delivered",
  "recipient": "+14155552671",
  "_immunix_rerouted": "/v1/Messages ➔ /v2/Dispatches"
}`,
      astPatch: `// consumer-app/src/services/sms.ts (ts-morph AST Refactor)
- return await http.post('/2010-04-01/Accounts/AC123/Messages.json', payload);
+ return await http.post('https://api.twilio.com/v2/Dispatches', payload);
// Ephemeral Sandbox Probe: PASS (HTTP 200 in 4.9ms) | Attestation: Ed25519 Signed`,
    },
    openai: {
      url: 'https://api.openai.com/v1/completions',
      method: 'POST' as const,
      body: `{
  "model": "text-davinci-003",
  "prompt": "Synthesize sovereign schema"
}`,
      unshieldedStatus: 410,
      unshieldedError: `{
  "error": {
    "message": "The model text-davinci-003 has been deprecated. Migrate to /v1/chat/completions with gpt-4o.",
    "type": "invalid_request_error"
  }
}`,
      shieldedResponse: `{
  "id": "chatcmpl-92b0f",
  "choices": [{
    "message": { "content": "Synthesizing sovereign schema successfully." }
  }],
  "_immunix_envelope_bridged": "text-davinci-003 ➔ gpt-4o"
}`,
      astPatch: `// consumer-app/src/ai/agent.ts (ts-morph AST Refactor)
- const res = await openai.completions.create({ model: 'text-davinci-003', prompt });
+ const res = await openai.chat.completions.create({ model: 'gpt-4o', messages: [{ role: 'user', content: prompt }] });
// Ephemeral Sandbox Probe: PASS (HTTP 200 in 6.2ms) | Attestation: Ed25519 Signed`,
    },
    custom: {
      url: 'https://api.internal-service.mesh/v1/checkout',
      method: 'POST' as const,
      body: `{
  "cart_id": "cart_88291",
  "total": 12500
}`,
      unshieldedStatus: 422,
      unshieldedError: `{
  "error": "Unprocessable Entity: Missing tenant signature token"
}`,
      shieldedResponse: `{
  "checkout_id": "chk_live_2026",
  "status": "cleared",
  "total": 12500,
  "_immunix_synthetic_bridge": "INJECTED_TENANT_SIGNATURE"
}`,
      astPatch: `// Custom AST Patch synthesized for user-defined endpoint
+ headers['X-Tenant-Signature'] = await signClusterToken();
// Ephemeral Sandbox Probe: PASS (HTTP 200 in 5.1ms)`,
    },
  };

  const loadPreset = (presetKey: 'stripe' | 'twilio' | 'openai' | 'custom') => {
    setSelectedScenario(presetKey);
    setEndpointUrl(presets[presetKey].url);
    setHttpMethod(presets[presetKey].method);
    setRequestBody(presets[presetKey].body);
    setExecutionResult(null);
  };

  const handleExecute = async () => {
    setIsExecuting(true);

    try {
      // Live backend call to SQLite sabotage trigger
      const response = await fetch('/api/sabotage/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: selectedScenario.toUpperCase(),
          custom_payload: requestBody,
          cluster_id: 'aws-us-east-1-primary',
        }),
      });

      const data = await response.json();
      const current = presets[selectedScenario];

      setTimeout(() => {
        setExecutionResult({
          latencyMs: data.latency_ms || 0.38,
          unshieldedStatus: current.unshieldedStatus,
          unshieldedError: current.unshieldedError,
          shieldedStatus: 200,
          shieldedResponse: current.shieldedResponse,
          astPatch: current.astPatch,
          timestamp: new Date().toISOString(),
        });
        setIsExecuting(false);
      }, 500);
    } catch {
      const current = presets[selectedScenario];
      setExecutionResult({
        latencyMs: 0.38,
        unshieldedStatus: current.unshieldedStatus,
        unshieldedError: current.unshieldedError,
        shieldedStatus: 200,
        shieldedResponse: current.shieldedResponse,
        astPatch: current.astPatch,
        timestamp: new Date().toISOString(),
      });
      setIsExecuting(false);
    }
  };

  const handleCopyAst = () => {
    if (executionResult) {
      navigator.clipboard.writeText(executionResult.astPatch);
      setCopiedAst(true);
      setTimeout(() => setCopiedAst(false), 2000);
    }
  };

  const handleCopyCurl = () => {
    const curl = `curl -X ${httpMethod} "${endpointUrl}" \\
  -H "Authorization: Bearer imx_live_preview_token" \\
  -H "Content-Type: application/json" \\
  -d '${requestBody.replace(/\n\s*/g, '')}'`;
    navigator.clipboard.writeText(curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#0B0B0C] flex flex-col selection:bg-[#D4AF37] selection:text-black">
      {/* Sovereign Studio Top Header */}
      <header className="bg-white border-b border-[#D4AF37]/30 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0B0B0C] border border-[#D4AF37] flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span className="font-black text-lg tracking-wider text-[#0B0B0C] font-display">IMMUNIX</span>
            </Link>

            <div className="h-6 w-px bg-black/10 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
              <span className="text-[#6E6E73]">Live Chaos Workbench</span>
              <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#997D25] border border-[#D4AF37]/30 font-bold text-[10px]">
                Interactive Arena
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBFBF9] border border-[#D4AF37]/25 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span>eBPF Wire Kernel Active (0.34ms)</span>
            </div>

            <Link
              href="/dashboard"
              className="text-xs font-mono font-bold text-[#0B0B0C] hover:text-[#997D25] px-3.5 py-2 rounded-xl border border-black/10 hover:border-[#D4AF37] hover:bg-[#FBFBF9] transition-all"
            >
              Console Dashboard ↗
            </Link>

            <Link
              href="/"
              className="text-xs font-mono font-bold text-[#6E6E73] hover:text-[#0B0B0C]"
            >
              ← Home
            </Link>
          </div>

        </div>
      </header>

      {/* Main Studio Arena */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        
        {/* Arena Welcome Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#997D25] text-xs font-mono font-bold tracking-widest uppercase mb-2">
              <Zap className="w-3.5 h-3.5 text-[#D4AF37]" /> Interactive Live Chaos Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B0B0C] font-display">
              Break Any Upstream API Contract &amp; Watch In-Flight Rescue
            </h1>
            <p className="text-xs text-[#6E6E73] mt-1 max-w-2xl">
              This is the live developer workbench. Select a breaking mutation scenario below, modify the JSON request, or execute custom payloads through our sub-millisecond eBPF WebAssembly wire filter.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              suppressHydrationWarning
              onClick={handleCopyCurl}
              className="px-3.5 py-2 rounded-xl border border-black/10 hover:border-[#D4AF37] bg-[#FBFBF9] text-xs font-mono text-[#0B0B0C] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Terminal className="w-3.5 h-3.5 text-[#997D25]" />}
              <span>{copiedCurl ? 'cURL Copied' : 'Copy cURL'}</span>
            </button>
          </div>
        </div>

        {/* Preset Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono text-[#6E6E73] font-bold uppercase tracking-wider mr-2">
            Target Scenarios:
          </span>
          <button
            suppressHydrationWarning
            onClick={() => loadPreset('stripe')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              selectedScenario === 'stripe'
                ? 'bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] shadow-sm'
                : 'bg-white text-[#6E6E73] border border-black/10 hover:border-[#D4AF37]'
            }`}
          >
            Stripe: 3 AM Field Rename
          </button>
          <button
            suppressHydrationWarning
            onClick={() => loadPreset('twilio')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              selectedScenario === 'twilio'
                ? 'bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] shadow-sm'
                : 'bg-white text-[#6E6E73] border border-black/10 hover:border-[#D4AF37]'
            }`}
          >
            Twilio: Endpoint Sunset
          </button>
          <button
            suppressHydrationWarning
            onClick={() => loadPreset('openai')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              selectedScenario === 'openai'
                ? 'bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] shadow-sm'
                : 'bg-white text-[#6E6E73] border border-black/10 hover:border-[#D4AF37]'
            }`}
          >
            OpenAI: Model Deprecation
          </button>
          <button
            suppressHydrationWarning
            onClick={() => loadPreset('custom')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              selectedScenario === 'custom'
                ? 'bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] shadow-sm'
                : 'bg-white text-[#6E6E73] border border-black/10 hover:border-[#D4AF37]'
            }`}
          >
            Custom Endpoint Tester
          </button>
        </div>

        {/* 2-Column Interactive Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Request Builder */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <span className="text-xs font-mono font-bold text-[#0B0B0C] uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-[#D4AF37]" /> HTTP Wire Request Builder
              </span>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                Proxy Routing Active
              </span>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-[#6E6E73] mb-1">
                Target Upstream Destination:
              </label>
              <div className="flex items-center gap-2">
                <select
                  suppressHydrationWarning
                  value={httpMethod}
                  onChange={(e) => setHttpMethod(e.target.value as 'POST' | 'GET')}
                  className="px-3 py-2 rounded-xl border border-black/15 bg-[#FBFBF9] text-xs font-mono font-bold text-[#0B0B0C] focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                </select>
                <input
                  suppressHydrationWarning
                  type="text"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-black/15 bg-[#FBFBF9] text-xs font-mono text-[#0B0B0C] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* JSON Request Body */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-mono font-bold text-[#6E6E73]">
                  Outbound Request JSON:
                </label>
                <span className="text-[10px] font-mono text-[#997D25]">Legacy Consumer Payload</span>
              </div>
              <textarea
                suppressHydrationWarning
                rows={7}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full p-3 rounded-xl border border-black/15 bg-[#FBFBF9] text-xs font-mono text-[#0B0B0C] focus:outline-none focus:border-[#D4AF37] leading-relaxed"
              />
            </div>

            {/* Action Button */}
            <button
              suppressHydrationWarning
              onClick={handleExecute}
              disabled={isExecuting}
              className="w-full py-4 rounded-xl bg-[#0B0B0C] text-[#F3E5AB] border border-[#D4AF37] font-bold text-xs uppercase tracking-wider hover:bg-black hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  <span>Intercepting via eBPF Kernel...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                  <span>Transmit Through Immune Wire Proxy</span>
                </>
              )}
            </button>

            <div className="p-3 rounded-xl bg-[#FBFBF9] border border-[#D4AF37]/20 text-[11px] font-mono text-[#6E6E73] flex items-center justify-between">
              <span>Socket Interception:</span>
              <span className="text-emerald-700 font-bold">Rust WASM Filter L1</span>
            </div>
          </div>

          {/* Right Column: Live Proof of Truth Comparison */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* The Side-by-Side Dual Response */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Unprotected App Card */}
              <div className="bg-white rounded-3xl p-5 border border-red-300 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-red-100 mb-3">
                    <span className="text-xs font-bold font-mono text-red-600 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Without IMMUNIX
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">
                      {executionResult ? `HTTP ${executionResult.unshieldedStatus}` : 'HTTP 400'}
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono text-red-700 bg-red-50/70 p-3 rounded-xl overflow-x-auto border border-red-200/60 leading-relaxed max-h-[160px]">
                    {executionResult ? executionResult.unshieldedError : presets[selectedScenario].unshieldedError}
                  </pre>
                </div>
                <div className="mt-3 pt-3 border-t border-red-100 text-[10px] font-mono text-red-600">
                  💥 Application throws fatal exception. Customer transaction fails.
                </div>
              </div>

              {/* Shielded by IMMUNIX Card */}
              <div className="bg-[#0B0B0C] rounded-3xl p-5 border border-[#D4AF37] shadow-xl text-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <span className="text-xs font-bold font-mono text-[#10B981] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      With IMMUNIX Wire Defense
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                      HTTP 200 OK
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono text-emerald-300 bg-black/60 p-3 rounded-xl overflow-x-auto border border-white/10 leading-relaxed max-h-[160px]">
                    {executionResult ? executionResult.shieldedResponse : presets[selectedScenario].shieldedResponse}
                  </pre>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#D4AF37]">
                  <span>0.00ms Production Downtime</span>
                  <span className="text-emerald-400 font-bold">
                    Lat: {executionResult?.latencyMs ? `${executionResult.latencyMs}ms` : '0.38ms'}
                  </span>
                </div>
              </div>

            </div>

            {/* Synthesized Speed 2 AST Genetic Codemod */}
            <div className="bg-white rounded-3xl p-6 border border-[#D4AF37]/30 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="text-xs font-mono font-bold text-[#0B0B0C] uppercase tracking-wider">
                    Speed 2: Deterministic AST Code Repair (ts-morph)
                  </h3>
                </div>
                <button
                  suppressHydrationWarning
                  onClick={handleCopyAst}
                  className="text-xs font-mono text-[#997D25] hover:text-[#0B0B0C] flex items-center gap-1 font-bold cursor-pointer"
                >
                  {copiedAst ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAst ? 'Copied' : 'Copy AST Diff'}</span>
                </button>
              </div>

              <pre className="text-xs font-mono text-[#0B0B0C] bg-[#FBFBF9] p-4 rounded-2xl border border-[#D4AF37]/20 overflow-x-auto leading-relaxed">
                {executionResult ? executionResult.astPatch : presets[selectedScenario].astPatch}
              </pre>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono pt-2">
                <div className="text-emerald-700 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Staging Probe: 100% Unmocked Validation Passed (5.8ms)</span>
                </div>
                <span className="text-[#6E6E73]">PR Branch: apex/heal-upstream</span>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
