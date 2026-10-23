# Scientific Data Provenance & Traceability Registry
**Project:** Chandrayaan-2 Lunar South Pole Water-Ice Detection, Landing-Site Assessment & Autonomous Rover Planning  
**Team:** TEAM SHAURYAM (ISRO AITHON 2.0 Hackathon)  
**Document:** Data Provenance (`docs/data_provenance.md`)  
**Scope:** Strict bidirectional mapping between every displayed metric, layer, chart, and candidate with its originating source files, algorithms, and verification status.

---

## 1. Provenance Matrix of Primary Scientific Products

| Displayed Metric / Layer | Source File / Relative Path | Output Artifact | Source Category | Calculation Method / Algorithm | Units | Verification Status | Known Limitations |
|---|---|---|---|---|---|---|---|
| **LOLA South Pole Elevation (LDEM)** | `lola/LDEM_80S_80MPP_ADJ.tiff` | `outputs/phase1/processed_data/lola_elevation_80m_cropped_core_sp.tif` | Raw Observation | Polar Stereographic cropping, coordinate alignment | Meters (m) | Verified | NASA LOLA laser track interpolation error <2.0 m |
| **Topographic Slope Gradient** | Derived from LDEM 80m | `outputs/phase1/processed_data/lola_slope_80m_cropped_core_sp.tif` | Project-Derived Result | Horn's algorithm ($3\times 3$ finite difference gradient) | Degrees (°) | Verified | Micro-relief (<80m) smoothed by spatial posting |
| **Permanently Shadowed Regions (PSR)** | `lola/LPSR_80S_20MPP_ADJ.tiff` | `outputs/phase1/processed_data/lola_psr_80m_aligned_lola.tif` | Published Reference Product | Nearest-neighbor categorical downsampling from 20m to 80m | Binary (0 / 1) | Verified | Modeled solar ephemeris over 18.6-year precession |
| **Published Polarimetric Ice Mask** | `dfsar/DFSAR_Water_Ice/Polar_Water_Ice_Products/ICY_CRATERS_SP.tif` | `outputs/phase1/processed_data/dfsar_ice_mask_south_pole_80m_aligned_lola.tif` | Published Reference Product | Nearest-neighbor spatial coregistration to 80m LOLA grid | Binary (0 / 1) | Verified | Derived by Putrevu et al. (2023) using CPR > 1.0 & DOP < 0.13 |
| **Confidence Tiers (1, 2, 3)** | `outputs/phase2/metadata/confidence_tier_summary.csv` | `outputs/phase2/processed_data/dfsar_ice_confidence_tiers_80m.tif` | Project-Derived Result | Spatial multi-criteria logical masking (Slope + PSR + Radar Ice) | Categorical (1, 2, 3) | Verified | Tier 3 = 8.95 km², Tier 2 = 10.27 km², Tier 1 = 238.22 km² |
| **DFSAR Level-0A Raw Telemetry** | `L&S band/ch2_sar_nrxl_20251024t114751370_d_fp_d32/` & `...d18/` | `outputs/phase1/metadata/dfsar_level0a_inventory.csv` | Raw Observation | Bit-level packet inspection, PDS4 XML parsing | SignedByte (I/Q) | Verified (5.72 GB present) | Level-0A raw echo telemetry awaiting MIDAS Range-Doppler focusing |
| **Continuous CPR & DOP on New Acquisitions** | Level-0A Telemetry | None (Placeholders strictly avoided) | Raw Observation (Unfocused) | Requires Range-Doppler compression & azimuth focusing via MIDAS | Unitless ratio [0, 1] | Pending / Not Computed | Cannot compute from raw time-domain SignedByte without full SAR focusing |
| **Ranked Crater Candidates** | `output_from_masterplan/tables/ranked_crater_candidates.csv` | `output_from_masterplan/tables/ranked_crater_candidates.csv` | Interpretation / Hypothesis | Connected component extraction, Random Forest likelihood, weighted $S$-score | Dimensionless score [0, 1] | Verified | 28 candidates characterized; highest rank: CAND_002, novel highlight: CAND_052 |
| **Landing Site Suitability Index (LSI)** | `outputs/phase3/tables/ranked_landing_sites.csv` | `outputs/phase3/maps/01_landing_site_suitability_index_map.png` | Project-Derived Result | Fuzzy Cognitive Map (FCM) 5-criteria Mamdani inference | Score [0, 1] | Verified | 97 candidate landing sites evaluated; Prime: LS_38 (Score 0.8845) |
| **Autonomous Rover Traverse (Cabeus B)** | `outputs/phase4/tables/rover_traverse_waypoints_cabeus_b.csv` | `output_from_masterplan/3d_animation/cabeus_b_3d_interactive_model.html` | Project-Derived Result | DIC3D-A* 3D spatio-temporal search with Bekker-Wong slip model | Waypoint coordinates, distance, slope, SoC | Verified | 47 waypoints, 4.74 km distance, mean slope 3.41°, peak slope 11.66° |
| **Subsurface Ice Reserves Inversion** | `outputs/phase4/tables/ice_resource_scenarios_summary.csv` | `outputs/phase4/maps/04_subsurface_ice_volumetric_concentration_map.tif` | Project-Derived Result | Looyenga-Landau-Lifshitz (LLL) 3-phase dielectric mixing model | Million Metric Tonnes (Mt) | Verified | Nominal: 52.55 Mt polar total; Cabeus B novel: 20.35 Mt |
| **Lunar ISRU Plant Balances** | `outputs/phase5/tables/isru_subsystem_mass_energy_balance.csv` | `outputs/phase5/maps/02_isru_mass_and_power_balance_chart.png` | Project-Derived Result | Thermal sublimation + Carbothermal tailings + SOXE electrolysis | kg/day & t/yr | Verified | 4,712 kg/sol regolith $	o$ 114.05 t/yr bipropellant (101.38 t LOX + 12.67 t LH2) |

---

## 2. Decision Rules & Mathematical Formulas

### A. Team SHAURYAM Primary Radar Screening Rule
- **Formula:** $\text{Potential Ice Candidate} = (\text{CPR} > 1.0) \land (\text{DOP} < 0.13)$
- **Source:** `Team Name  TEAM SHAURYAM.pdf`, Page 3, Objective 1.
- **Application Note:** This rule is verified as the documented scientific criterion. In current deliverables, it is embodied in the Putrevu et al. (2023) Level-4 reference mask. It is marked as **Awaiting Application** to the newly ingested Level-0A telemetry files until MIDAS focusing is complete.

### B. Spatial Coherence Boosting
- **Formula:** $\text{IPS}_{\text{final}} = \text{IPS} \cdot (1 + \alpha \log_{10}(A))$
- **Source:** `Team Name  TEAM SHAURYAM.pdf`, Page 3; calibrated with $\alpha = 0.08$.

### C. Safe Touchdown Constraint
- **Formulas:** $\text{Slope} \le 8.0^\circ$, $\text{Average Solar Illumination} \ge 35\%$, $\text{Distance to Ice} \le 15\text{ km}$
- **Source:** `Team Name  TEAM SHAURYAM.pdf`, Page 4, Objective 2.

### D. Bekker-Wong Soil Mechanics Wheel Slip Model
- **Formulas:** $\text{slip}_{\text{safe}} = A e^{B \theta_l}$, $\text{slip}_{\text{unsafe}} = C e^{D \phi_r}$
- **Source:** `Team Name  TEAM SHAURYAM.pdf`, Page 5, Objective 3; validated along Cabeus B descent (peak slip $11.7\% < 15.0\%$ tip limit).

### E. Looyenga-Landau-Lifshitz (LLL) 3-Phase Dielectric Mixing
- **Formula:** $\epsilon_{\text{eff}}^{1/3} = v_{\text{reg}} \epsilon_{\text{reg}}^{1/3} + v_{\text{ice}} \epsilon_{\text{ice}}^{1/3} + v_{\text{pore}} \epsilon_{\text{pore}}^{1/3}$
- **Constants:** $\epsilon_{\text{reg}} = 2.70$, $\epsilon_{\text{ice}} = 3.15$, $\epsilon_{\text{pore}} = 1.00$.
- **Source:** `Team Name  TEAM SHAURYAM.pdf`, Page 6, Objective 4.
