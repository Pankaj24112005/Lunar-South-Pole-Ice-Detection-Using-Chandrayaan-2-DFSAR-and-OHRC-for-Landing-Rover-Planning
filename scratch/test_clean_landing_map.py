"""
Test script to generate a crisp LOLA hillshade and test clean, collision-free
landing site label placement with leader lines and zoomed insets.
"""
import rasterio
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import pandas as pd
from scipy import ndimage

with rasterio.open("output_from_masterplan/maps/04_lola_dem_elevation_map.tif") as src:
    dem = src.read(1).astype(np.float32)
    bounds = src.bounds
    transform = src.transform

with rasterio.open("outputs/phase3/maps/01_landing_site_suitability_index_map.tif") as src:
    lsi = src.read(1).astype(np.float32)

with rasterio.open("output_from_masterplan/maps/09_final_ice_likelihood_map.tif") as src:
    ice_p = src.read(1).astype(np.float32)

sites_df = pd.read_csv("outputs/phase3/tables/ranked_landing_sites.csv")

# Compute hillshade from DEM
# pixel resolution 80m
dy, dx = np.gradient(dem, 80.0, 80.0)
slope_rad = np.arctan(np.sqrt(dx**2 + dy**2))
aspect_rad = np.arctan2(-dy, dx)

# Lighting: azimuth = 315 deg (NW), altitude = 30 deg
az_rad = np.radians(315.0)
alt_rad = np.radians(30.0)

shaded = np.sin(alt_rad) * np.cos(slope_rad) + np.cos(alt_rad) * np.sin(slope_rad) * np.cos(az_rad - aspect_rad)
hillshade = np.clip((shaded + 1.0) / 2.0, 0.0, 1.0)

print(f"Hillshade computed: shape={hillshade.shape}, min={hillshade.min():.2f}, max={hillshade.max():.2f}")
print("Top 5 sites:\n", sites_df[["Final_Rank", "Site_ID", "Site_Name", "Polar_X_km", "Polar_Y_km", "Mean_Slope_deg", "Dist_to_Ice_km"]].head(5))
