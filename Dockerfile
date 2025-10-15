# syntax=docker/dockerfile:1
# CI-like environment to run local builds/tests

FROM ruby:3.4-bookworm

# Install OS deps and Node.js LTS (20.x)
RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    git \
    jq \
    lsof \
    build-essential \
    locales \
  && rm -rf /var/lib/apt/lists/* \
  && sed -i 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen \
  && locale-gen

ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

# NodeSource for Node 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends nodejs \
  && rm -rf /var/lib/apt/lists/*

# Ensure Bundler version matches Gemfile.lock (2.3.26)
RUN gem install bundler:2.3.26

WORKDIR /work

# Pre-copy only manifests for better Docker layer caching
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Install Ruby deps using Gemfile / Gemfile.lock
COPY Gemfile Gemfile.lock ./
RUN bundle _2.3.26_ install

# Copy the rest of the repo
COPY . .

# Default command runs the quick CI (no serve, no lighthouse)
CMD ["/bin/bash", "-lc", "./scripts/local/build.sh --quick --no-serve"]


