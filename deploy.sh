#!/bin/bash
# Pull the latest changes from your repository
git pull

# Pull latest images that might be used in the build
sudo docker-compose pull

# Rebuild the services if necessary (using cache where possible)
sudo docker-compose build --no-cache

# Start up the services. If there's a new build for a service, it will be recreated.
# The --no-deps flag prevents linked services from being recreated if not necessary.
# The --remove-orphans flag removes containers for services not defined in the
# docker-compose file.
sudo docker-compose up -d --no-deps --remove-orphans
