# Asteroid Game - Cloudflare Pages

This is a static version of the Asteroids game optimized for deployment on Cloudflare Pages.

## Deployment

### Option 1: Automatic Git Deployment
1. Push this folder to a Git repository
2. Connect the repository to Cloudflare Pages
3. Set the build output directory to `cloudflare-pages`
4. Deploy automatically on git pushes

### Option 2: Direct Upload
1. Install Wrangler CLI: `npm install -g wrangler`
2. Login: `wrangler login`
3. Deploy: `npm run deploy`

### Option 3: Manual Upload
1. Zip all files in this directory
2. Upload via Cloudflare Pages dashboard

## Features

- Optimized for static hosting
- Security headers configured
- Asset caching optimization
- CSP policies for security
- Zero build process required

## Local Development

```bash
# Using Python
npm run serve

# Using Wrangler
npm run preview
```

## Files

- `index.html` - Main game page
- `game.js` - Game logic
- `style.css` - Game styling  
- `_headers` - HTTP headers configuration
- `_redirects` - Redirect rules
- `wrangler.toml` - Wrangler configuration
- `package.json` - Project configuration

The game works entirely in the browser with no server-side requirements.