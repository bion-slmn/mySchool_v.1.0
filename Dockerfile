FROM python:3.12-alpine

# Install necessary packages
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

WORKDIR /src/app

ADD pyproject.toml poetry.lock ./
RUN pip install --upgrade pip
RUN pip install poetry
RUN poetry install

ADD . /src/app/

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN chmod +x /src/app/entrypoint.sh

ENTRYPOINT ["/src/app/entrypoint.sh"]
