# Deployment Guide - ALZENT Digital

## Security Configuration for Production

### Apache (.htaccess)

Create or update `.htaccess` file in root directory:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
<IfModule mod_headers.c>
    # Prevent clickjacking
    Header always set X-Frame-Options "DENY"
    
    # Prevent MIME type sniffing
    Header always set X-Content-Type-Options "nosniff"
    
    # Control referrer information
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Restrict browser APIs
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
    
    # HSTS - Force HTTPS for 1 year
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    
    # Content Security Policy
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
</IfModule>

# Prevent access to sensitive files
<FilesMatch "\.(json|md|log)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

### Nginx Configuration

Add to your Nginx server block:

```nginx
# Force HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;
    
    # Root directory
    root /path/to/your/site;
    index index.html;
    
    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Protect sensitive files
    location ~* \.(json|md|log)$ {
        deny all;
    }
    
    # Main location
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Pre-Deployment Checklist

### Security
- [ ] HTTPS certificate installed and valid
- [ ] Security headers configured
- [ ] CSP tested and working
- [ ] All forms have CSRF tokens
- [ ] Rate limiting configured
- [ ] Input validation on backend

### Performance
- [ ] Assets minified (if using build process)
- [ ] Images optimized
- [ ] Caching headers configured
- [ ] CDN configured (if applicable)

### Testing
- [ ] All forms validated
- [ ] Translations working in all languages
- [ ] Navigation tested
- [ ] Mobile responsive tested
- [ ] Cross-browser testing completed

### Compliance
- [ ] Privacy policy published
- [ ] Cookie consent implemented (if needed)
- [ ] GDPR compliance verified
- [ ] Terms of service published

## Environment Variables

If backend is added, configure:

```
API_URL=https://api.yourdomain.com
CSRF_TOKEN_SECRET=your-secret-key
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_MS=60000
```

## Monitoring

### Recommended Tools
- Error tracking (Sentry, Rollbar)
- Analytics (privacy-compliant)
- Uptime monitoring
- Security scanning

### Logs to Monitor
- Form submission attempts
- Failed validations
- Rate limit hits
- Security events

## Backup Strategy

- Regular backups of:
  - Source code
  - Configuration files
  - Database (if applicable)
  - User data (if applicable)

## Rollback Plan

1. Keep previous version available
2. Document deployment process
3. Test rollback procedure
4. Have backup of current production

