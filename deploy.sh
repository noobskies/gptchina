#!/bin/bash

# Pull the latest changes from your repository
echo "Pulling latest changes..."
git pull

# Build the services with full verbose logging
echo "Building services with verbose logging..."
# Option 1: Disable BuildKit for maximum verbosity
# DOCKER_BUILDKIT=0 sudo docker-compose -f docker-compose.yml -f docker-compose.override.yml build --no-cache --progress=plain

# Option 2: Keep BuildKit but use plain progress (recommended)
sudo docker-compose -f docker-compose.yml -f docker-compose.override.yml build --no-cache --progress=plain

# Stop and remove all containers
echo "Stopping and removing containers..."
sudo docker-compose -f docker-compose.yml -f docker-compose.override.yml down --remove-orphans

# Start up the services
echo "Starting services..."
sudo docker-compose -f docker-compose.yml -f docker-compose.override.yml up --force-recreate -d

echo "Deployment complete!"