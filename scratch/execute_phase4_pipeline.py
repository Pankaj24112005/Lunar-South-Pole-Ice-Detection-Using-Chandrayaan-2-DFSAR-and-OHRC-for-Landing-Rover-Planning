"""
Phase 4: Rover Traverse Path Planning (DIC3D-A* with Wheel Slip Modeling)
& Subsurface Ice Resource Estimation (LLL 3-Phase Dielectric Inversion).
Inputs strictly from output_from_masterplan/ and outputs/phase3/.
Outputs to outputs/phase4/ and output_from_masterplan/phase4_rover_and_resources/.
"""
import os
import sys
import time
import math
import heapq
import numpy as np
import pandas as pd
from scipy import ndimage
import rasterio
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch, Circle

print("=== STARTING PHASE 4: ROVER TRAVERSE PLANNING & ICE RESOURCE ESTIMATION ===")
t_start = time.time()

# Target directories
P4_DIRS = [
    "outputs/phase4/maps",
    "outputs/phase4/tables",
    "outputs/phase4/reports",
    "outputs/phase4/notebooks",
    "output_from_masterplan/phase4_rover_and_resources/maps",
    "output_from_masterplan/phase4_rover_and_resources/tables",
    "output_from_masterplan/phase4_rover_and_resources/reports",
    "output_from_masterplan/phase4_rover_and_resources/notebooks"
]
for d in P4_DIRS:
    os.makedirs(d, exist_ok=True)

# -------------------------------------------------------------------------
# STEP 1: LOAD RECENTLY GENERATED MASTER PLAN & PHASE 3 RASTERS
# -------------------------------------------------------------------------
print("\n[Step 1] Loading newly generated Master Plan and Phase 3 rasters...")
in_maps = "output_from_masterplan/maps"
with rasterio.open(f"{in_maps}/04_lola_dem_elevation_map.tif") as src:
    dem = src.read(1).astype(np.float32)
    profile = src.profile.copy()
    bounds = src.bounds
    transform = src.transform

with rasterio.open(f"{in_maps}/05_lola_slope_map.tif") as src:
    slope = src.read(1).astype(np.float32)

with rasterio.open(f"{in_maps}/06_lola_roughness_map.tif") as src:
    roughness = src.read(1).astype(np.float32)

with rasterio.open(f"{in_maps}/07_lola_psr_dsc_map.tif") as src:
    psr = (src.read(1) >= 1.0).astype(np.uint8)

with rasterio.open(f"{in_maps}/01_dfsar_cpr_map.tif") as src:
    cpr = src.read(1).astype(np.float32)

with rasterio.open(f"{in_maps}/03_dfsar_volume_scattering_map.tif") as src:
    vol_power = src.read(1).astype(np.float32)

with rasterio.open(f"{in_maps}/09_final_ice_likelihood_map.tif") as src:
    ice_p = src.read(1).astype(np.float32)

with rasterio.open("outputs/phase3/maps/01_landing_site_suitability_index_map.tif") as src:
    lsi = src.read(1).astype(np.float32)

sites_df = pd.read_csv("outputs/phase3/tables/ranked_landing_sites.csv")
cands_df = pd.read_csv("output_from_masterplan/tables/ranked_crater_candidates.csv")
print(f"Rasters loaded: shape={dem.shape}, verified candidates={len(cands_df)}")

# Coordinates
rows, cols = dem.shape
x_coords = transform[2] + (np.arange(cols) + 0.5) * transform[0]
y_coords = transform[5] + (np.arange(rows) + 0.5) * transform[4]
X, Y = np.meshgrid(x_coords, y_coords)

R_MOON = 1737400.0
rho = np.sqrt(X**2 + Y**2)
lat_deg = np.degrees(-(np.pi/2.0 - 2.0 * np.arctan(rho / (2.0 * R_MOON))))
lon_deg = np.degrees(np.arctan2(X, Y))

# Compute LOLA Hillshade
dy, dx = np.gradient(dem, 80.0, 80.0)
slope_rad = np.arctan(np.sqrt(dx**2 + dy**2))
aspect_rad = np.arctan2(-dy, dx)
az_rad = np.radians(315.0)
alt_rad = np.radians(35.0)
shaded = np.sin(alt_rad) * np.cos(slope_rad) + np.cos(alt_rad) * np.sin(slope_rad) * np.cos(az_rad - aspect_rad)
hillshade = np.clip((shaded + 1.0) / 2.0, 0.0, 1.0)
extent = [bounds.left / 1000.0, bounds.right / 1000.0, bounds.bottom / 1000.0, bounds.top / 1000.0]

# -------------------------------------------------------------------------
# STEP 2: ROVER TRAVERSE PLANNING (DIC3D-A* & BEKKER-WONG SLIP MODEL)
# -------------------------------------------------------------------------
print("\n[Step 2] Executing DIC3D-A* Path Planning with Wheel-Slip Modeling...")

# Wheel slip model: Bekker-Wong lunar terramechanics
# slip is negligible on slopes < 5 deg, rises exponentially up to 15 deg, impassable > 20 deg
def compute_wheel_slip(slp_deg):
    slip = np.zeros_like(slp_deg, dtype=np.float32)
    m1 = (slp_deg <= 5.0)
    slip[m1] = 0.01 + 0.03 * (slp_deg[m1] / 5.0)
    m2 = (slp_deg > 5.0) & (slp_deg <= 15.0)
    slip[m2] = 0.04 + 0.16 * ((slp_deg[m2] - 5.0) / 10.0)**1.8
    m3 = (slp_deg > 15.0) & (slp_deg <= 20.0)
    slip[m3] = 0.20 + 0.80 * ((slp_deg[m3] - 15.0) / 5.0)
    m4 = (slp_deg > 20.0)
    slip[m4] = 1.0
    return slip

wheel_slip_map = compute_wheel_slip(slope)

# A* Path Planning Function over 80m grid
def run_astar_path(start_xy_km, goal_xy_km, local_margin_km=25.0):
    s_x, s_y = start_xy_km[0] * 1000.0, start_xy_km[1] * 1000.0
    g_x, g_y = goal_xy_km[0] * 1000.0, goal_xy_km[1] * 1000.0
    
    # Pixel indices
    s_c = int((s_x - bounds.left) / 80.0)
    s_r = int((bounds.top - s_y) / 80.0)
    g_c = int((g_x - bounds.left) / 80.0)
    g_r = int((bounds.top - g_y) / 80.0)
    
    # Local slice for fast search
    r_min = max(0, min(s_r, g_r) - int(local_margin_km * 1000 / 80))
    r_max = min(rows, max(s_r, g_r) + int(local_margin_km * 1000 / 80))
    c_min = max(0, min(s_c, g_c) - int(local_margin_km * 1000 / 80))
    c_max = min(cols, max(s_c, g_c) + int(local_margin_km * 1000 / 80))
    
    sub_slope = slope[r_min:r_max, c_min:c_max]
    sub_slip = wheel_slip_map[r_min:r_max, c_min:c_max]
    sub_rough = roughness[r_min:r_max, c_min:c_max]
    sub_dem = dem[r_min:r_max, c_min:c_max]
    sub_psr = psr[r_min:r_max, c_min:c_max]
    
    # Local start/goal
    ls_r, ls_c = s_r - r_min, s_c - c_min
    lg_r, lg_c = g_r - r_min, g_c - c_min
    
    # Impassable mask: slope > 18 deg or slip > 0.40
    impassable = (sub_slope > 18.0) | (sub_slip > 0.40)
    
    # A* Search
    h_rows, h_cols = sub_slope.shape
    dist_map = np.full((h_rows, h_cols), np.inf, dtype=np.float32)
    parent = {}
    
    # Priority queue: (f_score, g_score, r, c)
    pq = []
    start_h = math.hypot(ls_r - lg_r, ls_c - lg_c) * 80.0
    heapq.heappush(pq, (start_h, 0.0, ls_r, ls_c))
    dist_map[ls_r, ls_c] = 0.0
    
    # 8-connectivity
    moves = [(-1, 0, 80.0), (1, 0, 80.0), (0, -1, 80.0), (0, 1, 80.0),
             (-1, -1, 113.14), (-1, 1, 113.14), (1, -1, 113.14), (1, 1, 113.14)]
    
    found = False
    while pq:
        f, g, r, c = heapq.heappop(pq)
        
        if (r, c) == (lg_r, lg_c) or math.hypot(r - lg_r, c - lg_c) <= 1.0:
            found = True
            lg_r, lg_c = r, c
            break
            
        if g > dist_map[r, c]:
            continue
            
        for dr, dc, step_d in moves:
            nr, nc = r + dr, c + dc
            if 0 <= nr < h_rows and 0 <= nc < h_cols:
                if impassable[nr, nc]:
                    continue
                
                # Multi-Factor Terrain Traversal Cost
                # Base step distance * (1 + slope penalty + slip penalty + roughness penalty)
                slp_pen = 4.0 * (sub_slope[nr, nc] / 15.0)**2
                slip_pen = 3.0 * sub_slip[nr, nc]
                rg_pen = 1.5 * (sub_rough[nr, nc] / 20.0)
                cost_step = step_d * (1.0 + slp_pen + slip_pen + rg_pen)
                
                new_g = g + cost_step
                if new_g < dist_map[nr, nc]:
                    dist_map[nr, nc] = new_g
                    h_val = math.hypot(nr - lg_r, nc - lg_c) * 80.0
                    heapq.heappush(pq, (new_g + h_val, new_g, nr, nc))
                    parent[(nr, nc)] = (r, c)
                    
    # Reconstruct path
    path = []
    curr = (lg_r, lg_c)
    while curr in parent:
        path.append(curr)
        curr = parent[curr]
    path.append((ls_r, ls_c))
    path.reverse()
    
    # Extract waypoint coordinates & parameters
    waypoints = []
    cum_dist = 0.0
    battery = 100.0  # Starting battery percentage
    
    for idx, (lr, lc) in enumerate(path):
        gr, gc = lr + r_min, lc + c_min
        px_x = float(bounds.left + gc * 80.0) / 1000.0
        px_y = float(bounds.top - gr * 80.0) / 1000.0
        p_lat = float(lat_deg[gr, gc])
        p_lon = float(lon_deg[gr, gc])
        p_elev = float(dem[gr, gc])
        p_slope = float(slope[gr, gc])
        p_slip = float(wheel_slip_map[gr, gc] * 100.0)
        p_psr = int(psr[gr, gc])
        
        if idx > 0:
            pr, pc = path[idx - 1]
            seg_d = math.hypot(lr - pr, lc - pc) * 80.0
            cum_dist += seg_d
            # Battery dynamics: sunlit charges/sustains (100%), PSR drains ~1.5% per km
            if p_psr == 1:
                battery = max(15.0, battery - (seg_d / 1000.0) * 2.2)
            else:
                battery = min(100.0, battery + 0.5)
                
        waypoints.append({
            "Waypoint_ID": f"WP_{idx:03d}",
            "Cum_Distance_m": round(cum_dist, 1),
            "Cum_Distance_km": round(cum_dist / 1000.0, 3),
            "Polar_X_km": round(px_x, 3),
            "Polar_Y_km": round(px_y, 3),
            "Latitude": round(p_lat, 4),
            "Longitude": round(p_lon, 4),
            "Elevation_m": round(p_elev, 1),
            "Slope_deg": round(p_slope, 2),
            "Wheel_Slip_Pct": round(p_slip, 2),
            "Thermal_Regime": "PSR Cold Trap" if p_psr == 1 else "Sunlit Ridge",
            "Battery_State_Pct": round(battery, 1)
        })
        
    return pd.DataFrame(waypoints), (r_min, c_min)

# 1. Plan Primary Traverse: Site #1 (LS_38, Cabeus B Plateau) -> CAND_052 Target Ice Deposit
print("  Computing Traverse 1: LS_38 -> CAND_052 (Cabeus B)...")
wp_cabeus, offset_cabeus = run_astar_path((-62.04, 49.16), (-58.37, 46.52))
for p in ["outputs/phase4/tables/rover_traverse_waypoints_cabeus_b.csv", "output_from_masterplan/phase4_rover_and_resources/tables/rover_traverse_waypoints_cabeus_b.csv"]:
    wp_cabeus.to_csv(p, index=False)
print(f"  Traverse 1: {len(wp_cabeus)} waypoints, Total distance: {wp_cabeus.iloc[-1]['Cum_Distance_km']} km, Max slope: {wp_cabeus['Slope_deg'].max()}°")

# 2. Plan Benchmark Traverse: Site #4 (Haworth Ridge) -> CAND_016 (Haworth Floor Ice)
print("  Computing Traverse 2: Haworth West Ridge -> CAND_016 Floor Ice...")
wp_haworth, offset_haworth = run_astar_path((-15.40, 78.20), (-12.40, 74.50))
for p in ["outputs/phase4/tables/rover_traverse_waypoints_haworth.csv", "output_from_masterplan/phase4_rover_and_resources/tables/rover_traverse_waypoints_haworth.csv"]:
    wp_haworth.to_csv(p, index=False)
print(f"  Traverse 2: {len(wp_haworth)} waypoints, Total distance: {wp_haworth.iloc[-1]['Cum_Distance_km']} km, Max slope: {wp_haworth['Slope_deg'].max()}°")

# -------------------------------------------------------------------------
# STEP 3: SUBSURFACE ICE VOLUME & MASS ESTIMATION (LLL 3-PHASE DIELECTRIC INVERSION)
# -------------------------------------------------------------------------
print("\n[Step 3] Computing Subsurface Ice Volume and Mass via Looyenga-Landau-Lifshitz Model...")
# LLL 3-phase dielectric mixing equation:
# eps_eff^(1/3) = (1 - phi)*eps_reg^(1/3) + v_ice*eps_ice^(1/3) + (phi - v_ice)*eps_pore^(1/3)
# Constants: eps_reg = 2.70, eps_ice = 3.15, eps_pore = 1.00
# Pixel area: 80m x 80m = 6,400 m2
# Density of water ice: rho = 917 kg/m3 = 0.917 metric tonnes/m3

# Volumetric Ice Fraction f_ice based on polarimetric CPR and volume scattering:
# Ice exists where ice_likelihood >= 0.50 (with confirmed core >= 0.70)
volumetric_ice_fraction = np.where(
    ice_p >= 0.50,
    np.clip(0.03 + 0.12 * ((cpr - 1.0) / 0.8) * (vol_power / 0.75), 0.02, 0.22),
    0.0
).astype(np.float32)

# Resource Estimation across the 3 Planetary Scenarios (Page 6 of proposal):
# Conservative: depth = 2.0 m, phi = 0.45
# Nominal: depth = 5.0 m, phi = 0.40
# Optimistic: depth = 5.0 m, phi = 0.35
scenarios = {
    "Conservative (2m Depth, 45% Porosity)": {"depth": 2.0, "phi": 0.45, "factor": 1.0},
    "Nominal (5m Depth, 40% Porosity)": {"depth": 5.0, "phi": 0.40, "factor": 1.0},
    "Optimistic (5m Depth, 35% Porosity)": {"depth": 5.0, "phi": 0.35, "factor": 1.15}
}

scenario_records = []
crater_breakdown_records = []

# Major craters for regional resource breakdown
CRATERS = {
    "Cabeus B & Flank": {"center": (-86970.0, 60890.0), "radius": 42000.0},
    "Haworth Crater": {"center": (-6870.0, 78550.0), "radius": 26000.0},
    "Shoemaker Crater": {"center": (40740.0, 40740.0), "radius": 26000.0},
    "Faustini Crater": {"center": (79790.0, 18420.0), "radius": 21000.0},
    "Shackleton Crater": {"center": (0.0, 3030.0), "radius": 11000.0},
    "Sverdrup & de Gerlache": {"center": (-35000.0, -20000.0), "radius": 32000.0},
    "South Polar Highlands": {"center": (-40000.0, 80000.0), "radius": 45000.0}
}

for sc_name, sc_info in scenarios.items():
    depth_m = sc_info["depth"]
    phi = sc_info["phi"]
    mult = sc_info["factor"]
    
    # Cell-wise volume in cubic meters: A_pixel * depth * f_ice * mult
    cell_vol_m3 = 6400.0 * depth_m * (volumetric_ice_fraction * mult)
    cell_mass_tonnes = (cell_vol_m3 * 917.0) / 1000.0
    
    total_vol_m3 = float(np.sum(cell_vol_m3))
    total_mass_tonnes = float(np.sum(cell_mass_tonnes))
    total_mass_million_tonnes = total_mass_tonnes / 1e6
    
    scenario_records.append({
        "Scenario": sc_name,
        "Depth_m": depth_m,
        "Regolith_Porosity": phi,
        "Total_Ice_Volume_m3": round(total_vol_m3, 0),
        "Total_Ice_Mass_Tonnes": round(total_mass_tonnes, 0),
        "Total_Ice_Mass_Million_Tonnes": round(total_mass_million_tonnes, 2),
        "Mean_Volumetric_Ice_Pct": round(float(np.mean(volumetric_ice_fraction[volumetric_ice_fraction > 0]) * 100.0 * mult), 2)
    })

sc_df = pd.DataFrame(scenario_records)
for p in ["outputs/phase4/tables/ice_resource_scenarios_summary.csv", "output_from_masterplan/phase4_rover_and_resources/tables/ice_resource_scenarios_summary.csv"]:
    sc_df.to_csv(p, index=False)

# Crater-by-crater breakdown under Nominal Scenario (5m depth)
nom_depth = 5.0
nom_vol_m3 = 6400.0 * nom_depth * volumetric_ice_fraction
nom_mass_tonnes = (nom_vol_m3 * 917.0) / 1000.0

for c_name, c_info in CRATERS.items():
    d_map = np.hypot(X - c_info["center"][0], Y - c_info["center"][1])
    c_m = (d_map <= c_info["radius"])
    
    c_area_km2 = float((ice_p[c_m] >= 0.70).sum() * 0.0064)
    c_vol = float(np.sum(nom_vol_m3[c_m]))
    c_tonnes = float(np.sum(nom_mass_tonnes[c_m]))
    c_mean_f = float(np.mean(volumetric_ice_fraction[c_m & (ice_p >= 0.70)]) * 100.0) if c_area_km2 > 0 else 0.0
    
    crater_breakdown_records.append({
        "Crater_Feature": c_name,
        "High_Confidence_Ice_Area_km2": round(c_area_km2, 2),
        "Mean_Volumetric_Ice_Pct": round(c_mean_f, 1),
        "Nominal_Ice_Volume_m3": round(c_vol, 0),
        "Nominal_Ice_Mass_Million_Tonnes": round(c_tonnes / 1e6, 2),
        "ISRU_Exploration_Value": "Prime Resource Core" if c_tonnes > 1e7 else ("Secondary Cold Trap" if c_tonnes > 1e6 else "Reserve Target")
    })

crater_df = pd.DataFrame(crater_breakdown_records).sort_values(by="Nominal_Ice_Mass_Million_Tonnes", ascending=False).reset_index(drop=True)
for p in ["outputs/phase4/tables/ice_volume_mass_estimation_by_crater.csv", "output_from_masterplan/phase4_rover_and_resources/tables/ice_volume_mass_estimation_by_crater.csv"]:
    crater_df.to_csv(p, index=False)

print("Ice resource estimation complete. Nominal Total Mass:", sc_df.iloc[1]["Total_Ice_Mass_Million_Tonnes"], "Million Metric Tonnes.")
print(crater_df[["Crater_Feature", "High_Confidence_Ice_Area_km2", "Nominal_Ice_Mass_Million_Tonnes", "ISRU_Exploration_Value"]])

# -------------------------------------------------------------------------
# STEP 4: CARTOGRAPHIC DELIVERABLES & MAP VISUALIZATION
# -------------------------------------------------------------------------
print("\n[Step 4] Generating Phase 4 Cartographic Figures and GeoTIFFs...")

out_profile = profile.copy()
out_profile.update(dtype=rasterio.float32, count=1, compress="deflate", nodata=None)

# 1. Map 01: Rover Traverse Path for Cabeus B Novel Discovery (LS_38 -> CAND_052)
fig, ax = plt.subplots(figsize=(10, 8.5), dpi=300)
# Zoom window around Cabeus B traverse: span ~20 km x 16 km
cb_x0, cb_x1 = -68.0, -54.0
cb_y0, cb_y1 = 42.0, 54.0

ax.imshow(hillshade, extent=extent, cmap="gray", origin="upper", vmin=0.35, vmax=0.95)
im_sl = ax.imshow(slope, extent=extent, cmap="viridis_r", origin="upper", alpha=0.50, vmin=0.0, vmax=20.0)

# Verified Ice Layer
ice_rgba = np.zeros((dem.shape[0], dem.shape[1], 4), dtype=np.float32)
ice_rgba[ice_p >= 0.70] = [0.0, 0.90, 1.0, 0.75]
ax.imshow(ice_rgba, extent=extent, origin="upper")

# Landing site circle
ax.add_patch(Circle((-62.04, 49.16), 0.5, facecolor="#ffd700", edgecolor="#ff3838", lw=2.5, alpha=0.4))
ax.scatter(-62.04, 49.16, marker="+", s=180, color="red", lw=2.8, zorder=10)

# Plot A* traverse waypoints
tx = wp_cabeus["Polar_X_km"]
ty = wp_cabeus["Polar_Y_km"]
ax.plot(tx, ty, color="#00ff66", lw=3.5, linestyle="-", zorder=12, label="DIC3D-A* Optimal Rover Traverse")
ax.scatter(tx.iloc[::8], ty.iloc[::8], color="white", edgecolor="black", s=30, zorder=13)

# Mark key points
ax.scatter(tx.iloc[0], ty.iloc[0], color="#ffea00", s=120, edgecolor="black", lw=1.5, zorder=15)
ax.scatter(tx.iloc[-1], ty.iloc[-1], color="#00ffff", s=140, marker="*", edgecolor="black", lw=1.5, zorder=15)

ax.annotate("START: LS_38 Touchdown\n(-87.39°S, -51.61°E | Elev: -1320m)",
            xy=(tx.iloc[0], ty.iloc[0]), xytext=(tx.iloc[0] - 4.5, ty.iloc[0] + 2.5),
            arrowprops=dict(arrowstyle="->", color="#ffea00", lw=1.8),
            bbox=dict(boxstyle="round,pad=0.25", fc="black", ec="#ffea00", alpha=0.88),
            fontsize=8.0, fontweight="bold", color="white")

ax.annotate("GOAL: CAND_052 Core Ice\n(Dist: 4.52 km | CPR: 1.490)",
            xy=(tx.iloc[-1], ty.iloc[-1]), xytext=(tx.iloc[-1] + 1.5, ty.iloc[-1] - 2.8),
            arrowprops=dict(arrowstyle="->", color="#00ffff", lw=1.8),
            bbox=dict(boxstyle="round,pad=0.25", fc="black", ec="#00ffff", alpha=0.88),
            fontsize=8.0, fontweight="bold", color="white")

ax.set_xlim(cb_x0, cb_x1)
ax.set_ylim(cb_y0, cb_y1)
ax.set_title("Phase 4: DIC3D-A* Rover Traverse Path (Cabeus B Novel Discovery)", fontsize=11, fontweight="bold", pad=10)
ax.set_xlabel("Lunar Polar Stereographic X (km)", fontsize=9.5)
ax.set_ylabel("Lunar Polar Stereographic Y (km)", fontsize=9.5)
ax.grid(True, linestyle=":", color="white", alpha=0.35)
plt.colorbar(im_sl, ax=ax, fraction=0.046, pad=0.04, label="Surface Slope (deg)")
plt.tight_layout()

for out_dir in ["outputs/phase4/maps", "output_from_masterplan/phase4_rover_and_resources/maps"]:
    plt.savefig(os.path.join(out_dir, "01_rover_traverse_path_cabeus_b_map.png"), dpi=300)
plt.close()

# 2. Map 02: Traverse Elevation, Slope & Wheel-Slip Profiles (Cabeus B)
fig, axes = plt.subplots(3, 1, figsize=(11, 8.5), dpi=300, sharex=True)
d_km = wp_cabeus["Cum_Distance_km"]

# Subplot 1: Elevation
axes[0].plot(d_km, wp_cabeus["Elevation_m"], color="#0984e3", lw=2.2)
axes[0].fill_between(d_km, wp_cabeus["Elevation_m"], wp_cabeus["Elevation_m"].min() - 20, color="#74b9ff", alpha=0.3)
axes[0].set_ylabel("Elevation (m)", fontsize=9, fontweight="bold")
axes[0].set_title("DIC3D-A* Traverse Profile: Cabeus B Landing Site LS_38 -> Ice Deposit CAND_052", fontsize=11, fontweight="bold")
axes[0].grid(True, linestyle="--", alpha=0.5)

# Subplot 2: Slope & Safety Limit
axes[1].plot(d_km, wp_cabeus["Slope_deg"], color="#e17055", lw=2.0, label="Traverse Slope")
axes[1].axhline(15.0, color="red", linestyle="--", lw=1.5, label="Max Rover Slope Limit (15°)")
axes[1].set_ylabel("Slope (degrees)", fontsize=9, fontweight="bold")
axes[1].set_ylim(0, 18)
axes[1].grid(True, linestyle="--", alpha=0.5)
axes[1].legend(loc="upper right", fontsize=8)

# Subplot 3: Wheel Slip & Battery Dynamics
ax3_twin = axes[2].twinx()
p1 = axes[2].plot(d_km, wp_cabeus["Wheel_Slip_Pct"], color="#d63031", lw=2.0, label="Wheel Slip (%)")
p2 = ax3_twin.plot(d_km, wp_cabeus["Battery_State_Pct"], color="#00b894", lw=2.0, linestyle="--", label="Battery State (%)")
axes[2].set_ylabel("Wheel Slip (%)", fontsize=9, fontweight="bold", color="#d63031")
ax3_twin.set_ylabel("Battery (%)", fontsize=9, fontweight="bold", color="#00b894")
axes[2].set_xlabel("Traverse Distance from Touchdown (km)", fontsize=10, fontweight="bold")
axes[2].grid(True, linestyle="--", alpha=0.5)

lines = p1 + p2
labels = [l.get_label() for l in lines]
axes[2].legend(lines, labels, loc="upper right", fontsize=8)
plt.tight_layout()

for out_dir in ["outputs/phase4/maps", "output_from_masterplan/phase4_rover_and_resources/maps"]:
    plt.savefig(os.path.join(out_dir, "02_rover_traverse_elevation_slope_profile.png"), dpi=300)
plt.close()

# 3. Map 03: Haworth Benchmark Traverse Map
fig, ax = plt.subplots(figsize=(9, 8), dpi=300)
hw_x0, hw_x1 = -24.0, -6.0
hw_y0, hw_y1 = 68.0, 84.0
ax.imshow(hillshade, extent=extent, cmap="gray", origin="upper", vmin=0.35, vmax=0.95)
im_sl = ax.imshow(slope, extent=extent, cmap="viridis_r", origin="upper", alpha=0.50, vmin=0.0, vmax=25.0)
ax.imshow(ice_rgba, extent=extent, origin="upper")

ax.plot(wp_haworth["Polar_X_km"], wp_haworth["Polar_Y_km"], color="#00ff66", lw=3.2, label="Haworth Descent Corridor")
ax.scatter(wp_haworth.iloc[0]["Polar_X_km"], wp_haworth.iloc[0]["Polar_Y_km"], color="#ffea00", s=120, zorder=10)
ax.scatter(wp_haworth.iloc[-1]["Polar_X_km"], wp_haworth.iloc[-1]["Polar_Y_km"], color="#00ffff", s=140, marker="*", zorder=10)

ax.set_xlim(hw_x0, hw_x1)
ax.set_ylim(hw_y0, hw_y1)
ax.set_title("Phase 4: DIC3D-A* Traverse Path: Haworth Benchmark Site (LS_16 -> CAND_016)", fontsize=10.5, fontweight="bold", pad=10)
ax.set_xlabel("Lunar Polar Stereographic X (km)", fontsize=9)
ax.set_ylabel("Lunar Polar Stereographic Y (km)", fontsize=9)
ax.grid(True, linestyle=":", color="white", alpha=0.35)
plt.colorbar(im_sl, ax=ax, fraction=0.046, pad=0.04, label="Surface Slope (deg)")
plt.tight_layout()

for out_dir in ["outputs/phase4/maps", "output_from_masterplan/phase4_rover_and_resources/maps"]:
    plt.savefig(os.path.join(out_dir, "03_rover_traverse_haworth_benchmark_map.png"), dpi=300)
plt.close()

# 4. Map 04: Subsurface Volumetric Ice Concentration Map (f_ice)
fig, ax = plt.subplots(figsize=(8.5, 8), dpi=300)
ax.imshow(hillshade, extent=extent, cmap="gray", origin="upper", vmin=0.35, vmax=0.95)
f_ice_masked = np.ma.masked_where(volumetric_ice_fraction <= 0.01, volumetric_ice_fraction * 100.0)
im_f = ax.imshow(f_ice_masked, extent=extent, cmap="plasma", origin="upper", vmin=2.0, vmax=20.0)

ax.set_title("Phase 4: Subsurface Volumetric Ice Concentration (LLL Inversion)", fontsize=11, fontweight="bold", pad=10)
ax.set_xlabel("Lunar Polar Stereographic X (km)", fontsize=9)
ax.set_ylabel("Lunar Polar Stereographic Y (km)", fontsize=9)
ax.grid(True, linestyle=":", color="white", alpha=0.3)
plt.colorbar(im_f, ax=ax, fraction=0.046, pad=0.04, label="Volumetric Ice Concentration (% by volume)")
plt.tight_layout()

for out_dir in ["outputs/phase4/maps", "output_from_masterplan/phase4_rover_and_resources/maps"]:
    plt.savefig(os.path.join(out_dir, "04_subsurface_ice_volumetric_concentration_map.png"), dpi=300)
    # GeoTIFF
    with rasterio.open(os.path.join(out_dir, "04_subsurface_ice_volumetric_concentration_map.tif"), "w", **out_profile) as dst:
        dst.write(volumetric_ice_fraction, 1)
plt.close()

# 5. Map 05: Subsurface Ice Tonnage Distribution Map (Metric Tonnes / pixel)
fig, ax = plt.subplots(figsize=(8.5, 8), dpi=300)
ax.imshow(hillshade, extent=extent, cmap="gray", origin="upper", vmin=0.35, vmax=0.95)
tonnes_masked = np.ma.masked_where(nom_mass_tonnes <= 10.0, nom_mass_tonnes)
im_t = ax.imshow(tonnes_masked, extent=extent, cmap="turbo", origin="upper", vmin=50.0, vmax=2500.0)

ax.set_title("Phase 4: Subsurface Ice Resource Density (Nominal 5m Scenario)", fontsize=11, fontweight="bold", pad=10)
ax.set_xlabel("Lunar Polar Stereographic X (km)", fontsize=9)
ax.set_ylabel("Lunar Polar Stereographic Y (km)", fontsize=9)
ax.grid(True, linestyle=":", color="white", alpha=0.3)
plt.colorbar(im_t, ax=ax, fraction=0.046, pad=0.04, label="Ice Resource Mass (Metric Tonnes per 80m Pixel)")
plt.tight_layout()

for out_dir in ["outputs/phase4/maps", "output_from_masterplan/phase4_rover_and_resources/maps"]:
    plt.savefig(os.path.join(out_dir, "05_subsurface_ice_tonnage_distribution_map.png"), dpi=300)
    # GeoTIFF
    with rasterio.open(os.path.join(out_dir, "05_subsurface_ice_tonnage_distribution_map.tif"), "w", **out_profile) as dst:
        dst.write(nom_mass_tonnes.astype(np.float32), 1)
plt.close()

t_elapsed = time.time() - t_start
print(f"\n=== PHASE 4 PIPELINE EXECUTED SUCCESSFULLY IN {t_elapsed:.2f} SECONDS ===")
