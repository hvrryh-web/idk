-- Death Cards Table
CREATE TABLE death_cards (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    summary TEXT,
    tags JSONB,
    mechanical_hooks JSONB
);

-- Body Cards Table
CREATE TABLE body_cards (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    summary TEXT,
    stat_mods JSONB,
    spd_mod INTEGER,
    archetype_hint VARCHAR(255),
    mechanical_hooks JSONB
);

-- Seed Cards Table
CREATE TABLE seed_cards (
    id UUID PRIMARY KEY,
    colour VARCHAR(50),
    aspect VARCHAR(50),
    keywords JSONB,
    mechanical_bias JSONB
);

-- Character Seed Cards (many-to-many)
CREATE TABLE character_seed_cards (
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    seed_card_id UUID REFERENCES seed_cards(id) ON DELETE CASCADE,
    PRIMARY KEY (character_id, seed_card_id)
);

-- Character Techniques (many-to-many)
CREATE TABLE character_techniques (
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    technique_id UUID REFERENCES techniques(id) ON DELETE CASCADE,
    category VARCHAR(50),
    PRIMARY KEY (character_id, technique_id, category)
);
-- WuXuxian TTRPG Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Character types enum
CREATE TYPE character_type AS ENUM ('pc', 'npc', 'boss');

-- Speed band enum for 3-stage combat
CREATE TYPE spd_band AS ENUM ('Fast', 'Normal', 'Slow');

-- Technique types enum
CREATE TYPE technique_type AS ENUM ('Basic', 'Standard', 'Major', 'Spike');

-- Damage routing enum
CREATE TYPE damage_routing AS ENUM ('THP', 'Guard', 'Strain');

-- Characters table
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type character_type NOT NULL,
    level INTEGER,
    lineage VARCHAR(255),
    description TEXT,

    soul_capacity INTEGER,
    seq_lvl INTEGER,
    realm_lvl INTEGER,
    bod INTEGER,
    mnd INTEGER,
    sol INTEGER,
    ae_max INTEGER,
    ae_reg INTEGER,
    strain_cap INTEGER,
    thp_max INTEGER,
    php_max INTEGER,
    mshp_max INTEGER,
    guard_base_charges INTEGER,
    guard_prr INTEGER,
    guard_mrr INTEGER,
    guard_srr INTEGER,
    spd_raw INTEGER,
    death_card_id UUID REFERENCES death_cards(id) ON DELETE SET NULL,
    body_card_id UUID REFERENCES body_cards(id) ON DELETE SET NULL,
    soul_thesis TEXT,
    
    -- Legacy D&D-style primary stats (9): retained for migration/reference only.
    -- Canonical stat system is bod/mnd/sol/etc. (see lines 74-87 above).
    -- If not needed, these fields can be removed in a future schema update.
    strength INTEGER DEFAULT 0,
    dexterity INTEGER DEFAULT 0,
    constitution INTEGER DEFAULT 0,
    intelligence INTEGER DEFAULT 0,
    wisdom INTEGER DEFAULT 0,
    charisma INTEGER DEFAULT 0,
    perception INTEGER DEFAULT 0,
    resolve INTEGER DEFAULT 0,
    presence INTEGER DEFAULT 0,
    
    -- Aether stats (3)
    aether_fire INTEGER DEFAULT 0,
    aether_ice INTEGER DEFAULT 0,
    aether_void INTEGER DEFAULT 0,
    
    -- Condition tracks (stored as JSONB for history)
    conditions JSONB DEFAULT '{"violence": {"current": 0, "history": []}, "influence": {"current": 0, "history": []}, "revelation": {"current": 0, "history": []}}'::jsonb,
    
    -- Cost tracks (stored as JSONB)
    cost_tracks JSONB DEFAULT '{"blood": {"current": 0, "maximum": 10}, "fate": {"current": 0, "maximum": 10}, "stain": {"current": 0, "maximum": 10}}'::jsonb,
    
    -- Combat stats
    thp INTEGER,
    ae INTEGER,
    ae_reg INTEGER DEFAULT 0,
    dr FLOAT DEFAULT 0.0,
    strain INTEGER DEFAULT 0,
    guard INTEGER DEFAULT 0,
    spd_band spd_band DEFAULT 'Normal',
    
    -- Techniques (array of technique IDs)
    techniques JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Techniques table
CREATE TABLE techniques (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tier VARCHAR(50),
    archetype VARCHAR(50),
    axis VARCHAR(50),
    target_pool VARCHAR(50),
    base_offrank_bias INTEGER,
    
    -- Combat mechanics
    technique_type technique_type,
    base_damage INTEGER DEFAULT 0,  -- Kept for backward compatibility
    ae_cost INTEGER DEFAULT 0,
    self_strain INTEGER DEFAULT 0,
    damage_to_thp INTEGER,
    damage_to_php INTEGER,
    damage_to_mshp INTEGER,
    damage_routing damage_routing DEFAULT 'THP',
    boss_strain_on_hit INTEGER DEFAULT 0,
    dr_debuff FLOAT DEFAULT 0.0,
    ally_shield INTEGER,
    build_meta JSONB,
    
    -- Phase 2: New fields for data-driven combat
    attack_bonus INTEGER DEFAULT 0,  -- Modifier applied to attack roll/damage
    effect_rank INTEGER DEFAULT 0,   -- Non-damage effect magnitude (0-10)
    max_scl INTEGER,                 -- Maximum SCL allowed to use this technique
    
    -- Phase 2: Cost requirements (JSONB for flexibility)
    cost JSONB DEFAULT '{"blood": 0, "fate": 0, "stain": 0}'::jsonb,
    
    -- Quick action flag (0 = major action, 1 = quick action)
    is_quick_action INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Boss templates table
CREATE TABLE boss_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Combat stats
    thp INTEGER NOT NULL,
    ae INTEGER NOT NULL,
    ae_reg INTEGER DEFAULT 0 NOT NULL,
    dr FLOAT DEFAULT 0.0 NOT NULL,
    strain INTEGER DEFAULT 0 NOT NULL,
    guard INTEGER DEFAULT 0 NOT NULL,
    
    -- Boss-specific
    spike_threshold INTEGER,
    
    -- Techniques
    basic_technique_id VARCHAR(50) REFERENCES techniques(id),
    spike_technique_id VARCHAR(50) REFERENCES techniques(id),
    techniques JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Simulation configurations table
CREATE TABLE simulation_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    description TEXT,
    
    -- Configuration
    party_character_ids JSONB NOT NULL,  -- Array of character IDs
    boss_template_id UUID NOT NULL REFERENCES boss_templates(id),
    trials INTEGER DEFAULT 1000 NOT NULL,
    max_rounds INTEGER DEFAULT 50 NOT NULL,
    random_seed INTEGER,
    enable_3_stage BOOLEAN DEFAULT FALSE NOT NULL,
    quick_actions_mode BOOLEAN DEFAULT FALSE NOT NULL,
    decision_policy VARCHAR(50) DEFAULT 'balanced' NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Simulation results table
CREATE TABLE simulation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulation_config_id UUID NOT NULL REFERENCES simulation_configs(id) ON DELETE CASCADE,
    
    -- Results
    win_rate FLOAT NOT NULL,
    avg_rounds FLOAT NOT NULL,
    damage_by_character JSONB NOT NULL,
    ae_curves JSONB,
    strain_curves JSONB,
    boss_kills INTEGER NOT NULL,
    party_wipes INTEGER NOT NULL,
    timeouts INTEGER NOT NULL,
    
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT valid_win_rate CHECK (win_rate >= 0 AND win_rate <= 1)
);

-- Indexes for performance
CREATE INDEX idx_characters_type ON characters(type);
CREATE INDEX idx_characters_created_at ON characters(created_at DESC);
CREATE INDEX idx_techniques_type ON techniques(technique_type);
CREATE INDEX idx_techniques_is_quick ON techniques(is_quick_action);
CREATE INDEX idx_boss_templates_created_at ON boss_templates(created_at DESC);
CREATE INDEX idx_simulation_configs_boss ON simulation_configs(boss_template_id);
CREATE INDEX idx_simulation_results_config ON simulation_results(simulation_config_id);
CREATE INDEX idx_simulation_results_completed ON simulation_results(completed_at DESC);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers
CREATE TRIGGER update_characters_updated_at
    BEFORE UPDATE ON characters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_techniques_updated_at
    BEFORE UPDATE ON techniques
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boss_templates_updated_at
    BEFORE UPDATE ON boss_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_simulation_configs_updated_at
    BEFORE UPDATE ON simulation_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional - for development/testing)
-- Uncomment to populate with sample data

/*
-- Sample techniques
INSERT INTO techniques (name, description, technique_type, base_damage, ae_cost, self_strain, damage_routing)
VALUES 
    ('Basic Strike', 'A simple melee attack', 'Basic', 30, 2, 1, 'THP'),
    ('Thunder Slash', 'Lightning-infused sword strike', 'Standard', 60, 5, 2, 'THP'),
    ('Guard Break', 'Shattering attack targeting guard', 'Standard', 40, 4, 1, 'Guard'),
    ('Soul Drain', 'Spiritual attack causing strain', 'Major', 0, 8, 3, 'Strain');

-- Sample character
INSERT INTO characters (name, type, level, lineage, description, thp, ae, ae_reg, dr, stats)
VALUES (
    'Zhang Wei',
    'pc',
    5,
    'Azure Crane Sect',
    'A disciplined cultivator of the Azure Crane',
    120,
    12,
    3,
    0.15,
    '{"might": 3, "cunning": 2, "spirit": 4}'::jsonb
);
*/

-- ASCII Artifacts table for storing generated ASCII art
CREATE TABLE ascii_artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_hash VARCHAR(16) UNIQUE NOT NULL,
    ascii_art TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    style VARCHAR(50) NOT NULL,
    preset_name VARCHAR(100) NOT NULL,
    use_color BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create index on content_hash for fast lookups
CREATE INDEX idx_ascii_artifacts_content_hash ON ascii_artifacts(content_hash);
CREATE INDEX idx_ascii_artifacts_created_at ON ascii_artifacts(created_at DESC);

-- ComfyUI Character Generation Tables

-- Character generations table for tracking generation jobs
CREATE TABLE character_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    generation_type VARCHAR(50) NOT NULL,  -- 'full_7layer', 'poses_sheet', 'outfits_sheet', 'character_sheet'
    status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, processing, completed, failed
    current_layer INTEGER DEFAULT 0,
    total_layers INTEGER DEFAULT 7,
    layer_outputs JSONB DEFAULT '{}',  -- {layer_name: file_path}
    comfyui_job_id VARCHAR(255),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Character face embeddings for consistent face transposition
CREATE TABLE character_face_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
    embedding_data BYTEA NOT NULL,  -- serialized embedding
    embedding_format VARCHAR(50) DEFAULT 'insightface',
    reference_image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generation outputs for storing generated images
CREATE TABLE generation_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generation_id UUID REFERENCES character_generations(id) ON DELETE CASCADE,
    output_type VARCHAR(50) NOT NULL,  -- 'layer_1', 'layer_7', 'poses_sheet', etc.
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER,
    dimensions VARCHAR(20),  -- '512x768'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for character generation tables
CREATE INDEX idx_generations_character ON character_generations(character_id);
CREATE INDEX idx_generations_status ON character_generations(status);
CREATE INDEX idx_generations_created ON character_generations(created_at DESC);
CREATE INDEX idx_face_embeddings_character ON character_face_embeddings(character_id);
CREATE INDEX idx_generation_outputs_generation ON generation_outputs(generation_id);

-- Trigger for updating updated_at on character_generations
CREATE TRIGGER update_character_generations_updated_at
    BEFORE UPDATE ON character_generations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ASSET MANAGEMENT SYSTEM TABLES (Phase 1 Critical Infrastructure)
-- ============================================================

-- Asset inventory for tracking all generated visual assets
CREATE TABLE asset_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_type VARCHAR(50) NOT NULL,  -- 'character_portrait', 'npc_bust', 'fate_card', 'ui_icon', 'background'
    category VARCHAR(50),              -- 'military', 'nobility', 'cultivator', 'commoner', 'scholar'
    archetype_id VARCHAR(100),         -- Reference to NPC archetype spec
    variant_key VARCHAR(255),          -- Composite key: e.g., 'male_young_adult_neutral'
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    dimensions VARCHAR(20),            -- e.g., '512x768'
    content_hash VARCHAR(64),          -- SHA-256 for deduplication
    generation_params JSONB,           -- Full generation parameters for reproducibility
    generation_id UUID REFERENCES character_generations(id) ON DELETE SET NULL,
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP,
    is_base_asset BOOLEAN DEFAULT false,  -- True for core/foundation assets
    is_customization_layer BOOLEAN DEFAULT false,  -- True for overlay assets
    parent_asset_id UUID REFERENCES asset_inventory(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,              -- For TTL-based cleanup (NULL = never expires)
    deleted_at TIMESTAMP               -- Soft delete support
);

CREATE UNIQUE INDEX idx_asset_content_hash ON asset_inventory(content_hash) WHERE content_hash IS NOT NULL;
CREATE INDEX idx_asset_type ON asset_inventory(asset_type);
CREATE INDEX idx_asset_category ON asset_inventory(category);
CREATE INDEX idx_asset_archetype ON asset_inventory(archetype_id);
CREATE INDEX idx_asset_expires ON asset_inventory(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_asset_deleted ON asset_inventory(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_asset_access ON asset_inventory(last_accessed_at DESC);

-- Generation queue for managing async job processing
CREATE TABLE generation_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),  -- 1 = highest priority
    job_type VARCHAR(50) NOT NULL,     -- 'character_full', 'npc_portrait', 'fate_card', 'batch_npc'
    job_params JSONB NOT NULL,
    user_id VARCHAR(100),              -- For rate limiting
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'locked', 'processing', 'completed', 'failed', 'cancelled')),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    locked_by VARCHAR(100),            -- Worker ID that claimed the job
    locked_at TIMESTAMP,
    error_message TEXT,
    result JSONB,                      -- Job result/output references
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    estimated_duration_seconds INTEGER,
    actual_duration_seconds INTEGER
);

CREATE INDEX idx_queue_status_priority ON generation_queue(status, priority, created_at) WHERE status = 'pending';
CREATE INDEX idx_queue_locked ON generation_queue(locked_by, locked_at) WHERE status = 'locked';
CREATE INDEX idx_queue_user ON generation_queue(user_id, created_at DESC);

-- Resource usage tracking for monitoring and alerting
CREATE TABLE resource_usage_log (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metric_type VARCHAR(50) NOT NULL,  -- 'disk_usage_bytes', 'memory_usage_bytes', 'active_jobs', 'queue_depth', 'generation_rate'
    metric_value BIGINT NOT NULL,
    metric_unit VARCHAR(20),           -- 'bytes', 'count', 'per_hour'
    threshold_warning BIGINT,          -- Warning threshold
    threshold_critical BIGINT,         -- Critical threshold
    is_alert BOOLEAN DEFAULT false,
    details JSONB
);

CREATE INDEX idx_usage_timestamp ON resource_usage_log(timestamp DESC);
CREATE INDEX idx_usage_type ON resource_usage_log(metric_type, timestamp DESC);
CREATE INDEX idx_usage_alerts ON resource_usage_log(is_alert, timestamp DESC) WHERE is_alert = true;

-- Rate limiting tracking
CREATE TABLE rate_limit_tracking (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL,  -- 'generation', 'face_extract', 'batch'
    window_start TIMESTAMP NOT NULL,
    request_count INTEGER DEFAULT 1,
    UNIQUE (user_id, action_type, window_start)
);

CREATE INDEX idx_rate_limit_user ON rate_limit_tracking(user_id, action_type, window_start DESC);

-- Cleanup job tracking
CREATE TABLE cleanup_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_type VARCHAR(50) NOT NULL,     -- 'expired_assets', 'orphan_files', 'temp_cleanup', 'old_logs'
    status VARCHAR(20) DEFAULT 'pending',
    items_processed INTEGER DEFAULT 0,
    bytes_reclaimed BIGINT DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to automatically update access tracking
CREATE OR REPLACE FUNCTION update_asset_access()
RETURNS TRIGGER AS $$
BEGIN
    NEW.access_count = COALESCE(OLD.access_count, 0) + 1;
    NEW.last_accessed_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate disk usage by asset type
CREATE OR REPLACE FUNCTION get_disk_usage_by_type()
RETURNS TABLE(asset_type VARCHAR, total_bytes BIGINT, asset_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ai.asset_type,
        SUM(ai.file_size_bytes)::BIGINT as total_bytes,
        COUNT(*)::BIGINT as asset_count
    FROM asset_inventory ai
    WHERE ai.deleted_at IS NULL
    GROUP BY ai.asset_type;
END;
$$ LANGUAGE plpgsql;

-- Function to get expired assets for cleanup
CREATE OR REPLACE FUNCTION get_expired_assets(batch_size INTEGER DEFAULT 100)
RETURNS TABLE(id UUID, file_path VARCHAR, file_size_bytes BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT ai.id, ai.file_path, ai.file_size_bytes
    FROM asset_inventory ai
    WHERE ai.expires_at IS NOT NULL 
      AND ai.expires_at < NOW()
      AND ai.deleted_at IS NULL
      AND ai.is_base_asset = false
    ORDER BY ai.expires_at
    LIMIT batch_size;
END;
$$ LANGUAGE plpgsql;
