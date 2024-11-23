.PHONY: start-project start-app migrate migrations runserver allmigrations push testapi
.DEFAULT_GOAL := runserver
HOSTNAME = localhost:8000
POETRY_RUN = poetry run
POETRY_RUN_DJANGO = $(POETRY_RUN) python manage.py

start-project:
	@echo "--- Starting project: $(project) ---" 
	$(POETRY_RUN) django-admin startproject $(project) .
	@echo

start-app:
	@echo "--- Starting app: $(app) ---" 
	$(POETRY_RUN_DJANGO) startapp $(app)
	@echo

migrate:
	@echo "--- Migrating database ---"
	$(POETRY_RUN_DJANGO) migrate
	@echo

migrations:
	@echo "--- Creating migrations ---"
	$(POETRY_RUN_DJANGO) makemigrations
	@echo

runserver:
	@echo "--- Running server on port 8000 ---"
	$(POETRY_RUN_DJANGO) runserver
	@echo

allmigrations: migrations migrate

# Add files to git:
add:
	@echo "--- Adding files to  git ---"
	@while [ -z "$$file" ]; do \
		read -p "Enter file to add: " file; \
	done; \
	git add "$$file"
	@echo


# Commit files to git:
commit:
	@echo "--- Committing files with message: $(message) ---"
	@while [ -z "$$message" ]; do \
			read -p "Enter message to Commit: " message; \
	done; \
	git commit -m "$$message"
	@echo


# Push files to git:
push_remote:
	@echo "--- Pushing to remote repository ---"
	git push
	@echo "--- Push complete ---"
	@echo


push: add commit push_remote
	@echo "--- All done ---"
	@echo


CONTENT_TYPE := application/json

# Define a generic test function
define test
  @echo "--- Testing $(1) API: http://$(HOSTNAME)/$(endpoint)/  ---"
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
	@echo "--- Testing module: $(module) ---"
	$(POETRY_RUN_DJANGO) test $(module)

testall:
	@echo "--- Testing all modules ---"
	$(POETRY_RUN_DJANGO) test

clean:
	@echo "--- Cleaning up pycahe files  ---"
	rm -rf */__pycache__
	@echo
	@echo "--- Cleaning up migrations files  ---"
	rm -f *.sqlite3
	@echo
	@echo "--- Cleaning up log files  ---"     
	rm -rf logs/
	@echo
	@echo "--- Cleaning up migrations files  ---"
	rm -rf */migrations/
	@echo

lint:
	@echo "Linting code with pycodestyle ---"
	$(POETRY_RUN) pycodestyle ./*.py
	@echo "Checking type hints with mypy ---"
	$(POETRY_RUN) mypy ./


shell:
	@echo "--- Starting Django shell ---"
	poetry shell
	@echo

