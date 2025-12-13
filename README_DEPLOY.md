# GitHub Pages Deployment Guide

This guide explains how to deploy the WuXuxian TTRPG landing page to GitHub Pages for free public hosting.

## Quick Start

The landing page is already configured for GitHub Pages. Once enabled, it will be available at:

```
https://hvrryh-web.github.io/idk/
```

## Files Structure

The static website consists of:

```
/
├── index.html      # Main landing page
├── styles.css      # Stylesheet
├── script.js       # Interactive features (dark mode, etc.)
├── alpha-landing.html  # Alpha test diagnostics page
└── landing/        # Additional landing page variant
    ├── index.html
    ├── game.html
    └── assets/
```

## Local Development

### Option 1: Simple (Open Directly)

Simply open `index.html` in your browser:

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

### Option 2: Local Static Server (Recommended)

Using a local server provides a more accurate testing experience.

**With Python (Python 3):**
```bash
# Navigate to repository root
cd /path/to/idk

# Start server on port 8080
python -m http.server 8080

# Open in browser
# http://localhost:8080
```

**With Python 2:**
```bash
python -m SimpleHTTPServer 8080
```

**With Node.js (npx serve):**
```bash
# No installation needed - uses npx
npx serve .

# Or specify port
npx serve . -l 8080

# Open in browser
# http://localhost:8080
```

**With Node.js (http-server):**
```bash
# Install globally (one-time)
npm install -g http-server

# Run server
http-server . -p 8080

# Open in browser
# http://localhost:8080
```

**With PHP:**
```bash
php -S localhost:8080
```

## Deploy to GitHub Pages

### Step 1: Push Code to GitHub

If you haven't already:

```bash
git add index.html styles.css script.js
git commit -m "Add GitHub Pages landing page"
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/hvrryh-web/idk
2. Click **Settings** (gear icon in the top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### Step 3: Wait for Deployment

- GitHub will build and deploy your site (usually 1-5 minutes)
- Check the **Actions** tab to monitor deployment progress
- A green checkmark indicates successful deployment

### Step 4: Access Your Site

Your site will be available at:

```
https://hvrryh-web.github.io/idk/
```

## Alternative: Deploy from /docs Folder

If you prefer to keep website files separate:

1. Move files to a `/docs` folder:
   ```bash
   mkdir -p docs
   mv index.html styles.css script.js docs/
   git add docs/
   git commit -m "Move website to docs folder"
   git push origin main
   ```

2. In GitHub Pages settings, select:
   - Folder: `/docs`

## Troubleshooting

### Site Not Loading / 404 Error

**Cause:** GitHub Pages not enabled or still deploying.

**Solution:**
1. Check **Settings → Pages** to ensure Pages is enabled
2. Check **Actions** tab for deployment status
3. Wait 5-10 minutes for initial deployment
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### CSS/JS Not Loading

**Cause:** Incorrect file paths or case sensitivity.

**Solution:**
1. Ensure file names match exactly (case-sensitive)
2. Check that `styles.css` and `script.js` are in the same folder as `index.html`
3. Clear browser cache

### Changes Not Appearing

**Cause:** Browser caching or deployment delay.

**Solution:**
1. Wait 2-5 minutes after pushing changes
2. Hard refresh browser
3. Check **Actions** tab for deployment completion
4. Try incognito/private browsing mode

### Custom Domain Setup (Optional)

To use a custom domain:

1. Add a `CNAME` file to your repository root:
   ```
   yourdomain.com
   ```

2. Configure DNS settings with your domain provider:
   - Add a CNAME record pointing to `hvrryh-web.github.io`

3. In GitHub Pages settings, enter your custom domain

## Expected URL Format

| Repository | GitHub Pages URL |
|------------|------------------|
| `hvrryh-web/idk` | `https://hvrryh-web.github.io/idk/` |
| `username/repo` | `https://username.github.io/repo/` |
| `username/username.github.io` | `https://username.github.io/` |

## Existing Deployment Workflows

This repository includes pre-configured GitHub Actions workflows:

- `.github/workflows/deploy-pages.yml` - Deploys `/landing` folder
- `.github/workflows/static.yml` - Deploys entire repository root

These workflows automatically deploy on push to `main` branch.

## Features of the Landing Page

- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Dark Mode Toggle** - Press 'T' or click the moon/sun icon
- ✅ **Accessible** - Semantic HTML, ARIA attributes, keyboard navigation
- ✅ **Skip Links** - For screen reader users
- ✅ **Smooth Scrolling** - Animated navigation between sections
- ✅ **No External Dependencies** - Uses system fonts, no frameworks
- ✅ **Fast Loading** - Minimal, optimized assets

## Support

For issues or questions:
- [Open an Issue](https://github.com/hvrryh-web/idk/issues/new)
- [View Discussions](https://github.com/hvrryh-web/idk/discussions)
- Email: hvrryh.web@gmail.com
