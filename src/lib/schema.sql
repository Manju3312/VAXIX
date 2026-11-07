-- ==============================================================================
-- IMMUNIX 5-TIER DATA TOPOLOGY: TIER 3 TRANSACTIONAL SCHEMA (PostgreSQL 16)
-- Enterprise Sovereign Cloud Architecture
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Multi-Tenant Isolation & SLAs
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tier VARCHAR(50) DEFAULT 'growth' CHECK (tier IN ('open-core', 'growth', 'enterprise-grid', 'sovereign-mesh')),
    sla_warranty_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Zero-Knowledge API Keys (Argon2id Salted Hashes Only)
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    key_prefix VARCHAR(16) NOT NULL,
    hashed_secret VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    scopes TEXT[] DEFAULT ARRAY['wire:proxy', 'telemetry:write'],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Monitored Third-Party Upstream Providers (Stripe, Twilio, OpenAI, Salesforce)
CREATE TABLE IF NOT EXISTS monitored_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider_name VARCHAR(100) NOT NULL,
    target_host VARCHAR(255) NOT NULL,
    spec_type VARCHAR(50) DEFAULT 'openapi3',
    last_health_status VARCHAR(50) DEFAULT 'healthy',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Speed 1: Active Wire Antibodies (<0.8ms In-Flight Transformation Rules)
CREATE TABLE IF NOT EXISTS active_antibodies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 5. Speed 2: Permanent Codebase AST Repairs (ts-morph / GitHub PR Engine)
CREATE TABLE IF NOT EXISTS dna_repairs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    antibody_id UUID NOT NULL REFERENCES active_antibodies(id) ON DELETE CASCADE,
    repository_url VARCHAR(500) NOT NULL,
    target_branch VARCHAR(100) DEFAULT 'main',
    pr_number INT,
    pr_url TEXT,
    ast_diff_summary TEXT NOT NULL,
    sandbox_verification_status VARCHAR(50) DEFAULT 'pending' CHECK (sandbox_verification_status IN ('pending', 'passed', 'failed')),
    sandbox_latency_ms NUMERIC(8, 2),
    cryptographic_certificate VARCHAR(255),
    merged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tier 5: Decentralized Herd Immunity Ledger (Ed25519 Signed Byzantine Consensus)
CREATE TABLE IF NOT EXISTS herd_vaccines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vaccine_hash VARCHAR(128) UNIQUE NOT NULL,
    origin_region VARCHAR(50) NOT NULL,
    target_host VARCHAR(255) NOT NULL,
    antigen_pattern JSONB NOT NULL,
    antibody_bytecode BYTEA NOT NULL,
    ed25519_signature VARCHAR(255) NOT NULL,
    consensus_peer_votes INT DEFAULT 1,
    is_globally_approved BOOLEAN DEFAULT FALSE,
    broadcast_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tier 4: Semantic Vector Memory (pgvector 1536-dim Schema Drift Index)
CREATE TABLE IF NOT EXISTS schema_vector_index (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES monitored_providers(id) ON DELETE CASCADE,
    field_path VARCHAR(255) NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

