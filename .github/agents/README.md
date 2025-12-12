# GitHub Copilot Custom Agents

This directory contains custom agent configurations for GitHub Copilot, designed specifically for the WuXuxian TTRPG webapp project. These agents provide specialized knowledge and context to assist with development tasks.

## Available Agents

### 1. TTRPG Game Mechanics Expert (`ttrpg-game-mechanics.yml`)

**Specialization**: Tabletop RPG game mechanics, combat simulation, and character systems

**Use this agent for:**
- Implementing combat mechanics (THP, AE, DR, Strain, Guard)
- Developing the Monte Carlo simulation engine
- Creating or modifying techniques and abilities
- Working with 1-beat or 3-stage combat systems
- Implementing quick actions (GUARD_SHIFT, DODGE, BRACE, etc.)
- Designing boss encounters
- Balancing party compositions
- Testing combat scenarios

**Key Files:**
- `backend/app/simulation/combat_state.py`
- `backend/app/simulation/engine.py`
- `backend/app/simulation/quick_actions.py`
- `backend/tests/test_simulation.py`
- `backend/tests/test_3stage_combat.py`

### 2. FastAPI Backend Expert (`fastapi-backend.yml`)

**Specialization**: FastAPI backend development, API design, and database operations

**Use this agent for:**
- Creating or modifying API endpoints
- Implementing database models with SQLAlchemy
- Writing Pydantic validation schemas
- Database session management
- Adding new routes or refactoring existing ones
- Implementing business logic
- API error handling
- OpenAPI/Swagger documentation

**Key Files:**
- `backend/app/api/routes/*.py`
- `backend/app/models/*.py`
- `backend/app/db/session.py`
- `backend/app/core/config.py`
- `backend/tests/test_*.py`

### 3. React Frontend Expert (`react-frontend.yml`)

**Specialization**: React + TypeScript frontend development and UI components

**Use this agent for:**
- Building React components
- Implementing API integration with the backend
- State management with hooks
- TypeScript type definitions
- Form handling and validation
- UI/UX improvements
- Frontend testing with Vitest
- Responsive design

**Key Files:**
- `frontend/src/App.tsx`
- `frontend/src/main.tsx`
- `frontend/src/components/*` (future)
- `frontend/src/hooks/*` (future)
- `frontend/src/test/*`

### 4. Full-Stack Integration Expert (`fullstack-integration.yml`)

**Specialization**: End-to-end feature development and API integration

**Use this agent for:**
- Implementing complete features across the stack
- Designing API contracts
- Coordinating frontend and backend changes
- Database schema design and migrations
- Integration testing
- CORS and cross-origin configuration
- Type consistency across stack
- Docker and deployment concerns

**Key Areas:**
- Frontend ↔ Backend integration
- API contract design
- Database schema coordination
- End-to-end testing
- Environment configuration

## How to Use Custom Agents

### Via GitHub Copilot Chat

When using GitHub Copilot Chat in your IDE or on GitHub:

1. **Mention the agent by name**: Reference the agent in your prompt
   ```
   @ttrpg-game-mechanics How do I implement a new quick action?
   @fastapi-backend Create an endpoint for managing character equipment
   @react-frontend Build a component to display simulation results
   @fullstack-integration Implement a complete feature for character creation
   ```

2. **Context-aware assistance**: The agent will use its specialized knowledge to:
   - Understand project-specific terminology
   - Follow established patterns and conventions
   - Consider architectural constraints
   - Suggest best practices for the domain

3. **Code generation**: Agents can generate code that:
   - Matches the project's coding style
   - Uses the correct frameworks and libraries
   - Follows established patterns
   - Includes proper error handling and validation

## Agent Usage Examples

### How to Invoke an Agent in Copilot Chat

- **Game Mechanics Expert**
  > "@ttrpg-game-mechanics: Simulate a 3-stage combat round and explain the THP/AE/DR flow."

- **FastAPI Backend Expert**
  > "@fastapi-backend: Add a new endpoint for character techniques and update the OpenAPI spec."

- **React Frontend Expert**
  > "@react-frontend: Refactor the CharacterSheet component to use the new theme config."

- **Full-Stack Integration Expert**
  > "@fullstack-integration: Implement character creation end-to-end, including DB, API, and UI."

### Expected Input/Output
- Provide a clear task description and reference relevant files.
- Agent will return code changes, explanations, and test suggestions.

### Agent Selection Logic
- Choose the agent matching the domain (backend, frontend, game mechanics, full-stack).
- For cross-cutting features, use the full-stack agent.

### Best Practices

1. **Choose the right agent**: Select the agent that best matches your task
   - Game mechanics → TTRPG Game Mechanics Expert
   - Backend API → FastAPI Backend Expert
   - UI components → React Frontend Expert
   - Full features → Full-Stack Integration Expert

2. **Provide context**: Even with custom agents, provide specific details:
   - What feature you're implementing
   - What files you're working with
   - What the expected behavior should be

3. **Combine agents**: For complex tasks, you might need multiple agents:
   - First, design the API contract (@fullstack-integration)
   - Then, implement backend (@fastapi-backend)
   - Finally, build frontend (@react-frontend)

4. **Review and test**: Always review generated code and run tests:
   - Backend: `cd backend && pytest tests/`
   - Frontend: `cd frontend && npm test`
   - Linting: `npm run lint` and `ruff check .`

## Agent Configuration Format

Each agent is defined in a YAML file with the following structure:

```yaml
name: Agent Name
description: Brief description of the agent's expertise

agent:
  type: custom
  version: 1.0.0

expertise:
  - List of specialized knowledge areas

context:
  # Project-specific context and configuration

guidelines:
  do:
    - Best practices and patterns to follow
  dont:
    - Anti-patterns to avoid

code_patterns:
  # Code examples and templates

testing:
  # Testing requirements and patterns

quality:
  # Code quality standards
```

## Updating Custom Agents

When the project evolves, update the agent configurations to reflect:

1. **New features**: Add new capabilities to agent expertise
2. **Pattern changes**: Update code patterns and examples
3. **Best practices**: Refine guidelines based on lessons learned
4. **New tools**: Include new frameworks or libraries

To update an agent:
1. Edit the corresponding YAML file
2. Test the agent with sample prompts
3. Document the changes in this README
4. Commit the updates

## Project Architecture Overview

The WuXuxian TTRPG webapp uses a three-tier architecture:

```
Frontend (React + TypeScript)
    ↓ HTTP/REST API
Backend (FastAPI + SQLAlchemy)
    ↓ SQL/ORM
Database (PostgreSQL)
```

**Frontend**: React 18 + TypeScript + Vite (Port 5173)
**Backend**: FastAPI + SQLAlchemy + Python 3.12 (Port 8000)
**Database**: PostgreSQL 15 (Port 5432)

## Key Technologies

- **Backend**: FastAPI, SQLAlchemy, Pydantic, pytest
- **Frontend**: React, TypeScript, Vite, Vitest, React Testing Library
- **Database**: PostgreSQL
- **DevOps**: Docker, Docker Compose, GitHub Actions
- **Code Quality**: Black, Ruff, ESLint, Prettier

## Additional Resources

- [Main README](../../README.md): Project overview and setup
- [Architecture Documentation](../../ARCHITECTURE.md): Detailed system architecture
- [Contributing Guide](../../CONTRIBUTING.md): How to contribute
- [Security Policy](../../SECURITY.md): Security best practices
- [Troubleshooting](../../TROUBLESHOOTING.md): Common issues and solutions

## Feedback and Improvements

If you have suggestions for improving these custom agents:
1. Open an issue describing the improvement
2. Submit a PR with updated agent configurations
3. Share feedback in team discussions

Custom agents are living documents that should evolve with the project!
