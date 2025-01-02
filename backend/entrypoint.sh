#!/bin/bash

source "$(poetry env info --path)/bin/activate"

echo "Applying database migrations..."
poetry run python manage.py makemigrations
poetry run python manage.py migrate
echo "--- Migrations complete ---"

poetry run python manage.py runserver 0.0.0.0:8000 --reload