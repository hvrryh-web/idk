COMPOSE ?= docker compose
DB_CONTAINER ?= db
DB_NAME ?= wuxuxian
DB_USER ?= postgres
DB_PASSWORD ?= postgres

.PHONY: up down logs migrate seed psql

up:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down -v

logs:
	$(COMPOSE) logs -f

migrate:
	$(COMPOSE) exec -T $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME) -f /docker-entrypoint-initdb.d/00-schema.sql

seed:
	$(COMPOSE) exec -T $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME) -f /docker-entrypoint-initdb.d/10-seed.sql

psql:
	$(COMPOSE) exec $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME)

# Common Dev Workflows
.PHONY: build test lint format start

build:
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

test:
	./start-tests.sh

lint:
	cd backend && ruff check .
	cd frontend && npm run lint

format:
	cd backend && black . && isort .
	cd frontend && npm run format

start:
	cd infra && docker-compose up -d
	cd backend && uvicorn app.main:app --reload --port 8000 &
	cd frontend && npm run dev
