# TEAM SHAURYAM — Chandrayaan-2 Lunar Ice Detection & Rover Mission Dashboard
## Phase 1 Interactive Scientific Dashboard & Exploration System

**Team Name:** TEAM SHAURYAM (ISRO AITHON 2.0 Hackathon)  
**Project Title:** Detection & Characterization of Subsurface Ice in Lunar South Polar Regions Using Chandrayaan-2 DFSAR Radar + OHRC Imagery for Landing Site Selection & Rover Traverse Planning  
**Tagline:** *From radar echoes to rover tracks: finding lunar water, and the safest way to reach it.*  
**Local Development Directory:** `dashboard phase 1/`  
**Deployment Policy:** STRICT LOCAL DEVELOPMENT ONLY. No Git repositories created, no cloud publishing performed. Ready for manual deployment by researcher.

---

## 1. Project Overview & Architecture

This dashboard communicates the entire end-to-end planetary science workflow in one continuous, responsive, research-grade experience:
1. **Mission Overview & KPIs:** Regional context (80°S – 90°S), research discovery spotlight on Cabeus B (CAND_052 ice deposit + LS_38 prime landing site), and 8 verified metrics traced to local project files.
2. **Data Ingestion:** Complete audit of 1,844 cataloged project files, including 5.72 GB of raw Chandrayaan-2 DFSAR L-band Level-0A telemetry, LOLA laser altimetry, and OHRC observation footprints.
3. **Preprocessing & Quality Control:** Multi-sensor spatial coregistration on the standard 80.0 m/pixel Lunar South Polar Stereographic analytical grid, Horn's slope derivation, and spatial coherence boosting.
4. **Radar Polarimetry & Ice Evidence:** Strict distinction of evidentiary levels; non-fabrication disclosure of pending SAR focusing on Level-0A telemetry; team decision rule (`CPR > 1.0 AND DOP < 0.13`); and verified 3-tier confidence stratification (Tier 3 = 8.95 km², Tier 2 = 10.27 km², Tier 1 = 238.22 km²).
5. **Candidate-Region Explorer:** Detailed interactive inspection of 28 ranked polar cold traps, highlighting discovery candidate CAND_052.
6. **Landing-Site Assessment:** Fuzzy Cognitive Map (FCM) ranking of 97 candidate landing cells, highlighting prime novel touchdown site LS_38 (slope 2.17°, 100% illumination, 2.83 km to ice).
7. **Rover Traverse & 3D Simulation:** Preserves and executes the real 3D Plotly lunar mesh model (`cabeus_b_3d_interactive_model.html`) with camera controls, the real research GIF animation (`rover_traverse_cabeus_b_mission_animation.gif`), and 47-waypoint DIC3D-A* telemetry.
8. **Mission Insights & ISRU:** 6 mandatory synthesis subsections, 3-scenario Looyenga-Landau-Lifshitz (LLL) dielectric mixing ice reserves (52.55 Mt nominal), and continuous 114.05 t/yr bipropellant ISRU plant balances.
9. **Methodology, Equations & Provenance:** Exact mathematical formulations, variables, units, and page citations to the official proposal PDF, plus documentation links.
10. **Future Work (Section 22):** Interactive 6-stage roadmap toward an Autonomous, Self-Recovering Lunar Rover, closed-loop perception-to-recovery system architecture diagram, and core engineering challenges.

---

## 2. Directory Structure

```text
dashboard phase 1/
├── public/
│   └── assets/
│       ├── animations/           # Genuine project GIF animations (23 MB Cabeus B rover traverse)
│       ├── figures/              # High-resolution PNG figures from Phase 1, Phase 2, and model evidence
│       ├── maps/                 # Cartographic publication maps from Phase 3, Phase 4, and Phase 5
│       └── models/               # Genuine interactive 3D HTML Plotly model (77x83 mesh + waypoints)
├── src/
│   ├── components/               # Navbar, EvidenceBadge, MetricCard, ImageViewerModal
│   ├── data/                     # 18 JSON datasets parsed from authoritative project CSVs
│   ├── sections/                 # 10 modular, research-oriented dashboard sections
│   ├── App.jsx                   # Main React container with scroll tracking and image modal
│   ├── index.css                 # Comprehensive deep-space dark design system
│   └── main.jsx                  # React 18 DOM mount point
├── docs/
│   ├── source_asset_inventory.md # Complete audit of all source files, types, and browser safety
│   ├── data_provenance.md        # Strict bidirectional mapping between metrics and source files
│   └── scientific_limitations.md # Full disclosure of telemetry, resolution, and sensor limits
├── index.html                    # HTML entry point with Google Fonts
├── package.json                  # Dependencies (React, Lucide icons, Vite)
├── vite.config.js                # Vite build and dev server configuration
├── vercel.json                   # Standalone manual deployment configuration
└── README.md                     # Comprehensive project documentation and manual deployment guide
```

---

## 3. System Requirements & Hardware Design

The dashboard was engineered specifically to run smoothly on lightweight laptops (e.g., Intel i5, 16 GB RAM, integrated graphics):
- **Node.js:** v18.0.0 or later (Tested on Node v25.9.0 with npm 11.12.1).
- **Modern Web Browser:** Chrome, Edge, Firefox, or Safari with WebGL enabled (for 3D Plotly rendering).
- **Memory Footprint:** Precomputed JSON summaries and optimized web assets avoid loading multi-gigabyte satellite GeoTIFFs into browser memory.

---

## 4. Local Installation & Development Commands

### Step A: Navigate to the Dashboard Folder
Open PowerShell or your command terminal in the project directory:
```powershell
cd "c:\Users\DELL\Downloads\Lunar_ice_detection_2\dashboard phase 1"
```

### Step B: Install Dependencies
```powershell
npm install
```

### Step C: Start Local Development Server
```powershell
npm run dev
```
Open your browser to:
```text
http://localhost:3000
```

### Step D: Build for Production
To generate the optimized static production bundle in `dist/`:
```powershell
npm run build
```

### Step E: Preview Production Build Locally
```powershell
npm run preview
```
Open the displayed local URL (typically `http://localhost:4173`).

---

## 5. Organization of Assets & Scientific Data

All data shown in the dashboard is 100% traceable to local project files:
- **`src/data/`**: JSON files generated directly from `outputs/phase*/` CSV tables without data fabrication.
- **`public/assets/models/`**: Real Plotly 3D HTML model `cabeus_b_3d_interactive_model.html` extracted directly from `output_from_masterplan/3d_animation/`.
- **`public/assets/animations/`**: Real research GIF `rover_traverse_cabeus_b_mission_animation.gif` (23.11 MB) displaying the 4.74 km descent trajectory.
- **`public/assets/maps/` & `figures/`**: Lossless publication cartographic maps from `outputs/phase3/maps`, `phase4/maps`, and `phase5/maps`.

---

## 6. Troubleshooting

- **3D Model Not Displaying:** Ensure your browser has WebGL hardware acceleration enabled. The model loads via iframe from `/assets/models/cabeus_b_3d_interactive_model.html` using the official Plotly v3.0.1 CDN script.
- **GIF Animation Lag:** The GIF is 23.11 MB to maintain high cartographic fidelity. On slower connections or older hardware, allow a few seconds for full local caching.
- **Port 3000 In Use:** If port 3000 is occupied, Vite will automatically select the next available port (e.g., 3001). Check the terminal output for the active URL.

---

## 7. Manual Vercel Deployment Instructions (When Ready)

When you are ready to publish the dashboard online manually, follow these steps:

### Option A: Via Vercel CLI (Manual)
1. Install the Vercel CLI globally if not already installed:
   ```powershell
   npm install -g vercel
   ```
2. Log in to your personal Vercel account:
   ```powershell
   vercel login
   ```
3. Navigate into the dashboard folder:
   ```powershell
   cd "dashboard phase 1"
   ```
4. Deploy manually:
   ```powershell
   vercel
   ```
5. Follow the interactive prompts:
   - Set project name (e.g., `team-shauryam-lunar-dashboard`).
   - Confirm framework preset as `Vite`.
   - Confirm output directory as `dist`.

### Option B: Via GitHub & Vercel Dashboard (Manual)
1. Initialize a private or public GitHub repository manually (e.g., via GitHub Desktop or web interface).
2. Push the contents of `dashboard phase 1/` to the repository.
3. In the Vercel Dashboard (`vercel.com`):
   - Click **Add New Project**.
   - Import your repository.
   - If deploying from a monorepo, set **Root Directory** to `dashboard phase 1`.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click **Deploy**.

---

**TEAM SHAURYAM | Chandrayaan-2 Lunar South Pole Mission Architecture | Local Research Deliverable**
