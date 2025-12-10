-- ==========================
-- Enum Types
-- ==========================

CREATE TYPE character_type AS ENUM ('PC', 'Boss', 'NPC');

CREATE TYPE speed_band AS ENUM ('Normal', 'Fast', 'SuperFast');

CREATE TYPE technique_tier AS ENUM ('Basic', 'Std', 'Maj', 'Innate');

CREATE TYPE technique_axis AS ENUM ('Body', 'Mind', 'Soul', 'Mixed');

CREATE TYPE fate_colour AS ENUM ('Red', 'Blue', 'Green', 'Black', 'Gold');

CREATE TYPE fate_aspect AS ENUM ('Body', 'Mind', 'Soul');

CREATE TYPE boss_rank AS ENUM ('Lieutenant', 'Major', 'General', 'Boss', 'Final');

CREATE TYPE quick_actions_mode AS ENUM ('none', 'defensive_only', 'full');

CREATE TYPE sim_status AS ENUM ('pending', 'running', 'completed', 'failed');


-- ==========================
-- Characters
-- ==========================

CREATE TABLE characters (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    type            character_type NOT NULL,

    sc              INTEGER NOT NULL DEFAULT 1,
    seq_lvl         INTEGER NOT NULL DEFAULT 1,
    realm_lvl       INTEGER NOT NULL DEFAULT 1,

    bod             INTEGER NOT NULL,
    mnd             INTEGER NOT NULL,
    sol             INTEGER NOT NULL,

    ae_max          NUMERIC NOT NULL,
    ae_reg          NUMERIC NOT NULL,
    strain_cap      NUMERIC NOT NULL,

    thp_max         NUMERIC NOT NULL,
    php_max         NUMERIC NOT NULL,
    mshp_max        NUMERIC NOT NULL,

    dr              NUMERIC NOT NULL,

    guard_base_charges INTEGER NOT NULL,
    guard_prr       INTEGER NOT NULL,
    guard_mrr       INTEGER NOT NULL,
    guard_srr       INTEGER NOT NULL,

    spd_raw         INTEGER NOT NULL,
    spd_band        speed_band NOT NULL,

    death_card_id   UUID NULL,
    body_card_id    UUID NULL,
    soul_thesis     TEXT NULL,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- index for listing PCs/Bosses
CREATE INDEX idx_characters_type ON characters(type);


-- ==========================
-- Fate Cards
-- ==========================

CREATE TABLE death_cards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    summary         TEXT NOT NULL,
    tags            JSONB NOT NULL DEFAULT '[]'::jsonb,
    mechanical_hooks JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE body_cards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    summary         TEXT NOT NULL,
    stat_mods       JSONB NOT NULL DEFAULT '{}'::jsonb,
    spd_mod         INTEGER NOT NULL DEFAULT 0,
    archetype_hint  TEXT NULL,
    mechanical_hooks JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE seed_cards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    colour          fate_colour NOT NULL,
    aspect          fate_aspect NOT NULL,
    keywords        JSONB NOT NULL DEFAULT '[]'::jsonb,
    mechanical_bias JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- FK from characters to fate cards
ALTER TABLE characters
    ADD CONSTRAINT fk_characters_death_card
        FOREIGN KEY (death_card_id) REFERENCES death_cards(id),
    ADD CONSTRAINT fk_characters_body_card
        FOREIGN KEY (body_card_id) REFERENCES body_cards(id);

-- Character ↔ Seed many-to-many
CREATE TABLE character_seed_cards (
    character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    seed_card_id    UUID NOT NULL REFERENCES seed_cards(id) ON DELETE CASCADE,
    PRIMARY KEY (character_id, seed_card_id)
);


-- ==========================
-- Techniques
-- ==========================

CREATE TABLE techniques (
    id                  TEXT PRIMARY KEY,      -- string key, e.g. 'Karma_Innate'
    name                TEXT NOT NULL,
    tier                technique_tier NOT NULL,
    archetype           TEXT NULL,
    axis                technique_axis NOT NULL,
    target_pool         TEXT NOT NULL CHECK (target_pool IN ('PHP','MSHP','mixed')),

    base_offrank_bias   NUMERIC NOT NULL DEFAULT 0,
    base_damage         NUMERIC NOT NULL DEFAULT 0,
    ae_cost             NUMERIC NOT NULL DEFAULT 0,
    self_strain         NUMERIC NOT NULL DEFAULT 0,

    damage_to_thp       NUMERIC NOT NULL DEFAULT 1,
    damage_to_php       NUMERIC NOT NULL DEFAULT 0,
    damage_to_mshp      NUMERIC NOT NULL DEFAULT 0,

    boss_strain_on_hit  NUMERIC NOT NULL DEFAULT 0,
    dr_debuff           NUMERIC NOT NULL DEFAULT 0,

    ally_shield         JSONB NULL,
    build_meta          JSONB NULL,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ==========================
-- Character ↔ Technique associations
-- ==========================

-- Generic many-to-many if you want:
CREATE TABLE character_techniques (
    character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    technique_id    TEXT NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
    category        TEXT NOT NULL CHECK (category IN ('basic','std','maj')),
    PRIMARY KEY (character_id, technique_id, category)
);

-- Optional helper table to declare the “profile” by technique ID,
-- or just derive from character_techniques.


-- ==========================
-- Effect Modules (builder atoms)
-- ==========================

CREATE TABLE effect_modules (
    id                  TEXT PRIMARY KEY,
    name                TEXT NOT NULL,
    base_cost_per_rank  NUMERIC NOT NULL
);


-- ==========================
-- Boss Templates
-- ==========================

CREATE TABLE boss_templates (
    id                      TEXT PRIMARY KEY,
    name                    TEXT NOT NULL,
    rank                    boss_rank NOT NULL,
    sc_level                INTEGER NOT NULL,
    sc_offset_from_party    INTEGER NOT NULL DEFAULT 0,
    thp_factor              NUMERIC NOT NULL,
    dmg_factor              NUMERIC NOT NULL,
    dr_factor               NUMERIC NOT NULL,
    minions                 JSONB NOT NULL DEFAULT '[]'::jsonb,
    lieutenants             JSONB NOT NULL DEFAULT '[]'::jsonb
);


-- ==========================
-- Simulation Configs & Runs
-- ==========================

CREATE TABLE simulation_configs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL,
    party_character_ids JSONB NOT NULL,   -- array of character UUID strings
    boss_template_id    TEXT NOT NULL REFERENCES boss_templates(id),
    rounds_max          INTEGER NOT NULL,
    trials              INTEGER NOT NULL,
    enable_3_stage      BOOLEAN NOT NULL DEFAULT FALSE,
    quick_actions_mode  quick_actions_mode NOT NULL DEFAULT 'none',
    decision_policy     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE simulation_runs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_id       UUID NOT NULL REFERENCES simulation_configs(id) ON DELETE CASCADE,
    status          sim_status NOT NULL DEFAULT 'pending',
    metrics         JSONB NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_simulation_runs_config ON simulation_runs(config_id);


-- ==========================
-- Basic triggers for updated_at (optional)
-- ==========================

-- You can add a generic trigger function and attach it to characters, techniques, etc.

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_characters_updated
BEFORE UPDATE ON characters
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_techniques_updated
BEFORE UPDATE ON techniques
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_simulation_runs_updated
BEFORE UPDATE ON simulation_runs
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
