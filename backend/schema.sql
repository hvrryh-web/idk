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
    stats JSONB,
    
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Combat mechanics
    technique_type technique_type,
    base_damage INTEGER DEFAULT 0,
    ae_cost INTEGER DEFAULT 0,
    self_strain INTEGER DEFAULT 0,
    damage_routing damage_routing DEFAULT 'THP',
    boss_strain_on_hit INTEGER DEFAULT 0,
    dr_debuff FLOAT DEFAULT 0.0,
    
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
    basic_technique_id UUID REFERENCES techniques(id),
    spike_technique_id UUID REFERENCES techniques(id),
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
