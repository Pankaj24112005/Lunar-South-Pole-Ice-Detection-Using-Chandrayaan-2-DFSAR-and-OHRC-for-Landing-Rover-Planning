# Lunar South Pole Mission: 3D Models, GIS Data & Rover Traverse Animation Suite
## Autonomous Landing Site Selection (`LS_38`) to Volatile Water-Ice Core (`CAND_052`)

**Mission Project:** Chandrayaan-2 DFSAR Radar + LRO LOLA Topography Subsurface Ice Exploration  
**Team Name:** TEAM SHAURYAM (ISRO AITHON 2.0 Hackathon Submission)  
**Deliverable ID:** PHASE-4B-3D-GIS-ANIMATION-SUITE-2026  
**Primary Target:** Cabeus B Southeast Highland Plateau to Crater Floor Cold Trap  
**Standard Compliance:** IAU 2015 Lunar South Polar Stereographic (IAU:30135), OGC GeoJSON (RFC 7946), Wavefront OBJ/MTL, GeoTIFF, WebGL  

---

## 1. Overview of Generated Deliverables

All products have been generated strictly from the authoritative Master Plan data (`output_from_masterplan/`) without modifying any pre-existing files. The suite is located in both `output_from_masterplan/ed_animation/` (requested folder name) and mirrored in `output_from_masterplan/3d_animation/`.

```
output_from_masterplan/ed_animation/
├── 3D Models:
│   ├── cabeus_b_terrain_and_traverse_3d_model.obj     # 3D Wavefront Mesh (25,355 vertices, 49,960 faces, 6 groups)
│   ├── cabeus_b_terrain_and_traverse_3d_model.mtl     # Material library defining lunar regolith, PSR, ice & tracks
│   └── cabeus_b_3d_interactive_model.html             # Standalone interactive 3D WebGL model (rotate, pan, zoom, hover)
│
├── 3D GIS Datasets:
│   ├── cabeus_b_mission_gis.geojson                   # Complete 3D GIS collection (Landing Site, Ice Core, 3D LineString, 47 Waypoints, Ellipses)
│   ├── cabeus_b_rover_traverse_3d.geojson             # Dedicated 3D traverse trajectory & waypoint coordinates
│   ├── haworth_benchmark_mission_gis.geojson          # Companion Haworth West Rim benchmark 3D traverse
│   ├── cabeus_b_local_dem_3d.tif                      # Clipped high-res LOLA DEM GeoTIFF (IAU:30135, 80m resolution)
│   ├── cabeus_b_local_ice_likelihood_3d.tif           # Clipped Subsurface Ice Likelihood GeoTIFF
│   ├── cabeus_b_local_slope_3d.tif                    # Clipped Terrain Slope GeoTIFF
│   └── cabeus_b_mission_waypoints_gis.csv             # GIS Waypoint catalog with projected (X,Y) and geographic (Lat,Lon,Z)
│
├── Animated Mission Simulations:
│   ├── rover_traverse_cabeus_b_mission_animation.gif   # Primary mission animation (Map + Telemetry HUD + Synchronized Elevation Profile)
│   └── rover_traverse_3d_perspective_animation.gif     # Companion 3D perspective terrain descent animation
│
└── Documentation:
    └── README.md                                      # Full technical manual, coordinate schemas & software usage instructions
```

---

## 2. 3D Terrain & Rover Traverse Models

### 2.1 Wavefront 3D Object (`.obj` & `.mtl`)
- **Mesh Dimensions:** $13.2\text{ km} \times 12.2\text{ km}$ spatial corridor centered on the Cabeus B mission site.
- **Topographic Range:** $-4,345.4\text{ m}$ (crater deep floor) to $-1,308.8\text{ m}$ (highland rim crest).
- **Coordinate Space:** Centered at the primary touchdown coordinate (`LS_38`), with $(X, Y, Z)$ measured in meters:
  - $+X$: Easting in Lunar Polar Stereographic space.
  - $+Y$: Northing in Lunar Polar Stereographic space.
  - $+Z$: Relative altitude relative to landing site touchdown elevation ($-1,320.2\text{ m}$).
- **Material Classifications:**
  - `mat_sunlit_plateau`: Diffuse warm gray regolith representing sunlit highland plateau ($100\%$ illumination).
  - `mat_psr_cold_trap`: Dark basaltic gray terrain representing cryogenic cold traps ($< 40\text{ K}$).
  - `mat_ice_core`: Cyan crystalline luster marking high-concentration subsurface water-ice deposits ($P_{\text{ice}} \ge 0.50$).
  - `mat_landing_site_pad`: Emerald green touchdown landing zone cylinder ($60\text{ m}$ radius).
  - `mat_rover_track`: Raised $30\text{ m}$ wide gold/amber ribbon extruding $+5\text{ m}$ above the terrain surface across all 47 waypoints.
  - `mat_ice_target_beacon`: Cyan beacon column marking target core `CAND_052`.

### 2.2 Interactive 3D WebGL Browser Model (`.html`)
- Open `cabeus_b_3d_interactive_model.html` in any modern web browser (Chrome, Edge, Firefox, Safari).
- **Features:**
  - Full 360-degree orbital rotation, pan, zoom, and perspective tilt.
  - Continuous topographic color gradient (Magma scale) mapped to absolute elevation.
  - 3D Gold Ribbon representing the $4.74\text{ km}$ DIC3D-A* autonomous descent path.
  - Interactive hover tooltips for all 47 waypoints revealing cumulative distance, local elevation, slope, wheel slip %, battery state-of-charge, and thermal regime.
  - 3D spatial markers for Landing Site `LS_38` (Green Diamond) and Ice Core `CAND_052` (Cyan Sphere).

---

## 3. 3D GIS Layers & Coordinate Systems

### 3.1 Standards & Metadata
- **Projected Coordinate Reference System:** Moon (2015) - Sphere / Ocentric / South Polar (`IAU:30135`).
  - Projection: Polar Stereographic
  - Latitude of Origin: $-90.0^\circ$
  - Central Meridian: $0.0^\circ$
  - Reference Spheroid: $R = 1,737,400.0\text{ m}$
- **Geographic Reference System:** OGC CRS84 / Lunar Latitude-Longitude (Degrees North/East, WGS84 equivalent).

### 3.2 GeoJSON Feature Catalog (`cabeus_b_mission_gis.geojson`)
1. **`LANDING_SITE_LS_38` (Point, 3D):**
   - Coordinates: `[-51.6070, -87.3901, -1320.2]`
   - Attributes: Rank 1, LSI Score $0.8845$, Mean Slope $2.17^\circ$, Illumination $100.0\%$, Safe touchdown zone.
2. **`ICE_TARGET_CAND_052` (Point, 3D):**
   - Coordinates: `[-51.4439, -87.5390, -1758.7]`
   - Attributes: CPR $1.49$, Area $0.192\text{ km}^2$, Ice Probability $81.6\%$, Estimated Tonnage $384,000\text{ t}$.
3. **`SAFE_LANDING_ELLIPSE_LS_38` (Polygon, 3D):**
   - Semi-major axis $0.75\text{ km}$, semi-minor axis $0.50\text{ km}$.
4. **`ICE_DEPOSIT_EXTENT_CAND_052` (Polygon, 3D):**
   - Bounding contour of candidate volatile deposit.
5. **`ROVER_TRAVERSE_PATH_3D` (LineString, 3D):**
   - Complete 3D polyline with 47 vertices `[lon, lat, elev]` from WP_000 to WP_046.
6. **`WAYPOINT_WP_000` to `WAYPOINT_WP_046` (47 Points, 3D):**
   - Full terramechanic attributes for each waypoint (Distance, Elevation, Slope, Wheel Slip, Thermal Regime, Battery SoC).

---

## 4. Rover Traverse Mission Animation Breakdown

### 4.1 Primary Mission Animation (`rover_traverse_cabeus_b_mission_animation.gif`)
- **Resolution:** $1595 \times 901\text{ px}$, High-Definition 16:9 aerospace UI layout.
- **Frame Rate:** $120\text{ ms/frame}$ ($\sim 8.3\text{ fps}$), seamless looping.
- **Component Panels:**
  1. **Left Panel (Topographic Tactical Map):**
     - LOLA $80\text{ m}$ shaded relief base.
     - Subsurface ice likelihood overlay in luminous cyan.
     - Animated rover vehicle marker with orientation heading arrow and pulse ring.
     - Dynamic illuminated traversed golden path trailing behind the rover.
     - Landing site touchdown target and ice deposit crosshair.
     - 1.0 km scale bar and North orientation compass.
  2. **Right Top Panel (Mission Operations & Flight Telemetry HUD):**
     - Real-time digital readout of Waypoint ID and Mission Phase.
     - Progress bar tracking distance: $0.00\text{ km} \to 4.74\text{ km}$.
     - Real-time altitude readout: $-1,320.2\text{ m} \to -1,758.7\text{ m}$ ($-438.5\text{ m}$ net descent).
     - Terrain Slope meter with color safety indicators (Green $<6^\circ$, Yellow $6-11^\circ$, Red $>11^\circ$).
     - Bekker-Wong terramechanic wheel slip gauge: $1.7\% \to 11.7\%$.
     - Battery State-of-Charge tracker: $100.0\% \to 99.6\%$.
     - Thermal regime badge: Dynamic transition from `SUNLIT RIDGE (~300 K)` to `PSR COLD TRAP (~40 K)`.
  3. **Right Bottom Panel (Synchronized Elevation Profile):**
     - Real-time cross-section graph plotting distance vs elevation.
     - Visual background distinction between illuminated highlands and cryogenic PSR.
     - Moving gold tracker ball and vertical cursor indicating rover position on the ramp profile.

### 4.2 Companion 3D Perspective Animation (`rover_traverse_3d_perspective_animation.gif`)
- **Resolution:** $900 \times 630\text{ px}$.
- **Viewpoint:** Dynamic 3D orbital camera descending along the terrain slope, illustrating how the natural terraced ramp provides a safe descent gradient into the crater basin while avoiding steep crater walls ($> 25^\circ$).

---

## 5. Software Compatibility & Import Instructions

### 5.1 QGIS (Version 3.20+)
1. Drag and drop `cabeus_b_local_dem_3d.tif` and `cabeus_b_local_ice_likelihood_3d.tif` into the layer tree.
2. Drag and drop `cabeus_b_mission_gis.geojson`. QGIS will automatically load the points, polygon ellipses, and 3D LineString with full attributes.
3. In QGIS 3D Map View (`View -> 3D Map Views`), set `cabeus_b_local_dem_3d.tif` as the elevation surface to view the terrain and rover path in true 3D.

### 5.2 ArcGIS Pro
1. Add `cabeus_b_local_dem_3d.tif` as an elevation surface in a Local Scene.
2. Add `cabeus_b_mission_gis.geojson` through `JSON To Features`.
3. Set the elevation property to "Absolute Height" or "Relative to Surface" to render the 3D rover path ribbon.

### 5.3 Blender / MeshLab / 3D Printing
1. Import `cabeus_b_terrain_and_traverse_3d_model.obj` (`File -> Import -> Wavefront (.obj)`).
2. The material definitions (`.mtl`) will automatically assign separate surface colors to the plateau, PSR, ice core, landing pad, and rover traverse track.
3. Scale unit: 1 Blender unit = 1 meter.

### 5.4 Presentations & Web Applications
- Insert `rover_traverse_cabeus_b_mission_animation.gif` directly into PowerPoint, Google Slides, Keynote, or HTML websites to demonstrate the mission concept of operations.
- Open `cabeus_b_3d_interactive_model.html` directly in any web browser for live interactive demonstration.
