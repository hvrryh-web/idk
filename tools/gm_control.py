#!/usr/bin/env python3
"""
Game Master ComfyUI Control Script

Command-line tool for remotely starting, stopping, and monitoring
ComfyUI art generation sessions via the GM API.

Usage:
    ./gm_control.py start --characters npc-diao-chan,npc-lu-bu --types portrait,fullbody
    ./gm_control.py batch --manifest manifests/diao-chan-lu-bu.json
    ./gm_control.py status <session_id>
    ./gm_control.py pause <session_id>
    ./gm_control.py resume <session_id>
    ./gm_control.py stop <session_id>
    ./gm_control.py list
    ./gm_control.py jobs <session_id>
"""

import argparse
import json
import sys
import time
from typing import List, Optional
from urllib.parse import urljoin

import requests


class GMControlClient:
    """Client for interacting with the GM Control Panel API."""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.api_base = urljoin(base_url, "/api/v1/gm/")
    
    def _make_request(self, method: str, endpoint: str, **kwargs) -> requests.Response:
        """Make an API request."""
        url = urljoin(self.api_base, endpoint)
        try:
            response = requests.request(method, url, **kwargs)
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as e:
            print(f"❌ API Error: {e}")
            if hasattr(e.response, 'text'):
                try:
                    error_data = e.response.json()
                    print(f"   Detail: {error_data.get('detail', 'Unknown error')}")
                except:
                    print(f"   Response: {e.response.text}")
            sys.exit(1)
    
    def start_generation(
        self,
        character_ids: List[str],
        generation_types: List[str],
        use_lora: bool = True,
        priority: str = "normal"
    ) -> dict:
        """Start a new art generation session."""
        data = {
            "character_ids": character_ids,
            "generation_types": generation_types,
            "use_lora": use_lora,
            "priority": priority,
            "auto_cleanup": True,
        }
        response = self._make_request("POST", "art-generation/start", json=data)
        return response.json()
    
    def start_batch(
        self,
        manifest_path: str,
        generation_types: List[str],
        character_filter: Optional[List[str]] = None,
        parallel_jobs: int = 1
    ) -> dict:
        """Start a batch generation from manifest."""
        data = {
            "manifest_path": manifest_path,
            "generation_types": generation_types,
            "character_filter": character_filter,
            "parallel_jobs": parallel_jobs,
        }
        response = self._make_request("POST", "art-generation/batch", json=data)
        return response.json()
    
    def get_status(self, session_id: str) -> dict:
        """Get status of a generation session."""
        response = self._make_request("GET", f"art-generation/status/{session_id}")
        return response.json()
    
    def get_jobs(self, session_id: str) -> List[dict]:
        """Get all jobs in a session."""
        response = self._make_request("GET", f"art-generation/jobs/{session_id}")
        return response.json()
    
    def list_sessions(self) -> List[dict]:
        """List all active sessions."""
        response = self._make_request("GET", "art-generation/sessions")
        return response.json()
    
    def control_session(self, session_id: str, action: str) -> dict:
        """Control a session (pause/resume/stop)."""
        data = {"session_id": session_id, "action": action}
        response = self._make_request("POST", "art-generation/control", json=data)
        return response.json()
    
    def delete_session(self, session_id: str) -> dict:
        """Delete a completed/stopped session."""
        response = self._make_request("DELETE", f"art-generation/session/{session_id}")
        return response.json()


def format_time(seconds: Optional[int]) -> str:
    """Format seconds into human-readable time."""
    if seconds is None:
        return "N/A"
    mins = seconds // 60
    secs = seconds % 60
    return f"{mins}m {secs}s"


def print_session_status(session: dict):
    """Pretty-print a session status."""
    status_emoji = {
        "starting": "🔄",
        "running": "▶️",
        "paused": "⏸️",
        "stopped": "⏹️",
        "completed": "✅",
        "error": "❌",
    }
    emoji = status_emoji.get(session["status"], "❓")
    
    print(f"\n{emoji} Session: {session['session_id']}")
    print(f"   Status: {session['status'].upper()}")
    print(f"   Progress: {session['completed_jobs']}/{session['total_jobs']} completed")
    
    if session['failed_jobs'] > 0:
        print(f"   ⚠️  Failed: {session['failed_jobs']}")
    
    if session['in_progress_jobs'] > 0:
        print(f"   🔄 In Progress: {session['in_progress_jobs']}")
    
    if session.get('estimated_time_remaining'):
        print(f"   ⏱️  ETA: {format_time(session['estimated_time_remaining'])}")


def print_jobs_table(jobs: List[dict]):
    """Pretty-print jobs table."""
    if not jobs:
        print("   No jobs to display.")
        return
    
    print("\n{:<30} {:<25} {:<15} {:<10} {:<10}".format(
        "Job ID", "Character", "Type", "Status", "Progress"
    ))
    print("-" * 90)
    
    for job in jobs:
        status_emoji = {
            "pending": "⏳",
            "running": "▶️",
            "completed": "✅",
            "failed": "❌",
        }
        emoji = status_emoji.get(job["status"], "❓")
        
        print("{:<30} {:<25} {:<15} {:<2}{:<8} {:>5.1f}%".format(
            job["job_id"][:28],
            job["character_id"][:23],
            job["generation_type"],
            emoji,
            job["status"],
            job["progress_percent"]
        ))
        
        if job.get("error_message"):
            print(f"      ⚠️  Error: {job['error_message']}")


def cmd_start(args, client: GMControlClient):
    """Handle 'start' command."""
    character_ids = [c.strip() for c in args.characters.split(",")]
    generation_types = [t.strip() for t in args.types.split(",")]
    
    print(f"🚀 Starting generation for {len(character_ids)} character(s)...")
    print(f"   Characters: {', '.join(character_ids)}")
    print(f"   Types: {', '.join(generation_types)}")
    
    session = client.start_generation(
        character_ids=character_ids,
        generation_types=generation_types,
        use_lora=not args.no_lora,  # Invert the flag
        priority=args.priority
    )
    
    print(f"\n✅ Session started: {session['session_id']}")
    print(f"   Total jobs: {session['total_jobs']}")
    print(f"   Estimated time: {format_time(session.get('estimated_time_remaining'))}")
    
    if args.watch:
        print("\n👀 Watching session progress (Ctrl+C to stop watching)...")
        watch_session(client, session['session_id'])


def cmd_batch(args, client: GMControlClient):
    """Handle 'batch' command."""
    generation_types = [t.strip() for t in args.types.split(",")]
    character_filter = None
    if args.filter:
        character_filter = [c.strip() for c in args.filter.split(",")]
    
    print(f"📦 Starting batch generation from manifest...")
    print(f"   Manifest: {args.manifest}")
    print(f"   Types: {', '.join(generation_types)}")
    print(f"   Parallel jobs: {args.parallel}")
    
    session = client.start_batch(
        manifest_path=args.manifest,
        generation_types=generation_types,
        character_filter=character_filter,
        parallel_jobs=args.parallel
    )
    
    print(f"\n✅ Batch session started: {session['session_id']}")
    print(f"   Total jobs: {session['total_jobs']}")
    
    if args.watch:
        print("\n👀 Watching session progress (Ctrl+C to stop watching)...")
        watch_session(client, session['session_id'])


def cmd_status(args, client: GMControlClient):
    """Handle 'status' command."""
    session = client.get_status(args.session_id)
    print_session_status(session)
    
    if args.jobs:
        print("\n📋 Job Details:")
        jobs = client.get_jobs(args.session_id)
        print_jobs_table(jobs)


def cmd_list(args, client: GMControlClient):
    """Handle 'list' command."""
    sessions = client.list_sessions()
    
    if not sessions:
        print("📭 No active sessions.")
        return
    
    print(f"\n📋 Active Sessions ({len(sessions)}):")
    for session in sessions:
        print_session_status(session)


def cmd_jobs(args, client: GMControlClient):
    """Handle 'jobs' command."""
    jobs = client.get_jobs(args.session_id)
    print(f"\n📋 Jobs for session {args.session_id}:")
    print_jobs_table(jobs)


def cmd_pause(args, client: GMControlClient):
    """Handle 'pause' command."""
    result = client.control_session(args.session_id, "pause")
    print(f"⏸️  {result['message']}")


def cmd_resume(args, client: GMControlClient):
    """Handle 'resume' command."""
    result = client.control_session(args.session_id, "resume")
    print(f"▶️  {result['message']}")


def cmd_stop(args, client: GMControlClient):
    """Handle 'stop' command."""
    result = client.control_session(args.session_id, "stop")
    print(f"⏹️  {result['message']}")


def cmd_delete(args, client: GMControlClient):
    """Handle 'delete' command."""
    result = client.delete_session(args.session_id)
    print(f"🗑️  {result['message']}")


def watch_session(client: GMControlClient, session_id: str, interval: int = 2):
    """Watch a session's progress in real-time."""
    try:
        while True:
            session = client.get_status(session_id)
            
            # Clear screen (simple version)
            print("\n" * 2)
            print("=" * 90)
            print_session_status(session)
            
            if session['status'] in ['completed', 'stopped', 'error']:
                print("\n✅ Session finished.")
                jobs = client.get_jobs(session_id)
                print_jobs_table(jobs)
                break
            
            time.sleep(interval)
    
    except KeyboardInterrupt:
        print("\n\n⏹️  Stopped watching (session is still running).")


def main():
    parser = argparse.ArgumentParser(
        description="Game Master ComfyUI Control Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s start --characters npc-diao-chan,npc-lu-bu --types portrait,fullbody
  %(prog)s batch --manifest manifests/diao-chan-lu-bu.json --parallel 2
  %(prog)s status abc123def --jobs
  %(prog)s pause abc123def
  %(prog)s list
        """
    )
    
    parser.add_argument(
        "--url",
        default="http://localhost:8000",
        help="Backend API URL (default: http://localhost:8000)"
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")
    
    # Start command
    start_parser = subparsers.add_parser("start", help="Start art generation")
    start_parser.add_argument("--characters", required=True, help="Comma-separated character IDs")
    start_parser.add_argument("--types", default="portrait", help="Comma-separated generation types")
    start_parser.add_argument("--no-lora", action="store_true", help="Disable character LoRAs (enabled by default)")
    start_parser.add_argument("--priority", choices=["low", "normal", "high"], default="normal")
    start_parser.add_argument("--watch", action="store_true", help="Watch progress after starting")
    
    # Batch command
    batch_parser = subparsers.add_parser("batch", help="Start batch generation from manifest")
    batch_parser.add_argument("--manifest", required=True, help="Path to manifest JSON")
    batch_parser.add_argument("--types", default="portrait", help="Comma-separated generation types")
    batch_parser.add_argument("--filter", help="Comma-separated character IDs to filter")
    batch_parser.add_argument("--parallel", type=int, default=1, help="Number of parallel jobs")
    batch_parser.add_argument("--watch", action="store_true", help="Watch progress after starting")
    
    # Status command
    status_parser = subparsers.add_parser("status", help="Get session status")
    status_parser.add_argument("session_id", help="Session ID")
    status_parser.add_argument("--jobs", action="store_true", help="Show job details")
    
    # List command
    subparsers.add_parser("list", help="List all active sessions")
    
    # Jobs command
    jobs_parser = subparsers.add_parser("jobs", help="List jobs in a session")
    jobs_parser.add_argument("session_id", help="Session ID")
    
    # Control commands
    pause_parser = subparsers.add_parser("pause", help="Pause a session")
    pause_parser.add_argument("session_id", help="Session ID")
    
    resume_parser = subparsers.add_parser("resume", help="Resume a paused session")
    resume_parser.add_argument("session_id", help="Session ID")
    
    stop_parser = subparsers.add_parser("stop", help="Stop a session")
    stop_parser.add_argument("session_id", help="Session ID")
    
    delete_parser = subparsers.add_parser("delete", help="Delete a completed session")
    delete_parser.add_argument("session_id", help="Session ID")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    client = GMControlClient(base_url=args.url)
    
    # Dispatch to command handler
    command_handlers = {
        "start": cmd_start,
        "batch": cmd_batch,
        "status": cmd_status,
        "list": cmd_list,
        "jobs": cmd_jobs,
        "pause": cmd_pause,
        "resume": cmd_resume,
        "stop": cmd_stop,
        "delete": cmd_delete,
    }
    
    handler = command_handlers.get(args.command)
    if handler:
        handler(args, client)
    else:
        print(f"Unknown command: {args.command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
