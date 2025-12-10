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
