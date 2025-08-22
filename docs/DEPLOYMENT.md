# Deployment Guide

## 🚀 Quick Deploy (30 seconds)

**For immediate deployment, use the stable v1.0.0 release:**

```bash
# Pull the latest stable release
docker pull ghcr.io/jedarden-org/asteroids-game:v1.0.0

# Run on port 80 (production)
docker run -d -p 80:80 --name asteroids-game ghcr.io/jedarden-org/asteroids-game:v1.0.0

# Or run on port 8080 (development)  
docker run -d -p 8080:80 --name asteroids-game-dev ghcr.io/jedarden-org/asteroids-game:v1.0.0
```

**Access the game:** http://localhost (or http://localhost:8080)

## 🐳 Available Docker Images

All images are published to GitHub Container Registry with multiple tags:

### Stable Releases
- `ghcr.io/jedarden-org/asteroids-game:v1.0.0` - Specific v1.0.0 release
- `ghcr.io/jedarden-org/asteroids-game:1.0` - Major.minor (1.0)
- `ghcr.io/jedarden-org/asteroids-game:1` - Major version (1)
- `ghcr.io/jedarden-org/asteroids-game:latest` - Latest stable release

### Development Branches
- `ghcr.io/jedarden-org/asteroids-game:main` - Latest from main branch
- `ghcr.io/jedarden-org/asteroids-game:develop` - Latest from develop branch

## 📋 Production Deployment

### Option 1: Docker Compose (Recommended)

1. **Download the production compose file:**
```bash
curl -O https://raw.githubusercontent.com/jedarden-org/asteroids-game/v1.0.0/docker-compose.prod.yml
```

2. **Deploy:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Verify deployment:**
```bash
docker-compose -f docker-compose.prod.yml ps
curl -f http://localhost
```

### Option 2: Docker with Health Checks

```bash
# Run with health monitoring
docker run -d \
  --name asteroids-game \
  --restart unless-stopped \
  -p 80:80 \
  --health-cmd="curl -f http://localhost:80 || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  ghcr.io/jedarden-org/asteroids-game:v1.0.0
```

### Option 3: Kubernetes Deployment

```yaml
# kubernetes-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: asteroids-game
spec:
  replicas: 3
  selector:
    matchLabels:
      app: asteroids-game
  template:
    metadata:
      labels:
        app: asteroids-game
    spec:
      containers:
      - name: asteroids-game
        image: ghcr.io/jedarden-org/asteroids-game:v1.0.0
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: asteroids-game-service
spec:
  selector:
    app: asteroids-game
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

Deploy with:
```bash
kubectl apply -f kubernetes-deployment.yml
```

## 🔧 Environment-Specific Deployments

### Development Environment
```bash
# Use development port and enable debug logging
docker run -d \
  --name asteroids-game-dev \
  -p 8080:80 \
  -e NGINX_HOST=localhost \
  -e NGINX_PORT=8080 \
  ghcr.io/jedarden-org/asteroids-game:v1.0.0
```

### Staging Environment
```bash
# Use staging configuration
docker run -d \
  --name asteroids-game-staging \
  -p 8080:80 \
  --restart unless-stopped \
  -l environment=staging \
  ghcr.io/jedarden-org/asteroids-game:v1.0.0
```

### Production Environment
```bash
# Production with monitoring and auto-restart
docker run -d \
  --name asteroids-game-prod \
  -p 80:80 \
  --restart unless-stopped \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  -l environment=production \
  ghcr.io/jedarden-org/asteroids-game:v1.0.0
```

## 🔍 Monitoring & Maintenance

### Health Checks
```bash
# Check container health
docker ps
docker logs asteroids-game

# Test application response
curl -f http://localhost/
```

### Update to New Version
```bash
# Pull new version
docker pull ghcr.io/jedarden-org/asteroids-game:latest

# Stop and remove old container
docker stop asteroids-game
docker rm asteroids-game

# Start new container
docker run -d -p 80:80 --name asteroids-game ghcr.io/jedarden-org/asteroids-game:latest
```

### Backup & Restore
Since this is a static game, no data backup is required. Simply redeploy the container.

## 🌐 Reverse Proxy Configuration

### Nginx Reverse Proxy
```nginx
# /etc/nginx/sites-available/asteroids-game
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Apache Reverse Proxy
```apache
# /etc/apache2/sites-available/asteroids-game.conf
<VirtualHost *:80>
    ServerName your-domain.com
    ProxyPass / http://localhost:8080/
    ProxyPassReverse / http://localhost:8080/
    ProxyPreserveHost On
</VirtualHost>
```

### Traefik (Docker Labels)
```bash
docker run -d \
  --name asteroids-game \
  --restart unless-stopped \
  -l traefik.enable=true \
  -l traefik.http.routers.asteroids.rule=Host\(\`your-domain.com\`\) \
  -l traefik.http.services.asteroids.loadbalancer.server.port=80 \
  ghcr.io/jedarden-org/asteroids-game:v1.0.0
```

## 🔒 Security Considerations

### Container Security
- Container runs as non-root user
- Minimal attack surface (nginx:alpine base)
- No writable filesystem areas
- Regular security updates via automated rebuilds

### Network Security
- Configure HTTPS/TLS termination at reverse proxy
- Use security headers (CSP, HSTS, etc.)
- Consider firewall rules for port access

### Production Hardening
```bash
# Run with additional security options
docker run -d \
  --name asteroids-game \
  --restart unless-stopped \
  --read-only \
  --tmpfs /var/cache/nginx \
  --tmpfs /var/run \
  --cap-drop ALL \
  --cap-add CHOWN \
  --cap-add SETUID \
  --cap-add SETGID \
  -p 80:80 \
  ghcr.io/jedarden-org/asteroids-game:v1.0.0
```

## 📊 Performance Tuning

### Resource Limits
```bash
# Set memory and CPU limits
docker run -d \
  --name asteroids-game \
  --memory="128m" \
  --cpus="0.5" \
  -p 80:80 \
  ghcr.io/jedarden-org/asteroids-game:v1.0.0
```

### High-Availability Setup
```bash
# Run multiple instances with load balancing
for i in {1..3}; do
  docker run -d \
    --name asteroids-game-$i \
    -p $((8080 + i)):80 \
    ghcr.io/jedarden-org/asteroids-game:v1.0.0
done
```

## 🆘 Troubleshooting

### Common Issues

1. **Container won't start:**
```bash
# Check logs
docker logs asteroids-game
# Check if port is already in use
netstat -tulpn | grep :80
```

2. **Game not loading:**
```bash
# Test container health
curl -v http://localhost/
# Check nginx configuration
docker exec asteroids-game nginx -t
```

3. **Performance issues:**
```bash
# Monitor resource usage
docker stats asteroids-game
# Check container processes
docker exec asteroids-game ps aux
```

## 📞 Support

- **GitHub Issues**: https://github.com/jedarden-org/asteroids-game/issues
- **Discussions**: https://github.com/jedarden-org/asteroids-game/discussions
- **Documentation**: https://github.com/jedarden-org/asteroids-game/blob/main/README.md

---

**Ready to deploy? Choose your preferred method above and get gaming in minutes! 🎮**