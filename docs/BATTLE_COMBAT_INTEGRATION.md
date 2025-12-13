# Battle & Combat System Integration

## Overview

The WuXuxian TTRPG Battle & Combat system unifies multiple combat-related components into a cohesive gameplay experience. This document explains how the various combat engines, battle maps, and UI components work together.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Battle & Combat Hub (/battle-hub)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────┐    ┌─────────────────────────────────────────┐ │
│  │   STRATEGIC BATTLES     │    │        TACTICAL COMBAT                  │ │
│  ├─────────────────────────┤    ├─────────────────────────────────────────┤ │
│  │ • ROTK Battle: City     │    │ • Combat: Skirmish                      │ │
│  │ • ROTK Battle: Region   │    │ • Combat: Siege                         │ │
│  │ • ROTK Battle: War      │    │ • Combat: Standard                      │ │
│  └─────────────────────────┘    └─────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Combat Engine (Backend)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │   combat_state.py   │  │     engine.py       │  │  player_combat.py   │  │
│  │   ─────────────────  │  │   ─────────────────  │  │   ─────────────────  │  │
│  │   • Combatant State │  │   • Create Combat   │  │   • Session Mgmt    │  │
│  │   • HP/AE/Guard     │  │   • Technique Load  │  │   • Action Execute  │  │
│  │   • Conditions      │  │   • Damage Calc     │  │   • Turn Management │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘  │
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────────────────────────────┐   │
│  │   quick_actions.py  │  │              VTT Routes (vtt.py)            │   │
│  │   ─────────────────  │  │   ─────────────────────────────────────────  │   │
│  │   • Dodge/Guard     │  │   • Token Management                        │   │
│  │   • Disengage       │  │   • Map Synchronization                     │   │
│  │   • Rally           │  │   • Chat & Initiative                       │   │
│  └─────────────────────┘  └─────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Combat UI (Frontend)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                    components/combat/                                    ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │ • CombatView.tsx       - Main combat container                          ││
│  │ • CombatantCard.tsx    - Character state display                        ││
│  │ • TechniqueSelector.tsx- Skill/ability selection                        ││
│  │ • ActionPreview.tsx    - Damage/cost preview                            ││
│  │ • CombatLog.tsx        - Battle event log                               ││
│  │ • TurnIndicator.tsx    - Initiative display                             ││
│  │ • ConditionBadge.tsx   - Status effect display                          ││
│  │ • CostTrackDisplay.tsx - Resource tracking (Blood/Fate/Stain)           ││
│  │ • QuickActionPanel.tsx - Quick action buttons                           ││
│  │ • CombatResultModal.tsx- Victory/defeat screen                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                    components/rotk/                                      ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │ • Ro3KBattleHUD.tsx    - ROTK-style character panels                    ││
│  │ • CharacterPlate.tsx   - Unit info plates                               ││
│  │ • ClashIndicator.tsx   - Advantage/disadvantage display                 ││
│  │ • InitiativePanel.tsx  - Turn order tracker                             ││
│  │ • DamageNumber.tsx     - Floating damage numbers                        ││
│  │ • StatBar.tsx          - HP/AE/Guard bars                               ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Interconnections

### 1. Combat Engine ↔ Combat UI

The combat engine (`backend/app/simulation/`) provides the game logic, while the frontend renders the state.

**Data Flow:**
```
Frontend                         Backend
   │                               │
   ├──── POST /combat/encounters ──►│  Create new combat
   │                               │
   │◄── Combat State JSON ─────────┤  Returns initial state
   │                               │
   ├──── POST /encounters/{id}/actions ──►│  Execute technique
   │                               │
   │◄── Updated State + Log ───────┤  Returns new state + events
   │                               │
   ├──── GET /encounters/{id} ─────►│  Poll for updates
   │                               │
```

### 2. VTT (Virtual Table Top) ↔ Game Master

The VTT system provides real-time game state synchronization between GM and players.

**API Endpoints:**
- `POST /api/v1/vtt/tokens/add` - Add tokens to map
- `PUT /api/v1/vtt/tokens/{id}/move` - Move tokens
- `POST /api/v1/vtt/map/set` - Set current map
- `POST /api/v1/vtt/fog/reveal` - Reveal fog areas
- `POST /api/v1/vtt/initiative/set` - Set initiative order
- `POST /api/v1/vtt/chat/send` - Send chat messages
- `GET /api/v1/vtt/state` - Get full game state

### 3. Battle Map ↔ Combat Engine

Battle maps provide the spatial context for combat:

| Map Component | Combat Integration |
|---------------|-------------------|
| Token Position | Movement costs, range calculations |
| Terrain Type | Cover bonuses, movement modifiers |
| Fog of War | Line of sight, revealed enemies |
| Grid System | Distance calculation, AoE effects |

### 4. ROTK Battle Scenes

Three specialized battle scene types, each with unique mechanics:

#### City Battle (`/rotk/city`)
- Urban warfare within city walls
- District control mechanics
- Siege defense positioning

#### War Battle (`/rotk/war`)
- Large-scale army movements
- Strategic resource management
- Multiple army coordination

#### Standard Battle (`/rotk/battle`)
- Party vs enemy combat
- Full technique system
- Turn-based initiative

## Session Management

### Player Sessions
```typescript
interface GameSession {
  sessionId: string;      // Format: {profile}-{YYYYMMDD}-{random}
  profileType: 'player1' | 'player2' | 'gamemaster';
  isGameMaster: boolean;
  createdAt: string;
}
```

### Game Master Privileges
- Token creation and manipulation
- Map control (fog of war, terrain)
- Combat phase management
- Initiative override
- Broadcast messages to players

## Combat Flow

```
1. ENCOUNTER CREATION
   └── GM creates encounter via /combat/encounters
       └── Party + Enemy combatants loaded
           └── Techniques loaded from database
               └── Initial combat state generated

2. INITIATIVE PHASE
   └── Roll initiative for all combatants
       └── Sort by initiative value
           └── Set first combatant as active

3. COMBAT ROUNDS
   └── Active combatant's turn
       │
       ├── ACTIONS (choose one):
       │   ├── Use Technique (costs AE)
       │   ├── Basic Attack
       │   └── Pass Turn
       │
       └── QUICK ACTIONS (free):
           ├── Dodge (Guard bonus)
           ├── Rally (Clear conditions)
           └── Disengage (Movement bonus)
       │
       └── End Turn → Next combatant

4. RESOLUTION
   └── Victory: All enemies defeated
   └── Defeat: All party members down
   └── Flee: Successful disengage check
```

## Key Files

### Backend
- `backend/app/api/routes/combat.py` - Combat API endpoints
- `backend/app/api/routes/vtt.py` - VTT API endpoints
- `backend/app/api/routes/sessions.py` - Session management
- `backend/app/simulation/engine.py` - Combat calculations
- `backend/app/simulation/player_combat.py` - Player combat sessions
- `backend/app/simulation/combat_state.py` - State management

### Frontend
- `frontend/src/pages/BattleHubPage.tsx` - Battle hub navigation
- `frontend/src/pages/TestBattle.tsx` - Combat testing entry
- `frontend/src/components/combat/CombatView.tsx` - Main combat UI
- `frontend/src/pages/rotk/Ro3KBattleScene.tsx` - ROTK-style battle demo
- `frontend/src/pages/GameMasterDashboard.tsx` - GM control panel

## Future Enhancements

- [ ] WebSocket real-time updates
- [ ] Persistent combat state (database)
- [ ] Multiplayer synchronization
- [ ] Combat replay system
- [ ] AI opponent improvements
- [ ] Mobile-responsive battle UI
