# 🎮 WuXuxian TTRPG - Alpha Test Web Application

Welcome to the **WuXuxian TTRPG Alpha Test**! This is a web-based tabletop role-playing game set in a mystical cultivation world where you forge your path to immortality.

---

## 📋 Table of Contents

1. [What is This?](#what-is-this)
2. [Quick Start Guide](#quick-start-guide)
3. [Step-by-Step Instructions](#step-by-step-instructions)
4. [How to Play](#how-to-play)
5. [Troubleshooting](#troubleshooting)
6. [Getting Help](#getting-help)

---

## What is This?

**WuXuxian TTRPG** is a cultivation-themed tabletop role-playing game where you:

- 🧙 **Create Characters** with unique cultivation paths, soul cores, and domain sources
- ⚔️ **Engage in Combat** using a Monte Carlo simulation engine
- 📚 **Explore Lore** through an in-game wiki and System Reference Document (SRD)
- 🎭 **Experience Stories** through a visual novel-style interface

This **Alpha Test** allows you to try out the game's core features before the official release.

---

## Quick Start Guide

### If You Just Want to See the Landing Page

The landing page is hosted on GitHub Pages. Simply visit:

🔗 **[https://hvrryh-web.github.io/idk/](https://hvrryh-web.github.io/idk/)**

### If You Want to Run the Full Game

You'll need to run the game server on your own computer. Here's the quick version:

```bash
# 1. Clone the repository
git clone https://github.com/hvrryh-web/idk.git
cd idk

# 2. Start everything
./start-alpha.sh

# 3. Open in browser
# Visit http://localhost:5173
```

---

## Step-by-Step Instructions

### Prerequisites (What You Need First)

Before you start, make sure you have these programs installed on your computer:

| Program | What It's For | How to Check | How to Install |
|---------|--------------|--------------|----------------|
| **Git** | Downloading the code | `git --version` | [git-scm.com](https://git-scm.com/) |
| **Docker** | Running the database | `docker --version` | [docker.com](https://docs.docker.com/get-docker/) |
| **Node.js** | Running the game interface | `node --version` | [nodejs.org](https://nodejs.org/) (v16 or higher) |
| **Python** | Running the game server | `python3 --version` | [python.org](https://www.python.org/) (v3.8 or higher) |

**Don't have these?** Don't worry! Follow the installation links above - they're all free and have easy installers.

---

### Step 1: Download the Game

Open your **Terminal** (Mac/Linux) or **Command Prompt** (Windows) and type:

```bash
git clone https://github.com/hvrryh-web/idk.git
```

This downloads all the game files to your computer.

Then enter the game folder:

```bash
cd idk
```

---

### Step 2: Start the Game Services

Run this single command to start everything:

```bash
./start-alpha.sh
```

**On Windows?** Use Git Bash or WSL, or run these commands instead:
```bash
# Windows alternative
cd infra && docker compose up -d && cd ..
cd backend && python -m venv .venv && .venv\Scripts\activate && pip install -r requirements.txt && python -m uvicorn app.main:app --reload --port 8000
# (In a new terminal)
cd frontend && npm install && npm run dev
```

**What happens:**
1. ✅ PostgreSQL database starts (for saving your characters)
2. ✅ Backend server starts (the game logic)
3. ✅ Frontend starts (what you see in your browser)

Wait until you see:
```
============================================
🎮 Alpha Test Ready!
============================================
```

---

### Step 3: Open the Game

Open your web browser and go to:

🎮 **http://localhost:5173** - The main game interface

Or use the landing page:

🏠 **Open `docs/index.html`** in your browser - The control panel

---

### Step 4: Play!

You're in! Now you can:
- Create a new character
- Explore the game world
- Try combat simulations
- Read the wiki and SRD

---

## How to Play

### Creating Your First Character

1. **Open the Game** at http://localhost:5173
2. **Click "Character Manager"** in the navigation
3. **Click "Create New Character"**
4. **Fill in the details:**
   - **Name**: Your character's name
   - **Cultivation Path**: Your martial arts style
   - **Soul Core**: Your inner power source
   - **Domain Source**: Your special abilities

5. **Save** and start playing!

### Game Interface Overview

| Section | What It Does |
|---------|-------------|
| **Game Room** | Main hub - start your journey here |
| **Character Sheets** | View and edit your character's stats |
| **Wiki** | Learn about the game world and lore |
| **SRD Book** | Official rules and mechanics |
| **Combat Sim** | Test battles and strategies |

### Combat System Basics

WuXuxian uses a unique combat system:

1. **1-Beat Combat**: Quick single exchanges
2. **3-Stage Combat**: Extended battles with multiple phases
3. **Monte Carlo Trials**: Run thousands of simulations to test strategies

To try combat:
1. Go to **Combat Simulation**
2. Select your character
3. Choose an opponent (Boss Template)
4. Run the simulation
5. See detailed results!

---

## Troubleshooting

### "The page says Server Offline"

**Problem**: The game server isn't running.

**Solution**: 
1. Open Terminal/Command Prompt
2. Navigate to the game folder: `cd idk`
3. Run: `./start-alpha.sh`
4. Wait for "Alpha Test Ready!" message

### "Docker is not running"

**Problem**: Docker Desktop needs to be started.

**Solution**:
1. Open Docker Desktop application
2. Wait until it says "Docker is running"
3. Try again

### "Port already in use"

**Problem**: Something else is using the game's ports.

**Solution**:
```bash
./stop-alpha.sh
./start-alpha.sh
```

Or manually stop the processes:
```bash
# Find what's using the ports
lsof -i :8000
lsof -i :5173

# Stop them (replace PID with the number shown)
kill PID
```

### "npm/pip command not found"

**Problem**: Node.js or Python isn't installed properly.

**Solution**: 
- For npm: Reinstall Node.js from [nodejs.org](https://nodejs.org/)
- For pip: Reinstall Python from [python.org](https://www.python.org/)

Make sure to check "Add to PATH" during installation!

### "Page won't load in browser"

**Problem**: Services might still be starting.

**Solution**:
1. Wait 30 seconds after running start-alpha.sh
2. Refresh the page
3. Check the terminal for error messages

---

## Stopping the Game

When you're done playing:

```bash
./stop-alpha.sh
```

This cleanly stops all services and frees up your computer's resources.

---

## Getting Help

### Found a Bug?

1. Go to: https://github.com/hvrryh-web/idk/issues
2. Click "New Issue"
3. Describe what happened
4. Include any error messages you saw

### Have a Question?

- Check the [Wiki](https://github.com/hvrryh-web/idk/wiki)
- Read the [Architecture Guide](https://github.com/hvrryh-web/idk/blob/main/ARCHITECTURE.md)
- Open a [Discussion](https://github.com/hvrryh-web/idk/discussions)

### Want to Contribute?

See our [Contributing Guide](https://github.com/hvrryh-web/idk/blob/main/CONTRIBUTING.md)

---

## File Structure

```
docs/
├── index.html      # Landing page with server controls
├── game.html       # Game interface page
├── styles.css      # Visual styling
├── config.js       # Configuration settings
├── app.js          # Application logic
├── assets/         # Images and icons
└── README.md       # This file!
```

---

## Technical Details

### For Developers

The static site uses:
- Pure HTML/CSS/JavaScript (no build step required)
- State machine pattern for server status
- Fetch API for health checks
- Session storage for state persistence

### Configuration

Edit `config.js` to change:
- API endpoints
- Polling intervals
- Feature flags
- UI text

### Deploying Your Own Version

1. Fork the repository
2. Enable GitHub Pages in Settings → Pages
3. Set source to "GitHub Actions"
4. Push to main branch
5. Your site will be at `https://YOUR-USERNAME.github.io/idk/`

---

## Version Info

- **Version**: Alpha 0.1.0
- **Last Updated**: December 2024
- **Status**: Active Development

---

<div align="center">

**Happy Cultivating! 🎮⚔️🧙**

*May your path to immortality be filled with adventure!*

</div>
