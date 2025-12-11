-- Sample data for local development
INSERT INTO death_cards (id, name, summary, tags, mechanical_hooks)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Silent River',
    'A calm acceptance of endings that creates resilience.',
    '["serene", "patient"]',
    '{"resilience": 1}'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO body_cards (id, name, summary, stat_mods, spd_mod, archetype_hint, mechanical_hooks)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Stone Anchor',
    'Roots the wielder with steady footwork and unshakable focus.',
    '{"bod": 1, "sol": 1}',
    1,
    'Defender',
    '{"guard_bonus": 1}'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO seed_cards (id, colour, aspect, keywords, mechanical_bias)
VALUES (
    '99999999-9999-9999-9999-999999999999',
    'Blue',
    'Mind',
    '["insight", "flow"]',
    '{"ae_reg": 1}'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO characters (
    id, name, type, level, lineage, description, stats,
    strength, dexterity, constitution, intelligence, wisdom, charisma, perception, resolve, presence,
    aether_fire, aether_ice, aether_void,
    conditions, cost_tracks,
    created_at, updated_at
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Alpha Main Player',
    'pc',
    10,
    'Azure Crane Sect',
    'Insurance test character for alpha loading.',
    '{"might": 5, "cunning": 4, "spirit": 6}',
    5, 4, 6, 5, 4, 6, 5, 4, 6,
    2, 2, 2,
    '{"violence": {"current": 0, "history": []}, "influence": {"current": 0, "history": []}, "revelation": {"current": 0, "history": []}}',
    '{"blood": {"current": 0, "maximum": 10}, "fate": {"current": 0, "maximum": 10}, "stain": {"current": 0, "maximum": 10}}',
    NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO techniques (
    id,
    name,
    tier,
    archetype,
    axis,
    target_pool,
    base_offrank_bias,
    base_damage,
    ae_cost,
    self_strain,
    damage_to_thp,
    damage_to_php,
    damage_to_mshp,
    boss_strain_on_hit,
    dr_debuff,
    ally_shield,
    build_meta
) VALUES (
    'River_Wave',
    'River Wave',
    'Basic',
    'Striker',
    'Body',
    'PHP',
    1,
    4,
    1,
    0,
    1,
    0,
    0,
    0,
    0,
    2,
    '{"role": "burst"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO techniques (
    id,
    name,
    tier,
    archetype,
    axis,
    target_pool,
    base_offrank_bias,
    base_damage,
    ae_cost,
    self_strain,
    damage_to_thp,
    damage_to_php,
    damage_to_mshp,
    boss_strain_on_hit,
    dr_debuff,
    ally_shield,
    build_meta
) VALUES (
    'Anchor_Roots',
    'Anchor Roots',
    'Std',
    'Defender',
    'Soul',
    'mixed',
    0,
    2,
    0,
    1,
    0,
    1,
    0,
    0,
    1,
    1,
    '{"role": "tank"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

WITH dc AS (
    SELECT id FROM death_cards WHERE id = '11111111-1111-1111-1111-111111111111'
), bc AS (
    SELECT id FROM body_cards WHERE id = '22222222-2222-2222-2222-222222222222'
)
INSERT INTO characters (
    id,
    name,
    type,
    sc,
    seq_lvl,
    realm_lvl,
    bod,
    mnd,
    sol,
    ae_max,
    ae_reg,
    strain_cap,
    thp_max,
    php_max,
    mshp_max,
    dr,
    guard_base_charges,
    guard_prr,
    guard_mrr,
    guard_srr,
    spd_raw,
    spd_band,
    death_card_id,
    body_card_id,
    soul_thesis
) SELECT
    '33333333-3333-3333-3333-333333333333',
    'Yin River Monk',
    'pc',
    2,
    1,
    1,
    4,
    3,
    3,
    8,
    2,
    6,
    18,
    16,
    12,
    1,
    3,
    2,
    2,
    1,
    5,
    'Normal',
    dc.id,
    bc.id,
    'Pursues balance through flowing forms'
FROM dc, bc
ON CONFLICT (id) DO NOTHING;

INSERT INTO character_seed_cards (character_id, seed_card_id)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    '99999999-9999-9999-9999-999999999999'
) ON CONFLICT DO NOTHING;

INSERT INTO character_techniques (character_id, technique_id, category)
VALUES
    ('33333333-3333-3333-3333-333333333333', 'River_Wave', 'basic'),
    ('33333333-3333-3333-3333-333333333333', 'Anchor_Roots', 'maj')
ON CONFLICT DO NOTHING;
