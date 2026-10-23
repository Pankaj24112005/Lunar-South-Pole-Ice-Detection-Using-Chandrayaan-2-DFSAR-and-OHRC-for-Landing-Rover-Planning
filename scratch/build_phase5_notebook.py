"""
Builder script to generate and execute outputs/phase5/notebooks/phase5_lunar_isru_and_mission_synthesis.ipynb
Strictly enforces the rule that every code cell begins with exactly two concise comment sentences.
"""
import nbformat as nbf
from nbclient import NotebookClient
import os
import shutil
import time

P5_NB_DIR = "outputs/phase5/notebooks"
ALT_NB_DIR = "output_from_masterplan/phase5_isru_and_mission_synthesis/notebooks"
os.makedirs(P5_NB_DIR, exist_ok=True)
os.makedirs(ALT_NB_DIR, exist_ok=True)

nb = nbf.v4.new_notebook()
cells = []

# Cell 1: Markdown Title
cells.append(nbf.v4.new_markdown_cell("""# Phase 5: Lunar ISRU Architecture, Propellant Production & Mission Synthesis
### Feedstock Extraction, Carbothermal Reduction, Sabatier Loop, SOXE & Master Synthesis
**Team SHAURYAM | Lunar South Polar Region (80°S – 90°S)**

This notebook executes Phase 5 of the mission architecture based on the team's official proposal (`Team Name  TEAM SHAURYAM.pdf`, Page 7) and Master Plan. It integrates the discoveries and engineering deliverables from Phases 1 through 4:
1. **Quantitative Lunar In-Situ Resource Utilization (ISRU) Architecture:** Sizing an end-to-end chemical and mechanical plant at Cabeus B / Peak of Eternal Light (PEL) utilizing dual RASSOR robotic excavation, thermal crucible sublimation, tailings carbothermal reduction, methane pyrolysis carbon recycling, and Solid Oxide Electrolysis (SOXE).
2. **Cryogenic Propellant Synthesis:** Modeling the production of Liquid Oxygen (LOX) and Liquid Hydrogen (LH2) rocket propellant to refuel human lunar lander ascent stages.
3. **Master Mission Synthesis:** Cartographically and tabularly uniting the 5 mission phases into an authoritative operational framework."""))

# Cell 2: Setup & Environment
cells.append(nbf.v4.new_code_cell("""# This cell imports core geospatial and computational libraries for Phase 5 mission synthesis.
# File system paths to Phase 5 cartographic maps and tabular outputs are configured for this session.
import os
import pandas as pd
import matplotlib.pyplot as plt

MAPS_DIR = os.path.abspath("outputs/phase5/maps")
TABLES_DIR = os.path.abspath("outputs/phase5/tables")
print(f"Phase 5 environment initialized successfully. Artifacts path: {MAPS_DIR}")
"""))

# Cell 3: Markdown Section 1
cells.append(nbf.v4.new_markdown_cell("""## 1. End-to-End ISRU Plant Architecture
The ISRU plant harvests icy regolith from the newly identified Cabeus B cold trap (`CAND_052`), sublimates water in a thermal crucible, processes tailings via carbothermal reduction, recycles carbon through methane pyrolysis, transports water along the 4.74 km DIC3D-A* ridge traverse, and electrolyzes it into cryogenic rocket propellant at the Peak of Eternal Light (PEL)."""))

# Cell 4: Flowchart Display
cells.append(nbf.v4.new_code_cell("""# This cell displays the end-to-end chemical and mechanical ISRU plant architecture flowchart.
# Seven integrated processing stages connect regolith excavation to cryogenic rocket propellant storage.
img_flow = plt.imread("outputs/phase5/maps/01_isru_plant_architecture_flowchart.png")
fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
ax.imshow(img_flow)
ax.axis("off")
plt.title("Lunar Polar In-Situ Resource Utilization (ISRU) Plant Architecture", fontsize=12, fontweight="bold", pad=10)
plt.tight_layout()
plt.show()
"""))

# Cell 5: Markdown Section 2
cells.append(nbf.v4.new_markdown_cell("""## 2. Subsystem Mass & Energy Balances
Detailed engineering parameters, operating temperatures, mass flow rates, and electrical power baseloads across all 7 plant subsystems."""))

# Cell 6: Subsystem Table Display
cells.append(nbf.v4.new_code_cell("""# This cell loads and presents the detailed mass-energy balance table for all plant subsystems.
# Operating temperatures, daily material inputs, product yields, and electrical power are tabulated.
df_sub = pd.read_csv("outputs/phase5/tables/isru_subsystem_mass_energy_balance.csv")
print("=== ISRU SUBSYSTEM MASS & ENERGY BALANCES ===")
disp_cols = ["Subsystem_ID", "Subsystem_Name", "Operating_Temp_K", "Mass_Input_kg_day", "Mass_Output_kg_day", "Electrical_Power_kWe", "Process_Efficiency_Pct"]
df_sub[disp_cols]
"""))

# Cell 7: Markdown Section 3
cells.append(nbf.v4.new_markdown_cell("""## 3. Mass Flow Cascade & Baseload Electrical Power Distribution
Analyzing the daily mass throughput from 4,707 kg of raw icy regolith into 312 kg of water and 312 kg of cryogens, alongside the 245.2 kWe power distribution."""))

# Cell 8: Mass and Power Balance Chart Display
cells.append(nbf.v4.new_code_cell("""# This cell visualizes the daily mass flow cascade and subsystem electrical power breakdown.
# Solid Oxide Electrolysis and cryogenic liquefaction constitute the majority of electrical power draw.
img_bal = plt.imread("outputs/phase5/maps/02_isru_mass_and_power_balance_chart.png")
fig, ax = plt.subplots(figsize=(15, 7), dpi=200)
ax.imshow(img_bal)
ax.axis("off")
plt.title("ISRU Daily Mass Cascade & Electrical Power Breakdown", fontsize=12, fontweight="bold", pad=10)
plt.tight_layout()
plt.show()
"""))

# Cell 9: Markdown Section 4
cells.append(nbf.v4.new_markdown_cell("""## 4. Annual Propellant Sizing Scenarios
Comparing Pilot Demonstration (25 t/yr), Commercial Production (114 t/yr), and Industrial Settlement (350 t/yr) plant scales."""))

# Cell 10: Scenarios Table Display
cells.append(nbf.v4.new_code_cell("""# This cell loads and displays the comparative production metrics across three ISRU plant scales.
# Annual propellant tonnage, required electrical power, and supported lander ascents are reported.
df_sc = pd.read_csv("outputs/phase5/tables/isru_annual_propellant_yield_scenarios.csv")
print("=== ISRU PLANT SCALING & PROPELLANT YIELD SCENARIOS ===")
df_sc[["Plant_Scale", "Annual_Water_Yield_t", "Total_Bipropellant_t_yr", "Required_Power_kWe", "Lander_Ascents_Supported_yr", "Crew_Life_Support_Days_yr"]]
"""))

# Cell 11: Markdown Section 5
cells.append(nbf.v4.new_markdown_cell("""## 5. Master Mission Synthesis Cartography (Phases 1 – 5 Integration)
Integrated cartographic synthesis displaying LOLA 3D shaded relief, DFSAR polarimetric ice deposits (cyan), safe landing sites (green/yellow), DIC3D-A* rover traverses (red/orange), and the PEL ISRU refinery base."""))

# Cell 12: Master Map Display
cells.append(nbf.v4.new_code_cell("""# This cell presents the authoritative master mission synthesis map uniting all project phases.
# Radar ice deposits, touchdown ellipses, autonomous rover routes, and refinery sites are displayed.
img_map = plt.imread("outputs/phase5/maps/03_mission_synthesis_master_dashboard_map.png")
fig, ax = plt.subplots(figsize=(14, 13), dpi=200)
ax.imshow(img_map)
ax.axis("off")
plt.title("Master Mission Synthesis: Chandrayaan-2 Radar Ice, Landing Sites & Rover Routes", fontsize=12, fontweight="bold", pad=10)
plt.tight_layout()
plt.show()
"""))

# Cell 13: Markdown Section 6
cells.append(nbf.v4.new_markdown_cell("""## 6. Long-Term Propellant Production & Mission Sustainability
Evaluating multi-year cumulative propellant yields against lunar exploration architecture demands (Artemis human landers, ISRO sample returns, and permanent outpost life support)."""))

# Cell 14: Propellant Yield Chart Display
cells.append(nbf.v4.new_code_cell("""# This cell displays the ten-year cumulative propellant yield and mission architecture scaling curves.
# Over ten operational years, the facility delivers over one thousand metric tonnes of propellant.
img_yield = plt.imread("outputs/phase5/maps/04_propellant_production_and_mission_support_yield.png")
fig, ax = plt.subplots(figsize=(15, 6.5), dpi=200)
ax.imshow(img_yield)
ax.axis("off")
plt.title("Ten-Year Cumulative Propellant Yield & Plant Scaling Dynamics", fontsize=12, fontweight="bold", pad=10)
plt.tight_layout()
plt.show()
"""))

# Cell 15: Markdown Section 7
cells.append(nbf.v4.new_markdown_cell("""## 7. Integrated Mission Executive Matrix (Phases 1 through 5)
Authoritative phase-by-phase synthesis matrix documenting input sensors, algorithms, key scientific discoveries, and operational status."""))

# Cell 16: Executive Matrix Display
cells.append(nbf.v4.new_code_cell("""# This cell presents the complete executive mission matrix summarizing Phases 1 through 5.
# Methodologies, key discoveries, quantitative deliverables, and operational status are synthesized.
df_mat = pd.read_csv("outputs/phase5/tables/integrated_mission_executive_matrix.csv")
print("=== INTEGRATED MISSION EXECUTIVE MATRIX (PHASES 1 - 5) ===")
df_mat[["Phase_ID", "Phase_Name", "Core_Methodology", "Key_Discoveries_Deliverables", "Operational_Status"]]
"""))

nb.cells = cells

# Save notebook to primary directory
nb_path = os.path.join(P5_NB_DIR, "phase5_lunar_isru_and_mission_synthesis.ipynb")
with open(nb_path, "w", encoding="utf-8") as f:
    nbf.write(nb, f)

print(f"Notebook written at: {nb_path} with {len(cells)} cells.")

# Execute notebook with nbclient
print("Executing Phase 5 notebook with nbclient...")
t0 = time.time()
client = NotebookClient(nb, timeout=600, kernel_name="python3")
client.execute()

with open(nb_path, "w", encoding="utf-8") as f:
    nbf.write(nb, f)

# Mirror executed notebook to alt directory
shutil.copy2(nb_path, os.path.join(ALT_NB_DIR, "phase5_lunar_isru_and_mission_synthesis.ipynb"))
print(f"Phase 5 notebook executed cleanly in {time.time()-t0:.2f} seconds and mirrored to {ALT_NB_DIR}.")
