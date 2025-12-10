#!/usr/bin/env python3
"""CLI script for running simulations and displaying results."""
import argparse
import json
import sys
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.simulations import SimulationConfig, SimulationRun


def run_simulation_cli(config_id: str):
    """
    Load a simulation config by ID, run the simulation, and print metrics.
    
    Args:
        config_id: UUID string of the simulation config
    """
    db: Session = SessionLocal()
    
    try:
        # Load config
        config = db.query(SimulationConfig).filter(
            SimulationConfig.id == UUID(config_id)
        ).first()
        
        if not config:
            print(f"Error: Simulation config {config_id} not found", file=sys.stderr)
            sys.exit(1)
        
        print(f"Running simulation: {config.name}")
        print(f"Party characters: {config.party_character_ids}")
        print(f"Boss template: {config.boss_template_id}")
        print(f"Rounds max: {config.rounds_max}")
        print(f"Trials: {config.trials}")
        print()
        
        # In a real implementation, this would call the actual simulation engine
        # For now, we create a stub run with sample metrics
        from app.models.enums import SimStatus
        
        run = SimulationRun(
            config_id=config.id,
            status=SimStatus.completed,
            metrics={
                "party_win_rate": 0.52,
                "avg_rounds": 9.3,
                "damage_by_character": {
                    char_id: 450 + (i * 50)
                    for i, char_id in enumerate(config.party_character_ids)
                },
                "ae_curves": {"note": "AE consumption curves would go here"},
                "strain_curves": {"note": "Strain accumulation curves would go here"},
            },
        )
        
        db.add(run)
        db.commit()
        db.refresh(run)
        
        # Print results as pretty JSON
        print("Simulation Results:")
        print(f"Run ID: {run.id}")
        print(f"Status: {run.status.value}")
        print()
        print("Metrics:")
        print(json.dumps(run.metrics, indent=2))
        
        return 0
        
    except ValueError as e:
        print(f"Error: Invalid UUID format: {e}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1
    finally:
        db.close()


def main():
    """Main entry point for the CLI."""
    parser = argparse.ArgumentParser(
        description="Run a simulation and display results"
    )
    parser.add_argument(
        "config_id",
        help="UUID of the simulation config to run"
    )
    
    args = parser.parse_args()
    sys.exit(run_simulation_cli(args.config_id))


if __name__ == "__main__":
    main()
