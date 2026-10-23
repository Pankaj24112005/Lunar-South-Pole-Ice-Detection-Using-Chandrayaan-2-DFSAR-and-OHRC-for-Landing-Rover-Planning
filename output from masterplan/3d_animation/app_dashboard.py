"""
CHANDRAYAAN-2 LUNAR EXPLORATION MISSION DASHBOARD
Team SHAURYAM | ISRO AITHON 2.0 Hackathon Submission
Interactive Multi-Phase Lunar South Pole Exploration, Radar Ice Detection, Landing Site Selection,
Autonomous Rover Navigation & In-Situ Resource Utilization (ISRU) Synthesis.
"""
import os
import streamlit as st
import streamlit.components.v1 as components
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from PIL import Image

# -----------------------------------------------------------------------------
# PAGE CONFIGURATION
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Team SHAURYAM | Lunar Ice & ISRU Mission Control",
    page_icon="🌕",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for rich lunar dark theme
st.markdown("""
<style>
    .main {
        background-color: #0b0f19;
    }
    .stMetric {
        background-color: #131b2e;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #1e293b;
    }
    .metric-value {
        font-size: 1.8rem;
        font-weight: 700;
        color: #38bdf8;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }
    .stTabs [data-baseweb="tab"] {
        background-color: #131b2e;
        border-radius: 6px;
        color: #94a3b8;
        padding: 8px 16px;
    }
    .stTabs [aria-selected="true"] {
        background-color: #0284c7 !important;
        color: #ffffff !important;
        font-weight: bold;
    }
    .discovery-card {
        background: linear-gradient(135deg, #0c4a6e 0%, #1e293b 100%);
        border: 1px solid #38bdf8;
        border-radius: 10px;
        padding: 18px;
        margin-bottom: 20px;
    }
    .methodology-card {
        background: linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%);
        border: 1px solid rgba(6, 182, 212, 0.4);
        border-left: 5px solid #06b6d4;
        border-radius: 8px;
        padding: 14px 18px;
        margin-bottom: 20px;
        font-size: 1.05rem;
        line-height: 1.6;
        color: #e2e8f0;
    }
</style>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# SIDEBAR NAVIGATION (SEQUENTIAL PROJECT FLOW)
# -----------------------------------------------------------------------------
with st.sidebar:
    st.image("https://img.icons8.com/external-flatart-icons-lineal-color-flatarticons/64/000000/external-moon-space-flatart-icons-lineal-color-flatarticons.png", width=55)
    st.title("TEAM SHAURYAM")
    st.caption("Chandrayaan-2 DFSAR + LRO LOLA Mission Architecture")
    st.markdown("---")
    
    st.subheader("Sequential Project Flow")
    nav_option = st.radio(
        "Select Pipeline Stage",
        [
            "Mission Overview & Top KPIs",
            "Stage 1: Multi-Sensor Data Ingestion",
            "Stage 2: Preprocessing & Coregistration",
            "Stage 3: Feature Extraction & Polarimetry",
            "Stage 4: Subsurface Ice Detection & ML",
            "Stage 5: Safe Landing Site Selection (3D)",
            "Stage 6: Autonomous Rover Path Planning (GIF)",
            "Stage 7: Subsurface Ice Reserves & ISRU",
            "Interactive Propellant Sizer"
        ],
        index=0
    )
    
    st.markdown("---")
    st.markdown("""
    **Core Discoveries & Benchmarks:**
    - **Novel Landing Site:** `LS_38` (Cabeus B)
    - **Uncataloged Ice Core:** `CAND_052`
    - **Touchdown Slope:** `2.17°` (Limit: 8.0°)
    - **Ice Distance:** `2.83 km`
    - **Rover Route:** `4.74 km` (Mean slope 3.4°)
    - **Nominal Ice Reserves:** `52.55 Mt`
    - **Annual Propellant Yield:** `114.1 t/yr`
    """)

# -----------------------------------------------------------------------------
# TOP HEADER & MISSION KPIS
# -----------------------------------------------------------------------------
st.title("🌕 Chandrayaan-2 Lunar South Pole Exploration Dashboard")
st.markdown("**Multi-Sensor Radar Subsurface Ice Detection, Landing Site Selection, Autonomous DIC3D-A* Rover Traverse & Closed-Loop ISRU Architecture**")

# Top KPI Metric Row
kpi1, kpi2, kpi3, kpi4, kpi5 = st.columns(5)
with kpi1:
    st.metric(label="Total Polar Ice Reserves", value="52.55 Mt", delta="Looyenga 5m Baseline")
with kpi2:
    st.metric(label="Novel Discovery Site", value="LS_38", delta="Cabeus B Plateau (Rank 1)")
with kpi3:
    st.metric(label="Touchdown Slope", value="2.17°", delta="Safe (Limit ≤ 8.0°)")
with kpi4:
    st.metric(label="Rover Traverse Length", value="4.74 km", delta="Mean Slope 3.41°")
with kpi5:
    st.metric(label="Annual Propellant Yield", value="114.1 t/yr", delta="Refuels 3.8 Landers/yr")

st.markdown("---")

# -----------------------------------------------------------------------------
# 0. MISSION OVERVIEW & KPIS
# -----------------------------------------------------------------------------
if nav_option == "Mission Overview & Top KPIs":
    st.markdown("""
    <div class="discovery-card">
        <h3 style="color: #38bdf8; margin-top: 0;">🚀 Primary Scientific Contribution & Novel Research Discovery</h3>
        <p style="font-size: 1.05rem; line-height: 1.5; color: #f8fafc;">
            While conventional lunar south polar studies focus exclusively on known benchmark craters (Haworth, Shoemaker, Shackleton), 
            <strong>Team SHAURYAM's</strong> multi-sensor pipeline uncovered an uncataloged high-CPR subsurface ice deposit 
            (<strong>CAND_052</strong>, CPR = 1.49, DOP = 0.082) situated within a secondary cold trap on the 
            <strong>Cabeus B Southeast Flank</strong> (Lat -87.5371°, Lon -51.4792°).<br><br>
            Adjacent to this deposit lies an exceptionally safe landing site (<strong>LS_38</strong>, Lat -87.3901°, Lon -51.6070°) 
            featuring an ultra-gentle slope of <strong>2.17°</strong>, <strong>100% solar illumination</strong>, and a natural 
            continuous ramp granting rover access to the ice core over just <strong>4.74 km</strong> with zero rollover or wheel-lock hazard.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    col_map, col_info = st.columns([1.4, 1.0])
    with col_map:
        st.subheader("Integrated Master Mission Synthesis Map")
        map_path = "outputs/phase5/maps/03_mission_synthesis_master_dashboard_map.png"
        if os.path.exists(map_path):
            st.image(map_path, use_container_width=True)
    
    with col_info:
        st.subheader("Phase-Wise Deliverable Matrix")
        mat_path = "outputs/phase5/tables/integrated_mission_executive_matrix.csv"
        if os.path.exists(mat_path):
            df_mat = pd.read_csv(mat_path)
            for _, r in df_mat.iterrows():
                with st.expander(f"{r['Phase_ID']}: {r['Phase_Name']}", expanded=(r['Phase_ID'] in ["Phase 3", "Phase 4"])):
                    st.markdown(f"**Methodology:** {r['Core_Methodology']}")
                    st.markdown(f"**Key Deliverables:** {r['Key_Discoveries_Deliverables']}")
                    st.markdown(f"**Status:** `{r['Operational_Status']}`")

# -----------------------------------------------------------------------------
# STAGE 1: MULTI-SENSOR DATA INGESTION
# -----------------------------------------------------------------------------
elif nav_option == "Stage 1: Multi-Sensor Data Ingestion":
    st.header("Stage 1: Multi-Sensor Data Ingestion")
    
    # 2-Sentence Methodology
    st.markdown("""
    <div class="methodology-card">
        <strong>🔍 How We Performed Stage 1:</strong><br>
        We ingest raw polarimetric radar data from Chandrayaan-2 DFSAR (L-band and S-band), topographic elevation and surface roughness from LRO LOLA laser altimetry, and high-resolution optical imagery from Chandrayaan-2 OHRC. This multi-frequency sensor fusion establishes comprehensive observational coverage across the lunar south polar terrain (80°S to 90°S).
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2 = st.columns([1.1, 1.0])
    with col1:
        st.subheader("Multi-Sensor Instrument Matrix")
        sensor_data = {
            "Sensor / Dataset": ["Chandrayaan-2 DFSAR L-Band", "Chandrayaan-2 DFSAR S-Band", "LRO LOLA Topography", "Chandrayaan-2 OHRC Camera"],
            "Operating Frequency / Band": ["1.25 GHz (24 cm wavelength)", "2.50 GHz (12 cm wavelength)", "1064 nm Laser Altimeter", "Visible Panchromatic (450-900 nm)"],
            "Spatial Resolution": ["2.0 m / 80 m grid", "2.0 m / 80 m grid", "80 m / pixel", "0.25 m / pixel"],
            "Physical Detection Role": ["Deep regolith penetration (up to 5m)", "Upper regolith CPR & coherent backscatter", "Digital Elevation Model & Slope calculation", "Meter-scale boulder hazard validation"]
        }
        st.dataframe(pd.DataFrame(sensor_data), use_container_width=True)
    
    with col2:
        st.subheader("Ingested LOLA Elevation Base Map")
        dem_map = "output_from_masterplan/maps/04_lola_dem_elevation_map.png"
        if os.path.exists(dem_map):
            st.image(dem_map, use_container_width=True)

# -----------------------------------------------------------------------------
# STAGE 2: PREPROCESSING & COREGISTRATION
# -----------------------------------------------------------------------------
elif nav_option == "Stage 2: Preprocessing & Coregistration":
    st.header("Stage 2: Preprocessing & Polar Spatial Coregistration")
    
    # 2-Sentence Methodology
    st.markdown("""
    <div class="methodology-card">
        <strong>⚙️ How We Performed Stage 2:</strong><br>
        All raw sensor rasters are geometrically projected into the standard Moon South Polar Stereographic coordinate system (IAU:30135) with calibrated radiometric corrections and speckle filtering. Products are systematically resampled and coregistered onto a uniform 80-meter spatial resolution grid to ensure seamless pixel-by-pixel cross-sensor alignment.
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Coregistered LOLA Slope Field")
        slope_map = "output_from_masterplan/maps/05_lola_slope_map.png"
        if os.path.exists(slope_map):
            st.image(slope_map, use_container_width=True)
    with col2:
        st.subheader("Coregistered LOLA Roughness (100m Baseline)")
        rough_map = "output_from_masterplan/maps/06_lola_roughness_map.png"
        if os.path.exists(rough_map):
            st.image(rough_map, use_container_width=True)

# -----------------------------------------------------------------------------
# STAGE 3: FEATURE EXTRACTION & POLARIMETRY
# -----------------------------------------------------------------------------
elif nav_option == "Stage 3: Feature Extraction & Polarimetry":
    st.header("Stage 3: Feature Extraction & Polarimetric Decomposition")
    
    # 2-Sentence Methodology
    st.markdown("""
    <div class="methodology-card">
        <strong>🔬 How We Performed Stage 3:</strong><br>
        We calculate Circular Polarization Ratio (CPR), Degree of Polarization (DOP), and decomposed volume scattering power from DFSAR Stokes parameters alongside LOLA topographic slope and RMS roughness. Permanently Shadowed Regions (PSRs) and Diviner cryogenic thermal cold traps are identified and masked to isolate areas capable of preserving stable ground ice.
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("DFSAR Circular Polarization Ratio (CPR)")
        cpr_map = "output_from_masterplan/maps/01_dfsar_cpr_map.png"
        if os.path.exists(cpr_map):
            st.image(cpr_map, use_container_width=True)
    with col2:
        st.subheader("Cryogenic PSR & Cold Trap Mask")
        psr_map = "output_from_masterplan/maps/07_lola_psr_dsc_map.png"
        if os.path.exists(psr_map):
            st.image(psr_map, use_container_width=True)

# -----------------------------------------------------------------------------
# STAGE 4: SUBSURFACE ICE DETECTION & ML
# -----------------------------------------------------------------------------
elif nav_option == "Stage 4: Subsurface Ice Detection & ML":
    st.header("Stage 4: Subsurface Ice Detection & ML Fusion Modeling")
    
    # 2-Sentence Methodology
    st.markdown("""
    <div class="methodology-card">
        <strong>💧 How We Performed Stage 4:</strong><br>
        A multi-layer machine learning fusion model integrates dielectric permittivity inversions, radar volume scattering, and micro-topography to calculate pixel-level subsurface ice probability. This automated classification detected 24 high-confidence ice reservoirs across the south pole, headlined by the discovery of an uncataloged core deposit in Cabeus B (CAND_052, CPR = 1.49, 81.6% ice probability).
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2 = st.columns([1.1, 1.0])
    with col1:
        st.subheader("Final Subsurface Water-Ice Probability Map")
        p_map = "output_from_masterplan/maps/09_final_ice_likelihood_map.png"
        if os.path.exists(p_map):
            st.image(p_map, use_container_width=True)
    with col2:
        st.subheader("Top Ranked Ice Reservoirs")
        cand_path = "output_from_masterplan/tables/ranked_crater_candidates.csv"
        if os.path.exists(cand_path):
            df_cand = pd.read_csv(cand_path)
            st.dataframe(df_cand[["Final_rank", "Candidate_ID", "Crater_name", "Area_km2", "Median_CPR", "PSR_percentage", "Model_probability"]], use_container_width=True)

# -----------------------------------------------------------------------------
# STAGE 5: SAFE LANDING SITE SELECTION (WITH EMBEDDED 3D HTML MODEL)
# -----------------------------------------------------------------------------
elif nav_option == "Stage 5: Safe Landing Site Selection (3D)":
    st.header("Stage 5: Safe Landing Site Selection & 3D Characterization")
    
    # 2-Sentence Methodology
    st.markdown("""
    <div class="methodology-card">
        <strong>🚀 How We Performed Stage 5:</strong><br>
        Candidate landing sites are screened using a Landing Suitability Index (LSI) enforcing strict lander stability constraints: slope ≤ 8.0°, low boulder hazard, continuous solar illumination, and safe proximity to ice (1.5 to 7.0 km). The evaluation ranked the Cabeus B Southeast Plateau (LS_38) as the #1 landing site worldwide, providing an ultra-gentle 2.17° touchdown slope, 100% solar power, and direct ramp access to ice.
    </div>
    """, unsafe_allow_html=True)
    
    st.subheader("🌐 Interactive 3D WebGL Model: Cabeus B Landing Site & Terrain")
    st.caption("💡 Fully interactive 3D WebGL model: Click and drag to orbit 360°, scroll to zoom, and hover over waypoints to inspect real-time telemetry.")
    
    html_3d_path = "output_from_masterplan/ed_animation/cabeus_b_3d_interactive_model.html"
    if os.path.exists(html_3d_path):
        with open(html_3d_path, "r", encoding="utf-8") as f:
            html_code = f.read()
        components.html(html_code, height=650, scrolling=False)
    else:
        st.warning("3D interactive model HTML not found at expected path.")
        
    col1, col2 = st.columns([1.1, 1.0])
    with col1:
        st.subheader("Cabeus B Novel Discovery Landing Zone Zoom Map")
        zoom_map = "output_from_masterplan/phase3_landing_sites/maps/06_zoom_cabeus_b_novel_landing_site.png"
        if os.path.exists(zoom_map):
            st.image(zoom_map, use_container_width=True)
    with col2:
        st.subheader("Ranked Landing Site Catalog")
        ls_path = "output_from_masterplan/phase3_landing_sites/tables/ranked_landing_sites.csv"
        if os.path.exists(ls_path):
            df_ls = pd.read_csv(ls_path)
            st.dataframe(df_ls[["Final_Rank", "Site_ID", "Site_Name", "Designation", "Mean_Slope_deg", "Dist_to_Ice_km", "Illumination_Availability_Pct", "LSI_Score"]], use_container_width=True)

# -----------------------------------------------------------------------------
# STAGE 6: AUTONOMOUS ROVER PATH PLANNING (WITH ANIMATED GIF)
# -----------------------------------------------------------------------------
elif nav_option == "Stage 6: Autonomous Rover Path Planning (GIF)":
    st.header("Stage 6: Autonomous Rover Path Planning (DIC3D-A*) & Terramechanics")
    
    # 2-Sentence Methodology
    st.markdown("""
    <div class="methodology-card">
        <strong>🚜 How We Performed Stage 6:</strong><br>
        Rover traverses are calculated using Dynamic Illumination-Constrained 3D A-Star (DIC3D-A*) integrated with the Bekker-Wong terramechanic lunar wheel-slip model. The computed 4.74 km route from LS_38 to CAND_052 negotiates a natural terraced ramp with a safe mean slope of 3.41°, peak slip of only 11.7%, and 99.6% battery reserve upon entering the cold trap.
    </div>
    """, unsafe_allow_html=True)
    
    st.subheader("🎬 Primary Mission Animation: Rover Traveling from Landing Site to Ice Target")
    st.caption("Synchronized animation featuring dynamic route illumination, real-time Telemetry HUD (distance, elevation, slope, wheel slip %, battery SoC), and live profile cursor.")
    
    gif_path = "output_from_masterplan/ed_animation/rover_traverse_cabeus_b_mission_animation.gif"
    if os.path.exists(gif_path):
        st.image(gif_path, use_container_width=True)
        
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("🎥 Companion 3D Perspective Terrain Descent Animation")
        gif_3d_path = "output_from_masterplan/ed_animation/rover_traverse_3d_perspective_animation.gif"
        if os.path.exists(gif_3d_path):
            st.image(gif_3d_path, use_container_width=True)
    with col2:
        st.subheader("Cabeus B Traverse Engineering Profile")
        prof_map = "output_from_masterplan/phase4_rover_and_resources/maps/02_rover_traverse_elevation_slope_profile.png"
        if os.path.exists(prof_map):
            st.image(prof_map, use_container_width=True)
            
    st.subheader("Cabeus B 47-Waypoint Autonomous Traverse Telemetry")
    wp_path = "output_from_masterplan/phase4_rover_and_resources/tables/rover_traverse_waypoints_cabeus_b.csv"
    if os.path.exists(wp_path):
        df_wp = pd.read_csv(wp_path)
        st.dataframe(df_wp, use_container_width=True)

# -----------------------------------------------------------------------------
# STAGE 7: SUBSURFACE ICE RESERVES & ISRU
# -----------------------------------------------------------------------------
elif nav_option == "Stage 7: Subsurface Ice Reserves & ISRU":
    st.header("Stage 7: Subsurface Ice Reserves & ISRU Plant Synthesis")
    
    # 2-Sentence Methodology
    st.markdown("""
    <div class="methodology-card">
        <strong>🏭 How We Performed Stage 7:</strong><br>
        Using the Looyenga-Landau-Lifshitz 3-phase dielectric mixing model, we calculate 52.55 Million Metric Tonnes of nominal extractable water-ice reserves across the polar terrain. An end-to-end closed-loop ISRU architecture (sublimation + carbothermal reduction + SOXE electrolysis) processes this ice to generate 114.1 tonnes of LOX/LH₂ rocket propellant annually, sufficient to refuel 3.8 lunar ascent vehicles every year.
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Closed-Loop ISRU Plant Architecture Flowchart")
        flow_map = "outputs/phase5/maps/01_isru_plant_architecture_flowchart.png"
        if os.path.exists(flow_map):
            st.image(flow_map, use_container_width=True)
    with col2:
        st.subheader("Mass Flow Cascade & Subsystem Electrical Power")
        bal_map = "outputs/phase5/maps/02_isru_mass_and_power_balance_chart.png"
        if os.path.exists(bal_map):
            st.image(bal_map, use_container_width=True)
            
    st.subheader("Subsurface Ice Resource Scenarios (Looyenga Inversion)")
    res_path = "output_from_masterplan/phase4_rover_and_resources/tables/ice_resource_scenarios_summary.csv"
    if os.path.exists(res_path):
        df_res = pd.read_csv(res_path)
        st.table(df_res)

# -----------------------------------------------------------------------------
# INTERACTIVE ISRU PROPELLANT SIZER
# -----------------------------------------------------------------------------
elif nav_option == "Interactive Propellant Sizer":
    st.header("⚙️ Interactive Lunar ISRU Propellant Sizer")
    st.markdown("Dynamically adjust mining parameters and plant efficiencies to project real-time water, oxygen, hydrogen, and rocket propellant outputs.")
    
    col_input, col_output = st.columns([1.0, 1.2])
    
    with col_input:
        st.subheader("Mining & Plant Inputs")
        feed_vol_pct = st.slider("Deposit Volumetric Ice Fraction (%)", min_value=2.0, max_value=25.0, value=10.9, step=0.5)
        excav_rate = st.slider("Daily Regolith Excavated (kg / sol)", min_value=1000, max_value=15000, value=4712, step=250)
        sublim_eff = st.slider("Thermal Crucible Sublimation Efficiency (%)", min_value=80.0, max_value=99.0, value=96.5, step=0.5)
        include_carbo = st.checkbox("Include Tailings Carbothermal Reduction (Water 2)", value=True)
        soxe_eff = st.slider("SOXE Electrolysis Efficiency (%)", min_value=80.0, max_value=98.0, value=94.0, step=1.0)
    
    # Live Calculations
    rho_i = 917.0
    rho_r = 2700.0
    poros = 0.40
    vol_frac = feed_vol_pct / 100.0
    mass_i = vol_frac * rho_i
    mass_r = (1.0 - poros) * rho_r
    calc_wt_pct = (mass_i / (mass_r + mass_i)) * 100.0
    
    daily_w1 = excav_rate * (calc_wt_pct / 100.0) * (sublim_eff / 100.0)
    daily_w2 = 47.90 * (excav_rate / 4712.0) if include_carbo else 0.0
    total_daily_w = daily_w1 + daily_w2
    annual_w_tonnes = (total_daily_w * 365.25) / 1000.0
    
    daily_o2 = total_daily_w * (32.0 / 36.0) * (soxe_eff / 100.0)
    daily_h2 = total_daily_w * (4.0 / 36.0) * (soxe_eff / 100.0)
    annual_lox_tonnes = (daily_o2 * 365.25) / 1000.0
    annual_lh2_tonnes = (daily_h2 * 365.25) / 1000.0
    annual_bipro_tonnes = annual_lox_tonnes + annual_lh2_tonnes
    
    thermal_p_kW = (daily_w1 * 2.85 + excav_rate * 0.8 * 273.0 / 1000.0) / 86.4
    soxe_p_kWe = (total_daily_w * 14.2) / 24.0
    cryo_p_kWe = (daily_o2 * 1.8 + daily_h2 * 12.5) / 24.0
    aux_p_kWe = 12.0
    total_plant_kWe = (thermal_p_kW * 0.4) + soxe_p_kWe + cryo_p_kWe + aux_p_kWe
    
    landers_supported = annual_bipro_tonnes / 30.0
    crew_days = (annual_lox_tonnes * 1000.0) / (0.84 * 12.0)
    
    with col_output:
        st.subheader("Dynamic Output Projections")
        
        m1, m2 = st.columns(2)
        with m1:
            st.metric("Annual Water Harvested", f"{annual_w_tonnes:.1f} Tonnes / yr", delta=f"{total_daily_w:.1f} kg/sol")
        with m2:
            st.metric("Total Cryogenic Propellant", f"{annual_bipro_tonnes:.1f} Tonnes / yr", delta=f"{landers_supported:.2f} Landers Refueled")
            
        m3, m4 = st.columns(2)
        with m3:
            st.metric("Liquid Oxygen (LOX)", f"{annual_lox_tonnes:.1f} t/yr", delta=f"{daily_o2:.1f} kg/sol")
        with m4:
            st.metric("Liquid Hydrogen (LH₂)", f"{annual_lh2_tonnes:.1f} t/yr", delta=f"{daily_h2:.1f} kg/sol")
            
        st.metric("Total Continuous Electrical Power", f"{total_plant_kWe:.1f} kWe", delta="SOXE + Cryo + Crucible")
        st.info(f"💡 This plant configuration provides 100% life-support oxygen for a 12-astronaut lunar outpost for **{crew_days:.0f} crew-days** per year.")

st.markdown("---")
st.caption("Team SHAURYAM | ISRO AITHON 2.0 | Chandrayaan-2 DFSAR Radar Subsurface Ice & ISRU Mission")
