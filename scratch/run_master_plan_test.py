"""
Test script to verify reading input rasters, computing multi-scale roughness,
and extracting crater masks for the Master Plan pipeline.
"""
import rasterio
from rasterio.windows import Window
import numpy as np
from scipy import ndimage
import time

t0 = time.time()
print("Opening LOLA DEM and Slope...")
with rasterio.open("outputs/phase1/processed_data/lola_elevation_80m_cropped_core_sp.tif") as src:
    dem = src.read(1)
    profile = src.profile.copy()
    bounds = src.bounds
    transform = src.transform

with rasterio.open("outputs/phase1/processed_data/lola_slope_80m_cropped_core_sp.tif") as src:
    slope = src.read(1)

with rasterio.open("outputs/phase1/processed_data/lola_psr_80m_aligned_lola.tif") as src:
    psr = src.read(1)

with rasterio.open("outputs/phase1/processed_data/dfsar_ice_mask_south_pole_80m_aligned_lola.tif") as src:
    ice_mask = src.read(1)

print(f"Base rasters loaded in {time.time()-t0:.2f} s, shape={dem.shape}")

# Test roughness at 100m, 200m, 400m
def compute_rms_roughness(arr, size):
    mean_val = ndimage.uniform_filter(arr, size=size, mode='reflect')
    mean_sq = ndimage.uniform_filter(arr**2, size=size, mode='reflect')
    var = np.maximum(0.0, mean_sq - mean_val**2)
    return np.sqrt(var).astype(np.float32)

t1 = time.time()
r100 = compute_rms_roughness(dem, 3)
r200 = compute_rms_roughness(dem, 5)
r400 = compute_rms_roughness(dem, 9)
print(f"Roughness computed in {time.time()-t1:.2f} s: r100 mean={r100.mean():.2f}, r400 mean={r400.mean():.2f}")
