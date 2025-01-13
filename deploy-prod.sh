#!/bin/bash
set -e

echo "Starting production deployment process..."
# chmod +x ./scripts/wait-for-it.sh

docker-compose down -v
DOCKER_BUILDKIT=1 docker-compose --profile production up --build

echo "Deployment completed successfully"