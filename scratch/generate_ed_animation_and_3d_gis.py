"""
Script to generate:
1. 3D Model files (.obj, .mtl, and interactive .html)
2. 3D GIS files (.geojson, .tif, .csv)
3. Animated GIF simulations of rover traversing from landing site to ice target
Strictly reading existing data from output_from_masterplan/ and outputs/.
Saving all outputs to output_from_masterplan/ed_animation/ and mirroring to output_from_masterplan/3d_animation/.
"""
import os
import sys
import math
import json
import time
import shutil
import numpy as np
import pandas as pd
import rasterio
from rasterio.transform import from_bounds
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch, Circle
from PIL import Image
import plotly.graph_objects as go

print("=== STARTING 3D MODEL, GIS & ANIMATION GENERATION ===")
t0 = time.time()

# Target directories
OUT_DIR = "output_from_masterplan/ed_animation"
MIRROR_DIR = "output_from_masterplan/3d_animation"
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(MIRROR_DIR, exist_ok=True)

# -----------------------------------------------------------------------------
# 1. LOAD AUTHORITATIVE WAYPOINTS & MASTER PLAN RASTERS
# -----------------------------------------------------------------------------
print("\n[Step 1] Loading waypoint tables and master plan rasters...")
wp_path = "output_from_masterplan/phase4_rover_and_resources/tables/rover_traverse_waypoints_cabeus_b.csv"
wp_df = pd.read_csv(wp_path)
print(f"Loaded Cabeus B waypoints: {len(wp_df)} points (WP_000 to WP_046)")

haworth_wp_path = "output_from_masterplan/phase4_rover_and_resources/tables/rover_traverse_waypoints_haworth.csv"
haworth_df = pd.read_csv(haworth_wp_path)

sites_df = pd.read_csv("output_from_masterplan/phase3_landing_sites/tables/ranked_landing_sites.csv")
cands_df = pd.read_csv("output_from_masterplan/tables/ranked_crater_candidates.csv")

# Extract primary landing site LS_38 & primary candidate CAND_052
ls_38 = sites_df[sites_df['Site_ID'] == 'LS_38'].iloc[0]
cand_052 = cands_df[cands_df['Candidate_ID'] == 'CAND_052'].iloc[0]
print(f"Landing Site: {ls_38['Site_ID']} ({ls_38['Site_Name']}) at Lat {ls_38['Latitude']}, Lon {ls_38['Longitude']}")
print(f"Ice Target: {cand_052['Candidate_ID']} ({cand_052['Crater_name']}) at Lat {cand_052['Latitude']}, Lon {cand_052['Longitude']}")

# Load full-resolution master plan rasters
in_maps = "output_from_masterplan/maps"
with rasterio.open(f"{in_maps}/04_lola_dem_elevation_map.tif") as src:
    dem_full = src.read(1).astype(np.float32)
    dem_profile = src.profile.copy()
    dem_bounds = src.bounds
    dem_transform = src.transform
    dem_crs = src.crs

with rasterio.open(f"{in_maps}/05_lola_slope_map.tif") as src:
    slope_full = src.read(1).astype(np.float32)

with rasterio.open(f"{in_maps}/07_lola_psr_dsc_map.tif") as src:
    psr_full = (src.read(1) >= 1.0).astype(np.uint8)

with rasterio.open(f"{in_maps}/09_final_ice_likelihood_map.tif") as src:
    ice_p_full = src.read(1).astype(np.float32)

# Compute Bounding Box for Cabeus B Mission Window (with 4.8 km buffer around traverse)
margin_m = 4800.0
min_x_m = wp_df['Polar_X_km'].min() * 1000.0 - margin_m
max_x_m = wp_df['Polar_X_km'].max() * 1000.0 + margin_m
min_y_m = wp_df['Polar_Y_km'].min() * 1000.0 - margin_m
max_y_m = wp_df['Polar_Y_km'].max() * 1000.0 + margin_m

c_min = int((min_x_m - dem_bounds.left) / 80.0)
c_max = int((max_x_m - dem_bounds.left) / 80.0)
r_min = int((dem_bounds.top - max_y_m) / 80.0)
r_max = int((dem_bounds.top - min_y_m) / 80.0)

sub_dem = dem_full[r_min:r_max, c_min:c_max]
sub_slope = slope_full[r_min:r_max, c_min:c_max]
sub_psr = psr_full[r_min:r_max, c_min:c_max]
sub_ice = ice_p_full[r_min:r_max, c_min:c_max]
sub_rows, sub_cols = sub_dem.shape

# Exact clipped spatial bounds
clip_left = dem_bounds.left + c_min * 80.0
clip_top = dem_bounds.top - r_min * 80.0
clip_right = clip_left + sub_cols * 80.0
clip_bottom = clip_top - sub_rows * 80.0
clip_transform = from_bounds(clip_left, clip_bottom, clip_right, clip_top, sub_cols, sub_rows)

print(f"Clipped mission window: {sub_rows} rows x {sub_cols} cols ({(sub_cols*80)/1000:.1f} km x {(sub_rows*80)/1000:.1f} km)")
print(f"Elevation range: {sub_dem.min():.1f} m to {sub_dem.max():.1f} m")

# Compute local hillshade for realistic shading
dy, dx = np.gradient(sub_dem, 80.0, 80.0)
slope_rad = np.arctan(np.sqrt(dx**2 + dy**2))
aspect_rad = np.arctan2(-dy, dx)
az_rad = np.radians(315.0)
alt_rad = np.radians(35.0)
shaded = np.sin(alt_rad) * np.cos(slope_rad) + np.cos(alt_rad) * np.sin(slope_rad) * np.cos(az_rad - aspect_rad)
sub_hillshade = np.clip((shaded + 1.0) / 2.0, 0.0, 1.0)

# -----------------------------------------------------------------------------
# 2. GENERATE CLIPPED 3D GIS GEOTIFFS
# -----------------------------------------------------------------------------
print("\n[Step 2] Generating georeferenced 3D GeoTIFF layers...")
clip_profile = dem_profile.copy()
clip_profile.update({
    'height': sub_rows,
    'width': sub_cols,
    'transform': clip_transform,
    'crs': dem_crs
})

with rasterio.open(f"{OUT_DIR}/cabeus_b_local_dem_3d.tif", "w", **clip_profile) as dst:
    dst.write(sub_dem, 1)

with rasterio.open(f"{OUT_DIR}/cabeus_b_local_slope_3d.tif", "w", **clip_profile) as dst:
    dst.write(sub_slope, 1)

with rasterio.open(f"{OUT_DIR}/cabeus_b_local_ice_likelihood_3d.tif", "w", **clip_profile) as dst:
    dst.write(sub_ice, 1)

print("Saved clipped 3D GeoTIFF rasters successfully.")

# -----------------------------------------------------------------------------
# 3. GENERATE 3D GIS GEOJSON & WAYPOINT DATASETS
# -----------------------------------------------------------------------------
print("\n[Step 3] Generating 3D GIS GeoJSON layers and waypoint catalogs...")

# Primary Mission GeoJSON (Cabeus B LS_38 -> CAND_052)
features = []

# 1. Landing Site Point
features.append({
    "type": "Feature",
    "id": "LANDING_SITE_LS_38",
    "geometry": {
        "type": "Point",
        "coordinates": [float(ls_38['Longitude']), float(ls_38['Latitude']), float(ls_38['Elevation_m'])]
    },
    "properties": {
        "feature_type": "Landing_Site_Touchdown_Point",
        "site_id": str(ls_38['Site_ID']),
        "site_name": str(ls_38['Site_Name']),
        "final_rank": int(ls_38['Final_Rank']),
        "designation": str(ls_38['Designation']),
        "elevation_m": float(ls_38['Elevation_m']),
        "mean_slope_deg": float(ls_38['Mean_Slope_deg']),
        "max_slope_deg": float(ls_38['Max_Slope_deg']),
        "roughness_100m": float(ls_38['Roughness_100m']),
        "illumination_pct": float(ls_38['Illumination_Availability_Pct']),
        "lsi_suitability_score": float(ls_38['LSI_Score']),
        "target_ice_deposit": str(ls_38['Target_Ice_Deposit']),
        "distance_to_ice_km": float(ls_38['Dist_to_Ice_km']),
        "scientific_rationale": str(ls_38['Scientific_Contribution'])
    }
})

# 2. Target Ice Deposit Point
features.append({
    "type": "Feature",
    "id": "ICE_TARGET_CAND_052",
    "geometry": {
        "type": "Point",
        "coordinates": [float(cand_052['Longitude']), float(cand_052['Latitude']), float(wp_df.iloc[-1]['Elevation_m'])]
    },
    "properties": {
        "feature_type": "Water_Ice_Reservoir_Core",
        "candidate_id": str(cand_052['Candidate_ID']),
        "crater_name": str(cand_052['Crater_name']),
        "final_rank": int(cand_052['Final_rank']),
        "area_km2": float(cand_052['Area_km2']),
        "median_cpr": float(cand_052['Median_CPR']),
        "volume_scattering_pct": float(cand_052['Volume_scattering_percentage']),
        "psr_cold_trap_pct": float(cand_052['PSR_percentage']),
        "model_ice_probability": float(cand_052['Model_probability']),
        "estimated_nominal_tonnage": 384000.0,
        "resource_potential": "Strategic cryogenic volatile sampling site"
    }
})

# 3. Safe Landing Ellipse Polygon (1.5 km major axis at LS_38)
theta = np.linspace(0, 2*np.pi, 36)
r_lat = 0.75 / 30.3  # km to degrees approx at 87S
r_lon = 0.50 / (30.3 * np.cos(np.radians(-87.39)))
ellipse_coords = []
for t in theta:
    elon = float(ls_38['Longitude'] + r_lon * np.cos(t))
    elat = float(ls_38['Latitude'] + r_lat * np.sin(t))
    ellipse_coords.append([round(elon, 5), round(elat, 5), float(ls_38['Elevation_m'])])
ellipse_coords.append(ellipse_coords[0])

features.append({
    "type": "Feature",
    "id": "SAFE_LANDING_ELLIPSE_LS_38",
    "geometry": {
        "type": "Polygon",
        "coordinates": [ellipse_coords]
    },
    "properties": {
        "feature_type": "Safe_Landing_Zone_Ellipse",
        "site_id": "LS_38",
        "semi_major_axis_km": 0.75,
        "semi_minor_axis_km": 0.50,
        "terrain_safety": "100% compliant with Chandrayaan-2/3 landing slope criteria (< 6 deg)"
    }
})

# 4. Ice Deposit Footprint Polygon (Approximation of CAND_052)
r_ice_lat = 0.35 / 30.3
r_ice_lon = 0.25 / (30.3 * np.cos(np.radians(-87.54)))
ice_poly_coords = []
for t in theta:
    ilon = float(cand_052['Longitude'] + r_ice_lon * np.cos(t))
    ilat = float(cand_052['Latitude'] + r_ice_lat * np.sin(t))
    ice_poly_coords.append([round(ilon, 5), round(ilat, 5), float(wp_df.iloc[-1]['Elevation_m'])])
ice_poly_coords.append(ice_poly_coords[0])

features.append({
    "type": "Feature",
    "id": "ICE_DEPOSIT_EXTENT_CAND_052",
    "geometry": {
        "type": "Polygon",
        "coordinates": [ice_poly_coords]
    },
    "properties": {
        "feature_type": "Ice_Deposit_Boundary",
        "candidate_id": "CAND_052",
        "area_km2": 0.192,
        "cpr_classification": "High Circular Polarization Ratio (Volume Scattering)"
    }
})

# 5. Rover Traverse 3D LineString
coords_3d = [[round(float(r['Longitude']), 5), round(float(r['Latitude']), 5), round(float(r['Elevation_m']), 1)] for _, r in wp_df.iterrows()]
features.append({
    "type": "Feature",
    "id": "ROVER_TRAVERSE_PATH_3D",
    "geometry": {
        "type": "LineString",
        "coordinates": coords_3d
    },
    "properties": {
        "feature_type": "Autonomous_Traverse_Path_3D",
        "route_id": "DIC3D-A*_CABEUS_B_NOVEL_DESCENT",
        "total_distance_km": 4.74,
        "total_waypoints": len(wp_df),
        "elevation_start_m": float(wp_df.iloc[0]['Elevation_m']),
        "elevation_end_m": float(wp_df.iloc[-1]['Elevation_m']),
        "net_elevation_change_m": float(wp_df.iloc[-1]['Elevation_m'] - wp_df.iloc[0]['Elevation_m']),
        "mean_slope_deg": 3.41,
        "max_slope_deg": 11.66,
        "max_wheel_slip_pct": 11.7,
        "thermal_profile": "Sunlit Highland Ridge -> Cryogenic PSR Cold Trap",
        "end_battery_soc_pct": 99.6
    }
})

# 6. Detailed 3D Waypoint Points (All 47 waypoints)
for _, r in wp_df.iterrows():
    features.append({
        "type": "Feature",
        "id": f"WAYPOINT_{r['Waypoint_ID']}",
        "geometry": {
            "type": "Point",
            "coordinates": [round(float(r['Longitude']), 5), round(float(r['Latitude']), 5), round(float(r['Elevation_m']), 1)]
        },
        "properties": {
            "waypoint_id": str(r['Waypoint_ID']),
            "cum_distance_m": float(r['Cum_Distance_m']),
            "cum_distance_km": float(r['Cum_Distance_km']),
            "polar_x_km": float(r['Polar_X_km']),
            "polar_y_km": float(r['Polar_Y_km']),
            "elevation_m": float(r['Elevation_m']),
            "slope_deg": float(r['Slope_deg']),
            "wheel_slip_pct": float(r['Wheel_Slip_Pct']),
            "thermal_regime": str(r['Thermal_Regime']),
            "battery_soc_pct": float(r['Battery_State_Pct'])
        }
    })

geojson_mission = {
    "type": "FeatureCollection",
    "name": "Lunar_South_Pole_Cabeus_B_Mission_GIS",
    "crs": {
        "type": "name",
        "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}
    },
    "metadata": {
        "mission": "Chandrayaan-2 DFSAR + LRO LOLA Subsurface Ice Exploration",
        "landing_site": "LS_38 (Cabeus B Southeast Plateau)",
        "ice_target": "CAND_052 (Cabeus B Crater Floor PSR)",
        "software": "DIC3D-A* Autonomous Path Planner & Terramechanic Simulator",
        "team": "TEAM SHAURYAM"
    },
    "features": features
}

geojson_file = f"{OUT_DIR}/cabeus_b_mission_gis.geojson"
with open(geojson_file, "w", encoding="utf-8") as f:
    json.dump(geojson_mission, f, indent=2)

# Simplified 3D Traverse Only GeoJSON
geojson_traverse_only = {
    "type": "FeatureCollection",
    "name": "Cabeus_B_Rover_Traverse_3D_Path",
    "features": [features[4]] + features[5:]
}
with open(f"{OUT_DIR}/cabeus_b_rover_traverse_3d.geojson", "w", encoding="utf-8") as f:
    json.dump(geojson_traverse_only, f, indent=2)

# Companion Haworth Benchmark Mission GeoJSON
haworth_coords_3d = [[round(float(r['Longitude']), 5), round(float(r['Latitude']), 5), round(float(r['Elevation_m']), 1)] for _, r in haworth_df.iterrows()]
haworth_geojson = {
    "type": "FeatureCollection",
    "name": "Lunar_South_Pole_Haworth_Benchmark_Mission_GIS",
    "features": [
        {
            "type": "Feature",
            "id": "HAWORTH_TRAVERSE_3D",
            "geometry": {"type": "LineString", "coordinates": haworth_coords_3d},
            "properties": {
                "route_id": "HAWORTH_WEST_RIM_BENCHMARK",
                "total_distance_km": 5.28,
                "total_waypoints": len(haworth_df),
                "elevation_descent_m": -454.5,
                "max_slope_deg": 9.43
            }
        }
    ]
}
with open(f"{OUT_DIR}/haworth_benchmark_mission_gis.geojson", "w", encoding="utf-8") as f:
    json.dump(haworth_geojson, f, indent=2)

# Save formatted GIS CSV waypoint catalog
wp_df_gis = wp_df.copy()
wp_df_gis['Polar_X_m'] = wp_df_gis['Polar_X_km'] * 1000.0
wp_df_gis['Polar_Y_m'] = wp_df_gis['Polar_Y_km'] * 1000.0
wp_df_gis.to_csv(f"{OUT_DIR}/cabeus_b_mission_waypoints_gis.csv", index=False)
print("Saved all 3D GeoJSON and GIS waypoint catalog files.")

# -----------------------------------------------------------------------------
# 4. GENERATE 3D WAVEFRONT MODEL (.OBJ & .MTL)
# -----------------------------------------------------------------------------
print("\n[Step 4] Generating 3D Wavefront Model (.obj & .mtl)...")

# Subsample or direct grid for 3D mesh: 153 x 165 is 25,245 vertices, ideal for 3D viewers!
# Coordinate center: relative to Landing Site LS_38 in polar stereographic meters
origin_x = float(wp_df.iloc[0]['Polar_X_km'] * 1000.0)
origin_y = float(wp_df.iloc[0]['Polar_Y_km'] * 1000.0)
origin_z = float(wp_df.iloc[0]['Elevation_m'])

# Calculate grid coordinates (X along cols, Y along rows reversed)
xs = clip_left + (np.arange(sub_cols) + 0.5) * 80.0 - origin_x
ys = clip_top - (np.arange(sub_rows) + 0.5) * 80.0 - origin_y
X_mesh, Y_mesh = np.meshgrid(xs, ys)
Z_mesh = sub_dem - origin_z  # Z relative to landing touchdown elevation

# Material classification mask for faces
# mat_sunlit_plateau (diffuse warm gray)
# mat_psr_cold_trap (dark basaltic gray)
# mat_ice_core (cyan crystalline luster)
face_mats = np.zeros((sub_rows - 1, sub_cols - 1), dtype=np.uint8)
for r in range(sub_rows - 1):
    for c in range(sub_cols - 1):
        if sub_ice[r, c] >= 0.5:
            face_mats[r, c] = 2 # ice core
        elif sub_psr[r, c] >= 1:
            face_mats[r, c] = 1 # PSR cold trap
        else:
            face_mats[r, c] = 0 # sunlit plateau

# Write MTL material library
mtl_filename = "cabeus_b_terrain_and_traverse_3d_model.mtl"
with open(f"{OUT_DIR}/{mtl_filename}", "w", encoding="utf-8") as f_mtl:
    f_mtl.write("# Material library for Cabeus B Lunar Terrain & Mission Model\n")
    f_mtl.write("# Generated for TEAM SHAURYAM Lunar Ice Detection Mission\n\n")
    
    f_mtl.write("newmtl mat_sunlit_plateau\n")
    f_mtl.write("Ka 0.25 0.25 0.25\nKd 0.72 0.70 0.68\nKs 0.10 0.10 0.10\nNs 10.0\nillum 2\n\n")
    
    f_mtl.write("newmtl mat_psr_cold_trap\n")
    f_mtl.write("Ka 0.05 0.06 0.08\nKd 0.22 0.24 0.28\nKs 0.05 0.05 0.05\nNs 5.0\nillum 2\n\n")
    
    f_mtl.write("newmtl mat_ice_core\n")
    f_mtl.write("Ka 0.10 0.40 0.50\nKd 0.25 0.85 0.95\nKs 0.60 0.90 1.00\nNs 60.0\nillum 2\n\n")
    
    f_mtl.write("newmtl mat_landing_site_pad\n")
    f_mtl.write("Ka 0.10 0.50 0.20\nKd 0.15 0.95 0.40\nKs 0.40 0.80 0.40\nNs 30.0\nillum 2\n\n")
    
    f_mtl.write("newmtl mat_rover_track\n")
    f_mtl.write("Ka 0.60 0.40 0.05\nKd 1.00 0.80 0.15\nKs 0.80 0.70 0.30\nNs 40.0\nillum 2\n\n")
    
    f_mtl.write("newmtl mat_ice_target_beacon\n")
    f_mtl.write("Ka 0.00 0.60 0.80\nKd 0.00 0.95 1.00\nKs 0.90 0.95 1.00\nNs 80.0\nillum 2\n\n")

# Write OBJ file
obj_filename = "cabeus_b_terrain_and_traverse_3d_model.obj"
with open(f"{OUT_DIR}/{obj_filename}", "w", encoding="utf-8") as f_obj:
    f_obj.write("# 3D Lunar Terrain & Autonomous Rover Traverse Model\n")
    f_obj.write("# Landing Site: LS_38 (Cabeus B Southeast Plateau)\n")
    f_obj.write("# Ice Target: CAND_052 (Cabeus B Crater Floor PSR)\n")
    f_obj.write(f"mtllib {mtl_filename}\n\n")
    
    # 1. Vertices for terrain grid
    f_obj.write("# Terrain Mesh Vertices\n")
    for r in range(sub_rows):
        for c in range(sub_cols):
            f_obj.write(f"v {X_mesh[r, c]:.2f} {Y_mesh[r, c]:.2f} {Z_mesh[r, c]:.2f}\n")
    
    # Faces by material group
    mat_names = ["mat_sunlit_plateau", "mat_psr_cold_trap", "mat_ice_core"]
    for mat_id, mat_name in enumerate(mat_names):
        f_obj.write(f"\ng terrain_group_{mat_name}\n")
        f_obj.write(f"usemtl {mat_name}\n")
        for r in range(sub_rows - 1):
            for c in range(sub_cols - 1):
                if face_mats[r, c] == mat_id:
                    # 1-indexed vertex IDs
                    v1 = r * sub_cols + c + 1
                    v2 = r * sub_cols + (c + 1) + 1
                    v3 = (r + 1) * sub_cols + (c + 1) + 1
                    v4 = (r + 1) * sub_cols + c + 1
                    f_obj.write(f"f {v1} {v2} {v3}\n")
                    f_obj.write(f"f {v1} {v3} {v4}\n")
    
    # 2. 3D Rover Traverse Ribbon (30m wide quad ribbon elevated 5m above terrain)
    f_obj.write("\n# 3D Rover Traverse Path Ribbon\n")
    f_obj.write("g rover_traverse_track\n")
    f_obj.write("usemtl mat_rover_track\n")
    
    v_base = sub_rows * sub_cols + 1
    ribbon_half_w = 15.0 # meters
    wp_pts = []
    for _, row in wp_df.iterrows():
        wx = row['Polar_X_km'] * 1000.0 - origin_x
        wy = row['Polar_Y_km'] * 1000.0 - origin_y
        wz = row['Elevation_m'] - origin_z + 5.0 # 5m elevation clearance
        wp_pts.append((wx, wy, wz))
    
    # Generate ribbon left/right vertices along path
    n_wp = len(wp_pts)
    for i in range(n_wp):
        wx, wy, wz = wp_pts[i]
        if i < n_wp - 1:
            dx = wp_pts[i+1][0] - wx
            dy = wp_pts[i+1][1] - wy
        else:
            dx = wx - wp_pts[i-1][0]
            dy = wy - wp_pts[i-1][1]
        norm = math.sqrt(dx**2 + dy**2) or 1.0
        nx = -dy / norm * ribbon_half_w
        ny = dx / norm * ribbon_half_w
        f_obj.write(f"v {wx + nx:.2f} {wy + ny:.2f} {wz:.2f}\n")
        f_obj.write(f"v {wx - nx:.2f} {wy - ny:.2f} {wz:.2f}\n")
    
    for i in range(n_wp - 1):
        v1 = v_base + 2 * i
        v2 = v_base + 2 * i + 1
        v3 = v_base + 2 * (i + 1) + 1
        v4 = v_base + 2 * (i + 1)
        f_obj.write(f"f {v1} {v2} {v3}\n")
        f_obj.write(f"f {v1} {v3} {v4}\n")
        
    # 3. Landing Site Touchdown Pad (Hexagonal cylinder at origin)
    f_obj.write("\n# Landing Site Touchdown Pad at LS_38\n")
    f_obj.write("g landing_site_pad\n")
    f_obj.write("usemtl mat_landing_site_pad\n")
    pad_base = v_base + 2 * n_wp
    pad_r = 60.0 # 60m radius pad
    pad_h = 10.0 # 10m height
    for i in range(8):
        ang = i * (2 * math.pi / 8)
        px = pad_r * math.cos(ang)
        py = pad_r * math.sin(ang)
        f_obj.write(f"v {px:.2f} {py:.2f} {pad_h:.2f}\n")
    for i in range(1, 7):
        f_obj.write(f"f {pad_base} {pad_base + i} {pad_base + i + 1}\n")
        
    # 4. Ice Target Beacon (Cylinder at CAND_052)
    f_obj.write("\n# Water-Ice Target Beacon at CAND_052\n")
    f_obj.write("g ice_target_beacon\n")
    f_obj.write("usemtl mat_ice_target_beacon\n")
    ice_base = pad_base + 8
    ix = wp_pts[-1][0]
    iy = wp_pts[-1][1]
    iz = wp_pts[-1][2]
    ice_r = 75.0
    for i in range(8):
        ang = i * (2 * math.pi / 8)
        px = ix + ice_r * math.cos(ang)
        py = iy + ice_r * math.sin(ang)
        f_obj.write(f"v {px:.2f} {py:.2f} {iz + 15.0:.2f}\n")
    for i in range(1, 7):
        f_obj.write(f"f {ice_base} {ice_base + i} {ice_base + i + 1}\n")

print(f"Generated 3D Model: {obj_filename} and {mtl_filename} successfully.")

# -----------------------------------------------------------------------------
# 5. GENERATE INTERACTIVE 3D WEBGL HTML MODEL (PLOTLY)
# -----------------------------------------------------------------------------
print("\n[Step 5] Generating interactive 3D WebGL HTML model...")

# Downsample mesh slightly for smooth 60fps browser rendering (step=2 -> ~76x82 grid)
step = 2
sub_X_km = (clip_left + (np.arange(0, sub_cols, step) + 0.5) * 80.0) / 1000.0
sub_Y_km = (clip_top - (np.arange(0, sub_rows, step) + 0.5) * 80.0) / 1000.0
X_grid, Y_grid = np.meshgrid(sub_X_km, sub_Y_km)
Z_grid = sub_dem[::step, ::step]

fig_3d = go.Figure()

# 1. 3D Surface
fig_3d.add_trace(go.Surface(
    x=sub_X_km,
    y=sub_Y_km,
    z=Z_grid,
    colorscale='Magma',
    cmin=float(Z_grid.min()),
    cmax=float(Z_grid.max()),
    colorbar=dict(
        title=dict(text="Elevation (m)", font=dict(color="#d4d4d4")),
        tickfont=dict(color="#d4d4d4"),
        len=0.75,
        x=1.02
    ),
    lighting=dict(ambient=0.4, diffuse=0.8, roughness=0.5, specular=0.2),
    name="LOLA Lunar Topography"
))

# 2. Rover Traverse 3D Path
hover_texts = [
    f"<b>{r['Waypoint_ID']}</b><br>"
    f"Distance: {r['Cum_Distance_km']:.2f} km ({r['Cum_Distance_m']:.0f} m)<br>"
    f"Elevation: {r['Elevation_m']:.1f} m<br>"
    f"Slope: {r['Slope_deg']:.2f}°<br>"
    f"Wheel Slip: {r['Wheel_Slip_Pct']:.1f}%<br>"
    f"Battery: {r['Battery_State_Pct']:.1f}%<br>"
    f"Regime: {r['Thermal_Regime']}"
    for _, r in wp_df.iterrows()
]

fig_3d.add_trace(go.Scatter3d(
    x=wp_df['Polar_X_km'],
    y=wp_df['Polar_Y_km'],
    z=wp_df['Elevation_m'] + 15.0, # Slight vertical offset for clarity
    mode='lines+markers',
    line=dict(color='#ffd700', width=7),
    marker=dict(size=4, color='#ff9900', symbol='circle'),
    text=hover_texts,
    hoverinfo='text',
    name='Autonomous Rover Traverse (DIC3D-A*)'
))

# 3. Landing Site Touchdown Marker
fig_3d.add_trace(go.Scatter3d(
    x=[wp_df.iloc[0]['Polar_X_km']],
    y=[wp_df.iloc[0]['Polar_Y_km']],
    z=[wp_df.iloc[0]['Elevation_m'] + 35.0],
    mode='markers+text',
    marker=dict(size=12, color='#00ff66', symbol='diamond', line=dict(color='white', width=2)),
    text=['<b>LS_38 LANDING SITE</b><br>Rank 1 Plateau (-1320m)'],
    textposition='top center',
    textfont=dict(color='#00ff66', size=13),
    hoverinfo='text',
    name='Landing Site LS_38'
))

# 4. Ice Target Core Marker
fig_3d.add_trace(go.Scatter3d(
    x=[wp_df.iloc[-1]['Polar_X_km']],
    y=[wp_df.iloc[-1]['Polar_Y_km']],
    z=[wp_df.iloc[-1]['Elevation_m'] + 35.0],
    mode='markers+text',
    marker=dict(size=14, color='#00e5ff', symbol='circle', line=dict(color='white', width=2)),
    text=['<b>CAND_052 WATER ICE TARGET</b><br>Cabeus B Cold Trap (-1758m)'],
    textposition='top center',
    textfont=dict(color='#00e5ff', size=13),
    hoverinfo='text',
    name='Ice Target CAND_052'
))

fig_3d.update_layout(
    title=dict(
        text="<b>Interactive 3D Mission Model: Cabeus B Landing Site & Autonomous Rover Traverse</b><br>"
             "<span style='font-size:12px;color:#a0a0a0;'>Chandrayaan-2 DFSAR + LRO LOLA Topography | 4.74 km Natural Terraced Descent Corridor</span>",
        font=dict(color="#ffffff", size=17)
    ),
    paper_bgcolor='#0b0e14',
    scene=dict(
        xaxis=dict(title='Polar X (km)', backgroundcolor='#0f141e', gridcolor='#222b3a', color='#d0d0d0'),
        yaxis=dict(title='Polar Y (km)', backgroundcolor='#0f141e', gridcolor='#222b3a', color='#d0d0d0'),
        zaxis=dict(title='Elevation (m)', backgroundcolor='#0f141e', gridcolor='#222b3a', color='#d0d0d0'),
        aspectratio=dict(x=1.2, y=1.2, z=0.55),
        camera=dict(
            eye=dict(x=-1.4, y=-1.3, z=0.9),
            center=dict(x=0, y=0, z=-0.1)
        )
    ),
    margin=dict(l=0, r=0, b=0, t=65),
    legend=dict(
        x=0.02, y=0.95,
        bgcolor='rgba(15, 20, 30, 0.85)',
        bordercolor='#334155',
        borderwidth=1,
        font=dict(color='#ffffff', size=11)
    )
)

html_3d_file = f"{OUT_DIR}/cabeus_b_3d_interactive_model.html"
fig_3d.write_html(html_3d_file, include_plotlyjs='cdn')
print(f"Saved interactive 3D HTML model: {html_3d_file}")

# -----------------------------------------------------------------------------
# 6. GENERATE ANIMATED GIF SIMULATION (MISSION MAP + HUD + PROFILE)
# -----------------------------------------------------------------------------
print("\n[Step 6] Generating high-resolution Rover Traverse Mission Animation GIF...")

# Pre-calculate map extent in Polar km
extent_km = [clip_left / 1000.0, clip_right / 1000.0, clip_bottom / 1000.0, clip_top / 1000.0]

# Animation frames: 47 waypoints + 8 hold frames at destination = 55 frames
n_wp = len(wp_df)
frames_list = []
tmp_frames_dir = "scratch/anim_frames"
os.makedirs(tmp_frames_dir, exist_ok=True)

# Fixed styling tokens
BG_COLOR = "#0b0f19"
PANEL_BG = "#111827"
TEXT_COLOR = "#e5e7eb"
ACCENT_GOLD = "#f59e0b"
ACCENT_CYAN = "#06b6d4"
ACCENT_GREEN = "#10b981"
BORDER_COLOR = "#1f2937"

for idx in range(n_wp):
    cur_row = wp_df.iloc[idx]
    fig = plt.figure(figsize=(14.5, 8.2), facecolor=BG_COLOR)
    
    # Grid layout: Left = Map View (62% width), Right = Telemetry HUD + Elevation Profile (38% width)
    # Using SubplotSpec / Add_axes
    ax_map = fig.add_axes([0.04, 0.08, 0.56, 0.84], facecolor=PANEL_BG)
    ax_hud = fig.add_axes([0.63, 0.48, 0.34, 0.44], facecolor=PANEL_BG)
    ax_prof = fig.add_axes([0.63, 0.08, 0.34, 0.34], facecolor=PANEL_BG)
    
    # ------------------ 1. LEFT PANEL: MAP VIEW ------------------
    # LOLA Hillshade
    ax_map.imshow(sub_hillshade, cmap='gray', extent=extent_km, origin='upper', alpha=0.90)
    
    # Overlay ice likelihood as cyan glow
    ice_masked = np.ma.masked_where(sub_ice < 0.35, sub_ice)
    ax_map.imshow(ice_masked, cmap='cool', extent=extent_km, origin='upper', alpha=0.55, vmin=0.35, vmax=1.0)
    
    # Landing Site LS_38 Target
    ls_x, ls_y = wp_df.iloc[0]['Polar_X_km'], wp_df.iloc[0]['Polar_Y_km']
    ax_map.plot(ls_x, ls_y, marker='o', markersize=12, color=ACCENT_GREEN, markeredgecolor='white', markeredgewidth=1.8, zorder=5)
    circle_touchdown = plt.Circle((ls_x, ls_y), 0.6, color=ACCENT_GREEN, fill=False, linestyle='--', linewidth=1.2, alpha=0.7)
    ax_map.add_patch(circle_touchdown)
    ax_map.text(ls_x - 0.2, ls_y + 0.3, "LS_38 (Touchdown)", color='#34d399', fontsize=9.5, fontweight='bold', zorder=6)
    
    # Ice Target CAND_052 Target
    ice_x, ice_y = wp_df.iloc[-1]['Polar_X_km'], wp_df.iloc[-1]['Polar_Y_km']
    ax_map.plot(ice_x, ice_y, marker='s', markersize=12, color=ACCENT_CYAN, markeredgecolor='white', markeredgewidth=1.8, zorder=5)
    circle_target = plt.Circle((ice_x, ice_y), 0.5, color=ACCENT_CYAN, fill=False, linestyle=':', linewidth=1.5, alpha=0.85)
    ax_map.add_patch(circle_target)
    ax_map.text(ice_x - 0.2, ice_y - 0.4, "CAND_052 (Ice Core)", color='#38bdf8', fontsize=9.5, fontweight='bold', zorder=6)
    
    # Full Planned Route (Dashed translucent gray)
    ax_map.plot(wp_df['Polar_X_km'], wp_df['Polar_Y_km'], color='#94a3b8', linestyle=':', linewidth=1.5, alpha=0.6, zorder=3)
    
    # Traversed Route up to current step (Glowing gold/amber)
    traversed = wp_df.iloc[:idx+1]
    if len(traversed) > 1:
        ax_map.plot(traversed['Polar_X_km'], traversed['Polar_Y_km'], color='#fbbf24', linewidth=3.5, solid_capstyle='round', zorder=4)
        ax_map.plot(traversed['Polar_X_km'], traversed['Polar_Y_km'], color='#fef08a', linewidth=1.5, solid_capstyle='round', zorder=4)
    
    # Current Rover Position Marker
    rx, ry = cur_row['Polar_X_km'], cur_row['Polar_Y_km']
    # Outer pulse ring
    ax_map.plot(rx, ry, marker='o', markersize=16, color='#f59e0b', alpha=0.35, zorder=6)
    # Rover core symbol
    ax_map.plot(rx, ry, marker='o', markersize=9, color='#ffffff', markeredgecolor='#d97706', markeredgewidth=2.2, zorder=7)
    
    # Direction heading arrow
    if idx < n_wp - 1:
        dx = wp_df.iloc[idx+1]['Polar_X_km'] - rx
        dy = wp_df.iloc[idx+1]['Polar_Y_km'] - ry
    else:
        dx = rx - wp_df.iloc[idx-1]['Polar_X_km']
        dy = ry - wp_df.iloc[idx-1]['Polar_Y_km']
    d_norm = math.sqrt(dx**2 + dy**2) or 1.0
    arrow_len = 0.35
    ax_map.arrow(rx, ry, (dx/d_norm)*arrow_len, (dy/d_norm)*arrow_len, color='#fef08a', width=0.03, head_width=0.12, zorder=8)
    
    # Map styling & titles
    ax_map.set_title("LUNAR SOUTH POLE: CABEUS B ROVER DESCENT CORRIDOR", color='#f8fafc', fontsize=11, fontweight='bold', pad=8)
    ax_map.set_xlabel("Polar Stereographic X (km)", color='#94a3b8', fontsize=9)
    ax_map.set_ylabel("Polar Stereographic Y (km)", color='#94a3b8', fontsize=9)
    ax_map.tick_params(colors='#94a3b8', labelsize=8)
    for spine in ax_map.spines.values():
        spine.set_color(BORDER_COLOR)
        
    # Scale Bar (1 km)
    sb_x = extent_km[0] + 0.5
    sb_y = extent_km[2] + 0.5
    ax_map.plot([sb_x, sb_x + 1.0], [sb_y, sb_y], color='white', linewidth=3, zorder=10)
    ax_map.text(sb_x + 0.5, sb_y + 0.15, "1.0 km", color='white', fontsize=8, ha='center', fontweight='bold', zorder=10)
    
    # North Indicator
    ax_map.text(extent_km[1] - 0.7, extent_km[3] - 0.6, "▲ N", color='white', fontsize=10, fontweight='bold', ha='center', zorder=10)

    # ------------------ 2. RIGHT TOP: TELEMETRY HUD ------------------
    ax_hud.set_xticks([])
    ax_hud.set_yticks([])
    for spine in ax_hud.spines.values():
        spine.set_color(BORDER_COLOR)
        
    # Mission Header
    ax_hud.text(0.05, 0.90, "CHANDRAYAAN-2 / LOLA ROVER SIMULATION", color=ACCENT_GOLD, fontsize=10.5, fontweight='bold')
    ax_hud.text(0.05, 0.82, "Autonomous DIC3D-A* Surface Navigation", color='#94a3b8', fontsize=8.5)
    
    # Progress Bar
    pct = (cur_row['Cum_Distance_km'] / 4.74)
    ax_hud.add_patch(plt.Rectangle((0.05, 0.71), 0.90, 0.05, color='#1e293b'))
    ax_hud.add_patch(plt.Rectangle((0.05, 0.71), 0.90 * pct, 0.05, color=ACCENT_GOLD))
    ax_hud.text(0.05, 0.64, f"PROGRESS: {pct*100:.1f}%  |  {cur_row['Cum_Distance_km']:.2f} km / 4.74 km", color='#f1f5f9', fontsize=8.5, fontweight='bold')
    
    # Live Digital Readouts in 2 Columns
    y_pos1 = 0.50
    y_pos2 = 0.33
    y_pos3 = 0.16
    
    # Elevation
    elev_val = cur_row['Elevation_m']
    ax_hud.text(0.05, y_pos1 + 0.06, "ELEVATION", color='#64748b', fontsize=7.5, fontweight='bold')
    ax_hud.text(0.05, y_pos1, f"{elev_val:.1f} m", color='#38bdf8', fontsize=12, fontweight='bold')
    
    # Slope
    slope_val = cur_row['Slope_deg']
    slope_color = ACCENT_GREEN if slope_val < 6.0 else (ACCENT_GOLD if slope_val < 11.0 else "#ef4444")
    ax_hud.text(0.55, y_pos1 + 0.06, "TERRAIN SLOPE (LIMIT 15°)", color='#64748b', fontsize=7.5, fontweight='bold')
    ax_hud.text(0.55, y_pos1, f"{slope_val:.2f}°", color=slope_color, fontsize=12, fontweight='bold')
    
    # Wheel Slip
    slip_val = cur_row['Wheel_Slip_Pct']
    ax_hud.text(0.05, y_pos2 + 0.06, "WHEEL SLIP (BEKKER-WONG)", color='#64748b', fontsize=7.5, fontweight='bold')
    ax_hud.text(0.05, y_pos2, f"{slip_val:.1f}%", color=slope_color, fontsize=12, fontweight='bold')
    
    # Battery State
    batt_val = cur_row['Battery_State_Pct']
    ax_hud.text(0.55, y_pos2 + 0.06, "BATTERY STATE-OF-CHARGE", color='#64748b', fontsize=7.5, fontweight='bold')
    ax_hud.text(0.55, y_pos2, f"{batt_val:.1f}%", color=ACCENT_GREEN, fontsize=12, fontweight='bold')
    
    # Thermal Regime Badge
    regime = cur_row['Thermal_Regime']
    regime_color = ACCENT_GREEN if "Sunlit" in regime else "#38bdf8"
    regime_bg = "#064e3b" if "Sunlit" in regime else "#0c4a6e"
    ax_hud.add_patch(plt.Rectangle((0.05, y_pos3 - 0.02), 0.42, 0.10, color=regime_bg, ec=regime_color, lw=1))
    ax_hud.text(0.26, y_pos3 + 0.02, regime.upper(), color=regime_color, fontsize=8, fontweight='bold', ha='center', va='center')
    
    # Current Waypoint & Mission Phase
    phase_text = "Touchdown / System Checkout" if idx < 10 else \
                 ("Crater Rim Approach" if idx < 20 else \
                 ("Terraced Ramp Descent" if idx < 38 else \
                 ("PSR Cryogenic Ingress" if idx < 45 else "Water Ice Core Sampling")))
    ax_hud.text(0.55, y_pos3 + 0.06, f"WAYPOINT {cur_row['Waypoint_ID']}", color='#f8fafc', fontsize=8.5, fontweight='bold')
    ax_hud.text(0.55, y_pos3, phase_text, color='#94a3b8', fontsize=8)

    # ------------------ 3. RIGHT BOTTOM: ELEVATION PROFILE ------------------
    ax_prof.set_facecolor(PANEL_BG)
    for spine in ax_prof.spines.values():
        spine.set_color(BORDER_COLOR)
        
    dists = wp_df['Cum_Distance_km']
    elevs = wp_df['Elevation_m']
    
    # Shaded backgrounds for Sunlit Ridge vs PSR Cold Trap
    psr_start_km = wp_df[wp_df['Thermal_Regime'] == 'PSR Cold Trap']['Cum_Distance_km'].min()
    ax_prof.axvspan(0, 4.5, color='#14532d', alpha=0.15, label='Sunlit Ridge')
    ax_prof.axvspan(4.5, 4.8, color='#0369a1', alpha=0.25, label='PSR Cold Trap')
    
    # Profile curve
    ax_prof.plot(dists, elevs, color='#94a3b8', linewidth=1.8, label='Descent Profile')
    # Traversed line
    ax_prof.plot(dists[:idx+1], elevs[:idx+1], color=ACCENT_GOLD, linewidth=3.0)
    
    # Current point tracker
    cur_d = cur_row['Cum_Distance_km']
    cur_e = cur_row['Elevation_m']
    ax_prof.plot(cur_d, cur_e, marker='o', markersize=8, color='#ffffff', markeredgecolor=ACCENT_GOLD, markeredgewidth=2.2, zorder=6)
    ax_prof.axvline(cur_d, color='#f59e0b', linestyle='--', linewidth=1.2, alpha=0.7)
    
    ax_prof.set_title("SYNCHRONIZED ELEVATION DESCENT PROFILE", color='#f8fafc', fontsize=9.5, fontweight='bold', pad=6)
    ax_prof.set_xlabel("Traverse Distance (km)", color='#94a3b8', fontsize=8)
    ax_prof.set_ylabel("Elevation (m)", color='#94a3b8', fontsize=8)
    ax_prof.set_xlim(-0.1, 4.9)
    ax_prof.set_ylim(-1820, -1280)
    ax_prof.tick_params(colors='#94a3b8', labelsize=7.5)
    ax_prof.grid(True, color='#1f2937', linestyle=':', linewidth=0.8)
    
    # Save frame
    frame_path = f"{tmp_frames_dir}/frame_{idx:03d}.png"
    plt.savefig(frame_path, dpi=110, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close(fig)
    frames_list.append(frame_path)

# Add 8 hold frames at destination for clear observation of arrival
for h in range(8):
    frames_list.append(frames_list[-1])

print(f"Rendered {len(frames_list)} animation frames. Assembling GIF with Pillow...")
pil_images = [Image.open(f) for f in frames_list]

gif_output_path = f"{OUT_DIR}/rover_traverse_cabeus_b_mission_animation.gif"
pil_images[0].save(
    gif_output_path,
    save_all=True,
    append_images=pil_images[1:],
    duration=120, # 120ms per frame = ~8.3 fps
    loop=0,
    optimize=True
)
print(f"Generated High-Fidelity Mission Animation GIF: {gif_output_path} ({os.path.getsize(gif_output_path)/(1024*1024):.2f} MB)")

# -----------------------------------------------------------------------------
# 7. GENERATE COMPANION 3D PERSPECTIVE ANIMATION GIF
# -----------------------------------------------------------------------------
print("\n[Step 7] Generating companion 3D Perspective Terrain Descent Animation...")
tmp_3d_frames_dir = "scratch/anim_3d_frames"
os.makedirs(tmp_3d_frames_dir, exist_ok=True)
frames_3d_list = []

# Subsample surface for fast, crisp 3D matplotlib rendering
sub_step = 3
p_x = (clip_left + (np.arange(0, sub_cols, sub_step) + 0.5) * 80.0) / 1000.0
p_y = (clip_top - (np.arange(0, sub_rows, sub_step) + 0.5) * 80.0) / 1000.0
P_X, P_Y = np.meshgrid(p_x, p_y)
P_Z = sub_dem[::sub_step, ::sub_step]

for idx in range(0, n_wp, 2):  # Sample every 2 waypoints for dynamic 3D camera
    fig = plt.figure(figsize=(10, 7), facecolor='#0b0f19')
    ax = fig.add_subplot(111, projection='3d', facecolor='#0b0f19')
    
    # 3D surface with gray/terrain colormap
    surf = ax.plot_surface(P_X, P_Y, P_Z, cmap='gist_earth', linewidth=0, antialiased=True, alpha=0.80, vmin=-3500, vmax=-1300)
    
    # Planned path
    ax.plot(wp_df['Polar_X_km'], wp_df['Polar_Y_km'], wp_df['Elevation_m'] + 20, color='#94a3b8', linestyle=':', linewidth=1.5)
    
    # Traversed path
    trav = wp_df.iloc[:idx+1]
    if len(trav) > 1:
        ax.plot(trav['Polar_X_km'], trav['Polar_Y_km'], trav['Elevation_m'] + 25, color='#fbbf24', linewidth=3.5)
    
    # Landing site
    ax.scatter([ls_x], [ls_y], [wp_df.iloc[0]['Elevation_m'] + 40], color='#10b981', s=80, marker='^', label='LS_38 Touchdown')
    # Ice target
    ax.scatter([ice_x], [ice_y], [wp_df.iloc[-1]['Elevation_m'] + 40], color='#06b6d4', s=90, marker='s', label='CAND_052 Ice Core')
    
    # Current Rover
    crx, cry, crz = wp_df.iloc[idx]['Polar_X_km'], wp_df.iloc[idx]['Polar_Y_km'], wp_df.iloc[idx]['Elevation_m']
    ax.scatter([crx], [cry], [crz + 50], color='#ffffff', edgecolors='#f59e0b', s=120, marker='o', linewidths=2.5)
    
    # Dynamic camera orbit as rover advances
    elev_cam = 42 - (idx / n_wp) * 8
    azim_cam = -120 + (idx / n_wp) * 25
    ax.view_init(elev=elev_cam, azim=azim_cam)
    
    ax.set_title(f"3D DESCENT PERSPECTIVE: WP_{idx:03d} (Dist: {wp_df.iloc[idx]['Cum_Distance_km']:.2f} km | Elev: {crz:.0f} m)",
                 color='#f8fafc', fontsize=10, fontweight='bold', pad=12)
    ax.set_xlabel("X (km)", color='#94a3b8', fontsize=8)
    ax.set_ylabel("Y (km)", color='#94a3b8', fontsize=8)
    ax.set_zlabel("Elevation (m)", color='#94a3b8', fontsize=8)
    ax.tick_params(colors='#94a3b8', labelsize=7)
    
    frame_3d_path = f"{tmp_3d_frames_dir}/frame_3d_{idx:03d}.png"
    plt.savefig(frame_3d_path, dpi=90, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close(fig)
    frames_3d_list.append(frame_3d_path)

# Hold at destination
for h in range(5):
    frames_3d_list.append(frames_3d_list[-1])

pil_3d_images = [Image.open(f) for f in frames_3d_list]
gif_3d_path = f"{OUT_DIR}/rover_traverse_3d_perspective_animation.gif"
pil_3d_images[0].save(
    gif_3d_path,
    save_all=True,
    append_images=pil_3d_images[1:],
    duration=160,
    loop=0,
    optimize=True
)
print(f"Generated 3D Perspective Animation GIF: {gif_3d_path} ({os.path.getsize(gif_3d_path)/(1024*1024):.2f} MB)")

# -----------------------------------------------------------------------------
# 8. MIRROR TO output_from_masterplan/3d_animation/
# -----------------------------------------------------------------------------
print("\n[Step 8] Mirroring generated products to output_from_masterplan/3d_animation/...")
for item in os.listdir(OUT_DIR):
    s = os.path.join(OUT_DIR, item)
    d = os.path.join(MIRROR_DIR, item)
    if os.path.isfile(s):
        shutil.copy2(s, d)

# Cleanup temporary frame files
shutil.rmtree(tmp_frames_dir, ignore_errors=True)
shutil.rmtree(tmp_3d_frames_dir, ignore_errors=True)

t_end = time.time()
print(f"\n=== COMPLETED SUCCESSFULLY IN {t_end - t0:.1f} SECONDS ===")
print(f"Primary output directory: {OUT_DIR}")
print(f"Mirror directory: {MIRROR_DIR}")
for f in sorted(os.listdir(OUT_DIR)):
    sz = os.path.getsize(os.path.join(OUT_DIR, f))
    print(f" - {f} ({sz:,} bytes)")
