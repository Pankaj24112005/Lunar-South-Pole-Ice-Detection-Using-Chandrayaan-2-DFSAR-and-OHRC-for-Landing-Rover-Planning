# Source Asset & Research Evidence Inventory
**Project:** Chandrayaan-2 Lunar South Pole Water-Ice Detection, Landing-Site Assessment & Autonomous Rover Planning  
**Team:** TEAM SHAURYAM (ISRO AITHON 2.0 Hackathon)  
**Document:** Source Asset Inventory (`docs/source_asset_inventory.md`)  
**Scope:** Exhaustive audit of local research artifacts, raw telemetry, processed rasters, vectors, 3D visualizations, cartographic maps, and structured tables.

---

## 1. Summary of Project Evidence Categories

Every asset utilized in the dashboard is categorized according to strict scientific standards:
1. **Raw Observation:** Original satellite telemetry, unprocessed DEM/optical rasters, instrument geometry labels.
2. **Project-Derived Result:** Calibrated metrics, coregistered grids, machine-learning likelihood scores, candidate landing cells, DIC3D-A* rover waypoints, and LLL inversion tonnages computed by Team SHAURYAM.
3. **Published Reference Product:** Externally peer-reviewed reference layers (e.g., Putrevu et al. 2023 Level-4 DFSAR polarimetric ice mask, NASA LOLA science team products).
4. **Interpretation / Hypothesis:** Scientifically reasoned rankings, heuristic suitability indices, and future exploration concepts awaiting ground validation.

---

## 2. Interactive 3D Models & Trajectory Animations

| Actual Filename | Relative Source Path | File Type | Size | Scientific / Visual Purpose | Category | Browser Safe? | Lightweight Preview Needed? | Target Dashboard Section |
|---|---|---|---|---|---|---|---|---|
| `cabeus_b_3d_interactive_model.html` | `output_from_masterplan/3d_animation/cabeus_b_3d_interactive_model.html` | HTML / JS (Plotly 3.0.1) | 5.17 MB | Full 3D interactive lunar mesh ($77\times 83$ LOLA DEM) with autonomous rover traverse trajectory (WP_000 to WP_046), landing site LS_38, and ice deposit CAND_052 | Project-Derived Result | Yes (embedded via responsive iframe with Plotly WebGL) | No, native Plotly WebGL runs smoothly in-browser | Section 7: Rover Path Planning |
| `cabeus_b_terrain_and_traverse_3d_model.html` | `output_from_masterplan/3d_animation/cabeus_b_terrain_and_traverse_3d_model.html` | HTML / JS | 5.17 MB | Terrain elevation model of Cabeus B crater floor with colored elevation bands and approach corridor | Project-Derived Result | Yes | No | Section 7: Rover Path Planning |
| `rover_traverse_cabeus_b_mission_animation.gif` | `output_from_masterplan/3d_animation/rover_traverse_cabeus_b_mission_animation.gif` | GIF Animation | 23.11 MB | 3D perspective animation showing rover vehicle motion along 4.74 km terraced descent from sunlit rim to PSR cold trap | Visualization of Derived Result | Yes (direct `<img>` tag or video preview) | Included directly; lazy-loaded on section view | Section 7: Rover Path Planning |
| `rover_traverse_3d_perspective_animation.gif` | `output_from_masterplan/3d_animation/rover_traverse_3d_perspective_animation.gif` | GIF Animation | 23.11 MB | Multi-angle dynamic perspective rendering of crater descent path and wheel contact points | Visualization of Derived Result | Yes | Included directly; lazy-loaded | Section 7: Rover Path Planning |

---

## 3. Cartographic Maps & Scientific Figures

| Actual Filename | Relative Source Path | File Type | Size | Scientific / Visual Purpose | Category | Browser Safe? | Target Section |
|---|---|---|---|---|---|---|---|
| `fig01_lola_elevation_80m_sp.png` | `outputs/phase1/figures/` | PNG Image | 1.84 MB | 80m LOLA South Pole regional elevation map (80°S-90°S) | Project-Derived Result | Yes | Section 3: Preprocessing & QC |
| `fig02_lola_elevation_hillshade_az315_alt45.png` | `outputs/phase1/figures/` | PNG Image | 3.12 MB | Multi-directional hillshade emphasizing micro-topography and crater rims | Project-Derived Result | Yes | Section 3: Preprocessing & QC |
| `fig03_lola_south_pole_slope.png` | `outputs/phase1/figures/` | PNG Image | 2.15 MB | Slope gradient raster indicating trafficability zones ($<8°$, $8°-15°$, $>15°$) | Project-Derived Result | Yes | Section 3: Preprocessing & QC |
| `fig04_lola_elevation_uncertainty_err.png` | `outputs/phase1/figures/` | PNG Image | 1.95 MB | LOLA altimeter interpolation error map showing sparse laser track regions | Project-Derived Result | Yes | Section 3: Preprocessing & QC |
| `fig05_lola_permanently_shadowed_regions_20m.png` | `outputs/phase1/figures/` | PNG Image | 1.45 MB | 20m resolution Permanently Shadowed Region (PSR) cold trap binary mask | Published Reference Product | Yes | Section 3 & 4 |
| `fig06_dfsar_water_ice_detections_south_pole.png` | `outputs/phase1/figures/` | PNG Image | 1.62 MB | South Pole DFSAR ice detections from Putrevu et al. (2023) Level-4 reference | Published Reference Product | Yes | Section 4: Ice-Related Evidence |
| `fig07_dfsar_water_ice_north_pole.png` | `outputs/phase1/figures/` | PNG Image | 1.58 MB | North Pole DFSAR ice detections for comparative hemispheric study | Published Reference Product | Yes | Section 4: Ice-Related Evidence |
| `fig08_multisensor_coregistered_overlay_south_pole.png` | `outputs/phase1/figures/` | PNG Image | 2.45 MB | Coregistered overlay of LOLA hillshade, PSR mask, and DFSAR ice clusters | Project-Derived Result | Yes | Section 3 & 4 |
| `fig09_ohrc_footprints_coverage_audit.png` | `outputs/phase1/figures/` | PNG Image | 1.25 MB | Audit of OHRC sub-meter optical strips overlapping south polar cold traps | Raw Observation Audit | Yes | Section 2: Data Ingestion |
| `fig11_dem_filter_comparison_raw_vs_smooth.png` | `outputs/phase1/figures/` | PNG Image | 1.88 MB | Quality control: raw LOLA DEM vs Gaussian curvature-filtered DEM | Project-Derived Result | Yes | Section 3: Preprocessing & QC |
| `fig12_ice_mask_coherence_filter_comparison.png` | `outputs/phase1/figures/` | PNG Image | 1.72 MB | Spatial coherence boosting comparison on candidate ice pixel clusters | Project-Derived Result | Yes | Section 3 & 4 |
| `fig13_spatial_overlap_and_enclosure_diagnostic.png` | `outputs/phase1/figures/` | PNG Image | 1.98 MB | Intersection diagnostic: radar ice vs PSR vs low-slope crater floor | Project-Derived Result | Yes | Section 3 & 5 |
| `fig201_dfsar_raw_signal_telemetry_audit.png` | `outputs/phase2/figures/` | PNG Image | 2.10 MB | Inspection of raw Level-0A echo telemetry waveforms, I/Q samples, and headers | Raw Observation Audit | Yes | Section 2 & 4 |
| `fig202_dfsar_level4_polarimetric_ice_and_craters.png` | `outputs/phase2/figures/` | PNG Image | 2.30 MB | Distribution of peer-reviewed polarimetric ice detections across named craters | Published Reference Product | Yes | Section 4 & 5 |
| `fig203_ice_in_psr_cold_traps_correlation.png` | `outputs/phase2/figures/` | PNG Image | 2.15 MB | Bivariate correlation between radar ice detections and PSR thermal models | Project-Derived Result | Yes | Section 4: Ice-Related Evidence |
| `fig204_slope_roughness_discrimination.png` | `outputs/phase2/figures/` | PNG Image | 1.95 MB | Separation of volume ice from rocky wall roughness using slope thresholding | Project-Derived Result | Yes | Section 4 & 5 |
| `fig205_ice_confidence_tiers_classification.png` | `outputs/phase2/figures/` | PNG Image | 2.40 MB | Cartographic map of 3 Confidence Tiers (High, Moderate, Candidate) | Project-Derived Result | Yes | Section 4 & 5 |
| `fig206_crater_case_studies_haworth_shoemaker.png` | `outputs/phase2/figures/` | PNG Image | 2.25 MB | Detailed case study comparison: Haworth vs Shoemaker vs Cabeus B | Project-Derived Result | Yes | Section 4 & 5 |
| `01_landing_site_suitability_index_map.png` | `outputs/phase3/maps/` | PNG Image | 2.85 MB | Landing Site Suitability Index (LSI) across 300 km polar exploration zone | Project-Derived Result | Yes | Section 6: Landing Sites |
| `02_safe_lander_slope_mask_map.png` | `outputs/phase3/maps/` | PNG Image | 2.10 MB | Binary safe touchdown slope mask (slope $\le 8.0°$) | Project-Derived Result | Yes | Section 6: Landing Sites |
| `03_ice_proximity_distance_map.png` | `outputs/phase3/maps/` | PNG Image | 2.95 MB | Continuous Euclidean distance field to nearest verified ice deposit (km) | Project-Derived Result | Yes | Section 6: Landing Sites |
| `04_illumination_ridge_proximity_map.png` | `outputs/phase3/maps/` | PNG Image | 2.70 MB | Distance to persistent solar illumination ridges ($>35\%$ solar availability) | Project-Derived Result | Yes | Section 6: Landing Sites |
| `05_top_candidate_landing_sites_map.png` | `outputs/phase3/maps/` | PNG Image | 3.40 MB | Regional master map showing top 97 ranked landing site centroids | Project-Derived Result | Yes | Section 6: Landing Sites |
| `06_zoom_cabeus_b_novel_landing_site.png` | `outputs/phase3/maps/` | PNG Image | 3.10 MB | 35 km high-resolution zoom on prime novel discovery LS_38 on Cabeus B | Project-Derived Result | Yes | Section 6: Landing Sites |
| `07_zoom_haworth_benchmark_landing_site.png` | `outputs/phase3/maps/` | PNG Image | 2.95 MB | 45 km benchmark comparison zoom on Haworth crater rim landing site | Project-Derived Result | Yes | Section 6: Landing Sites |
| `08_landing_site_to_target_ice_distance_map.png` | `outputs/phase3/maps/` | PNG Image | 2.65 MB | Dimensioned distance vectors connecting top landing sites to target ice traps | Project-Derived Result | Yes | Section 6: Landing Sites |
| `01_rover_traverse_path_cabeus_b_map.png` | `outputs/phase4/maps/` | PNG Image | 3.20 MB | 47-waypoint DIC3D-A* autonomous rover path with slope contours | Project-Derived Result | Yes | Section 7: Rover Path Planning |
| `02_rover_traverse_elevation_slope_profile.png` | `outputs/phase4/maps/` | PNG Image | 1.85 MB | Multi-panel telemetry plot: elevation, slope, wheel slip %, and battery SoC | Project-Derived Result | Yes | Section 7: Rover Path Planning |
| `03_rover_traverse_haworth_benchmark_map.png` | `outputs/phase4/maps/` | PNG Image | 3.05 MB | 55-waypoint Haworth benchmark rover traverse path for comparative analysis | Project-Derived Result | Yes | Section 7: Rover Path Planning |
| `04_subsurface_ice_volumetric_concentration_map.png` | `outputs/phase4/maps/` | PNG Image | 2.50 MB | Volumetric ice concentration ($f_{ice}$) retrieved via LLL mixing model | Project-Derived Result | Yes | Section 4 & 8 |
| `05_subsurface_ice_tonnage_distribution_map.png` | `outputs/phase4/maps/` | PNG Image | 2.60 MB | Subsurface water-ice mass density (metric tonnes per 80m pixel) | Project-Derived Result | Yes | Section 8: Mission Insights |
| `01_isru_plant_architecture_flowchart.png` | `outputs/phase5/maps/` | PNG Image | 1.95 MB | 7-stage chemical-mechanical process flowchart for lunar water & fuel mining | Project-Derived Result | Yes | Section 8 & Future Work |
| `02_isru_mass_and_power_balance_chart.png` | `outputs/phase5/maps/` | PNG Image | 1.80 MB | Daily mass cascade (4,712 kg icy regolith $	o$ 114.05 t/yr bipropellant) | Project-Derived Result | Yes | Section 8: Mission Insights |
| `03_mission_synthesis_master_dashboard_map.png` | `outputs/phase5/maps/` | PNG Image | 3.85 MB | Master mission synthesis map linking landing site, rover route, and ISRU plant | Project-Derived Result | Yes | Section 8: Mission Insights |
| `04_propellant_production_and_mission_support_yield.png` | `outputs/phase5/maps/` | PNG Image | 1.75 MB | 10-year cumulative bipropellant production & human lander refuel curves | Project-Derived Result | Yes | Section 8: Mission Insights |

---

## 4. Primary Structured Datasets (CSVs converted to JSON)

| JSON Dataset Name | Source CSV File | Record Count | Key Fields Included | Scientific Interpretation | Target Section |
|---|---|---|---|---|---|
| `dfsar_level0a_inventory.json` | `outputs/phase1/metadata/dfsar_level0a_inventory.csv` | 8 files | Relative path, file size, product level, format | Verifies presence of 5.72 GB raw Level-0A telemetry awaiting MIDAS processing | Section 2: Data Ingestion |
| `phase1_data_inventory.json` | `outputs/phase1/reports/phase1_data_inventory.csv` | 1,844 files | Path, category, level, size, inspection status | Complete repository file audit establishing 100% data traceability | Section 2: Data Ingestion |
| `confidence_tier_summary.json` | `outputs/phase2/metadata/confidence_tier_summary.csv` | 3 tiers | Tier name, criteria, pixel count, area km², % | Authoritative confidence tiers: Tier 3 (8.95 km²), Tier 2 (10.27 km²), Tier 1 (238.22 km²) | Section 4 & 5 |
| `crater_ice_inventory.json` | `outputs/phase2/metadata/crater_ice_inventory.csv` | 7 craters | Crater name, area, Tier 1/2/3 area breakdown | Crater-by-crater distribution of high-confidence radar ice cold traps | Section 4 & 5 |
| `ranked_crater_candidates.json` | `output_from_masterplan/tables/ranked_crater_candidates.csv` | 28 candidates | Candidate ID, crater, lat, lon, area, CPR, DOP, score, rank | Ranked list of discrete ice-bearing candidate cold traps | Section 5: Candidate Regions |
| `ranked_landing_sites.json` | `outputs/phase3/tables/ranked_landing_sites.csv` | 97 sites | Site ID, name, designation, lat, lon, slope, dist, LSI score | Authoritative ranking of safe lander cells (Prime: LS_38 on Cabeus B) | Section 6: Landing Sites |
| `landing_site_evaluation_criteria.json` | `outputs/phase3/tables/landing_site_evaluation_criteria.csv` | 5 criteria | Criterion, weight, threshold, unit, physical rationale | Multi-criteria evaluation rules for lander safety and scientific reach | Section 6: Landing Sites |
| `rover_traverse_waypoints_cabeus_b.json` | `outputs/phase4/tables/rover_traverse_waypoints_cabeus_b.csv` | 47 waypoints | Waypoint ID, distance, lat, lon, elevation, slope, slip %, battery | Verified waypoints of the 4.74 km Cabeus B autonomous traverse route | Section 7: Rover Path Planning |
| `ice_volume_mass_estimation_by_crater.json` | `outputs/phase4/tables/ice_volume_mass_estimation_by_crater.csv` | 7 craters | Crater, nominal depth, ice area, volume, mass Mt | Subsurface ice mass inversion results (Cabeus B = 20.35 Mt nominal) | Section 8: Mission Insights |
| `ice_resource_scenarios_summary.json` | `outputs/phase4/tables/ice_resource_scenarios_summary.csv` | 3 scenarios | Scenario, depth, porosity, volume Mm³, mass Mt | 3-Scenario LLL dielectric inversion bounds (21.02 Mt to 60.44 Mt) | Section 8: Mission Insights |
| `integrated_mission_executive_matrix.json` | `outputs/phase5/tables/integrated_mission_executive_matrix.csv` | 5 phases | Phase, title, status, primary output, verification metric | Complete executive matrix tracking status across all 5 mission phases | Section 1 & 8 |
| `isru_subsystem_mass_energy_balance.json` | `outputs/phase5/tables/isru_subsystem_mass_energy_balance.csv` | 7 subsystems | Subsystem, daily throughput, power kW, product | Engineering balances for continuous 114.05 t/yr propellant production plant | Section 8: Mission Insights |

---

## 5. Raw Satellite & Large GeoTIFF Preservation Notice

The following large source datasets remain safely preserved in their original directories and are **not** bundled into the web client to preserve performance:
- `dfsar/DFSAR_Water_Ice/Polar_Water_Ice_Products/ICY_CRATERS_SP.tif` (604.15 MB GeoTIFF)
- `dfsar/DFSAR_Water_Ice/Polar_Water_Ice_Products/ICY_CRATERS_NP.tif` (567.85 MB GeoTIFF)
- `lola/LDEM_80S_80MPP_ADJ.tiff` (189.16 MB GeoTIFF)
- `lola/LDSM_80S_80MPP_ADJ.tiff` (241.59 MB GeoTIFF)
- `lola/LPSR_80S_20MPP_ADJ.tiff` (154.22 MB GeoTIFF)
- `L&S band/ch2_sar_nrxl_20251024t114751370_d_fp_d32/...` (2.80 GB Level-0A `.dat` binary)
- `L&S band/ch2_sar_nrxl_20251025t211236510_d_fp_d18/...` (2.92 GB Level-0A `.dat` binary)

All browser visualizations utilize 100% genuine, lossless, publication-grade PNG cartographic exports, Plotly 3D meshes, and JSON tables directly derived from these rasters during pipeline execution.
