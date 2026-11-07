-- ==============================================================================
-- IMMUNIX 5-TIER DATA TOPOLOGY: TIER 3 & 4 POSTGRESQL 16 SCHEMA
-- Enterprise Sovereign Cloud Architecture (pgvector + crypto + uuid-ossp)
-- Standard: RFC-9457 Problem Details & NIST SP 800-207 Zero Trust
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ------------------------------------------------------------------------------
-- 1. Multi-Tenant Isolation & SLAs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tier VARCHAR(50) DEFAULT 'growth' CHECK (tier IN ('open-core', 'growth', 'enterprise-grid', 'sovereign-mesh')),
    sla_warranty_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. Zero-Knowledge API Keys (Argon2id Salted Hashes Only)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    key_prefix VARCHAR(16) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    tier VARCHAR(50) DEFAULT 'growth',
    rate_limit_rpm INT DEFAULT 6000,
    requests_count BIGINT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. Monitored Third-Party Upstream Providers (Stripe, Twilio, OpenAI, Salesforce)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS monitored_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider_name VARCHAR(100) NOT NULL,
    target_host VARCHAR(255) NOT NULL,
    spec_type VARCHAR(50) DEFAULT 'openapi3',
    last_health_status VARCHAR(50) DEFAULT 'healthy',
    latency_p99_ms NUMERIC(6, 2) DEFAULT 0.38,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. Speed 1: Active Wire Antibodies (<0.8ms In-Flight Transformation Rules)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS active_antibodies (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES monitored_providers(id) ON DELETE CASCADE,
    antigen_signature VARCHAR(128) NOT NULL,
    rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN ('payload_rewrite', 'url_reroute', 'header_transform', 'synthetic_mock')),
    source_pattern JSONB NOT NULL,
    target_mutation JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'evaluating', 'retired', 'failed')),
    in_flight_rescues_count BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. Antibodies Registry (Legacy/Convenience View for UI & Tests)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS antibodies (
    id VARCHAR(64) PRIMARY KEY,
    target_vendor VARCHAR(100) NOT NULL,
    mutation_type VARCHAR(50) NOT NULL,
    original_schema TEXT NOT NULL,
    healed_schema TEXT NOT NULL,
    ast_patch TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'VERIFIED_GREEN',
    shielded_reqs BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. Speed 2: Permanent Codebase AST Repairs (ts-morph / GitHub PR Engine)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dna_repairs (
    id VARCHAR(64) PRIMARY KEY,
    antibody_id VARCHAR(64) NOT NULL,
    repository_url VARCHAR(500) NOT NULL,
    target_branch VARCHAR(100) DEFAULT 'main',
    pr_number INT,
    pr_url TEXT,
    ast_diff_summary TEXT NOT NULL,
    sandbox_verification_status VARCHAR(50) DEFAULT 'pending' CHECK (sandbox_verification_status IN ('pending', 'passed', 'failed')),
    sandbox_latency_ms NUMERIC(8, 2) DEFAULT 18.5,
    cryptographic_certificate VARCHAR(255),
    merged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. Tier 5: Decentralized Herd Immunity Ledger (Ed25519 Signed Byzantine Consensus)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS herd_vaccines (
    id VARCHAR(64) PRIMARY KEY,
    vaccine_hash VARCHAR(128) UNIQUE NOT NULL,
    origin_region VARCHAR(50) NOT NULL,
    target_host VARCHAR(255) NOT NULL,
    antigen_pattern JSONB NOT NULL,
    antibody_bytecode BYTEA NOT NULL,
    ed25519_signature VARCHAR(255) NOT NULL,
    consensus_peer_votes INT DEFAULT 14280,
    is_globally_approved BOOLEAN DEFAULT TRUE,
    broadcast_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. Tier 4: Semantic Vector Memory (pgvector 1536-dim Schema Drift Index)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schema_vector_index (
    id VARCHAR(64) PRIMARY KEY,
    provider_id UUID NOT NULL REFERENCES monitored_providers(id) ON DELETE CASCADE,
    field_path VARCHAR(255) NOT NULL,
    embedding vector(1536),
    distance_metric VARCHAR(50) DEFAULT 'cosine',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. Global Cluster Mesh Nodes (Data Plane & Mesh)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clusters (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    cloud VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Inoculated',
    latency_ms NUMERIC(6, 2) DEFAULT 0.38,
    shielded_count BIGINT DEFAULT 0,
    last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. Sabotage Events Audit Table (BreakMyAPI Arena)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sabotage_events (
    id VARCHAR(64) PRIMARY KEY,
    scenario_id VARCHAR(100) NOT NULL,
    vendor VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    latency_ms NUMERIC(8, 2) NOT NULL,
    payload_before JSONB NOT NULL,
    payload_after JSONB NOT NULL,
    ast_patch TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. Executive PoC & Sovereign Audit Requests Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_requests (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    cloud VARCHAR(50) NOT NULL,
    volume VARCHAR(50) NOT NULL,
    tier VARCHAR(50) NOT NULL,
    access_token VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'PROVISIONED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- PERFORMANCE INDICES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_pg_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_pg_api_keys_tenant ON api_keys(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pg_monitored_providers_tenant ON monitored_providers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pg_active_ab_provider ON active_antibodies(provider_id);
CREATE INDEX IF NOT EXISTS idx_pg_active_ab_status ON active_antibodies(status);
CREATE INDEX IF NOT EXISTS idx_pg_dna_repairs_ab ON dna_repairs(antibody_id);
CREATE INDEX IF NOT EXISTS idx_pg_herd_vaccines_hash ON herd_vaccines(vaccine_hash);
CREATE INDEX IF NOT EXISTS idx_pg_clusters_region ON clusters(region);
CREATE INDEX IF NOT EXISTS idx_pg_sabotage_created ON sabotage_events(created_at);
CREATE INDEX IF NOT EXISTS idx_pg_audit_requests_created ON audit_requests(created_at);
