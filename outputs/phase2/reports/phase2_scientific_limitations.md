# Phase 2: Scientific Limitations and Data Provenance Audit

## 1. Status of Radar Backscatter Inversion
- **Level-0A Telemetry Status:** The project holds newly downloaded Chandrayaan-2 DFSAR L-band Full-Polarimetric Level-0A telemetry data (5.72 GB total raw signal).
- **Processing Requirement:** Converting Level-0A time-domain SignedByte echo data into calibrated Stokes vectors (S0, S1, S2, S3), CPR, and DOP requires Range-Doppler pulse compression and azimuth synthetic aperture focusing using ISRO SAC MIDAS software.
- **Compliance with Project Rule D:** No synthetic placeholder CPR/DOP rasters were fabricated. The peer-reviewed Level-4 polarimetric water ice product from Putrevu et al. (2023, SAC/ISRO) provides the verified ground truth derived from calibrated DFSAR polarimetry using CPR > 1.0 and DOP < 0.13.

## 2. Multi-Sensor Discretization and Co-Registration
- **Native Resolutions:** Native DFSAR resolution is 25 m, LOLA DEM is 80 m, and LOLA PSR is 20 m.
- **Standardization:** All multi-sensor integration was executed on the standardized 80 m core grid using Nearest-Neighbour resampling (`Resampling.nearest`) to protect categorical integrity.

## 3. Surface Roughness vs Volume Ice Ambiguity
- **Limitation:** Multiple surface scatter on blocky crater walls can generate CPR > 1.0 without water ice.
- **Mitigation:** Confidence tiering categorizes detections into Tier 3 (flat floor <= 10° in confirmed PSR), Tier 2 (moderate slope 10°-15° in PSR), and Tier 1 (candidate / steep slope > 15° roughness risk).
