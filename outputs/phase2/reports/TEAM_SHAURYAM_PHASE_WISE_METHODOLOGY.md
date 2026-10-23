# TEAM SHAURYAM — PHASE-WISE SCIENTIFIC METHODOLOGY SPECIFICATION
## Comprehensive Methodology Extraction, Mathematical Formulations, and Data Requirements

**Document Source:** `Team Name  TEAM SHAURYAM.pdf` (ISRO AITHON 2.0 Hackathon Submission)  
**Team Name:** TEAM SHAURYAM  
**Team Leader:** Pankaj Jadhav  
**Problem Statement Category:** Software  
**Project Title:** Detection & Characterization of Subsurface Ice in Lunar South Polar Regions Using Chandrayaan-2 DFSAR Radar + OHRC Imagery for Landing Site Selection & Rover Traverse Planning  
**Project Tagline:** From radar echoes to rover tracks: finding lunar water, and the safest way to reach it.  
**Audit Date:** 2026-10-22  
**Auditor:** Senior Planetary Remote-Sensing Scientist & Scientific Software Auditor  

---

## 1. Executive Overview and Document Structure

The team's official proposal PDF consists of 7 presentation slides/pages submitted for the AITHON 2.0 competition. It establishes a multi-sensor lunar exploration pipeline connecting radar polarimetry, optical crater hazard detection, digital elevation modeling, fuzzy landing site evaluation, reinforcement learning rover navigation, and dielectric-driven ice resource estimation.

### Slide-to-Phase Mapping in the Proposal Document:
- **Page 1:** Title Slide, Team Identification, Lunar South Pole Polar Stereographic Crater Context (Haworth, Shoemaker, Faustini, Shackleton, de Gerlache).
- **Page 2:** Idea Title, Problem Definition, Proposed End-to-End Solution Summary, and Project Tagline.
- **Page 3 (Objective 1):** Identification of high-probability subsurface ice regions $\rightarrow$ **Phase 2 Methodology**.
- **Page 4 (Objective 2):** Feasible Landing Sites $\rightarrow$ **Phase 3 Methodology**.
- **Page 5 (Objective 3):** Optimized Rover Traverse Path $\rightarrow$ **Phase 4 Navigation Methodology**.
- **Page 6 (Objective 4):** Subsurface Ice Volume & Mass $\rightarrow$ **Phase 4 Resource Estimation Methodology**.
- **Page 7:** Research References, Software Tech Stack, and Bonus Lunar ISRU Workflow $\rightarrow$ **Phase 1 Foundation & Phase 5 Dashboard / ISRU**.

---

## 2. Phase 1 — Data Audit, Preprocessing & Quality Enhancement

### 2.1 Specification in PDF (Pages 2, 3, 6, 7)
- **Primary Objectives:** Ingest, inspect, radiometrically calibrate, speckle filter, and coregister multi-sensor datasets: Chandrayaan-2 DFSAR, Chandrayaan-2 OHRC, and LRO LOLA DEM/PSR products.
- **Data Preprocessing Software Stack (Page 3, 7):** Python, MIDAS (ISRO SAC SAR processor), ENVI, GDAL, Rasterio, NumPy, SciPy, OpenCV, Scikit-image.
- **Radar Radiometric Calibration (Page 6, Section 2):**
  $$\sigma^0_{\text{dB}} = 20\log_{10}(\text{DN}) - k$$
  where $\text{DN}$ is the digital number and $k$ is the calibration constant supplied in the DFSAR product metadata.
- **Radar Speckle Filtering (Page 6, Section 2):** Lee filter or Refined Lee filter to preserve structural boundaries and reduce coherent speckle noise.
- **Radar Multi-Look Averaging (Page 3, Objective 1):** $5 \times 5$ window spatial averaging of the scattering matrix elements to generate covariance terms.
- **LOLA Topographic Preprocessing (Page 4, 6):** Derivation of pixel-wise slope ($\theta$), aspect, local incidence angle ($\theta_{\text{local}}$), and illumination from LOLA DEM products.
- **OHRC Optical Preprocessing (Page 4, 7):** Preprocessing of high-resolution optical imagery for shadow-casting small crater detection and lander hazard delineation.

### 2.2 Required Source Data & Metadata:
- Chandrayaan-2 DFSAR Full-Polarimetric (FP) L-band / S-band Single-Look Complex (SLC) or Calibrated Slant-Range / Ground-Range Intensity products.
- Chandrayaan-2 OHRC Level-1 / Level-2 high-resolution optical rasters ($0.25\text{ m}$ to $0.32\text{ m}$ pixel scale).
- LRO LOLA Digital Elevation Model (LDEM $80\text{ m}$ / $20\text{ m}$), Slope, and PSR illumination masks.

### 2.3 Identified Ambiguities & Data Gaps:
- The PDF assumes raw calibrated Full-Pol (FP) DFSAR complex data are available in local storage for MIDAS processing.
- In reality, the local repository contains only derived Level-4 binary ice masks (`ICY_CRATERS_SP.tif` from Putrevu et al., 2023) and footprint shapefiles. No raw Level-1 SLC matrices ($S_{HH}, S_{HV}, S_{VV}$) exist locally.
- OHRC image rasters ($0.25\text{ m}$) are absent from local storage (only coverage footprint shapefiles are present).

---

## 3. Phase 2 — Subsurface Lunar Ice Detection Using DFSAR Radar Polarimetry

### 3.1 Mathematical Formulations (Page 3, Objective 1)

#### 1. Scattering Matrix Representation:
$$S = \begin{bmatrix} S_{HH} & S_{HV} \\ S_{VH} & S_{VV} \end{bmatrix}$$
Under monostatic radar reciprocity ($S_{HV} = S_{VH}$).

#### 2. Multi-Look Covariance Terms ($5 \times 5$ window):
$$\sigma_{HH} = \langle |S_{HH}|^2 \rangle, \quad \sigma_{HV} = \langle |S_{HV}|^2 \rangle, \quad \sigma_{VV} = \langle |S_{VV}|^2 \rangle$$
$$C_{HHVV} = \langle S_{HH} S_{VV}^* \rangle$$
$$\text{Re}\{S_{HH} S_{VV}^*\} = \beta \sqrt{\sigma_{HH}\sigma_{VV}}, \quad \text{with } -1 \le \beta \le 1$$

#### 3. Stokes Parameters:
$$S_1 = \sigma_{HH} + \sigma_{VV}$$
$$S_2 = \sigma_{HH} - \sigma_{VV}$$
$$S_3 = 2\,\text{Re}[S_{HH} S_{VV}^*]$$
$$S_4 = -2\,\text{Im}[S_{HH} S_{VV}^*]$$

#### 4. Circular Polarization Backscatter Transformation:
- **Same-Sense Circular (SC) Backscatter ($\sigma_{SC}$):**
  $$\sigma_{SC} = \frac{1}{4}\left(\sigma_{HH} + \sigma_{VV} + 4\sigma_{HV} - 2\,\text{Re}[S_{HH} S_{VV}^*]\right)$$
- **Opposite-Sense Circular (OC) Backscatter ($\sigma_{OC}$):**
  $$\sigma_{OC} = \frac{1}{4}\left(\sigma_{HH} + \sigma_{VV} + 2\,\text{Re}[S_{HH} S_{VV}^*]\right)$$

#### 5. Circular Polarization Ratio (CPR, $\mu$):
$$\text{CPR}(\mu) = \frac{\sigma_{SC}}{\sigma_{OC}}$$

#### 6. Degree of Polarization (DOP, $m$):
$$\text{DOP}(m) = \frac{\sqrt{S_2^2 + S_3^2 + S_4^2}}{S_1}$$

#### 7. Dual Physical Ice Detection Criterion:
$$\text{Criterion: } \text{CPR} > 1.0 \quad \text{AND} \quad \text{DOP} < 0.13$$
- **True (T):** Subsurface Ice Candidate Pixels.
- **False (F):** Subsurface Non-Ice Pixels.

#### 8. Likelihood Ratio (LR) per Pixel:
$$\text{LR} = \frac{P(\text{CPR}, \text{DOP} \mid \text{Ice})}{P(\text{CPR}, \text{DOP} \mid \text{NonIce})}$$
Modelled using bivariate Gaussian Kernel Density Estimation (KDE) over observed (CPR, DOP) distributions. $\text{LR} > 1.0$ indicates preference for the ice hypothesis.

#### 9. Base Ice Probability Score (IPS):
$$\text{IPS} = \frac{\text{LR}}{1 + \text{LR}}, \quad \text{where } 0 \le \text{IPS} \le 1$$

#### 10. Spatial Coherence Boosting Algorithm:
$$\text{IPS}_{\text{final}} = \text{IPS} \cdot \left(1 + \alpha \log_{10}(A)\right)$$
where $A = \text{Cluster}_{\text{size}}$ (connected component candidate pixel count), and $\alpha$ is a positive scaling factor.

#### 11. Final Decision Threshold:
$$\text{Target Class: } \text{IPS}_{\text{final}} \ge T \quad (T = 0.70) \implies \text{High-Probability Ice Region}$$

### 3.2 Thresholds, Constants, and Assumptions:
- $\text{CPR} > 1.0$: Coherent backscatter enhancement from volumetric ice scattering (Campbell et al., 2012; Putrevu et al., 2023).
- $\text{DOP} < 0.13$: Strong multiple volumetric scattering causing severe depolarization of the return radar signal.
- $T = 0.70$: High-probability extraction threshold cited on Page 3.
- $\alpha$: Coherence scaling factor (calibrated as $0.08$ in notebook implementation).

---

## 4. Phase 3 — Multisensor Ice Mapping & Landing Site Selection

### 4.1 Methodology in PDF (Page 4, Objective 2)

#### 1. Co-Registration and Sampling Region Determination:
- Cross-reference DFSAR ice-positive detections ($\text{CPR} > 1 \land \text{DOP} < 0.13$) with OHRC-mapped Permanently Shadowed Regions (PSRs) and Doubly Shadowed Craters (DSCs).
- Identify flat regions within reach of ice deposits using LOLA slope.

#### 2. Preselection of Safe Lander Cells:
- **Slope Constraint (LOLA):** $\text{Slope} \le 8^\circ$.
- **Illumination Constraint (LOLA):** $\text{Average Illumination} \ge 35\%$.
- **Cell Generation:** Generate $10 \times 10\text{ m}^2$ landing seeds, eliminate artifact pixels.
- **Sliding Window Filtering:** Sliding window Root-Mean-Square (RMS) slope aggregation to delineate $1 \times 1\text{ km}^2$ safe landing blocks.
- **Ice Proximity Constraint:** Delineate landing cells with distance to verified ice $\le 15\text{ km}$.

#### 3. Characterization of Small-Scale Hazards:
- **Small Craters:** Detect shadow-casting micro-craters from sub-meter OHRC images.
- **Rocky Regimes:** Detect boulder fields and rough rock distributions from DFSAR high-resolution backscatter.
- **Illumination Dynamics:** LOLA DEM solar visibility modelling for day/night duration.

#### 4. Fuzzy Cognitive Map (FCM) Optimal Site Ranking:
- **Five Primary Evaluation Criteria ($C_j$):**
  - $C_1$: Distance to Ice Region.
  - $C_2$: Terrain Slope.
  - $C_3$: Rock / Boulder Distribution.
  - $C_4$: Illumination Intensity.
  - $C_5$: Maximum Surface Temperature.
- **Fuzzy Membership Functions:**
  $$\mu_i(x, v) = \min(\mu_i(x), \mu_i(v)), \quad f(x, v) = \frac{2xy}{1+xy}$$
- **Inference & Aggregation:** Mamdani Minimum Fuzzy Rule Base with Einstein Sum family rule aggregation.
- **Dynamic State Update (Kosko Method):**
  $$A_i^{t+1} = f\left(\sum_{j=1}^5 A_j^t W_{ji}\right)$$
- **Final Evaluation Index Score:**
  $$\text{Score} = \sum_{j=1}^5 \omega_j y_j, \quad \text{where } \sum \omega_j = 1, \quad y_j \in [0, 1]$$

---

## 5. Phase 4 — Rover Traverse Planning & Uncertainty-Aware Ice Resource Estimation

### 5.1 Rover Navigation Methodology (Page 5, Objective 3)

#### 1. Two-Tier Hybrid Architecture:
- **Tier 1 (Global Approach, Landing Site $\to$ Crater Rim):**
  - Algorithm: **DIC3D-A\*** (Dynamic Illumination Constrained 3D A-Star; Miao et al., 2026).
  - Search Space: 3D spatio-temporal state space $(x, y, t)$ accounting for moving solar illumination.
  - Heuristic Cost Function:
    $$\text{Cost}_{\text{heuristic}} = \alpha \text{Cost}_r + \beta \text{Cost}_D + \gamma \text{Cost}_{sl} + \delta \text{Cost}_{\text{ice}}$$
    where $\text{Cost}_r$ = terrain roughness/height/slope, $\text{Cost}_D$ = distance, $\text{Cost}_{sl}$ = wheel slip cost, $\text{Cost}_{\text{ice}}$ = inverse ice probability cost.
  - Evaluation Function: $f(n) = g(n) + h(n)$ with $h(n) = \text{Distance}(n, \text{Goal})$.
  - Waypoints: Periodic wait-mechanism at sunlit crater rim waypoints for solar battery recharging.

#### 2. Wheel Slip Safety Model:
$$\text{slip}_{\text{safe}} = A\, e^{B \theta_l}, \quad \text{slip}_{\text{unsafe}} = C\, e^{D \phi_r}$$
where $\theta_l$ is longitudinal slope, $\phi_r$ is roll angle, and $A, B, C, D$ are empirical soil mechanics parameters.

#### 3. Crater-Rim Phase Handoff Gate:
Rover pauses at the crater rim and enters the descent phase only when all 3 conditions are satisfied:
1. $\text{Battery State} \ge \text{Threshold}$.
2. $\text{Visible Fraction of Solar Disk (VFSD)} < 0.3$ (entry into dark cold trap).
3. System status in experiment mode.

#### 4. Tier 2 (Local Dark Descent, Crater Rim $\to$ DSC Floor):
- Algorithm: **PPO-DRL** (Proximal Policy Optimization Deep Reinforcement Learning; Yu et al., 2021).
- State Space: Local DEM elevation patch, CPR/DOP values, battery charge state, distance to target ice deposit.
- Composite Reward Function:
  $$r_t = r_t^{\text{dis}} + \alpha_s r_t^{\text{safe}}$$
  $$r_t^{\text{dis}} = \begin{cases} 10, & \text{if } d_t^c < d_{\text{goal}} \\ -10, & \text{if } d_t^c > d_{\text{max}} \\ d_t^{l-1} - d_t^l, & \text{otherwise} \end{cases}$$
  $$r_t^{\text{safe}} = \begin{cases} -10, & (\theta_t > \theta_{\text{max}}) \lor (\phi_t > \phi_{\text{max}}) \\ -(\text{slip} \cdot \beta_t), & \text{otherwise} \end{cases}$$
- Simulation Environment: Gazebo / ROS robotics platform.

---

### 5.2 Subsurface Ice Volume & Mass Estimation (Page 6, Objective 4)

#### 1. Integral Equation Model (IEM) Forward Simulation:
- Permittivity Range: $\epsilon \in [1, 12]$.
- Roughness Parameters: $\text{RMS Height} < 5\text{ cm}$ (Gaussian), $< 7.2\text{ cm}$ (Exponential), Correlation Length $L = 24\text{ cm}$, Magnetic Permeability $\mu = 1$.
- Autocorrelation Functions (4 Models): 2D Gaussian ($\exp(-(r/L)^2)$), 2D Exponential ($\exp(-r/L)$), 3D Gaussian, and 3D Exponential.
- Training Dataset: 56,000 to 79,000 synthetic radar backscatter samples mapping $(\sigma^0_{HH}, \sigma^0_{VV}, \theta_{\text{local}}) \to \epsilon_{\text{theory}}$ (70% train / 30% test split).

#### 2. Artificial Neural Network (ANN) Inversion Ensemble:
- Architecture: 3 inputs $(\sigma^0_{HH}, \sigma^0_{VV}, \theta_{\text{local}})$, 3 hidden layers $\times 64$ neurons, $\tanh$ activation, Adam optimizer, MSE loss, 50–150 epochs. Output: retrieved dielectric constant $\hat{\epsilon}$.
- Ensemble Weighting ($R^2$-weighted):
  $$\epsilon_{\text{final}} = \frac{\sum_{i=1}^4 R_i^2 \epsilon_i}{\sum_{i=1}^4 R_i^2}$$
  $$\text{Uncertainty } \sigma_\epsilon = \text{std}(\epsilon_1, \epsilon_2, \epsilon_3, \epsilon_4)$$

#### 3. Looyenga-Landau-Lifshitz (LLL) 3-Phase Dielectric Mixing Model:
$$\epsilon_{\text{eff}}^{1/3} = v_{\text{reg}} \epsilon_{\text{reg}}^{1/3} + v_{\text{ice}} \epsilon_{\text{ice}}^{1/3} + v_{\text{pore}} \epsilon_{\text{pore}}^{1/3}$$
- Constants:
  - Apollo lunar regolith: $\epsilon_{\text{reg}} \approx 2.7$.
  - Pure water ice ($100\text{ K}$): $\epsilon_{\text{ice}} \approx 3.15$.
  - Vacuum / pore space: $\epsilon_{\text{pore}} = 1.0$.
  - Volume fractions sum: $v_{\text{reg}} + v_{\text{ice}} + v_{\text{pore}} = 1.0$.
- Invert for volumetric ice concentration: $f_{\text{ice}} = v_{\text{ice}} \in [0, 1]$.

#### 4. Ice Volume & Mass Calculation Across 3 Scenarios:
$$V_{\text{ice}} = \sum_{\text{pixels}} \left(\text{pixel}_{\text{area}} \times \text{depth} \times f_{\text{ice}}\right)$$
$$\text{Mass}_{\text{ice}} = V_{\text{ice}} \times 917\text{ kg}\cdot\text{m}^{-3}$$

| Scenario | Modelled Depth ($d$) | Regolith Porosity ($\phi$) | Scenario Designation |
|---|---|---|---|
| **Conservative** | $2\text{ m}$ | $\phi = 0.45$ | Lower Bound ($V_{\text{low}}$) |
| **Nominal** | $5\text{ m}$ | $\phi = 0.40$ | Best Estimate ($V_{\text{nominal}}$) |
| **Optimistic** | $5\text{ m}$ | $\phi = 0.35$ | Upper Bound ($V_{\text{high}}$) |

---

## 6. Phase 5 — Lunar ISRU Analysis, Interactive Dashboard & Mission Outputs

### 6.1 Bonus Lunar ISRU Workflow (Page 7)
1. **Feedstock:** Icy regolith mined from high-confidence ice regions.
2. **Excavation:** RASSOR bucket drum robotic excavation.
3. **Primary Extraction:** Thermal heated crucible sublimation $\to$ Dry tailings + Raw water vapour (Water 1).
4. **Tailings Processing:** Particle size separator $\to$ Carbothermal reduction ($\text{SiO}_2 + 3\text{C} \to \text{SiC} + 2\text{CO}$).
5. **Methanation & Methane Pyrolysis:**
   - Methanation: $\text{CO} + 3\text{H}_2 \to \text{CH}_4 + \text{H}_2\text{O}$ (Water 2).
   - Pyrolysis carbon recycle: $\text{CH}_4 \to \text{C} + 2\text{H}_2$.
6. **Water Transport & Electrolysis:**
   - Surface hauling: Water tanker transport from PSR to Peak of Eternal Light (PEL, $\sim 5\text{ km}$).
   - Solid Oxide Electrolysis (SOXE): $2\text{H}_2\text{O} \to 2\text{H}_2 + \text{O}_2$.
   - Cryogenic liquefaction and storage: Liquid Oxygen (LOX) and Liquid Hydrogen ($\text{LH}_2$) rocket propellant.

### 6.2 Interactive Dashboard Architecture (Page 7)
- Frontend: Streamlit / React interactive dashboard.
- Backend: FastAPI analytical engine.
- Spatial Visualizations: GeoTIFF, QGIS/ArcGIS layers, Matplotlib/Plotly figures.
- Mission Deliverables: High-resolution maps, landing site rankings, rover waypoints, and ice resource tonnage with error margins.

---

## 7. Phase-Wise Dependency and Implementation Pre-Requisite Audit

| Phase | Core Inputs Required | Local Data Availability | Scientific Status | Implementation Status |
|---|---|---|---|---|
| **Phase 1** | DFSAR, OHRC, LOLA DEM, LOLA PSR | LOLA DEM ($80\text{ m}$), LOLA PSR ($20\text{ m}$), Putrevu Level-4 mask present. Raw DFSAR FP SLC and OHRC rasters absent. | Calibrated topography and reference ice mask verified. | **Completed & Audited** in Phase 1 report. |
| **Phase 2** | Full-Pol $S_{HH}, S_{HV}, S_{VV}$, Stokes parameters, CPR, DOP | Only Putrevu et al. (2023) Level-4 binary mask present. No raw complex scattering matrix cubes exist. | Discrete mask represents verified Category C published reference. Continuous CPR/DOP cannot be computed from raw data (Category D). | **Audited in Phase 2**. Heuristic candidate scoring validated; raw CPR/DOP documented as data gap. |
| **Phase 3** | Candidate ice raster, LOLA slope, LOLA illumination, OHRC hazard imagery | LOLA slope ($80\text{ m}$) available. High-res illumination and sub-meter OHRC rasters unavailable. | FCM site ranking can be implemented using available LOLA topography + DFSAR candidate layers. | **Deferred** until Phase 3 approval. |
| **Phase 4** | 3D dynamic illumination, obstacle layers, calibrated $\sigma^0_{HH}, \sigma^0_{VV}$ | Standard static slope available. Dynamic moving shadow and continuous $\sigma^0$ cubes absent. | Rover traverse cost function and 3-scenario LLL mixing model can be evaluated using documented bounds. | **Deferred** until Phase 4 approval. |
| **Phase 5** | Integrated GIS layers, tonnage estimates, traverse profiles | Dependent on Phases 2–4 outputs. | Dashboard architecture designed; awaiting pipeline outputs. | **Deferred** until Phase 5 approval. |

---

## 8. Summary of Methodological Findings

1. **Intended vs Actual Radar Workflow:** The team's intended methodology on Page 3 is a mathematically rigorous Full-Polarimetric workflow starting from raw $2 \times 2$ scattering matrices ($S_{HH}, S_{HV}, S_{VV}$) through $5\times 5$ multi-looking, Stokes decomposition, circular polarization synthesis, CPR, DOP, and Gaussian bivariate KDE. However, because ISRO SAC only released Level-4 derived binary ice products (`ICY_CRATERS_SP.tif`) and not Level-1 Single Look Complex matrices in the downloaded package, the project scientifically accommodates this reality by utilizing the peer-reviewed Putrevu et al. (2023) mask as a Category C published reference classification.
2. **Bayesian Score Formulation:** In the absence of continuous CPR/DOP rasters to fit a continuous Gaussian KDE, the existing notebook appropriately modeled the likelihood ratio using physical discrete multipliers ($LR = 2.0$ for ice, $1.8\times$ for PSR, $1.2\times$ for flat terrain, and $0.45\times$ penalty for steep slopes). However, these scores must be designated as **Heuristic Ice-Candidate Scores (ICS)** rather than true posterior probabilities.
3. **Threshold Compliance:** The decision rules $\text{CPR} > 1.0 \land \text{DOP} < 0.13$ and $T = 0.70$ are explicitly specified on Page 3 of the team's proposal PDF.
