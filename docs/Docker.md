# Docker Compose Cheat Sheet

## Basic Commands
```bash
# Start services
docker-compose up

# Start services in detached mode
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View running containers
docker-compose ps

# View logs
docker-compose logs

# Build/rebuild services
docker-compose build
```

## Common Tasks
```bash
# Scale specific services
docker-compose up -d --scale service=3

# Execute command in running container
docker-compose exec service_name command

# View container logs
docker-compose logs service_name

# Remove all stopped containers
docker-compose rm
```

## Configuration
```yaml
# Example docker-compose.yml structure
services:
    web:
        image: nginx:latest
        ports:
            - "80:80"
        volumes:
            - ./app:/usr/share/nginx/html
    db:
        image: postgres:latest
        environment:
            POSTGRES_PASSWORD: example
```

## Tips
- Use `.env` files for environment variables
- Version your compose files
- Use named volumes for data persistence
- Always specify container versions