"""API routes for combat simulations."""
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.simulation import SimulationConfig, SimulationResult
from app.simulation.engine import run_simulation

router = APIRouter(prefix="/simulations", tags=["simulations"])


class SimulationConfigCreate(BaseModel):
    """Request body for creating a simulation configuration."""
    name: Optional[str] = Field(None, example="Test Combat")
    description: Optional[str] = Field(None, example="Testing party vs boss")
    party_character_ids: List[str] = Field(..., example=["uuid1", "uuid2"])
    boss_template_id: str = Field(..., example="boss-uuid")
    trials: int = Field(1000, ge=1, le=10000, example=1000)
    max_rounds: int = Field(50, ge=1, le=1000, example=50)
    random_seed: Optional[int] = Field(None, example=42)
    enable_3_stage: bool = Field(False, example=False)
    quick_actions_mode: bool = Field(False, example=False)
    decision_policy: str = Field("balanced", example="balanced")


class SimulationConfigRead(BaseModel):
    """Response model for simulation configuration."""
    id: uuid.UUID
    name: Optional[str]
    description: Optional[str]
    party_character_ids: List[str]
    boss_template_id: uuid.UUID
    trials: int
    max_rounds: int
    random_seed: Optional[int]
    enable_3_stage: bool
    quick_actions_mode: bool
    decision_policy: str

    class Config:
        orm_mode = True


class SimulationResultRead(BaseModel):
    """Response model for simulation results."""
    id: uuid.UUID
    simulation_config_id: uuid.UUID
    win_rate: float
    avg_rounds: float
    damage_by_character: dict
    ae_curves: Optional[dict]
    strain_curves: Optional[dict]
    boss_kills: int
    party_wipes: int
    timeouts: int

    class Config:
        orm_mode = True


@router.post("/configs", response_model=SimulationConfigRead, status_code=status.HTTP_201_CREATED)
def create_simulation_config(payload: SimulationConfigCreate, db: Session = Depends(get_db)):
    """Create a new simulation configuration."""
    config = SimulationConfig(
        name=payload.name,
        description=payload.description,
        party_character_ids=payload.party_character_ids,
        boss_template_id=uuid.UUID(payload.boss_template_id),
        trials=payload.trials,
        max_rounds=payload.max_rounds,
        random_seed=payload.random_seed,
        enable_3_stage=payload.enable_3_stage,
        quick_actions_mode=payload.quick_actions_mode,
        decision_policy=payload.decision_policy
    )
    db.add(config)
    db.commit()
    db.refresh(config)
    return config


@router.get("/configs/{config_id}", response_model=SimulationConfigRead)
def get_simulation_config(config_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get a simulation configuration by ID."""
    config = db.query(SimulationConfig).filter(SimulationConfig.id == config_id).first()
    if not config:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Config not found")
    return config


@router.post("/run/{config_id}", response_model=SimulationResultRead)
def run_simulation_endpoint(config_id: uuid.UUID, db: Session = Depends(get_db)):
    """Run a simulation and store the results."""
    # Load config
    config = db.query(SimulationConfig).filter(SimulationConfig.id == config_id).first()
    if not config:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Config not found")
    
    # Run simulation
    try:
        results = run_simulation(config, db)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulation failed: {str(e)}"
        )
    
    # Store results
    result_record = SimulationResult(
        simulation_config_id=config.id,
        win_rate=results["win_rate"],
        avg_rounds=results["avg_rounds"],
        damage_by_character=results["damage_by_character"],
        ae_curves=results["ae_curves"],
        strain_curves=results["strain_curves"],
        boss_kills=results["boss_kills"],
        party_wipes=results["party_wipes"],
        timeouts=results["timeouts"]
    )
    db.add(result_record)
    db.commit()
    db.refresh(result_record)
    
    return result_record


@router.get("/results/{result_id}", response_model=SimulationResultRead)
def get_simulation_result(result_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get simulation results by ID."""
    result = db.query(SimulationResult).filter(SimulationResult.id == result_id).first()
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")
    return result


@router.get("/configs/{config_id}/results", response_model=List[SimulationResultRead])
def list_results_for_config(config_id: uuid.UUID, db: Session = Depends(get_db)):
    """List all results for a given simulation configuration."""
    results = db.query(SimulationResult).filter(
        SimulationResult.simulation_config_id == config_id
    ).order_by(SimulationResult.completed_at.desc()).all()
    return results
