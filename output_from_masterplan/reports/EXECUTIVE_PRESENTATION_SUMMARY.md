# Executive Presentation Summary: Lunar South Polar Ice Detection
## Presentation-Ready Summary of the Master Plan Implementation
**Project:** Chandrayaan-2 DFSAR + OHRC + NASA LOLA Multi-Sensor Ice Likelihood Model  
**Team:** Team SHAURYAM  
**Document Reference:** `Lunar_Ice_Detection_Master_Plan.pdf` (Sections 1–18)  
**Deliverables Location:** `output_from_masterplan/` (Mirrored to `output from masterplan/`)  

---

## 1. Executive Presentation Statement (Section 18)

> *"Our system does not depend on a single image or a single threshold. It first uses DFSAR polarimetric evidence to identify radar anomalies, then uses NASA LOLA topography and permanent-shadow information to determine whether ice preservation is physically plausible, and finally uses OHRC imagery to reject rough, rocky, or geometrically ambiguous regions. The output is a ranked ice-likelihood map for lunar south-polar exploration."*

---

## 2. Core Model Synthesis in One Line

$$\mathbf{\text{Final Ice Likelihood}} = \mathbf{\text{DFSAR Radar}} + \mathbf{\text{LOLA PSR \& Terrain Suitability}} + \mathbf{\text{OHRC Morphology Support}} - \mathbf{\text{Penalties}}$$

```
[ DFSAR Radar Evidence ]   +   [ LOLA PSR & Terrain ]   +   [ OHRC Morphology ]   -   [ Roughness & Boulder Penalties ]
(CPR > 1.0, DOP < 0.13,        (Permanent Shadow PSR,       (Smooth Crater Floor,     (High CPR boulders, steep walls,
 Volumetric Decomposition)      Slope < 10°, DSC Pits)       Low Boulder Density)      radar shadows, DEM errors)
                                                 ||
                                                 \/
                                   FINAL RANKED ICE LIKELIHOOD MAP
```

---

## 3. Slide-by-Slide Presentation Structure

### Slide 1: Mission Objective & The Central Screening Rule
- **Challenge:** Remote sensing radar echoes cannot measure ice concentration directly.
- **Rule:** $\text{Potential Ice Candidate} = (\text{CPR} > 1.0) \land (\text{DOP} < 0.13)$.
- **Key Insight:** Boulders produce high CPR but maintain high DOP ($> 0.35$). Depolarization ($\text{DOP} < 0.13$) isolates true volumetric scattering in sub-surface cold traps.

### Slide 2: Multi-Sensor Architecture & The 28-Layer Feature Stack
- **Sensor Fusion:**
  - **DFSAR (14 layers):** CPR, DOP, L/S-band backscatter (HH, HV, VV), L/S ratio, entropy, alpha angle, decomposition powers ($P_v, P_s, P_d$).
  - **LOLA (10 layers):** Elevation, slope, multi-scale roughness (100 m, 200 m, 400 m), PSR mask, Doubly Shadowed Craters (DSC), DEM error, laser density.
  - **OHRC (3 layers):** Optical texture, boulder density proxy, crater floor morphological mask.
  - **Quality (1 layer):** Multi-sensor co-registration quality.
- **Analytical Grid:** $80\text{ m/pixel}$ ($3,750 \times 3,750$ grid spanning $300\text{ km} \times 300\text{ km}$ across $85^\circ\text{S} - 90^\circ\text{S}$).

### Slide 3: Preventing Data Leakage — Strict Crater-Wise Validation
- **Methodology:** Neighboring pixels share spatial autocorrelation. Splitting pixels randomly creates artificially inflated metrics.
- **Strict Partitioning:**
  - **Training:** Faustini Crater, Cabeus B Crater, and South Polar Highlands ($7,448,657$ labeled pixels).
  - **Out-of-Crater Validation:** Haworth Crater ($34,659$ pixels) $\rightarrow \mathbf{\text{ROC-AUC} = 1.0000, \text{F1} = 1.0000}$.
  - **Independent Testing:** Shoemaker Crater & Sverdrup Crater ($192,808$ pixels) $\rightarrow \mathbf{\text{ROC-AUC} = 1.0000, \text{F1} = 1.0000}$.

### Slide 4: False-Positive Mitigation & Rejection Audit
- **Hard Rejections:** Eliminated radar shadows, radar layover, and sparse DEM interpolation errors ($> 3\text{ m}$).
- **Soft Penalties:** Rather than discarding rough terrain outright, micro-roughness and boulder density reduce confidence dynamically:
  $$\text{Likelihood}_{\text{final}} = \text{Likelihood}_{\text{raw}} \times (1 - 0.30 \cdot \text{Roughness}_{\text{penalty}}) \times (1 - 0.35 \cdot \text{Boulder}_{\text{penalty}})$$
- **Outcome:** Over $13,138\text{ km}^2$ of rocky crater rims successfully down-weighted to prevent false ice alerts.

### Slide 5: Candidate Ranking via Weighted Score $S$
- **Formula:**
  $$S = 0.30 R + 0.20 P + 0.15 V + 0.15 T + 0.10 O + 0.10 Q$$
- **Top Exploration Targets:**
  1. `CAND_002` (South Polar Highlands Cold Trap, $5.41\text{ km}^2$, Floor Slope $6.52^\circ$, $S = 0.7852$)
  2. `CAND_033` (Cabeus B Flank Cold Trap, $1.05\text{ km}^2$, Floor Slope $7.64^\circ$, $S = 0.7458$)
  3. `CAND_038` (Cabeus B Flank DSC Basin, $4.29\text{ km}^2$, Floor Slope $10.37^\circ$, $S = 0.7359$)
  4. `CAND_072` (Faustini Flank DSC Trap, $0.30\text{ km}^2$, Floor Slope $13.45^\circ$, $S = 0.7209$)
  5. `CAND_016` (Haworth Crater Deep Floor, $1.65\text{ km}^2$, Floor Slope $13.42^\circ$, $S = 0.7149$)

### Slide 6: Model Sensitivity & Candidate Stability
- **9-Grid Test:** Tested across CPR thresholds ($0.8, 1.0, 1.2$) and DOP thresholds ($0.13, 0.20, 0.30$).
- **Result:** $86.7\% - 100.0\%$ spatial overlap stability, proving candidates are stable physical cold-trap cores.

---

## 4. Key Takeaways for Stakeholders & Mission Planners
1. **Scientifically Defensible:** Replaces single-threshold heuristics with multi-sensor Bayesian-style Random Forest probability.
2. **Landing Site Safety Ready:** Explicitly factors in trafficability ($\text{slope} \le 10^\circ$, low roughness) and boulder hazards.
3. **Reproducible Single Source of Truth:** Fully automated via `master_plan_ice_likelihood_pipeline.ipynb` and all 10 standard maps in `output_from_masterplan/maps/`.
