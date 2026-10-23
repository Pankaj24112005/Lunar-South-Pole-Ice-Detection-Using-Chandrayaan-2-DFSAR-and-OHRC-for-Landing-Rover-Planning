# Scientific Limitations & Research Boundaries
**Project:** Chandrayaan-2 Lunar South Pole Water-Ice Detection, Landing-Site Assessment & Autonomous Rover Planning  
**Team:** TEAM SHAURYAM (ISRO AITHON 2.0 Hackathon)  
**Document:** Scientific Limitations (`docs/scientific_limitations.md`)  
**Scope:** Transparent disclosure of sensor constraints, processing boundaries, data gaps, and non-validated assumptions.

---

## 1. Level-0A DFSAR Radar Telemetry Processing Status
- **Physical Reality:** The newly downloaded Chandrayaan-2 DFSAR L-band datasets (`ch2_sar_nrxl_20251024t114751370_d_fp_d32` and `...d18`, totaling 5.72 GB) are **Level-0A raw telemetry products** (`_r0a_`).
- **Processing Constraint:** Level-0A files contain uncompressed raw time-domain radar echo samples in SignedByte format. Deriving calibrated Stokes parameters ($S_0, S_1, S_2, S_3$), Circular Polarization Ratio (CPR), and Degree of Polarization (DOP) requires Range-Doppler pulse compression and azimuth synthetic aperture focusing into Level-1 Single-Look Complex (SLC) matrices.
- **Compliance with Non-Fabrication Rule:** In strict adherence to scientific integrity, placeholder CPR and DOP rasters were **not** fabricated. In the dashboard, CPR and DOP for these specific new acquisitions are transparently reported as **Not Yet Computed / Pending Focusing via ISRO SAC MIDAS**.
- **Authoritative Baseline:** Peer-reviewed Level-4 polarimetric water-ice detections from Putrevu et al. (2023, ISRO SAC) serve as the verified ground truth radar reference, which directly embodies the $\text{CPR} > 1.0 \land \text{DOP} < 0.13$ criterion.

---

## 2. Optical High Resolution Camera (OHRC) Data Availability
- **Observation Strips:** The local repository contains complete geospatial footprint shapefiles for Chandrayaan-2 OHRC observation strips across the south polar region (`outputs/phase1/ohrc/ohrc_south_pole_cataloged_footprints.geojson`).
- **Limitation:** Raw sub-meter optical rasters ($0.25\text{ m} - 0.32\text{ m/pixel}$) are not stored locally due to multi-gigabyte volume constraints.
- **Mitigation:** Boulder density and small-crater hazard assessments utilize cataloged spatial footprint intersections and LOLA multi-scale roughness ($100\text{ m}, 200\text{ m}, 400\text{ m}$) as physical proxies.

---

## 3. Discretization of Published Reference vs Newly Derived Products
- **Reference Distinction:** The binary water-ice mask (`ICY_CRATERS_SP.tif`) is an externally published reference product (Putrevu et al., 2023). It is not claimed as a newly computed result from the newly added Level-0A DFSAR telemetry.
- **Multi-Sensor Grid Standardization:** Native DFSAR resolution is $25\text{ m}$, LOLA DEM is $80\text{ m}$, and LOLA PSR is $20\text{ m}$. To prevent synthetic precision and spatial artifacts, all multi-sensor fusion is conducted on the standardized $80.0\text{ m/pixel}$ coregistered grid using nearest-neighbor categorical resampling.

---

## 4. Terrain-Conditioned Candidate Tiers vs Ground Truth
- **Surface Roughness Ambiguity:** Blocky crater walls, fresh impact ejecta, and steep slopes can generate $\text{CPR} > 1.0$ due to multiple corner-reflections without any subsurface water ice.
- **Confidence Tiering Rationale:** To mitigate this ambiguity, candidates are stratified into three terrain-conditioned tiers:
  - **Tier 3 (High Confidence):** Radar Ice + Confirmed PSR + Slope $\le 10.0^\circ$ ($8.95\text{ km}^2$, $3.48\%$ of ice pixels). Low roughness, thermal stability, minimal false-positive hazard.
  - **Tier 2 (Moderate Confidence):** Radar Ice + Confirmed PSR + Moderate Slope $10.0^\circ - 15.0^\circ$ ($10.27\text{ km}^2$, $3.99\%$ of ice pixels).
  - **Tier 1 (Candidate / Roughness Risk):** Radar Ice + Outside PSR or Steep Slope $> 15.0^\circ$ ($238.22\text{ km}^2$, $92.54\%$ of ice pixels). High risk of surface rock roughness generating radar anomalies.
- **Unverified Historical Figures:** Previously rumored provisional figures (e.g., Tier 1: 73.84 km², Tier 2: 43.46 km², Tier 3: 43.76 km²) were audited against the actual raster inventory and found to be unverified historical drafts. The authoritative, pixel-counted values from `confidence_tier_summary.csv` are $238.22\text{ km}^2$, $10.27\text{ km}^2$, and $8.95\text{ km}^2$.

---

## 5. Rover Navigation & Geotechnical Validation
- **Traverse Kinematics:** The DIC3D-A* traverse for Cabeus B ($4.74\text{ km}$, 47 waypoints) is a kinematically verified path using LRO LOLA $80\text{ m}$ elevation and static solar illumination models.
- **Operational Reality:** True surface traversability depends on sub-meter regolith shear strength, cohesion, wheel sinkage, and micro-boulder distribution. In-situ autonomous execution will require real-time stereoscopic hazard camera perception and onboard slip compensation.
- **Thermal Descent Limits:** The transition into PSR cold traps ($< 40\text{ K}$) entails extreme cryogenic thermal shock; mission success requires onboard radioisotope heater units (RHUs) and strict battery discharge throttling.
