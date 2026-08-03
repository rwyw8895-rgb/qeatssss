#!/bin/bash
set -euo pipefail

# Stop all running containers
if [ "$(docker ps -q)" != "" ]; then
  echo "Stopping all containers..."
  docker stop $(docker ps -q)
fi

# Remove all containers
if [ "$(docker ps -aq)" != "" ]; then
  echo "Removing all containers..."
  docker rm -f $(docker ps -aq)
fi

# Remove all images
if [ "$(docker images -q)" != "" ]; then
  echo "Removing all Docker images..."
  docker rmi -f $(docker images -q)
fi

# Remove unused volumes and networks
echo "Pruning unused volumes and networks..."
docker volume prune -f
docker network prune -f

# Rebuild and restart the compose stack
echo "Rebuilding and restarting Docker Compose..."
docker compose down -v --remove-orphans || true
docker compose up --build -d

echo "Done. Your Docker Compose stack has been rebuilt and restarted."
