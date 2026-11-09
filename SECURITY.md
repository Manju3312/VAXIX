# 🛡️ VAXIX Sovereign Security & Cryptographic Disclosure

**Classification:** Enterprise Sovereign Cloud Standard  
**Published by:** VAXIX Sovereign Defense Labs (`vaxix.network`)  
**Audited Against:** SOC 2 Type II, ISO/IEC 27001, FIPS 140-3, FIPS 186-5  

---

## 1. Zero-Knowledge Credential Policy

VAXIX enforces an absolute **Zero-Storage Architecture** for third-party upstream credentials:

1. **Zero Upstream Secret Persistence:**
   - Client secrets for external vendors (Stripe `sk_live_...`, Twilio Auth Tokens, OpenAI API keys, Salesforce OAuth refresh tokens) are **never written to disk, persistent databases, or logs**.
   - Outbound requests pass through the VAXIX eBPF socket interceptor via ephemeral Linux kernel ring buffers (`sock_recvmsg`), applying payload transformations entirely in volatile memory before releasing packets to user-space.

2. **Client Platform Key Vault:**
   - Platform keys (`imx_live_...` and `imx_test_...`) are salted with cryptographically secure random bytes and hashed using **Argon2id** (Memory: 64MB, Iterations: 3, Parallelism: 4) conforming to OWASP Password Storage standards.
   - Only key prefixes (e.g. `imx_live_sec_789...`) are stored in plaintext for administrative identification in the console.

3. **Short-Lived GitHub App Tokens:**
   - Speed 2 AST codebase repairs authenticate against customer Git repositories using ephemeral GitHub Installation Access Tokens with a maximum 60-minute time-to-live (TTL), strictly scoped to `contents:write` and `pull_requests:write`.

---

## 2. Asymmetric Cryptographic Herd Consensus (Ed25519)

When an enterprise cluster synthesizes a novel biological antibody rule:

1. **PII Redaction Sanitizer:**
   - Prior to gossiping, the rule payload is processed by the Zero-Knowledge Sanitizer, stripping all client headers, authorization bearer tokens, customer cookies, and IP addresses, preserving strictly the abstract AST schema grammar.
2. **Ed25519 Digital Signatures:**
   - The sanitized bytecode is hashed with SHA-256 and signed with the origin cluster's hardware-backed **Ed25519** private key (Curve25519 / RFC 8032).
3. **Byzantine Fault Tolerant Peer-to-Peer Consensus:**
   - Nodes in the peer-to-peer GossipSub mesh (Tokyo, Frankfurt, London, San Francisco) independently verify the Ed25519 signature against the cluster's public key registry. Malicious, malformed, or poisoned rules are mathematically rejected before execution.

---

## 3. Vulnerability Reporting & Bug Bounty

To report security vulnerabilities or request cryptographic verification certificates, contact our sovereign security team:

* **Security Ingestion Endpoint:** `security@vaxix.network`
* **PGP Key Fingerprint:** `4A9F B120 73EC 991D 002B  8F3E 5D14 C8A9 E200 48B1`
* **SLA for Critical Disclosures:** Initial response within **2 hours**; fix deployment within **24 hours**.

