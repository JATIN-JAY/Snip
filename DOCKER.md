# 🐳 Docker Setup & Deployment Guide

## Local Development

### Prerequisites
- Docker Desktop installed
- Docker Compose v2+
- Git

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/JATIN-JAY/Snip.git
cd Snip

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env with your values
# MONGO_USER=your_mongo_user
# MONGO_PASSWORD=your_mongo_password
# JWT_SECRET=your_jwt_secret

# 4. Start services
docker-compose up --build

# 5. Access application
# Frontend: http://localhost
# Backend: http://localhost:3000
# MongoDB: localhost:27017
```

### Useful Docker Commands

```bash
# View running containers
docker ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Stop services
docker-compose down

# Remove data (reset database)
docker-compose down -v

# Rebuild specific service
docker-compose up --build backend

# Execute command in container
docker exec snip-backend npm run migrate

# Shell access to container
docker exec -it snip-backend sh
```

---

## Production Deployment

### 1. Push Images to Docker Hub

```bash
docker login
docker tag snip-backend:v2 YOURUSERNAME/snip-backend:latest
docker tag snip-frontend:latest YOURUSERNAME/snip-frontend:latest

docker push YOURUSERNAME/snip-backend:latest
docker push YOURUSERNAME/snip-frontend:latest
```

### 2. Deploy on Server

```bash
# SSH into server
ssh user@your-server.com

# Clone repository
git clone https://github.com/JATIN-JAY/Snip.git
cd Snip

# Create .env for production
cat > .env << EOF
MONGO_USER=prod_user
MONGO_PASSWORD=generate_strong_password
JWT_SECRET=generate_strong_secret
EOF

# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# Verify services
docker ps
```

### 3. Health Checks

```bash
# Test backend
curl http://localhost:3000/

# Check MongoDB
docker exec snip-mongodb-prod mongosh --eval "db.adminCommand('ping')"

# View Docker stats
docker stats
```

---

## Scaling & Optimization

### Scale Backend to Multiple Instances

```yaml
# docker-compose.prod.yml
backend:
  deploy:
    replicas: 3
```

### Use Docker Swarm/Kubernetes

```bash
# Initialize Swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml snip
```

---

## Security Best Practices

- ✅ Use strong passwords for MongoDB
- ✅ Generate random JWT secrets
- ✅ Use environment variables (never commit secrets)
- ✅ Run containers as non-root
- ✅ Use read-only filesystems where possible
- ✅ Enable logging and monitoring
- ✅ Keep images updated
- ✅ Use network policies

---

## Monitoring & Logging

```bash
# View all logs
docker-compose logs -f

# Export logs
docker-compose logs > logs.txt

# Real-time stats
docker stats

# Inspect container
docker inspect snip-backend
```

---

## Troubleshooting

### Container Won't Start
```bash
docker-compose logs backend
```

### Port Already in Use
```bash
# Change ports in docker-compose.yml
# Or kill process using port:
sudo lsof -i :3000
```

### MongoDB Connection Failed
```bash
# Verify MongoDB is running
docker ps | grep mongodb

# Check logs
docker-compose logs mongodb

# Test connection
docker exec snip-backend mongosh mongodb://root:password@mongodb:27017
```

### Data Persistence
```bash
# Check volumes
docker volume ls

# Backup data
docker run --rm -v snip_mongodb_data:/data -v $(pwd):/backup mongo:7-alpine \
  mongodump --uri "mongodb://root:password@mongodb:27017/snip?authSource=admin" \
  --out /backup/dump
```

---

## CI/CD Integration

See `.github/workflows/deploy.yml` for GitHub Actions automation.

