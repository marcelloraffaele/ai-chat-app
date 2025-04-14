FROM mcr.microsoft.com/devcontainers/java:21

# Install Maven
ARG MAVEN_VERSION=3.9.5
RUN su vscode -c "umask 0002 && . /usr/local/sdkman/bin/sdkman-init.sh && sdk install maven ${MAVEN_VERSION}"

# Install Node.js
ARG NODE_VERSION=18
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y nodejs

# [Optional] Install additional OS packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends git curl

# Set the default shell to bash
ENV SHELL=/bin/bash