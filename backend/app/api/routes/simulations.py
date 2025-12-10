from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.simulations import QuickActionsMode, SimStatus, SimulationConfig, SimulationRun
from app.schemas.simulations import SimulationConfigCreate, SimulationConfigRead, SimulationRunRead

router = APIRouter(prefix="/simulations", tags=["Simulations"])


def _serialize_config(config: SimulationConfig) -> SimulationConfigRead:
    return SimulationConfigRead(
        id=str(config.id),
        name=config.name,
        boss_template_id=str(config.boss_template_id) if config.boss_template_id else None,
        params=config.params or {},
        quick_actions_mode=config.quick_actions_mode,
        created_at=config.created_at,
    )


def _serialize_run(run: SimulationRun) -> SimulationRunRead:
    return SimulationRunRead(
        id=str(run.id),
        config_id=str(run.config_id),
        status=run.status,
        result=run.result,
        iterations=float(run.iterations) if run.iterations is not None else None,
        created_at=run.created_at,
        completed_at=run.completed_at,
    )


def _load_config(db: Session, config_id: str) -> SimulationConfig:
    config = db.query(SimulationConfig).filter(SimulationConfig.id == config_id).first()
    if not config:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Simulation config not found")
    return config


@router.post("/configs", status_code=status.HTTP_201_CREATED)
def create_simulation_config(payload: SimulationConfigCreate, db: Session = Depends(get_db)):
    config = SimulationConfig(
        name=payload.name,
        boss_template_id=payload.boss_template_id,
        params=payload.params,
        quick_actions_mode=payload.quick_actions_mode or QuickActionsMode.none,
    )
    db.add(config)
    db.commit()
    db.refresh(config)
    return _serialize_config(config)


@router.get("/configs/{configId}")
def get_simulation_config(configId: str, db: Session = Depends(get_db)):
    config = _load_config(db, configId)
    return _serialize_config(config)


@router.post("/runs")
def run_simulation(payload: dict, db: Session = Depends(get_db)):
    config_id: Optional[str] = payload.get("config_id")
    iterations: Optional[float] = payload.get("iterations")
    if not config_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="config_id is required")
    config = _load_config(db, config_id)
    run = SimulationRun(
        config_id=config.id,
        status=SimStatus.completed,
        iterations=iterations or 100,
        completed_at=datetime.utcnow(),
        result={"message": "Simulation completed", "config": config.params},
    )
    db.add(run)
    db.commit()
    db.refresh(run)
    return _serialize_run(run)


@router.get("/runs/{runId}")
def get_simulation_run(runId: str, db: Session = Depends(get_db)):
    run = db.query(SimulationRun).filter(SimulationRun.id == runId).first()
    if not run:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Simulation run not found")
    return _serialize_run(run)

