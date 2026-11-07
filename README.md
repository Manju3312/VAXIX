# 🧬 Immunix

> **"Your integrations, immune to vendor surprises."**

Immunix is an autonomous immune system for third-party API integrations. It detects when SaaS APIs change (schema drift, deprecations, retired endpoints) and automatically proposes a verified code fix as a pull request for human approval.

---

## 💥 The Problem

Modern software platforms rely on external SaaS APIs like **Stripe**, **OpenAI**, and **Twilio**. Upstream vendors routinely change field names, sunset endpoints, or deprecate models without warning:
- `source` ➔ `payment_method` on `/v1/charges`
- `customer_email` ➔ `email_address` on `/v1/payment_intents`
- `/v1/charges` ➔ `/v2/checkout/pay`
- `choices[0].text` ➔ `choices[0].message.content`

When this happens, customer apps begin throwing `400 Bad Request`, `404 Not Found`, or `422 Unprocessable Entity`. Payments fail, checkout breaks, and engineers scramble at 3:00 AM to diagnose the breakage and fix it by hand.

**Immunix changes this paradigm**: It detects drift early, isolates the upstream breaking change, generates a deterministic AST code fix, validates the fix in an isolated test sandbox, and opens a clean GitHub Pull Request for human review.

---

## 📖 Vocabulary

Immunix uses biological immunology metaphors to describe API change management:

| Term | Definition |
| :--- | :--- |
| **Pathogen** | A detected upstream API change (schema drift event, field rename, endpoint sunset, or type mutation). |
| **Antibody** | A verified code fix rule (e.g. deterministic AST refactoring renaming `source` to `payment_method`). |
| **Vaccine** | A signed, reviewed antibody package (designed for ecosystem sharing in later phases). |
| **Immune Log** | The tamper-evident, append-only audit trail recording every detection, probe, synthesis, and action. |

---

## 🛡️ Core Principles

1. **Safety First**: Never modify live payment or customer traffic automatically in flight.
2. **Human Approval Required**: No code merges automatically; an engineer must review and approve every Pull Request.
3. **100% Auditable & Reversible**: Every automated detection and generated patch is logged in the Immune Log.
4. **Pragmatic & Deterministic**: Built on deterministic Abstract Syntax Tree surgery (`ts-morph`) and Zod schema contracts. Zero hallucinations, zero wire hot-patching in the MVP.
5. **Zero-Leak Redaction**: Secrets, API keys (`sk_live_...`), card numbers, and PII are redacted before log persistence or PR generation.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Upstream ["Upstream SaaS APIs"]
        Stripe["Stripe Payments"]
        OpenAI["OpenAI Platform"]
        Twilio["Twilio Cloud"]
    end

    subgraph SensorLayer ["1. Sensor (Capture Layer)"]
        Proxy["Async Sensor Proxy (fetch wrapper)"]
        Redactor["Zero-Leak Redactor (secrets & PII stripped)"]
    end

    subgraph Adapters ["2. Vendor Adapters"]
        StripeAdapter["Stripe Adapter (Zod Schemas & Canary)"]
        OpenAIAdapter["OpenAI Adapter (Zod Schemas & Canary)"]
        TwilioAdapter["Twilio Adapter (Zod Schemas & Canary)"]
    end

    subgraph Detector ["3. Pathogen Detector"]
        DriftCheck["Schema Drift & Sunset Header Monitor"]
        CanaryEngine["Scheduled Canary Probe Engine"]
    end

    subgraph Repair ["4. Antibody Generator & Verifier"]
        AstGen["ts-morph AST Code Surgeon"]
        Sandbox["Ephemeral Sandbox Verifier"]
        CertSigner["Ed25519 Verification Certifier"]
    end

    subgraph Delivery ["5. PR Bot & Dashboard"]
        PrBot["Immunix PR Bot (Human Review Required)"]
        Dashboard["Immunix Dashboard & Immune Log"]
    end

    Upstream --> Proxy
    Proxy --> Redactor
    Redactor --> Adapters
    Adapters --> Detector
    Detector -- "Pathogen Event" --> AstGen
    AstGen -- "Proposed Antibody" --> Sandbox
    Sandbox -- "Pass (HTTP 200)" --> CertSigner
    CertSigner --> PrBot
    PrBot --> Dashboard
```

---

## 🧩 Components Built

### 1. Sensor (Capture Layer)
- SDK client / proxy wrapping outgoing vendor HTTP calls (`src/immunix/sensor/proxy.ts`).
- Records request shapes, response status codes, latencies, and headers asynchronously without delaying in-flight requests.
- **Zero-Leak Redactor** (`src/immunix/sensor/redactor.ts`): Strips raw API keys (`sk_live_...`, `ghp_...`, `Bearer`), credit card PANs, SSNs, and passwords before metadata storage.

### 2. Adapters
- One adapter per vendor so changes are a one-file fix (`src/immunix/adapters/`).
- Ships with production adapters for **Stripe**, **OpenAI**, and **Twilio**.
- Encapsulates expected Zod contract schemas, RFC 8594 `Sunset` and `Deprecation` header parsers, and canary probe payloads.

### 3. Pathogen Detector
- Detects `FIELD_RENAMED`, `SUNSET_HEADER`, `TYPE_MUTATION`, `FIELD_REMOVED`, and 4xx spike anomalies (`src/immunix/detector/`).
- Runs scheduled canary probes against vendor sandboxes to detect drift before users encounter errors.

### 4. Antibody Generator
- Deterministic Abstract Syntax Tree (AST) surgery powered by `ts-morph` (`src/immunix/antibody/`).
- Traverses codebase ASTs, pinpoints affected call sites, renames fields or reroutes URLs, and formats clean unified Git diffs.

### 5. Sandbox Verifier
- Executes the customer application's test suite against the vendor's test mode in an isolated environment (`src/immunix/sandbox/`).
- Issues an Ed25519 cryptographic attestation certificate upon verification (`ed25519_cert_..._verified`).

### 6. PR Bot
- Synthesizes formatted GitHub Pull Requests containing upstream evidence, unified AST diffs, test logs, and plain-English explanations (`src/immunix/pr-bot/`).
- Strict directive: **Human approval is required before merging.**

### 7. Immunix Dashboard
- Live web console (`src/app/dashboard/page.tsx`) with 5 dedicated views:
  1. **Vendor Health**: Real-time status (Green/Yellow/Red) with on-demand "Run Canary Probe" triggers.
  2. **Active Pathogens**: Detected drift events with mutation vectors and evidence payloads.
  3. **Proposed Antibodies**: Interactive unified diff viewer with compiler verification stamps.
  4. **Pull Requests**: Open PR review cards with simulated human merge actions.
  5. **Immune Log**: Tamper-evident audit trail streaming every system action.

---

## 🚀 Quickstart: Running the End-to-End Demo

Immunix includes a single-command demonstration executing the complete 8-step lifecycle:

```bash
npm run demo
```

### The 8-Step Lifecycle Verified:
1. **Mock Vendor Server Starts**: Mock Stripe server activates on port 4000.
2. **Customer App Baseline**: Sample billing service (`demo-app/src/billing.ts`) charges \$20.00 via standard test token $\rightarrow$ 3/3 tests pass.
3. **Upstream Sneeze Injected**: At 03:00 AM, Stripe deploys a breaking change (parameter `source` deprecated; `payment_method` required + Sunset header).
4. **Canary Probe Isolates Pathogen**: The canary probe catches the drift in 1 cycle without affecting customer traffic.
5. **ts-morph Synthesizes Antibody**: AST engine refactors `source: token` to `payment_method: token` in `demo-app/src/billing.ts`.
6. **Sandbox Verifier Executes**: Isolated test runner verifies the patch against the mock vendor sandbox in < 5ms.
7. **PR Bot Opens Pull Request**: PR #414 is dispatched with diff, reproduction steps, and human approval notice.
8. **Immune Log Audit**: Verifies that 100% of actions are logged and zero secrets leaked.

---

## 🧪 Testing & Verification

Run the entire test suite and production build:

```bash
# Run unit and integration verification suite
npm test

# Run ESLint compliance check (0 errors, 0 warnings)
npm run lint

# Run single-command end-to-end demo
npm run demo

# Compile production Next.js build
npm run build
```

---

## 📁 Repository Structure

```
immunix/
├── demo-app/                      # Sample customer application
│   └── src/
│       ├── billing.ts             # Customer billing service using Sensor SDK
│       └── billing.test.ts        # Customer unit tests
├── scripts/
│   ├── run-demo.mjs               # Single-command end-to-end demo runner
│   └── test-sovereign-pipeline.mjs# Test verification suite
├── src/
│   ├── app/
│   │   ├── api/immunix/           # REST API exposing vendors, pathogens, logs
│   │   ├── arena/                 # Fullscreen chaos playground workbench
│   │   ├── dashboard/             # Immunix 5-tab web dashboard
│   │   └── page.tsx               # Immunix landing page
│   └── immunix/                   # Core Immunix Monorepo Package
│       ├── adapters/              # Vendor adapters (Stripe, OpenAI, Twilio)
│       ├── antibody/              # ts-morph AST antibody generator
│       ├── detector/              # Pathogen drift detector & canary runner
│       ├── immune-log/            # Tamper-evident audit log manager
│       ├── mock-vendor/           # In-process mock SaaS vendor server
│       ├── pr-bot/                # Pull request synthesizer
│       ├── sandbox/               # Ephemeral sandbox verifier
│       └── sensor/                # Async capture proxy & zero-leak redactor
├── package.json
└── README.md
```

---

## 📜 License & Compliance

Built for sovereign-grade enterprise infrastructure. Licensed under the MIT License.
