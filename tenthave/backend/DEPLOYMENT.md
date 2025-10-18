# Deployment Guide - 10th Avenue Bible Chapel Backend

This guide provides comprehensive instructions for deploying the 10th Avenue Bible Chapel backend API to production.

## 🚀 Deployment Options

### Option 1: Traditional VPS/Server Deployment

#### Prerequisites

- Ubuntu 20.04+ or CentOS 8+ server
- Node.js 18+ installed
- PostgreSQL 13+ installed
- Nginx installed
- SSL certificate (Let's Encrypt recommended)
- Domain name configured

#### Step 1: Server Setup

1. **Update system packages**

   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js 18+**

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PostgreSQL**

   ```bash
   sudo apt install postgresql postgresql-contrib -y
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

4. **Install Nginx**

   ```bash
   sudo apt install nginx -y
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

5. **Install PM2 for process management**
   ```bash
   sudo npm install -g pm2
   ```

#### Step 2: Database Setup

1. **Create database and user**

   ```bash
   sudo -u postgres psql
   ```

   ```sql
   CREATE DATABASE tenthave_db;
   CREATE USER tenthave_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE tenthave_db TO tenthave_user;
   \q
   ```

2. **Configure PostgreSQL for remote connections**

   ```bash
   sudo nano /etc/postgresql/13/main/postgresql.conf
   ```

   Uncomment and modify:

   ```
   listen_addresses = 'localhost'
   ```

   ```bash
   sudo nano /etc/postgresql/13/main/pg_hba.conf
   ```

   Add:

   ```
   local   tenthave_db   tenthave_user   md5
   ```

3. **Restart PostgreSQL**
   ```bash
   sudo systemctl restart postgresql
   ```

#### Step 3: Application Deployment

1. **Clone repository**

   ```bash
   cd /var/www
   sudo git clone <repository-url> tenthave-backend
   sudo chown -R $USER:$USER tenthave-backend
   cd tenthave-backend/backend
   ```

2. **Install dependencies**

   ```bash
   npm install --production
   ```

3. **Environment configuration**

   ```bash
   cp env.example .env
   nano .env
   ```

   Configure production values:

   ```env
   NODE_ENV=production
   DATABASE_URL="postgresql://tenthave_user:your_secure_password@localhost:5432/tenthave_db"
   JWT_SECRET="your-super-secure-jwt-secret-key"
   PORT=3001
   CORS_ORIGIN="https://yourdomain.com"
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   ```

4. **Database migration**

   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Build application**

   ```bash
   npm run build
   ```

6. **Create uploads directory**
   ```bash
   mkdir -p uploads
   chmod 755 uploads
   ```

#### Step 4: Process Management with PM2

1. **Create PM2 ecosystem file**

   ```bash
   nano ecosystem.config.js
   ```

   ```javascript
   module.exports = {
     apps: [
       {
         name: "tenthave-backend",
         script: "dist/server.js",
         instances: "max",
         exec_mode: "cluster",
         env: {
           NODE_ENV: "production",
           PORT: 3001,
         },
         error_file: "./logs/err.log",
         out_file: "./logs/out.log",
         log_file: "./logs/combined.log",
         time: true,
         max_memory_restart: "1G",
         node_args: "--max-old-space-size=1024",
       },
     ],
   };
   ```

2. **Start application**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

#### Step 5: Nginx Configuration

1. **Create Nginx configuration**

   ```bash
   sudo nano /etc/nginx/sites-available/tenthave-backend
   ```

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       # Redirect HTTP to HTTPS
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name yourdomain.com www.yourdomain.com;

       # SSL Configuration
       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
       ssl_prefer_server_ciphers off;

       # Security headers
       add_header X-Frame-Options DENY;
       add_header X-Content-Type-Options nosniff;
       add_header X-XSS-Protection "1; mode=block";
       add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

       # API routes
       location /api/ {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
           proxy_read_timeout 300s;
           proxy_connect_timeout 75s;
       }

       # Health check
       location /health {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Static files (uploads)
       location /uploads/ {
           alias /var/www/tenthave-backend/backend/uploads/;
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # Frontend (if serving from same server)
       location / {
           root /var/www/tenthave-frontend/dist;
           try_files $uri $uri/ /index.html;
           expires 1h;
           add_header Cache-Control "public";
       }
   }
   ```

2. **Enable site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/tenthave-backend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

#### Step 6: SSL Certificate

1. **Install Certbot**

   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Obtain SSL certificate**

   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Test auto-renewal**
   ```bash
   sudo certbot renew --dry-run
   ```

### Option 2: Docker Deployment

#### Prerequisites

- Docker and Docker Compose installed
- Domain name configured

#### Step 1: Create Docker Compose file

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://tenthave_user:password@db:5432/tenthave_db
      - JWT_SECRET=your-super-secure-jwt-secret
      - CORS_ORIGIN=https://yourdomain.com
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    restart: unless-stopped

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=tenthave_db
      - POSTGRES_USER=tenthave_user
      - POSTGRES_PASSWORD=your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
      - ./uploads:/var/www/uploads
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Step 2: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

#### Step 3: Deploy

```bash
docker-compose up -d
```

### Option 3: Cloud Platform Deployment

#### Heroku Deployment

1. **Install Heroku CLI**

   ```bash
   npm install -g heroku
   ```

2. **Create Heroku app**

   ```bash
   heroku create tenthave-backend
   ```

3. **Add PostgreSQL addon**

   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set environment variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-super-secure-jwt-secret
   heroku config:set CORS_ORIGIN=https://yourdomain.com
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

#### AWS Deployment

1. **Use AWS Elastic Beanstalk**
2. **Configure RDS for PostgreSQL**
3. **Set up S3 for file uploads**
4. **Configure CloudFront for CDN**

## 🔧 Production Configuration

### Environment Variables

Ensure these are set in production:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
PORT=3001
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@10thavebiblechapel.com
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
CORS_ORIGIN=https://yourdomain.com
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure firewall (only ports 80, 443, 22)
- [ ] Set up regular database backups
- [ ] Configure log rotation
- [ ] Enable fail2ban for SSH protection
- [ ] Set up monitoring and alerting
- [ ] Configure rate limiting
- [ ] Enable CORS for specific origins only

### Monitoring Setup

1. **Install monitoring tools**

   ```bash
   npm install -g pm2-logrotate
   pm2 install pm2-server-monit
   ```

2. **Set up log rotation**

   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 7
   ```

3. **Configure alerts**
   - Set up email alerts for errors
   - Monitor disk space and memory usage
   - Set up uptime monitoring (UptimeRobot, Pingdom)

### Backup Strategy

1. **Database backups**

   ```bash
   # Daily backup script
   #!/bin/bash
   pg_dump tenthave_db > /backups/db_$(date +%Y%m%d_%H%M%S).sql
   find /backups -name "db_*.sql" -mtime +7 -delete
   ```

2. **File backups**

   ```bash
   # Backup uploads directory
   tar -czf /backups/uploads_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/tenthave-backend/backend/uploads/
   ```

3. **Automated backups**
   ```bash
   # Add to crontab
   0 2 * * * /path/to/backup-script.sh
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Database connection errors**

   - Check DATABASE_URL format
   - Verify PostgreSQL is running
   - Check firewall settings

2. **File upload issues**

   - Verify uploads directory permissions
   - Check file size limits
   - Ensure disk space available

3. **Email sending failures**

   - Verify email credentials
   - Check SMTP settings
   - Test with a simple email

4. **Performance issues**
   - Monitor memory usage
   - Check database query performance
   - Review log files for errors

### Log Analysis

```bash
# View application logs
pm2 logs tenthave-backend

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View system logs
sudo journalctl -u nginx -f
```

## 📞 Support

For deployment support:

- Email: info@10thavebiblechapel.com
- Phone: (604) 222-7777

## 🔄 Updates and Maintenance

### Application Updates

1. **Pull latest changes**

   ```bash
   cd /var/www/tenthave-backend
   git pull origin main
   cd backend
   ```

2. **Update dependencies**

   ```bash
   npm install --production
   ```

3. **Run migrations**

   ```bash
   npm run db:migrate
   ```

4. **Rebuild and restart**
   ```bash
   npm run build
   pm2 restart tenthave-backend
   ```

### Regular Maintenance

- Weekly: Check logs for errors
- Monthly: Update system packages
- Quarterly: Review security settings
- Annually: Renew SSL certificates

This deployment guide ensures a secure, scalable, and maintainable production environment for the 10th Avenue Bible Chapel backend API.
