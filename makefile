.PHONY: start-project start-app migrate migrations runserver allmigrations push testapi
.DEFAULT_GOAL := runserver
HOSTNAME = localhost:8000
POETRY_RUN = poetry run
POETRY_RUN_DJANGO = $(POETRY_RUN) python manage.py

start-project:
	@echo "Starting project: $(project)..." 
	$(POETRY_RUN) django-admin startproject $(project) .

start-app:
	@echo "Starting app: $(app)..." 
	$(POETRY_RUN_DJANGO) startapp $(app)

migrate:
	@echo "Migrating database..."
	$(POETRY_RUN_DJANGO) migrate

migrations:
	@echo "Creating migrations..."
	$(POETRY_RUN_DJANGO) makemigrations

runserver:
	@echo "Running server on port 8000..."
	$(POETRY_RUN_DJANGO) runserver

allmigrations: migrations migrate

files ?= .
message ?= "Update code"

push:
	@echo "Adding files: $(files)..."
	git add .
	@echo "Committing with message: '$(message)'..."
	git commit -m "$(message)"
	@echo "Pushing to GitHub..."
	git push


CONTENT_TYPE := application/json

# Define a generic test function
define test
  @echo "Testing $(1) API: http://$(HOSTNAME)/$(endpoint)/ ..."
  $(POETRY_RUN) curl -X $(1) http://$(HOSTNAME)/$(endpoint)/ \
    -H "Content-Type: $(CONTENT_TYPE)" \
    $(if $(2),-d '$(2)',) | jq
endef


# Define specific test targets
.PHONY: testget testpost testput testdelete, clean

testget:
	$(call test,GET,$(data))

testpost:
	$(call test,POST,$(data))

testput:
	$(call test,PUT,$(data))

testdelete:
	$(call test,DELETE,$(data))

testmodule:
	@echo "Testing module: $(module)..."
	$(POETRY_RUN_DJANGO) test $(module)

testall:
	@echo "Testing all modules..."
	$(POETRY_RUN_DJANGO) test

clean:
	@echo "Cleaning up pycahe files ..."
	rm -rf */__pycache__ 
	@echo "Cleaning up migrations files ..."
	rm -f *.sqlite3
	@echo "Cleaning up log files ..."     
	rm -rf logs/

lint:
	@echo "Linting code with pycodestyle..."
	$(POETRY_RUN) pycodestyle ./*.py
	@echo "Checking type hints with mypy..."
	$(POETRY_RUN) mypy ./

