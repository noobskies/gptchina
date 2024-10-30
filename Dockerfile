# Base node image
FROM node:20-alpine AS node

RUN apk --no-cache add curl

RUN mkdir -p /app && chown node:node /app
WORKDIR /app

USER node

COPY --chown=${UID}:${GID} .env.production /app/.env.production
COPY --chown=${UID}:${GID} .env.production /app/client/.env.production

COPY --chown=node:node . .

# Add debug steps before the build
RUN echo "=== DEBUG: Environment Files ===" && \
    ls -la .env* && \
    ls -la client/.env* && \
    echo "=== DEBUG: ENV Contents ===" && \
    cat .env.production && \
    echo "=== DEBUG: Directory Structure ===" && \
    pwd && \
    ls -la && \
    ls -la client/

RUN \
    # Allow mounting of these files, which have no default
    touch .env ; \
    # Create directories for the volumes to inherit the correct permissions
    mkdir -p /app/client/public/images /app/api/logs ; \
    npm config set fetch-retry-maxtimeout 600000 ; \
    npm config set fetch-retries 5 ; \
    npm config set fetch-retry-mintimeout 15000 ; \
    npm install --no-audit; \
    # Add debug for environment before build
    echo "=== DEBUG: Environment before build ===" && \
    env && \
    # React client build with explicit environment loading
    cd client && \
    NODE_OPTIONS="--max-old-space-size=2048" NODE_ENV=production \
    sh -c 'set -a && . ../.env.production && set +a && npm run build' ; \
    cd .. && \
    npm prune --production; \
    npm cache clean --force

RUN mkdir -p /app/client/public/images /app/api/logs

# Node API setup
EXPOSE 3080
ENV HOST=0.0.0.0
CMD ["npm", "run", "backend"]