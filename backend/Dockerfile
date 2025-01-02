FROM python:3.9-alpine

RUN apk add --update --no-cache \
    gcc \
    libc-dev \
    libffi-dev \
    openssl-dev \
    bash \
    git \
    libtool \
    m4 \
    g++ \
    autoconf \
    automake \
    build-base \
    postgresql-dev

# Set the working directoryok
WORKDIR /src/app

# Install Poetry and dependencies
RUN pip install --upgrade pip
RUN pip install poetry
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-root

# Copy application files
COPY . /src/app/

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Ensure entrypoint.sh is executable
RUN chmod +x /src/app/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/src/app/entrypoint.sh"]