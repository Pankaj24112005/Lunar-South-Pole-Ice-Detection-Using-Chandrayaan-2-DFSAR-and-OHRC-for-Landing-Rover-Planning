# TEAM SHAURYAM — Chandrayaan-2 Lunar Ice Detection & Rover Mission Dashboard
## Phase 1 Interactive Scientific Dashboard & Planetary Exploration System

**Team Name:** TEAM SHAURYAM (ISRO AITHON 2.0 Hackathon Submission)  
**Project Title:** Detection & Characterization of Subsurface Ice in Lunar South Polar Regions Using Chandrayaan-2 DFSAR Radar + OHRC Imagery for Landing Site Selection, Autonomous Rover Traverse Planning & In-Situ Resource Utilization (ISRU)  
**Project Tagline:** *From radar echoes to rover tracks: finding lunar water, and the safest way to reach it.*  
**Directory:** `dashboard phase 1/`  
**Technology Stack:** React 18, Vite 5, Lucide React, WebGL / Plotly 3D, HTML5/CSS3 Deep Space Design System  
**Deployment Policy:** Local Development & Standalone Research Deployments. Zero dependencies on external cloud backends.

---

## 1. Project Overview & System Purpose

The **Phase 1 Interactive Scientific Dashboard** is a mission-control web application developed for planetary scientists, mission planners, and evaluation judges. It translates complex, multi-gigabyte lunar remote sensing datasets into a responsive, research-grade, dark-mode visual interface.

The application communicates the entire end-to-end scientific pipeline across 10 coordinated modules:
- Ingests and audits **1,844 mission files** across radar, optical, and laser altimetry sensors.
- Enforces strict scientific epistemology: distinguishes indirect orbital radar scattering from in-situ ground truth, providing an **ice-likelihood model** backed by physical principles.
- Showcases the team's primary breakthrough discovery: uncataloged candidate deposit **`CAND_052`** on the Southeast Flank of **Cabeus B** ($20.35\text{ Million Tonnes}$ nominal water ice) paired with prime landing site **`LS_38`** ($2.17^\circ$ touchdown slope, $100\%$ solar illumination, $2.83\text{ km}$ distance to ice).
- Embeds interactive **3D WebGL terrain models**, synchronized **HUD rover traverse animations**, and a **6-stage autonomous rover recovery architecture**.

---

## 2. The 10 Operational Dashboard Sections

The dashboard is organized into 10 modular sections located in `src/sections/`, orchestrated by `App.jsx` with an active scroll-tracking IntersectionObserver:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              DASHBOARD MODULE ARCHITECTURE                             │
├────┬─────────────────────────────┬─────────────────────────────────────────────────────┤
│ #  │ Module Component            │ Core Functionality & Scientific Scope               │
├────┼─────────────────────────────┼─────────────────────────────────────────────────────┤
│ 01 │ MissionOverviewSection.jsx  │ Regional context (80°S–90°S), Cabeus B discovery    │
│    │                             │ spotlight, and 8 verified scientific KPI cards      │
│ 02 │ DataIngestionSection.jsx    │ Audit of 1,844 cataloged files, 5.72 GB DFSAR L0A   │
│    │                             │ telemetry, LOLA grids, search/filter table          │
│ 03 │ PreprocessingSection.jsx    │ Multi-sensor coregistration on 80m polar grid,      │
│    │                             │ Horn's slope derivation, spatial coherence boost    │
│ 04 │ IceEvidenceSection.jsx      │ CPR > 1.0 & DOP < 0.13 rule, boulder rejection,     │
│    │                             │ 3-tier confidence stratification (257.44 km² total) │
│ 05 │ CandidateExplorerSection.jsx│ Interactive catalog of 28 ranked polar cold traps,  │
│    │                             │ detailed candidate cards, spotlight on CAND_052     │
│ 06 │ LandingSiteSection.jsx      │ Fuzzy Cognitive Map (FCM) evaluating 97 candidate   │
│    │                             │ touchdown cells, highlighting prime site LS_38      │
│ 07 │ RoverTraverseSection.jsx    │ 3D Plotly WebGL model, 47-waypoint DIC3D-A* route,  │
│    │                             │ Bekker-Wong wheel slip, HUD traverse GIF animation  │
│ 08 │ MissionInsightsSection.jsx  │ 6 synthesis subsections, 3-scenario LLL ice tonnage │
│    │                             │ (52.55 Mt nominal), 114.05 t/yr bipropellant ISRU   │
│ 09 │ MethodologySection.jsx      │ Peer-reviewed physics equations, variable tables,   │
│    │                             │ units, and citations to proposal & master plan      │
│ 10 │ FutureWorkSection.jsx       │ Section 22: 6-stage roadmap toward an Autonomous,   │
│    │                             │ Self-Recovering Lunar Rover & closed-loop diagram   │
└────┴─────────────────────────────┴─────────────────────────────────────────────────────┘
```

### Module Highlights:

1. **Mission Overview & KPIs (`MissionOverviewSection.jsx`)**
   - Displays executive polar metrics: $52.55\text{ Million Tonnes}$ nominal polar ice reserves, $2.17^\circ$ touchdown slope at `LS_38`, $4.74\text{ km}$ traverse distance, and $114.05\text{ t/yr}$ bipropellant yield.
   - Provides quick navigation shortcuts to critical modules and an executive summary of the Cabeus B breakthrough.

2. **Multi-Sensor Data Ingestion (`DataIngestionSection.jsx`)**
   - Interactive paginated table auditing 1,844 files across radar (DFSAR), optical (OHRC), and altimetry (LOLA) categories.
   - Features real-time search, category filtering, file size formatting, and an analytical verification sequence flow diagram.
   - Includes transparent disclosure regarding pending SAR Doppler focusing for raw Level-0A telemetry.

3. **Topography & Preprocessing (`PreprocessingSection.jsx`)**
   - Details the spatial transformation from spherical coordinates to the Lunar South Polar Stereographic projection (`IAU:30135`, $80.0\text{ m/pixel}$, $3,750 \times 3,750$ grid).
   - Explains Horn's finite difference slope derivation and spatial coherence filtering ($3 \times 3$ window smoothing, boosting SNR by $4.2\text{ dB}$).
   - Confirms 0% missing data dropouts across all operational masks.

4. **Radar Polarimetry & Ice Evidence (`IceEvidenceSection.jsx`)**
   - Formulates the fundamental ISRO decision rule: $\text{CPR} > 1.0 \land \text{DOP} < 0.13 \land P_v > 0.50$.
   - Interactive evidence cards contrasting true volumetric Coherent Backscatter Opposing Effect (CBOE) from false-positive surface boulder scattering ($\text{DOP} \approx 0.40 - 0.85$).
   - Breakdown of the 3 confidence tiers: Tier 1 ($238.22\text{ km}^2$), Tier 2 ($10.27\text{ km}^2$), and Tier 3 ($8.95\text{ km}^2$).

5. **Candidate-Region Explorer (`CandidateExplorerSection.jsx`)**
   - Searchable, filterable catalog of 28 discrete polar cold traps across Cabeus B, Haworth, Shoemaker, Faustini, and South Polar Highlands.
   - Interactive inspection card displaying CPR, DOP, floor slope, ice probability, estimated tonnage, and coordinates.
   - Dedicated spotlight on primary research discovery `CAND_052`.

6. **Landing-Site Assessment (`LandingSiteSection.jsx`)**
   - Details the Fuzzy Cognitive Map (FCM) and Landing Suitability Index (LSI):
     $$\text{LSI} = 0.25\,C_{\text{slope}} + 0.25\,C_{\text{ice}} + 0.20\,C_{\text{illum}} + 0.20\,C_{\text{hazard}} + 0.10\,C_{\text{rough}}$$
   - Comparative evaluation between novel discovery site `LS_38` (Cabeus B) and conventional benchmark site `LS_16` (Haworth Rim).
   - "Plan Rover Traverse" action button that smoothly scrolls to the rover navigation module.

7. **Rover Traverse & 3D Simulation (`RoverTraverseSection.jsx`)**
   - Interactive 3D WebGL viewer rendering the genuine Plotly terrain mesh (`cabeus_b_3d_interactive_model.html` via iframe) with 360° rotation and waypoint hover cards.
   - High-fidelity synchronized HUD mission simulation GIF (`rover_traverse_cabeus_b_mission_animation.gif`) displaying dynamic vehicle telemetry and elevation descent.
   - 47-waypoint DIC3D-A* telemetry table with elevation, slope, Bekker-Wong wheel slip %, battery SoC, and thermal regime.

8. **Mission Insights & ISRU Architecture (`MissionInsightsSection.jsx`)**
   - 6 mandatory synthesis subsections covering scientific context, discovery rationale, resource estimation, rover safety, ISRU engineering, and long-term lunar habitation.
   - 3-scenario Looyenga-Landau-Lifshitz (LLL) dielectric mixing resource breakdown (Conservative 21.02 Mt, Nominal 52.55 Mt, Optimistic 60.44 Mt).
   - Closed-loop ISRU mass and power balance table detailing dual RASSOR mining, fluidized bed sublimation, carbothermal reduction, Sabatier methanation, and SOXE electrolysis producing $114.05\text{ t/yr}$ bipropellant.

9. **Methodology, Equations & Provenance (`MethodologySection.jsx`)**
   - Rigorous mathematical documentation of all algorithms used in the pipeline: Horn's slope, DIC3D-A* cost function, Bekker-Wong soil mechanics, LLL dielectric mixing, and FCM suitability index.
   - Complete table of variables, physical units, and citations to the proposal and master plan.

10. **Future Work: Autonomous Self-Recovering Rover (`FutureWorkSection.jsx`)**
    - Comprehensive interactive implementation of Section 22 of the master plan:
      - **Stage 1:** Multi-Modal Proprioceptive & Exteroceptive Perception (Stereo cameras, wheel encoders, IMU, motor current monitoring).
      - **Stage 2:** Real-Time Terramechanics Anomaly Detection (Bekker sinkage detection, slip runaway monitoring).
      - **Stage 3:** Adaptive Local Path Re-Planning (Micro-scale A* re-routing around boulder obstacles).
      - **Stage 4:** Active Wheel Unsticking & Micro-Excavation (Rocker-bogie peristaltic wiggling and reverse-tread ejection).
      - **Stage 5:** Power & Thermal Safe-Mode Hibernation (Cryogenic PSR battery preservation and RHU thermal management).
      - **Stage 6:** Distributed Multi-Rover Cooperative Swarm Rescue (Tether assistance and collaborative towing).
    - Closed-loop perception-to-recovery architecture diagram and core engineering challenges.

---

## 3. Directory Structure

```text
dashboard phase 1/
├── public/
│   └── assets/
│       ├── animations/           # High-fidelity rover traverse GIF simulations (1.23 MB optimized)
│       │   ├── rover_traverse_cabeus_b_mission_animation.gif  # Synchronized HUD + elevation animation
│       │   └── rover_traverse_3d_perspective_animation.gif    # 3D perspective terrain descent
│       ├── figures/              # High-resolution PNG figures from scientific audits
│       │   ├── model_evidence/   # Random forest feature importances & ROC curves
│       │   ├── phase1/           # Preprocessing & inventory figures
│       │   └── phase2/           # Polarimetry & decomposition figures
│       ├── maps/                 # Publication-grade cartographic maps (lossless PNG)
│       │   ├── phase3/           # Landing site regional, zoom & distance maps
│       │   ├── phase4/           # Traverse path, elevation profile & resource maps
│       │   └── phase5/           # ISRU flowchart, mass/power chart & master synthesis
│       └── models/               # Interactive 3D WebGL Plotly model
│           └── cabeus_b_3d_interactive_model.html  # 77x83 terrain mesh + 47-waypoint 3D ribbon
│
├── src/
│   ├── components/               # Modular reusable UI components
│   │   ├── Navbar.jsx            # Frosted glass navigation with scroll-spy tracking
│   │   ├── EvidenceBadge.jsx     # Scientific epistemology confidence badges
│   │   ├── MetricCard.jsx        # Glassmorphic KPI metric cards with change indicators
│   │   └── ImageViewerModal.jsx  # Research-grade image modal lightbox with pan/zoom & metadata
│   ├── data/                     # 18 JSON datasets parsed directly from authoritative CSVs
│   ├── sections/                 # 10 modular, research-oriented dashboard sections
│   ├── App.jsx                   # Root application container & modal coordinator
│   ├── index.css                 # Comprehensive deep-space dark design system & CSS variables
│   └── main.jsx                  # React 18 DOM mount point
│
├── docs/                         # Scientific documentation & verification records
│   ├── source_asset_inventory.md # Complete audit of all source files, types, and browser safety
│   ├── data_provenance.md        # Strict bidirectional mapping between metrics and source files
│   └── scientific_limitations.md # Full disclosure of telemetry, resolution, and sensor limits
│
├── dist/                         # Optimized production build (generated via npm run build)
├── index.html                    # HTML entry point with Google Fonts (Inter, Outfit, JetBrains Mono)
├── package.json                  # Dependencies (React 18.3, Vite 5.4, Lucide React)
├── vite.config.js                # Vite build and dev server configuration (port 3000)
├── vercel.json                   # Manual standalone deployment configuration
└── README.md                     # This technical manual
```

---

## 4. Scientific Datasets & Data Provenance Matrix

Every quantitative value rendered in the dashboard is 100% traceable to local project tables generated during Phase 1–5 executions. There is **zero synthetic data fabrication**:

| Dataset File (`src/data/`) | Primary Data Fields | Source Pipeline Origin |
| :--- | :--- | :--- |
| `phase1_data_inventory.json` | 1,844 cataloged files, formats, paths, sizes | `outputs/phase1/reports/phase1_data_inventory.csv` |
| `dfsar_level0a_inventory.json` | 5.72 GB DFSAR L0A raw telemetry files | `outputs/phase1/dfsar/manifests/` |
| `confidence_tier_summary.json` | 3 confidence tiers, areas ($257.44\text{ km}^2$ total) | `output_from_masterplan/tables/` |
| `threshold_sensitivity_grid.json`| CPR & DOP sensitivity matrix (0.8–1.4, 0.05–0.25) | `outputs/phase2/tables/` |
| `false_positive_rejection_audit.json`| 14 rejected high-CPR rocky craters | `outputs/phase2/reports/` |
| `ranked_crater_candidates.json`| 28 polar cold traps, CPR, DOP, floor slopes | `output_from_masterplan/tables/ranked_crater_candidates.csv` |
| `crater_ice_inventory.json` | Regional ice surface areas by crater | `output_from_masterplan/tables/crater_ice_inventory.csv` |
| `landing_site_evaluation_criteria.json`| LSI criteria weights, slope & roughness limits | `outputs/phase3/reports/` |
| `ranked_landing_sites.json` | 97 candidate landing cells, coordinates, scores | `outputs/phase3/tables/ranked_landing_sites.csv` |
| `novel_landing_site_contribution_report.json`| Detailed engineering profile of `LS_38` | `outputs/phase3/reports/` |
| `rover_traverse_waypoints_cabeus_b.json`| 47 waypoints, elevation, slope, slip, battery | `outputs/phase4/tables/rover_traverse_waypoints_cabeus_b.csv` |
| `rover_traverse_waypoints_haworth.json` | 69 waypoints for Haworth benchmark route | `outputs/phase4/tables/rover_traverse_waypoints_haworth.csv` |
| `ice_resource_scenarios_summary.json` | Conservative, Nominal, Optimistic ice tonnages | `outputs/phase4/tables/ice_resource_scenarios_summary.csv` |
| `ice_volume_mass_estimation_by_crater.json`| Tonnage breakdown across polar craters | `outputs/phase4/tables/` |
| `isru_subsystem_mass_energy_balance.json` | 7-stage ISRU mass flows & electrical power | `outputs/phase5/tables/isru_subsystem_mass_energy_balance.csv` |
| `isru_annual_propellant_yield_scenarios.json`| Annual propellant yield & flight support | `outputs/phase5/tables/` |
| `integrated_mission_executive_matrix.json`| Cross-phase synthesized mission metrics | `outputs/phase5/reports/` |
| `model_performance_metrics.json`| Random Forest accuracy ($94.8\%$), AUC ($0.972$) | `output_from_masterplan/model_evidence/` |

---

## 5. User Interface & Design System Tokens

The application employs a curated deep-space design system defined in `src/index.css`:

- **Cosmic Dark Palette:**
  - Background Space: `#07090e`
  - Surface Elevation: `#0c1017`
  - Card Glassmorphism: `#121824` with $75\%$ alpha backdrop blur
  - Borders: Subdued slate `#1e293b` with radiant cyan glow `#38bdf8` on active focus
- **Vibrant Scientific Accents:**
  - Neon Cyan / Sky Blue (`#06b6d4`, `#38bdf8`): Primary radar signals and discovery badges
  - Lunar Gold / Amber (`#f59e0b`, `#d97706`): Rover telemetry, battery reserves, and illumination
  - Emerald Green (`#10b981`): Safe landing zones and verified validation gates
  - Rose Red (`#ef4444`): Dynamic slope hazards and false-positive rejections
- **Typography:**
  - Heading Display: `Outfit` (clean geometric space aesthetic)
  - Body Text: `Inter` (high legibility at dense information densities)
  - Data / Coordinates: `JetBrains Mono` (tabular numbers, latitude/longitude, and telemetry readings)
- **Modal Lightbox (`ImageViewerModal.jsx`):**
  - Click any cartographic map or diagram to trigger a fullscreen modal view.
  - Displays high-resolution imagery with metadata inspection, dataset origin, and citations.

---

## 6. System Requirements & Hardware Performance

The dashboard was engineered specifically to run smoothly on standard development laptops without requiring dedicated workstation GPUs:
- **Node.js:** v18.0.0 or later (Tested on Node v25.9.0 with npm 11.12.1).
- **Web Browser:** Any modern evergreen browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari) with WebGL enabled for 3D Plotly rendering.
- **Memory Footprint:** Pre-computed, optimized JSON summaries avoid loading multi-gigabyte satellite GeoTIFFs into browser memory, keeping memory consumption $< 120\text{ MB}$.
- **Optimized Media Assets:** Rover traverse HUD animation is optimized to $1.23\text{ MB}$ for instantaneous caching and 60 FPS playback.

---

## 7. Local Installation & Development Commands

### Step 1: Open PowerShell / Terminal
Navigate to the dashboard directory:
```powershell
cd "c:\Users\DELL\Downloads\Lunar_ice_detection_2\dashboard phase 1"
```

### Step 2: Install Node Dependencies
```powershell
npm install
```

### Step 3: Start Vite Development Server
```powershell
npm run dev
```
Open your browser to:
```text
http://localhost:3000
```
*(If port 3000 is occupied, Vite will automatically select the next available port, e.g., 3001).*

### Step 4: Build for Production
To generate the optimized static distribution bundle in `dist/`:
```powershell
npm run build
```

### Step 5: Preview Production Build Locally
```powershell
npm run preview
```
Open the displayed local URL (typically `http://localhost:4173`).

---

## 8. Troubleshooting & FAQ

- **3D Model Displays Blank Screen:**  
  Verify that WebGL is enabled in your browser settings (`chrome://gpu` or `edge://gpu`). The 3D model loads via iframe from `/assets/models/cabeus_b_3d_interactive_model.html` using the official Plotly v3.0.1 WebGL engine.
- **Port 3000 Already in Use:**  
  Vite automatically increments port numbers. Check terminal output for the active URL or specify a custom port: `npx vite --port 3050`.
- **Assets Not Loading in Production Preview:**  
  Ensure you ran `npm run build` prior to `npm run preview`. All public assets from `public/` are mapped 1-to-1 into `dist/assets/`.

---

## 9. Manual Vercel & Static Cloud Deployment

The dashboard is configured for standalone zero-configuration deployment to any static hosting provider.

### Option A: Via Vercel CLI (Recommended)
1. Install the Vercel CLI globally:
   ```powershell
   npm install -g vercel
   ```
2. Log in to your Vercel account:
   ```powershell
   vercel login
   ```
3. Navigate into the dashboard folder and deploy:
   ```powershell
   cd "dashboard phase 1"
   vercel
   ```
4. Confirm defaults:
   - Framework preset: `Vite`
   - Output directory: `dist`

### Option B: Via GitHub & Vercel Web Dashboard
1. Push the repository to GitHub.
2. In the Vercel Dashboard (`https://vercel.com`):
   - Click **Add New Project** $\to$ **Import Repository**.
   - If deploying from the root workspace, set **Root Directory** to `dashboard phase 1`.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click **Deploy**.

---

**TEAM SHAURYAM | Chandrayaan-2 Lunar South Pole Mission Architecture | Phase 1 Dashboard**
