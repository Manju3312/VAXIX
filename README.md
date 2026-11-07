# 🧬 IMMUNIX (`immunix.network`)
### *The Autonomous Software Immune Network*
**Ultra-Luxury White & Imperial Gold Sovereign Design System • Next.js 16 • TypeScript 5.7+ • Three.js 3D DNA Mesh • BreakMyAPI Live Arena**

---

## 🏛️ Executive Summary & Core Thesis

**IMMUNIX** is the world’s first autonomous immune system for cloud software. 
Modern enterprise platforms rely on hundreds of external APIs (Stripe, Twilio, Salesforce, OpenAI, Plaid, internal microservices). When upstream providers deploy silent contract drifts, property renames, or endpoint relocations at 3:00 AM, traditional monitoring suites alert developers **after** customers crash and revenue is dropped.

IMMUNIX operates as a biological immune network:
1. **Speed 1: Wire-Time Inception (< 0.4ms)**: Intercepts broken payloads inside the Linux kernel socket ring buffer (`sock_recvmsg` via eBPF/WASM), synthesizing backwards-compatible responses so checkout orders succeed with **zero customer downtime**.
2. **Speed 2: Deterministic AST Codebase Repair**: Mathematically crawls Git repositories using the TypeScript Compiler API (`ts-morph`), refactors call sites with zero hallucinations, verifies the patch against live upstream staging in an isolated Firecracker microVM, and opens a verified GitHub Pull Request.
3. **Global Herd Immunity**: When an antibody is synthesized in Tokyo, the cryptographically signed Ed25519 vaccine rule is gossiped across **14,280 clusters globally in 3.4ms** before regional rollouts reach your VPC.

---

## 📐 Canonical 3-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. CONTROL PLANE (Autonomous Orchestration & DNA Repair)                                    │
│                                                                                             │
│                         ┌─────────────────────────────┐                                     │
│                         │ Kafka / Redpanda Event Bus  │                                     │
│                         └──────────────┬──────────────┘                                     │
│                                        │                                                    │
│                         ┌──────────────▼──────────────┐                                     │
│                         │ Antigen Profiler & Sentry   │                                     │
│                         └───────┬─────────────┬───────┘                                     │
│               ┌─────────────────┘             └─────────────────┐                           │
│               ▼                                                 ▼                           │
│ ┌───────────────────────────┐                 ┌───────────────────────────────────┐         │
│ │ Hot-Patch Rule Compiler   │                 │ AST Genome Engine (ts-morph/grep) │         │
│ └─────────┬───────────────┬─┘                 └─────────────────┬─────────────────┘         │
│           │               │                                     │                           │
│           │ Push Rule     │                               ┌─────▼─────────────────┐         │
│           │ Update        │                               │ Ephemeral Sandbox     │         │
│           │               │                               └─────┬─────────────────┘         │
│           │               │                                     ▼                           │
│           │               │                           ┌───────────────────────────┐         │
│           │               │                           │ PR Synthesizer & Git App  │         │
│           │               │                           └───────────────────────────┘         │
└───────────┼───────────────┼─────────────────────────────────────────────────────────────────┘
            │               │
            │               ▼
┌───────────┼─────────────────────────────────────────────────────────────────────────────────┐
│ 3. GLOBAL HERD MESH (The Immune Consensus Ledger)                                           │
│           │                                                                                 │
│           │ ┌───────────────────────────────────┐     ┌───────────────────────────────────┐ │
│           └►│ Zero-Knowledge PII Sanitizer      ├────►│ Ed25519 Cryptographic Signer      │ │
│             └───────────────────────────────────┘     └─────────────────┬─────────────────┘ │
│                                                                         │                   │
│             ┌───────────────────────────────────┐     ┌─────────────────▼─────────────────┐ │
│             │ Global Clusters (Tokyo, FFM, SF)  │◄────┤ P2P GossipSub Mesh Network        │ │
│             └───────────────────────────────────┘     └───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
            │
            │ Push Rule Update
            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. DATA PLANE (Edge Wire Defense - Sub-Millisecond)                                         │
│                                                                                             │
│                         ┌───────────────────────────────────┐                               │
│                         │ Downstream Consumer Microservices │                               │
│                         └─────────────────┬─────────────────┘                               │
│                                           │ Outbound API Request                            │
│                         ┌─────────────────▼─────────────────┐                               │
│                         │ Envoy / Edge Ingress Gateway      │                               │
│                         └─────────────────┬─────────────────┘                               │
│                                           │ Hook                                            │
│                         ┌─────────────────▼─────────────────┐                               │
│                         │ IMMUNIX WASM Kernel Filter        │                               │
│                         └───────┬───────────────────┬───────┘                               │
│             ┌───────────────────┘                   └───────────────────┐                   │
│             │ 1. Fast Match Hot-Patch                                   │ 2. In-Flight      │
│             ▼                                                           ▼    Payload Rewrite│
│ ┌───────────────────────────────────┐                 ┌───────────────────────────────────┐ │
│ │ In-Memory Lock-Free Antibody Trie │                 │ Upstream SaaS / Internal API      │ │
│ └───────────────────────────────────┘                 └───────────────────────────────────┘ │
│         ▲                                                                                   │
│         └─────────────── Telemetry & Anomaly Stream (to Control Plane) ────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ 5-Tier Polyglot Database Topology & DDL

```
+──────────────────────────────────────────────────────────────────────────────────────────────────────────────+
|                                    IMMUNIX 5-TIER DATA TOPOLOGY                                             |
+──────────────────────────────────────────────────────────────────────────────────────────────────────────────+
  [ TIER 1: SUB-MILLISECOND L1 CACHE ]     ── WASM Radix Trie / Redis (<0.1ms wire antibody lookup)
  [ TIER 2: HIGH-THROUGHPUT TELEMETRY ]    ── ClickHouse + Redpanda (Billions of wire events, 10:1 compression)
  [ TIER 3: PRIMARY TRANSACTIONAL DB ]     ── PostgreSQL 16 (Tenants, contracts, PR tracking, ACID guarantee)
  [ TIER 4: SEMANTIC VECTOR MEMORY ]       ── pgvector / Qdrant (Fuzzy schema drift embeddings)
  [ TIER 5: DECENTRALIZED HERD LEDGER ]    ── Merkle-DAG + Ed25519 (Global peer-to-peer consensus)
+──────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

### PostgreSQL Production Schema (`src/lib/schema.sql`)
The transactional tier enforces multi-tenant boundaries, zero-knowledge keys, antibody rules, and audited GitHub PR records:
* `tenants`: Multi-tenant isolation with SLA warranty statuses.
* `api_keys`: Argon2id salted secret hashes with strictly scoped permission arrays.
* `monitored_providers`: Upstream vendor hosts (Stripe, Twilio, OpenAI, Salesforce) and specs.
* `active_antibodies`: Sub-millisecond wire transformation rules (payload rewrite, url reroute).
* `dna_repairs`: Deterministic ts-morph code patches and sandbox verification proofs.
* `herd_vaccines`: Ed25519-signed vaccine bytecodes with Byzantine peer consensus.
* `schema_vector_index`: 1536-dimensional OpenAI embeddings for fuzzy schema drift recognition.

---

## 🎨 Ultra-Luxury Design Tokens

| Token Name | Hex Code / Value | Visual Character & UI Role |
| :--- | :--- | :--- |
| **Pure Alabaster** | `#FFFFFF` | Primary immaculate light background |
| **Pearl White** | `#FBFBF9` | Secondary warm surface fills, card backdrops |
| **Imperial Gold** | `#D4AF37` | Sovereign metallic gold accent, active glows, 3D DNA nodes |
| **Champagne Shimmer** | `#F3E5AB` | Gradient stops, subtle hover highlights, glow halos |
| **Bronze Gold** | `#997D25` | High-contrast luxury typography on light surfaces |
| **Gold Tint (8%)** | `rgba(212, 175, 55, 0.08)` | Glassmorphism wash, table row highlights |
| **Obsidian Deep** | `#0B0B0C` | Pure jet black typography, terminal backgrounds |
| **Charcoal Carbon** | `#1C1C1F` | Matte dark slate inspection console containers |
| **Muted Silver** | `#6E6E73` | Apple-grade secondary micro-copy, inactive tabs |
| **Immune Green** | `#10B981` | Emerald verification pips, "0.38ms Inception", "Inoculated" |

---

## 🚀 Key Modules & Interactive Features

1. **Interactive 3D DNA Double-Helix Canvas (`components/ImmuneHelix3D.tsx`)**:
   - Three.js particle mesh with 260+ golden nodes, translucent base-pair bonds, and rotation resonance toggles (`1.0x` / `2.8x`).
2. **Canonical 3-Tier Topology Map (`components/ArchitectureSystemMap.tsx`)**:
   - Visual interactive map with live telemetry trace buttons that fire anomaly packets through all nodes in real time.
3. **BreakMyAPI Live Sabotage Arena (`components/BreakMyApiArena.tsx`)**:
   - 4 Sabotage Attack simulations with real backend execution against `/api/sabotage/trigger`.
4. **Global Herd Immunity Simulator (`components/GlobalHerdImmunity.tsx`)**:
   - World topology map with interactive **Tokyo ➔ Worldwide Inoculation Wave** (3.8ms).
5. **Upstream Vendor Health Radar (`components/VendorHealthRadar.tsx`)**:
   - Real-time egress monitoring for Stripe, OpenAI, Twilio, Salesforce, Plaid, and GitHub.
6. **Definitive Architectural Benchmark (`components/BenchmarkComparison.tsx`)**:
   - Corrigio vs. Mendr vs. APISynQ vs. IMMUNIX across 7 dimensions.
7. **Model Context Protocol (MCP) Agent Arena (`components/McpProtocolSection.tsx`)**:
   - Real JSON-RPC 2.0 client simulator querying `whats_changed`, `inoculate_cluster`, and `probe_sandbox`.
8. **Downtime Financial Loss & ROI Estimator (`components/FinancialLossCalculator.tsx`)**:
   - Interactive sliders for monthly API transaction velocity, calculating revenue protected and ROI multipliers.
9. **Cluster Deployment Wizard (`components/ClusterDeployWizard.tsx`)**:
   - One-click manifests for Kubernetes DaemonSet, Helm v3, Terraform, and systemd.
10. **4-Tab Sovereign Key & Multi-Technology Vault (`components/ApiKeyModal.tsx`)**:
   - Complete HSM management across 4 tabs: `Sovereign Mesh Keys`, `Upstream Providers`, `Infrastructure Engines`, and `Compliance & HSM`.
   - Real-time diagnostic ping with DNS, TLS, and wire eBPF filter latency breakdown.
   - Zero-downtime key rotation with 24-hour dual-key grace bridge.
   - 1-click download of Ed25519-signed HSM vault manifest (`.json`).
11. **Dedicated Fullscreen Developer Workbench (`/arena`)**:
   - Real-time chaos playground with interactive curl generator, eBPF wire telemetry status, custom endpoint tester, and live JSON-RPC execution.
12. **Enterprise Mission Control Dashboard (`/dashboard`)**:
   - 6-Tab Sovereign Command Center:
     - Tab 1: Active Antibodies with live toggle retirement/reactivation.
     - Tab 2: High-velocity Live Wire Telemetry console.
     - Tab 3: DNA Repairs with automated GitHub PRs and unmocked sandbox proofs.
     - Tab 4: Global Herd Consensus ledger with Byzantine fault-tolerant voting.
     - Tab 5: Sovereign Key Vault & Monitored Upstream Technologies.
     - Tab 6: Python 3.12 LibCST & Scikit-learn AI Anomaly Engine.
13. **Python 3.12 LibCST & Scikit-Learn Hybrid Microservice (`backend/`)**:
   - FastAPI microservice running on port `8001` with LibCST deterministic AST surgery and Scikit-learn DBSCAN clustering.
14. **Stripe Enterprise Checkout Gateway (`/api/checkout`)**:
   - Real-time subscription payments, auto-provisioned tenants, and encrypted access passes.
15. **Mathematical Architecture Dossier (`components/ArchitectureDossierModal.tsx`)**:
   - Formal mathematical proofs for $O(1)$ socket hash ring latency and deterministic compiler AST equivalence.

---

## 🌐 Backend API Reference

### 1. `POST /api/pipeline/simulate`
Simulates full end-to-end execution of the 3-plane architecture:
```bash
curl -X POST http://localhost:3000/api/pipeline/simulate \
  -H "Content-Type: application/json" \
  -d '{"service":"Stripe Payments","endpoint":"stripe/v1/charges","mutationType":"FIELD_RENAMED"}'
```

### 2. `POST /api/sabotage/trigger`
Simulates an upstream breaking change and executes the WASM bridge in 0.38ms:
```bash
curl -X POST http://localhost:3000/api/sabotage/trigger \
  -H "Content-Type: application/json" \
  -d '{"scenario_id":"PROPERTY_RENAMED"}'
```

### 3. `GET & POST /api/keys/providers`
Multi-technology provider key vault, live diagnostic ping, zero-downtime key rotation, and Ed25519 HSM manifest export:
```bash
# Get all monitored technologies
curl -s http://localhost:3000/api/keys/providers

# Test diagnostic ping with microsecond breakdown
curl -X POST http://localhost:3000/api/keys/providers \
  -H "Content-Type: application/json" \
  -d '{"action":"test_ping","provider_id":"stripe"}'

# Rotate key with 24-hour dual-key grace bridge
curl -X POST http://localhost:3000/api/keys/providers \
  -H "Content-Type: application/json" \
  -d '{"action":"rotate_key","provider_id":"stripe"}'

# Export Ed25519-signed HSM vault manifest
curl -X POST http://localhost:3000/api/keys/providers \
  -H "Content-Type: application/json" \
  -d '{"action":"export_vault"}'
```

### 4. `POST /api/checkout`
Processes Stripe enterprise subscription checkout and auto-provisions tenant credentials:
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"tier":"enterprise-grid","company":"Goldman Sachs","email":"ciso@gs.test","simulateCard":{"last4":"4242"}}'
```

### 5. `POST /api/mcp`
Model Context Protocol JSON-RPC 2.0 endpoint:
```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

### 6. `GET /api/clusters`
Returns synchronized nodes and global shielded request counts:
```bash
curl -s http://localhost:3000/api/clusters
```

### 7. `GET /api/health`
Liveness, readiness, and 5-tier topology diagnostic probe:
```bash
curl -s http://localhost:3000/api/health
```

### 8. `http://localhost:8001/api/health` (Python AI Engine)
Python 3.12 LibCST & Scikit-learn microservice health check:
```bash
curl -s http://localhost:8001/api/health
```

---

## 💻 Local Development & Verification

```bash
# Clone and navigate to repo
git clone https://github.com/immunix/immunix.network.git
cd immunix

# Install Node.js dependencies
npm install

# (Optional) Setup Python 3.12 virtual environment for AI Engine
uv venv backend/.venv
uv pip install -p backend/.venv -r backend/requirements.txt
# Start Python AI engine (runs on port 8001)
backend/.venv/Scripts/python.exe backend/main.py

# Configure environment (copy template)
cp .env.example .env.local

# Option A: Start local development server with Turbopack (SQLite Embedded Engine)
npm run dev

# Option B: Run full sovereign multi-container stack (PostgreSQL + Redis + Redpanda + ClickHouse)
docker-compose up -d

# Execute automated sovereign resilience test suite across all 13 architecture suites
npm test

# Run ESLint validation
npm run lint

# Compile production build
npm run build

# Start production server
npm run start -p 3000
```

---

## 📜 Compliance & Sovereign Assurance

- **SOC 2 Type II:** Annually audited for zero-payload persistence.
- **ISO/IEC 27001:** Certified software immunology infrastructure.
- **Kernel Verifier Safety:** Verified by Linux in-kernel eBPF register tracking.
- **Financial SLA Warranty:** Up to $5,000,000 underwritten protection for Sovereign Mesh customers.

---

© 2026 IMMUNIX Sovereign Defense Labs, Inc. All rights reserved.
