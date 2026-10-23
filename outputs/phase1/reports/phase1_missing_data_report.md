# Phase 1: Missing and Unsupported Data Report

## 1. Chandrayaan-2 OHRC Optical Imagery (CRITICAL GAP)
- **Detected Optical Images:** 0 files on disk.
- **PDS4 Data Directory Status:** `ohrc/ohr/data/` contains 0 files.
- **PDS4 Browse Directory Status:** `ohrc/ohr/browse/` contains 0 files.
- **PDS4 Geometry Directory Status:** `ohrc/ohr/geometry/` contains 0 files.
- **Present Components:** 12 TDI calibration lookup tables and 312 south-polar vector strip footprints.
- **Scientific Consequence:** High-resolution optical boulder identification cannot be performed without images.

## 2. Chandrayaan-2 DFSAR Radar Products (VERIFIED STATUS)
- **Present Level-0A Products:** 2 Full-Polarimetric L-band telemetry observations in `L&S band/` (5.72 GB total raw signal).
- **Present Level-4 Products:** Peer-reviewed water-ice detection masks (`ICY_CRATERS_SP.tif` and `NP.tif`, Putrevu et al., 2023).
- **Intermediate Level-1/2 Status:** Level-0A telemetry requires range-Doppler SAR focusing via ISRO SAC MIDAS software to produce Level-1 SLC and Level-2 Stokes parameters.
- **Scientific Strategy:** Putrevu et al. (2023) Level-4 polarimetric ice mask provides the peer-reviewed ground truth for South Polar ice; Level-0A telemetry confirms sensor telemetry parameters.

## 3. Illumination / Solar Visibility (DATA GAP)
- **Status:** No precomputed temporal illumination rasters or SPICE kernels exist on disk.
- **Scientific Consequence:** Illumination analysis requires future solar horizon modeling.
