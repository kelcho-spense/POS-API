#!/bin/bash

# Exit on any error
set -e

echo "Starting development deployment process..."

# Make wait-for-it.sh executable
chmod +x ./scripts/wait-for-it.sh

# Clean up existing containers and volumes
echo "Cleaning up existing containers and volumes..."
if ! docker-compose down -v; then
    echo "Error: Failed to stop containers and remove volumes"
    exit 1
fi

# Rebuild and start containers
echo "Rebuilding and starting containers..."
if ! docker-compose --profile development up --build; then
    echo "Error: Failed to build and start containers"
    exit 1
fi

echo "Deployment completed successfully"