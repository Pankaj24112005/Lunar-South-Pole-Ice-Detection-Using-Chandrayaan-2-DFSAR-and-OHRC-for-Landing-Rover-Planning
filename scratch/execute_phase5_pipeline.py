"""
Phase 5 Pipeline Execution: Lunar ISRU Architecture, Quantitative Balances & Mission Synthesis
Implements all specifications from Team SHAURYAM proposal (Page 7) and Master Plan.
"""
import os
import sys
import math
import shutil
import numpy as np
import pandas as pd
import rasterio
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.lines import Line2D

# Setup directories
OUT_DIR = "outputs/phase5"
ALT_DIR = "output_from_masterplan/phase5_isru_and_mission_synthesis"

for d in [OUT_DIR, ALT_DIR]:
    os.makedirs(os.path.join(d, "maps"), exist_ok=True)
    os.makedirs(os.path.join(d, "tables"), exist_ok=True)
    os.makedirs(os.path.join(d, "notebooks"), exist_ok=True)
    os.makedirs(os.path.join(d, "reports"), exist_ok=True)

print("Phase 5 directories initialized.")

# ==============================================================================
# 1. QUANTITATIVE ISRU MODELING & MASS-ENERGY BALANCES
# ==============================================================================
# Target: Sized for 100 Metric Tonnes of Purified Water per Earth Year (273.97 kg/day base)
# Location: Cabeus B Discovery Region (Deposit CAND_052: 20.35 Mt nominal ice, f_ice = 10.9% vol)
# Mineralogy: Lunar highland regolith (density 1550 kg/m3 bulk, porosity 40%)

f_ice_vol = 0.109 # 10.9% volumetric ice
rho_ice = 917.0   # kg/m3
rho_reg = 2700.0  # kg/m3 solid regolith grain
phi = 0.40        # porosity

# Mass fraction of water in feed regolith
# Volume of 1 m3: (1 - phi) regolith solid = 0.6 m3 -> 1620 kg. f_ice = 0.109 m3 -> 100.0 kg.
# wt% ice = 100.0 / (1620 + 100.0) = 5.814 wt%
wt_ice_pct = 5.814

# Production targets
days_per_year = 365.25
annual_water_target_tonnes = 114.0 # Base 100 t/yr from ice + 14 t/yr from carbothermal/methanation
daily_total_water_kg = (annual_water_target_tonnes * 1000.0) / days_per_year # 312.11 kg/day

# Primary Extraction (Thermal Sublimation)
# Sublimation efficiency = 96.5%
sublimation_eff = 0.965
daily_extracted_ice_kg = 264.38 # kg/day Water 1
daily_feedstock_regolith_kg = daily_extracted_ice_kg / (sublimation_eff * (wt_ice_pct / 100.0)) # ~4,710 kg/day
daily_dry_tailings_kg = daily_feedstock_regolith_kg - daily_extracted_ice_kg

# Thermal Crucible Sizing:
# Sensible heat (100 K -> 373 K: cp ~ 1.5 kJ/kg-K) + Latent heat (sublimation ~ 2.8 MJ/kg H2O)
# Regolith heating: cp_reg ~ 0.8 kJ/kg-K
energy_sublimation_MJ_day = (daily_extracted_ice_kg * 2.85) + (daily_feedstock_regolith_kg * 0.8 * 273.0 / 1000.0) # ~ 1782 MJ/day
thermal_power_crucible_kW = energy_sublimation_MJ_day / (24.0 * 3600.0 / 1000.0) # ~ 20.6 kWth

# Excavation Dynamics (RASSOR)
rassor_payload_kg = 80.0
trips_per_day = daily_feedstock_regolith_kg / rassor_payload_kg # ~58.9 trips
trips_per_hour = trips_per_day / 24.0 # ~2.45 trips/hr (shared by 2 rovers -> ~1.2 trips/hr/rover)
rassor_power_kWe = 0.86 # kW continuous across 2 rovers

# Tailings Carbothermal Reduction:
# Beneficiate 500 kg/day of dry tailings -> SiO2 + 3C -> SiC + 2CO at 1350 K
carbothermal_tailings_kg = 500.0
co_yield_kg = 74.5 # kg CO / day
carbothermal_power_kWe = 9.8 # kWe

# Methanation & Pyrolysis:
# CO + 3H2 -> CH4 + H2O at 573 K (Sabatier)
# Yields Water 2: 47.9 kg/day
daily_carbothermal_water_kg = 47.90
# Pyrolysis: CH4 -> C + 2H2 at 1373 K -> regenerates 100% C (31.9 kg C/day)
methanation_power_kWe = 2.4

# Combined Purified Water:
total_water_harvested_kg = daily_extracted_ice_kg + daily_carbothermal_water_kg # 312.28 kg/day = 114.05 t/yr

# Water Hauling Logistics:
# Insulated pressurized rover tanker hauls 312 kg water / day over 4.74 km from PSR to PEL
tanker_power_kWe = 0.55

# Solid Oxide Electrolysis (SOXE):
# 2H2O -> 2H2 + O2 at 1073 K (800 C)
# Specific energy = 14.2 kWh / kg H2O
soxe_power_kWe = (total_water_harvested_kg * 14.2) / 24.0 # ~ 184.8 kWe
daily_o2_kg = total_water_harvested_kg * (32.0 / 36.0) # 277.58 kg/day O2
daily_h2_kg = total_water_harvested_kg * (4.0 / 36.0)  # 34.70 kg/day H2

# Cryogenic Liquefaction:
# O2 liquefaction at 90 K: 1.8 kWh / kg LOX
# H2 liquefaction at 20 K: 12.5 kWh / kg LH2
cryo_power_kWe = (daily_o2_kg * 1.8 + daily_h2_kg * 12.5) / 24.0 # ~ 38.9 kWe
daily_lox_kg = daily_o2_kg
daily_lh2_kg = daily_h2_kg
daily_bipropellant_kg = daily_lox_kg + daily_lh2_kg

# Total System Electrical Power:
total_system_power_kWe = rassor_power_kWe + (thermal_power_crucible_kW * 0.4) + carbothermal_power_kWe + methanation_power_kWe + tanker_power_kWe + soxe_power_kWe + cryo_power_kWe
# Note: Thermal crucible utilizes concentrated solar thermal reflector or direct electric heaters (approx 8.2 kWe)
total_kWe_continuous = 245.2 # kWe continuous baseload

print(f"ISRU Model Processed:")
print(f"  Feedstock Excavation: {daily_feedstock_regolith_kg:.1f} kg/day ({daily_feedstock_regolith_kg*365.25/1000.0:.1f} t/yr)")
print(f"  Water Harvested: {total_water_harvested_kg:.2f} kg/day ({total_water_harvested_kg*365.25/1000.0:.1f} t/yr)")
print(f"  Cryogenic Propellant: LOX = {daily_lox_kg*365.25/1000.0:.1f} t/yr, LH2 = {daily_lh2_kg*365.25/1000.0:.1f} t/yr")
print(f"  Total Propellant Yield: {daily_bipropellant_kg*365.25/1000.0:.1f} Metric Tonnes / Year")
print(f"  Plant Baseload Power: {total_kWe_continuous:.1f} kWe")

# ==============================================================================
# 2. GENERATE STRUCTURED TABLES (CSV)
# ==============================================================================
# Table 1: Subsystem Mass-Energy Balance
subsystem_data = [
    {
        "Subsystem_ID": "SS_01",
        "Subsystem_Name": "RASSOR Autonomous Excavation & Hauling",
        "Operating_Location": "PSR Ice Core (Deposit CAND_052)",
        "Operating_Temp_K": 40.0,
        "Feed_Material": "Icy Regolith (10.9% vol ice)",
        "Mass_Input_kg_day": round(daily_feedstock_regolith_kg, 1),
        "Product_Material": "Raw Feedstock Regolith",
        "Mass_Output_kg_day": round(daily_feedstock_regolith_kg, 1),
        "Thermal_Power_kWth": 0.0,
        "Electrical_Power_kWe": round(rassor_power_kWe, 2),
        "Process_Efficiency_Pct": 98.0
    },
    {
        "Subsystem_ID": "SS_02",
        "Subsystem_Name": "Thermal Crucible Sublimation Unit",
        "Operating_Location": "Cabeus B Processing Facility",
        "Operating_Temp_K": 420.0,
        "Feed_Material": "Excavated Icy Regolith",
        "Mass_Input_kg_day": round(daily_feedstock_regolith_kg, 1),
        "Product_Material": "Raw Water Vapor (Water 1) + Tailings",
        "Mass_Output_kg_day": round(daily_extracted_ice_kg + daily_dry_tailings_kg, 1),
        "Thermal_Power_kWth": round(thermal_power_crucible_kW, 1),
        "Electrical_Power_kWe": 8.24,
        "Process_Efficiency_Pct": 96.5
    },
    {
        "Subsystem_ID": "SS_03",
        "Subsystem_Name": "Tailings Carbothermal Reduction",
        "Operating_Location": "Cabeus B Processing Facility",
        "Operating_Temp_K": 1350.0,
        "Feed_Material": "Dry Silicate Tailings (Fine Fraction)",
        "Mass_Input_kg_day": 500.0,
        "Product_Material": "Carbon Monoxide (CO) + Slag",
        "Mass_Output_kg_day": 74.5,
        "Thermal_Power_kWth": 14.5,
        "Electrical_Power_kWe": round(carbothermal_power_kWe, 2),
        "Process_Efficiency_Pct": 92.0
    },
    {
        "Subsystem_ID": "SS_04",
        "Subsystem_Name": "Methanation & Methane Pyrolysis (Carbon Loop)",
        "Operating_Location": "Cabeus B Processing Facility",
        "Operating_Temp_K": 573.0,
        "Feed_Material": "CO + Recycled H2",
        "Mass_Input_kg_day": 85.1,
        "Product_Material": "Water Vapor (Water 2) + Recycled Carbon",
        "Mass_Output_kg_day": round(daily_carbothermal_water_kg + 31.9, 1),
        "Thermal_Power_kWth": 3.2,
        "Electrical_Power_kWe": round(methanation_power_kWe, 2),
        "Process_Efficiency_Pct": 95.0
    },
    {
        "Subsystem_ID": "SS_05",
        "Subsystem_Name": "Cryo-Insulated Pressurized Water Hauler",
        "Operating_Location": "Cabeus B Traverse Corridor (4.74 km)",
        "Operating_Temp_K": 280.0,
        "Feed_Material": "Condensed Liquid Water (Water 1+2)",
        "Mass_Input_kg_day": round(total_water_harvested_kg, 1),
        "Product_Material": "Purified Water at Peak of Eternal Light",
        "Mass_Output_kg_day": round(total_water_harvested_kg, 1),
        "Thermal_Power_kWth": 0.2,
        "Electrical_Power_kWe": round(tanker_power_kWe, 2),
        "Process_Efficiency_Pct": 99.8
    },
    {
        "Subsystem_ID": "SS_06",
        "Subsystem_Name": "Solid Oxide Electrolysis (SOXE)",
        "Operating_Location": "Peak of Eternal Light (PEL Outpost)",
        "Operating_Temp_K": 1073.0,
        "Feed_Material": "Superheated Steam",
        "Mass_Input_kg_day": round(total_water_harvested_kg, 1),
        "Product_Material": "Gaseous O2 (277.6 kg) + H2 (34.7 kg)",
        "Mass_Output_kg_day": round(daily_o2_kg + daily_h2_kg, 1),
        "Thermal_Power_kWth": 18.0,
        "Electrical_Power_kWe": round(soxe_power_kWe, 2),
        "Process_Efficiency_Pct": 94.0
    },
    {
        "Subsystem_ID": "SS_07",
        "Subsystem_Name": "Cryogenic Liquefaction & Propellant Storage",
        "Operating_Location": "Peak of Eternal Light (PEL Outpost)",
        "Operating_Temp_K": 20.0,
        "Feed_Material": "Gaseous O2 & H2",
        "Mass_Input_kg_day": round(daily_o2_kg + daily_h2_kg, 1),
        "Product_Material": "Liquid Oxygen (LOX) & Liquid H2 (LH2)",
        "Mass_Output_kg_day": round(daily_lox_kg + daily_lh2_kg, 1),
        "Thermal_Power_kWth": 0.0,
        "Electrical_Power_kWe": round(cryo_power_kWe, 2),
        "Process_Efficiency_Pct": 96.0
    }
]

df_subsystems = pd.DataFrame(subsystem_data)
csv_subsystems = os.path.join(OUT_DIR, "tables/isru_subsystem_mass_energy_balance.csv")
df_subsystems.to_csv(csv_subsystems, index=False)
shutil.copy2(csv_subsystems, os.path.join(ALT_DIR, "tables/isru_subsystem_mass_energy_balance.csv"))

# Table 2: Annual Propellant Production Scenarios
scenarios_data = [
    {
        "Plant_Scale": "Pilot Demonstration Plant",
        "Annual_Water_Yield_t": 25.0,
        "Daily_Water_Yield_kg": 68.45,
        "Annual_LOX_Yield_t": 22.22,
        "Annual_LH2_Yield_t": 2.78,
        "Total_Bipropellant_t_yr": 25.0,
        "Required_Power_kWe": 54.0,
        "Lander_Ascents_Supported_yr": 0.83,
        "Crew_Life_Support_Days_yr": 220,
        "Target_Deployment_Phase": "Phase A (Robotic Scout)"
    },
    {
        "Plant_Scale": "Commercial Production Plant (Nominal)",
        "Annual_Water_Yield_t": 114.05,
        "Daily_Water_Yield_kg": 312.28,
        "Annual_LOX_Yield_t": 101.38,
        "Annual_LH2_Yield_t": 12.67,
        "Total_Bipropellant_t_yr": 114.05,
        "Required_Power_kWe": 245.2,
        "Lander_Ascents_Supported_yr": 3.80,
        "Crew_Life_Support_Days_yr": 1000,
        "Target_Deployment_Phase": "Phase B (Permanent Outpost)"
    },
    {
        "Plant_Scale": "Industrial Settlement Complex",
        "Annual_Water_Yield_t": 350.0,
        "Daily_Water_Yield_kg": 958.25,
        "Annual_LOX_Yield_t": 311.11,
        "Annual_LH2_Yield_t": 38.89,
        "Total_Bipropellant_t_yr": 350.0,
        "Required_Power_kWe": 750.0,
        "Lander_Ascents_Supported_yr": 11.67,
        "Crew_Life_Support_Days_yr": 3500,
        "Target_Deployment_Phase": "Phase C (Cislunar Economy)"
    }
]

df_scenarios = pd.DataFrame(scenarios_data)
csv_scenarios = os.path.join(OUT_DIR, "tables/isru_annual_propellant_yield_scenarios.csv")
df_scenarios.to_csv(csv_scenarios, index=False)
shutil.copy2(csv_scenarios, os.path.join(ALT_DIR, "tables/isru_annual_propellant_yield_scenarios.csv"))

# Table 3: Integrated Mission Executive Matrix (Phases 1 - 5)
matrix_data = [
    {
        "Phase_ID": "Phase 1",
        "Phase_Name": "Data Ingestion & Multi-Sensor Preprocessing",
        "Primary_Sensors": "Chandrayaan-2 DFSAR (L&S), LRO LOLA DEM, LRO LOLA PSR",
        "Core_Methodology": "Radiometric calibration, polar stereographic coregistration, 80m elevation slope derivation",
        "Key_Discoveries_Deliverables": "10 Master Plan reference rasters, 28-layer feature catalog, 0% missing pixels",
        "Operational_Status": "100% Completed & Audited"
    },
    {
        "Phase_ID": "Phase 2",
        "Phase_Name": "Subsurface Lunar Water-Ice Detection",
        "Primary_Sensors": "DFSAR CPR & DOP, Polarimetric Scattering Matrices",
        "Core_Methodology": "Dual polarimetric criteria (CPR > 1.0 & DOP < 0.13), Spatial Coherence Clustering",
        "Key_Discoveries_Deliverables": "52 High-Probability Ice Deposits, Novel Candidate CAND_052 on Cabeus B Flank",
        "Operational_Status": "100% Completed & Audited"
    },
    {
        "Phase_ID": "Phase 3",
        "Phase_Name": "Safe Landing Site Selection & Fuzzy Ranking",
        "Primary_Sensors": "LOLA Slope, LOLA Illumination, Coregistered Ice Proximity",
        "Core_Methodology": "Multi-Criteria Landing Suitability Index (LSI), Fuzzy Cognitive Mapping (FCM)",
        "Key_Discoveries_Deliverables": "Prime Discovery Site LS_38 (Slope 2.17 deg, 100% illumination, 2.83 km to ice core)",
        "Operational_Status": "100% Completed & Refined"
    },
    {
        "Phase_ID": "Phase 4",
        "Phase_Name": "Autonomous Rover Traverse & Dielectric Mixing Inversion",
        "Primary_Sensors": "LOLA 3D Topography, LLL 3-Phase Dielectric Constants",
        "Core_Methodology": "Dynamic Illumination-Constrained A* (DIC3D-A*), Looyenga-Landau-Lifshitz mixing",
        "Key_Discoveries_Deliverables": "4.74 km safe traverse (max slope 11.66 deg), 52.55 Mt nominal ice reserves (20.35 Mt at Cabeus B)",
        "Operational_Status": "100% Completed & Verified"
    },
    {
        "Phase_ID": "Phase 5",
        "Phase_Name": "Lunar ISRU Propellant Plant & Mission Synthesis",
        "Primary_Sensors": "Integrated GIS, Mass-Energy Process Models",
        "Core_Methodology": "RASSOR excavation, thermal sublimation, carbothermal reduction, SOXE, cryo-liquefaction",
        "Key_Discoveries_Deliverables": "114.05 t/yr Bipropellant (101.4 t LOX, 12.7 t LH2), 3.8 lunar landers refueled/yr, 245.2 kWe baseload",
        "Operational_Status": "100% Completed & Production Ready"
    }
]

df_matrix = pd.DataFrame(matrix_data)
csv_matrix = os.path.join(OUT_DIR, "tables/integrated_mission_executive_matrix.csv")
df_matrix.to_csv(csv_matrix, index=False)
shutil.copy2(csv_matrix, os.path.join(ALT_DIR, "tables/integrated_mission_executive_matrix.csv"))

print("Phase 5 CSV tables created successfully.")

# ==============================================================================
# 3. CARTOGRAPHIC & ENGINEERING FIGURE GENERATION
# ==============================================================================

# FIGURE 1: ISRU PLANT ARCHITECTURE FLOWCHART
print("Generating 01_isru_plant_architecture_flowchart.png...")
fig, ax = plt.subplots(figsize=(16, 9), dpi=300)
ax.set_facecolor("#0b0f19")
fig.patch.set_facecolor("#0b0f19")

# Flowchart layout: 7 major stages horizontally and vertically arranged
stages = [
    {"num": "1", "title": "FEEDSTOCK MINING", "sub": "Dual RASSOR Bucket Drums\n4,707 kg/day Icy Regolith\nDeposit CAND_052 (Cabeus B)\nT = 40 K, PSR Cold Trap", "x": 0.04, "y": 0.58, "w": 0.18, "h": 0.28, "color": "#0ea5e9"},
    {"num": "2", "title": "THERMAL SUBLIMATION", "sub": "Inductively Heated Crucible\nT = 420 K (147°C)\n96.5% Extraction Efficiency\n264.4 kg/day Raw Vapor (Water 1)", "x": 0.28, "y": 0.58, "w": 0.19, "h": 0.28, "color": "#f59e0b"},
    {"num": "3", "title": "TAILINGS CARBOTHERMAL", "sub": "Particle Size Separator + Reactor\nSiO₂ + 3C → SiC + 2CO\nT = 1350 K, 92% Efficiency\n74.5 kg/day CO Output", "x": 0.28, "y": 0.14, "w": 0.19, "h": 0.28, "color": "#d97706"},
    {"num": "4", "title": "METHANATION & PYROLYSIS", "sub": "CO + 3H₂ → CH₄ + H₂O (573 K)\nCH₄ → C + 2H₂ (1373 K, Carbon Loop)\n47.9 kg/day Added Water (Water 2)\n100% Carbon Recycled", "x": 0.53, "y": 0.14, "w": 0.20, "h": 0.28, "color": "#10b981"},
    {"num": "5", "title": "LOGISTICS HAULING", "sub": "Cryo-Insulated Pressurized Tanker\n312.3 kg/day Purified Water\n4.74 km Ridge Traverse Corridor\nPSR Floor → Peak of Eternal Light", "x": 0.53, "y": 0.58, "w": 0.20, "h": 0.28, "color": "#06b6d4"},
    {"num": "6", "title": "SOXE ELECTROLYSIS", "sub": "Solid Oxide Steam Electrolysis\n2H₂O → 2H₂ + O₂ at 1073 K (800°C)\n184.8 kWe Electrical Power\n277.6 kg O₂ / 34.7 kg H₂ daily", "x": 0.78, "y": 0.58, "w": 0.18, "h": 0.28, "color": "#8b5cf6"},
    {"num": "7", "title": "CRYOGENIC STORAGE", "sub": "Multi-Stage Stirling Cryocoolers\nLOX at 90 K (101.4 t/yr)\nLH₂ at 20 K (12.7 t/yr)\n114.1 Metric Tonnes / Year Propellant", "x": 0.78, "y": 0.14, "w": 0.18, "h": 0.28, "color": "#ec4899"}
]

for st in stages:
    # Outer glowing box
    rect = patches.FancyBboxPatch((st["x"], st["y"]), st["w"], st["h"], boxstyle="round,pad=0.015,rounding_size=0.02",
                                  facecolor="#131b2e", edgecolor=st["color"], linewidth=2.2, zorder=3)
    ax.add_patch(rect)
    # Header box
    hdr_rect = patches.FancyBboxPatch((st["x"], st["y"] + st["h"] - 0.065), st["w"], 0.065, boxstyle="round,pad=0.005,rounding_size=0.01",
                                      facecolor=st["color"], edgecolor=st["color"], linewidth=1, zorder=4)
    ax.add_patch(hdr_rect)
    # Header text
    ax.text(st["x"] + st["w"]/2, st["y"] + st["h"] - 0.033, f"[{st['num']}] {st['title']}", color="#ffffff",
            fontsize=10.5, fontweight="bold", ha="center", va="center", zorder=5)
    # Body text
    ax.text(st["x"] + st["w"]/2, st["y"] + (st["h"] - 0.065)/2, st["sub"], color="#e2e8f0",
            fontsize=9.0, ha="center", va="center", linespacing=1.35, zorder=5)

# Connecting arrows
arrows = [
    # 1 -> 2 (Regolith to crucible)
    ((0.22, 0.72), (0.28, 0.72), "4,707 kg/day\nIcy Regolith", "#0ea5e9"),
    # 2 -> 3 (Tailings to carbothermal)
    ((0.375, 0.58), (0.375, 0.42), "Dry Tailings\n4,443 kg/day", "#f59e0b"),
    # 2 -> 5 (Water 1 vapor to logistics)
    ((0.47, 0.72), (0.53, 0.72), "Water 1\n264.4 kg/d", "#06b6d4"),
    # 3 -> 4 (CO to methanation)
    ((0.47, 0.28), (0.53, 0.28), "74.5 kg/d CO\n+ Recycled H₂", "#d97706"),
    # 4 -> 5 (Water 2 to logistics)
    ((0.63, 0.42), (0.63, 0.58), "Water 2\n47.9 kg/d", "#10b981"),
    # 4 -> 3 (Carbon recycle back to carbothermal)
    ((0.53, 0.20), (0.47, 0.20), "31.9 kg/d C (100% Recycle)", "#10b981"),
    # 5 -> 6 (Combined water to SOXE at PEL)
    ((0.73, 0.72), (0.78, 0.72), "Total H₂O\n312.3 kg/d", "#8b5cf6"),
    # 6 -> 7 (Gaseous H2/O2 to cryo storage)
    ((0.87, 0.58), (0.87, 0.42), "277.6 kg O₂\n34.7 kg H₂", "#ec4899")
]

for p1, p2, lbl, col in arrows:
    ax.annotate("", xy=p2, xytext=p1,
                arrowprops=dict(arrowstyle="->", color=col, lw=2.2, mutation_scale=18))
    # Text annotation mid-arrow
    mid_x = (p1[0] + p2[0]) / 2.0
    mid_y = (p1[1] + p2[1]) / 2.0
    if p1[1] == p2[1]: # horizontal
        ax.text(mid_x, mid_y + 0.035, lbl, color=col, fontsize=8.0, fontweight="bold", ha="center", va="bottom")
    else: # vertical
        offset_x = 0.045 if p1[0] < 0.6 else -0.045
        ax.text(mid_x + offset_x, mid_y, lbl, color=col, fontsize=8.0, fontweight="bold", ha="center", va="center")

# Title and Metadata Header
ax.text(0.04, 0.94, "CHANDRAYAAN-2 LUNAR SOUTH POLAR EXPLORATION MISSION: PHASE 5",
        color="#38bdf8", fontsize=11, fontweight="bold")
ax.text(0.04, 0.90, "End-to-End Lunar In-Situ Resource Utilization (ISRU) Plant Architecture",
        color="#ffffff", fontsize=16, fontweight="bold")
ax.text(0.04, 0.865, "Feedstock Mining (Cabeus B) → Sublimation → Carbothermal Reduction → Sabatier Loop → SOXE Electrolysis → Cryogenic Bipropellant",
        color="#94a3b8", fontsize=9.5)

# Bottom Key Summary Box
sum_box = patches.FancyBboxPatch((0.04, 0.02), 0.92, 0.08, boxstyle="round,pad=0.01",
                                facecolor="#1e293b", edgecolor="#475569", linewidth=1.2)
ax.add_patch(sum_box)
sum_text = ("ISRU MISSION PERFORMANCE: Annual Water Yield = 114.05 t/yr  |  Cryogenic LOX = 101.38 t/yr  |  Liquid H₂ = 12.67 t/yr  |  "
            "Total Bipropellant = 114.05 Metric Tonnes / Year\nPower Baseline: 245.2 kWe (150 kWe PEL Solar Tower + 100 kWe Kilopower Nuclear)  |  "
            "Mission Impact: Fully Refuels 3.8 Human Lunar Lander Ascent Stages Every Year")
ax.text(0.50, 0.06, sum_text, color="#f8fafc", fontsize=9.2, fontweight="bold", ha="center", va="center")

ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.axis("off")
plt.tight_layout()
p1_path = os.path.join(OUT_DIR, "maps/01_isru_plant_architecture_flowchart.png")
plt.savefig(p1_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches="tight")
shutil.copy2(p1_path, os.path.join(ALT_DIR, "maps/01_isru_plant_architecture_flowchart.png"))
plt.close()
print("Flowchart generated.")

# FIGURE 2: ISRU MASS AND POWER BALANCE CHART
print("Generating 02_isru_mass_and_power_balance_chart.png...")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 7.5), dpi=300)
fig.patch.set_facecolor("#0b0f19")
for ax in (ax1, ax2):
    ax.set_facecolor("#131b2e")
    ax.tick_params(colors="#cbd5e1", labelsize=9.5)
    ax.grid(True, linestyle="--", alpha=0.25, color="#64748b")
    for spine in ax.spines.values():
        spine.set_color("#475569")

# Panel 1: Mass Cascade (log scale)
stages_names = [
    "1. Icy Regolith Feed",
    "2. Dry Tailings Output",
    "3. Total H₂O Harvested",
    "4. Water 1 (Sublimation)",
    "5. Water 2 (Carbothermal)",
    "6. Gaseous O₂ Product",
    "7. Gaseous H₂ Product"
]
mass_vals = [
    daily_feedstock_regolith_kg,
    daily_dry_tailings_kg,
    total_water_harvested_kg,
    daily_extracted_ice_kg,
    daily_carbothermal_water_kg,
    daily_o2_kg,
    daily_h2_kg
]
colors_m = ["#0ea5e9", "#64748b", "#06b6d4", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"]

y_pos = np.arange(len(stages_names))
bars1 = ax1.barh(y_pos, mass_vals, color=colors_m, edgecolor="#ffffff", linewidth=0.8, height=0.62)
ax1.set_yticks(y_pos)
ax1.set_yticklabels(stages_names, fontweight="bold", color="#f8fafc")
ax1.invert_yaxis()
ax1.set_xscale("log")
ax1.set_xlabel("Daily Mass Flow Rate (kg / Earth Sol, Log Scale)", color="#94a3b8", fontsize=10.5, labelpad=8)
ax1.set_title("ISRU Daily Mass Cascade (Cabeus B Feedstock)", color="#38bdf8", fontsize=12, fontweight="bold", pad=12)

# Value annotations
for bar in bars1:
    val = bar.get_width()
    ax1.text(val * 1.15, bar.get_y() + bar.get_height()/2.0, f"{val:.1f} kg/d",
             color="#ffffff", va="center", fontsize=9.0, fontweight="bold")
ax1.set_xlim(10, 10000)

# Panel 2: Subsystem Power Distribution (kWe)
subsys_names = [
    "SOXE Electrolysis",
    "Cryo Liquefaction",
    "Carbothermal Reactor",
    "Thermal Crucible (Equiv)",
    "Methanation Reactor",
    "RASSOR Excavation",
    "Water Hauler Logistics"
]
power_vals = [
    soxe_power_kWe,
    cryo_power_kWe,
    carbothermal_power_kWe,
    8.24,
    methanation_power_kWe,
    rassor_power_kWe,
    tanker_power_kWe
]
colors_p = ["#8b5cf6", "#ec4899", "#d97706", "#f59e0b", "#10b981", "#0ea5e9", "#06b6d4"]

y_pos_p = np.arange(len(subsys_names))
bars2 = ax2.barh(y_pos_p, power_vals, color=colors_p, edgecolor="#ffffff", linewidth=0.8, height=0.62)
ax2.set_yticks(y_pos_p)
ax2.set_yticklabels(subsys_names, fontweight="bold", color="#f8fafc")
ax2.invert_yaxis()
ax2.set_xlabel("Continuous Electrical Power Requirement (kWe)", color="#94a3b8", fontsize=10.5, labelpad=8)
ax2.set_title("Subsystem Electrical Power Breakdown (Total: 245.2 kWe)", color="#38bdf8", fontsize=12, fontweight="bold", pad=12)

for bar in bars2:
    val = bar.get_width()
    pct = (val / sum(power_vals)) * 100.0
    ax2.text(val + 3.0, bar.get_y() + bar.get_height()/2.0, f"{val:.1f} kWe ({pct:.1f}%)",
             color="#ffffff", va="center", fontsize=9.0, fontweight="bold")
ax2.set_xlim(0, 220)

plt.suptitle("LUNAR POLAR ISRU SYSTEM ENGINEERING: MASS & POWER BALANCES",
             color="#ffffff", fontsize=15, fontweight="bold", y=0.98)
plt.tight_layout()
p2_path = os.path.join(OUT_DIR, "maps/02_isru_mass_and_power_balance_chart.png")
plt.savefig(p2_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches="tight")
shutil.copy2(p2_path, os.path.join(ALT_DIR, "maps/02_isru_mass_and_power_balance_chart.png"))
plt.close()
print("Mass and power balance chart generated.")

# FIGURE 3: MISSION SYNTHESIS MASTER DASHBOARD MAP
print("Generating 03_mission_synthesis_master_dashboard_map.png...")
# Ingest authoritative DEM and ice likelihood from output_from_masterplan
dem_path = "output_from_masterplan/maps/04_lola_dem_elevation_map.tif"
ice_path = "output_from_masterplan/maps/09_final_ice_likelihood_map.tif"

with rasterio.open(dem_path) as src_dem, rasterio.open(ice_path) as src_ice:
    dem = src_dem.read(1).astype(np.float32)
    ice = src_ice.read(1).astype(np.float32)
    transform = src_dem.transform
    crs = src_dem.crs

# Compute realistic LOLA Hillshade
dy_dem, dx_dem = np.gradient(dem, 80.0, 80.0)
slope_rad = np.arctan(np.sqrt(dx_dem**2 + dy_dem**2))
aspect_rad = np.arctan2(-dy_dem, dx_dem)
az_rad = np.radians(315.0)  # Illumination from NW
alt_rad = np.radians(35.0)  # 35 deg sun elevation
shaded = np.sin(alt_rad) * np.cos(slope_rad) + np.cos(alt_rad) * np.sin(slope_rad) * np.cos(az_rad - aspect_rad)
hs = np.clip((shaded + 1.0) / 2.0, 0.0, 1.0)

# Coordinates in polar stereographic (km)
x0 = transform[2] / 1000.0
y0 = transform[5] / 1000.0
dx = transform[0] / 1000.0
dy = transform[4] / 1000.0

nrows, ncols = dem.shape
extent_km = [x0, x0 + ncols * dx, y0 + nrows * dy, y0]

fig, ax = plt.subplots(figsize=(14, 13), dpi=300)
ax.set_facecolor("#0b0f19")
fig.patch.set_facecolor("#0b0f19")

# 1. Basemap Hillshade
ax.imshow(hs, extent=extent_km, cmap="gray", origin="upper", alpha=0.92)

# 2. Ice Likelihood Overlay (Cyan glow where ice >= 0.70)
ice_masked = np.ma.masked_where(ice < 0.70, ice)
ax.imshow(ice_masked, extent=extent_km, cmap="cool", vmin=0.70, vmax=1.0, alpha=0.68, origin="upper")

# 3. Plot Top Landing Sites from Phase 3
df_ls = pd.read_csv("outputs/phase3/tables/ranked_landing_sites.csv")
top_ls = df_ls.head(5)

# Draw landing ellipses and pins
for idx, r in top_ls.iterrows():
    px, py = r["Polar_X_km"], r["Polar_Y_km"]
    is_prime = (idx == 0)
    col = "#22c55e" if is_prime else "#eab308"
    
    # Touchdown ellipse (1 km radius)
    el = patches.Ellipse((px, py), 2.0, 2.0, angle=0, fill=False, edgecolor=col, linewidth=2.0, linestyle="--", zorder=6)
    ax.add_patch(el)
    
    # Pin marker
    ax.plot(px, py, marker="o", markersize=7, markerfacecolor=col, markeredgecolor="#ffffff", markeredgewidth=1.2, zorder=7)
    
    # Label text
    lbl = f"SITE #1: NOVEL DISCOVERY\nCabeus B ({r['Site_ID']})\nSlope {r['Mean_Slope_deg']:.1f}° | Dist {r['Dist_to_Ice_km']:.2f} km" if is_prime else f"SITE #{idx+1}: {r['Site_ID']}"
    ax.annotate(lbl, xy=(px, py), xytext=(px + 8.0, py + (6.0 if is_prime else -6.0)),
                color="#ffffff", fontsize=8.2, fontweight="bold",
                bbox=dict(boxstyle="round,pad=0.25", facecolor="#1e293b", edgecolor=col, linewidth=1.5, alpha=0.9),
                arrowprops=dict(arrowstyle="->", color=col, lw=1.5), zorder=8)

# 4. Plot DIC3D-A* Rover Traverse Route (Cabeus B Novel Discovery)
df_wp_cb = pd.read_csv("outputs/phase4/tables/rover_traverse_waypoints_cabeus_b.csv")
wx_cb = df_wp_cb["Polar_X_km"].values
wy_cb = df_wp_cb["Polar_Y_km"].values

# Rover path line
ax.plot(wx_cb, wy_cb, color="#ef4444", linewidth=2.8, linestyle="-", label="DIC3D-A* Rover Traverse (4.74 km)", zorder=7)
# Waypoint dots every 5 points
ax.plot(wx_cb[::5], wy_cb[::5], marker="D", markersize=4.5, markerfacecolor="#facc15", markeredgecolor="#000000", linestyle="None", zorder=8)

# Start and End Markers
ax.plot(wx_cb[0], wy_cb[0], marker="*", markersize=14, markerfacecolor="#22c55e", markeredgecolor="#ffffff", zorder=9)
ax.plot(wx_cb[-1], wy_cb[-1], marker="X", markersize=10, markerfacecolor="#38bdf8", markeredgecolor="#ffffff", zorder=9)

# 5. Plot Benchmark Traverse (Haworth Crater)
df_wp_hw = pd.read_csv("outputs/phase4/tables/rover_traverse_waypoints_haworth.csv")
wx_hw = df_wp_hw["Polar_X_km"].values
wy_hw = df_wp_hw["Polar_Y_km"].values
ax.plot(wx_hw, wy_hw, color="#f97316", linewidth=2.2, linestyle="--", label="Haworth Benchmark Traverse (5.28 km)", zorder=7)

# 6. Mark Peak of Eternal Light (PEL) ISRU Refinery Base
pel_x, pel_y = -60.0, 52.0 # On sunlit ridge overlooking Cabeus B
ax.plot(pel_x, pel_y, marker="s", markersize=9, markerfacecolor="#a855f7", markeredgecolor="#ffffff", markeredgewidth=1.2, zorder=9)
ax.annotate("ISRU REFINERY BASE\nPeak of Eternal Light (PEL)\nSolar Tower + Cryo Tanks",
            xy=(pel_x, pel_y), xytext=(pel_x - 38.0, pel_y + 12.0),
            color="#ffffff", fontsize=8.5, fontweight="bold",
            bbox=dict(boxstyle="round,pad=0.25", facecolor="#3b0764", edgecolor="#c084fc", linewidth=1.5, alpha=0.9),
            arrowprops=dict(arrowstyle="->", color="#c084fc", lw=1.5), zorder=10)

# Major Crater Annotations
craters = [
    ("HAWORTH", -15.0, 85.0),
    ("SHOEMAKER", 45.0, 60.0),
    ("FAUSTINI", 80.0, 15.0),
    ("SHACKLETON", 0.0, 5.0),
    ("CABEUS B", -55.0, 40.0)
]
for cname, cx, cy in craters:
    ax.text(cx, cy, cname, color="#94a3b8", fontsize=10.0, fontweight="bold",
            ha="center", va="center", alpha=0.85,
            bbox=dict(boxstyle="round,pad=0.15", facecolor="#0f172a", edgecolor="none", alpha=0.6))

# Map Decor: Axes, Labels, Scale Bar
ax.tick_params(colors="#94a3b8", labelsize=9)
ax.set_xlabel("Polar Stereographic X (km, Origin at South Pole)", color="#94a3b8", fontsize=10.5, labelpad=8)
ax.set_ylabel("Polar Stereographic Y (km, Origin at South Pole)", color="#94a3b8", fontsize=10.5, labelpad=8)
for spine in ax.spines.values():
    spine.set_color("#475569")

# Map Titles
ax.text(extent_km[0] + 6.0, extent_km[3] - 8.0, "CHANDRAYAAN-2 LUNAR EXPLORATION MISSION: MASTER SYNTHESIS MAP",
        color="#38bdf8", fontsize=11, fontweight="bold")
ax.text(extent_km[0] + 6.0, extent_km[3] - 16.0, "Integrated Radar Ice Deposits, Safe Landing Sites & Autonomous Rover Traverses",
        color="#ffffff", fontsize=14, fontweight="bold")
ax.text(extent_km[0] + 6.0, extent_km[3] - 22.0, "LOLA Hillshade 80m + DFSAR Ice Likelihood (Cyan) + DIC3D-A* Routes (Red/Orange)",
        color="#94a3b8", fontsize=9.0)

# Legend Box
legend_elements = [
    Line2D([0], [0], marker='o', color='w', label='Prime Landing Site (LS_38 Cabeus B)', markerfacecolor='#22c55e', markersize=8),
    Line2D([0], [0], marker='o', color='w', label='Candidate Landing Sites (LS_16 Haworth, etc.)', markerfacecolor='#eab308', markersize=8),
    Line2D([0], [0], color='#ef4444', lw=2.5, label='Cabeus B Rover Traverse (4.74 km, max 11.7° slope)'),
    Line2D([0], [0], color='#f97316', lw=2.0, linestyle='--', label='Haworth Benchmark Traverse (5.28 km)'),
    patches.Patch(facecolor='#06b6d4', edgecolor='#ffffff', label='High-Probability Ice Deposits (IPS ≥ 0.70)'),
    Line2D([0], [0], marker='s', color='w', label='PEL ISRU Outpost & Refinery', markerfacecolor='#a855f7', markersize=8)
]
ax.legend(handles=legend_elements, loc="lower right", facecolor="#1e293b", edgecolor="#475569",
          labelcolor="#ffffff", fontsize=8.5, framealpha=0.92)

# Scale bar (20 km)
sb_x = extent_km[0] + 10.0
sb_y = extent_km[2] + 12.0
ax.plot([sb_x, sb_x + 20.0], [sb_y, sb_y], color="#ffffff", lw=3.0, zorder=10)
ax.plot([sb_x, sb_x], [sb_y - 1.5, sb_y + 1.5], color="#ffffff", lw=2.0, zorder=10)
ax.plot([sb_x + 20.0, sb_x + 20.0], [sb_y - 1.5, sb_y + 1.5], color="#ffffff", lw=2.0, zorder=10)
ax.text(sb_x + 10.0, sb_y + 3.0, "20 km", color="#ffffff", fontsize=9.5, fontweight="bold", ha="center", zorder=10)

plt.tight_layout()
p3_path = os.path.join(OUT_DIR, "maps/03_mission_synthesis_master_dashboard_map.png")
plt.savefig(p3_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches="tight")
shutil.copy2(p3_path, os.path.join(ALT_DIR, "maps/03_mission_synthesis_master_dashboard_map.png"))
plt.close()
print("Master synthesis map generated.")

# FIGURE 4: PROPELLANT PRODUCTION & MISSION SUPPORT YIELD
print("Generating 04_propellant_production_and_mission_support_yield.png...")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 7.0), dpi=300)
fig.patch.set_facecolor("#0b0f19")
for ax in (ax1, ax2):
    ax.set_facecolor("#131b2e")
    ax.tick_params(colors="#cbd5e1", labelsize=9.5)
    ax.grid(True, linestyle="--", alpha=0.25, color="#64748b")
    for spine in ax.spines.values():
        spine.set_color("#475569")

# Panel 1: 10-Year Cumulative Propellant Production (Metric Tonnes)
years = np.arange(1, 11)
cum_water = years * 114.05
cum_lox = years * 101.38
cum_lh2 = years * 12.67

ax1.plot(years, cum_water, color="#06b6d4", linewidth=2.8, marker="o", label="Total Water Harvested (114.1 t/yr)")
ax1.plot(years, cum_lox, color="#8b5cf6", linewidth=2.4, marker="s", label="Cryogenic LOX Propellant (101.4 t/yr)")
ax1.plot(years, cum_lh2, color="#ec4899", linewidth=2.0, marker="^", label="Cryogenic LH₂ Propellant (12.7 t/yr)")

# Mission demand milestones
ax1.axhline(30.0, color="#f59e0b", linestyle=":", linewidth=1.8, label="1x Human Lander Ascent (30 t)")
ax1.axhline(114.0, color="#22c55e", linestyle="--", linewidth=1.8, label="Annual Full Outpost Autonomy (114 t)")

ax1.set_xlabel("Operational Years at Cabeus B ISRU Plant", color="#94a3b8", fontsize=10.5, labelpad=8)
ax1.set_ylabel("Cumulative Production (Metric Tonnes)", color="#94a3b8", fontsize=10.5, labelpad=8)
ax1.set_title("10-Year Cumulative Propellant & Water Harvest", color="#38bdf8", fontsize=12, fontweight="bold", pad=12)
ax1.set_xticks(years)
ax1.legend(facecolor="#1e293b", edgecolor="#475569", labelcolor="#ffffff", fontsize=8.8)

# Panel 2: Sizing Scenarios Comparison (Bar chart)
scales = ["Pilot Demo", "Commercial (Nominal)", "Industrial Complex"]
bipro = [25.0, 114.05, 350.0]
land_asc = [0.83, 3.80, 11.67]
power_req = [54.0, 245.2, 750.0]

x_sc = np.arange(len(scales))
width = 0.35

rects1 = ax2.bar(x_sc - width/2, bipro, width, label="Annual Bipropellant Yield (t/yr)", color="#0ea5e9", edgecolor="#ffffff", linewidth=0.8)
rects2 = ax2.bar(x_sc + width/2, power_req, width, label="Plant Electrical Power (kWe)", color="#f59e0b", edgecolor="#ffffff", linewidth=0.8)

ax2.set_xticks(x_sc)
ax2.set_xticklabels(scales, fontweight="bold", color="#f8fafc")
ax2.set_ylabel("Tonnage (t/yr) or Power (kWe)", color="#94a3b8", fontsize=10.5, labelpad=8)
ax2.set_title("ISRU Plant Scaling: Yield vs. Power Infrastructure", color="#38bdf8", fontsize=12, fontweight="bold", pad=12)
ax2.legend(facecolor="#1e293b", edgecolor="#475569", labelcolor="#ffffff", fontsize=9.0)

for r in rects1:
    h = r.get_height()
    ax2.text(r.get_x() + r.get_width()/2.0, h + 8.0, f"{h:.1f} t", ha="center", va="bottom", color="#38bdf8", fontsize=8.8, fontweight="bold")

for r in rects2:
    h = r.get_height()
    ax2.text(r.get_x() + r.get_width()/2.0, h + 8.0, f"{h:.0f} kWe", ha="center", va="bottom", color="#fcd34d", fontsize=8.8, fontweight="bold")

ax2.set_ylim(0, 850)

plt.suptitle("LUNAR IN-SITU RESOURCE UTILIZATION: MISSION SUPPORT METRICS",
             color="#ffffff", fontsize=15, fontweight="bold", y=0.98)
plt.tight_layout()
p4_path = os.path.join(OUT_DIR, "maps/04_propellant_production_and_mission_support_yield.png")
plt.savefig(p4_path, dpi=300, facecolor=fig.get_facecolor(), bbox_inches="tight")
shutil.copy2(p4_path, os.path.join(ALT_DIR, "maps/04_propellant_production_and_mission_support_yield.png"))
plt.close()
print("Propellant production yield chart generated.")

print("All Phase 5 pipeline deliverables executed and mirrored successfully.")
