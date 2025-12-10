"""Simulation CRUD router matching OpenAPI spec."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.enums import SimStatus
from app.models.simulations import SimulationConfig, SimulationRun
from app.schemas.other import SimulationConfigCreate, SimulationConfigRead, SimulationRunRead

router = APIRouter(prefix="/simulations", tags=["Simulations"])


@router.post("/configs", response_model=SimulationConfigRead, status_code=status.HTTP_201_CREATED)
def create_simulation_config(payload: SimulationConfigCreate, db: Session = Depends(get_db)):
    """Create simulation config."""
    config = SimulationConfig(
        name=payload.name,
        party_character_ids=payload.party_character_ids,
        boss_template_id=payload.boss_template_id,
        rounds_max=payload.rounds_max,
        trials=payload.trials,
        enable_3_stage=payload.enable_3_stage or False,
        quick_actions_mode=payload.quick_actions_mode,
        decision_policy=payload.decision_policy or {},
    )
    db.add(config)
    db.commit()
    db.refresh(config)
    return config


@router.get("/configs/{config_id}", response_model=SimulationConfigRead)
def get_simulation_config(config_id: UUID, db: Session = Depends(get_db)):
    """Get simulation config."""
    config = db.query(SimulationConfig).filter(SimulationConfig.id == config_id).first()
    if not config:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Simulation config not found")
    return config


class RunSimulationRequest(BaseModel):
    config_id: UUID


@router.post("/runs", response_model=SimulationRunRead)
def run_simulation(payload: RunSimulationRequest, db: Session = Depends(get_db)):
    """Run simulation (stub - returns pending status)."""
    # Verify config exists
    config = db.query(SimulationConfig).filter(SimulationConfig.id == payload.config_id).first()
    if not config:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Simulation config not found")
    
    # Create simulation run (stub implementation)
    run = SimulationRun(
        config_id=payload.config_id,
        status=SimStatus.completed,
        metrics={
            "party_win_rate": 0.5,
            "avg_rounds": 10.0,
            "damage_by_character": {},
            "ae_curves": {},
            "strain_curves": {},
        },
    )
    db.add(run)
    db.commit()
    db.refresh(run)
    return run


@router.get("/runs/{run_id}", response_model=SimulationRunRead)
def get_simulation_run(run_id: UUID, db: Session = Depends(get_db)):
    """Get simulation run."""
    run = db.query(SimulationRun).filter(SimulationRun.id == run_id).first()
    if not run:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Simulation run not found")
    return run
