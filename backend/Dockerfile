FROM python:3.11-slim

# Set the working directoryok
WORKDIR /src/app

# Install Poetry and dependencies
RUN pip install --upgrade pip
RUN pip install poetry==1.8.5
COPY pyproject.toml poetry.lock ./
RUN poetry install 

# Copy application files
COPY . /src/app/

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Ensure entrypoint.sh is executable
RUN chmod +x /src/app/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/src/app/entrypoint.sh"]