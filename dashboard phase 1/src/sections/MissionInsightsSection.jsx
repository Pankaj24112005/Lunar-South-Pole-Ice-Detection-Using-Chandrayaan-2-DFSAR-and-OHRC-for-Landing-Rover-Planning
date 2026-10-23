import React from 'react';
import EvidenceBadge from '../components/EvidenceBadge';
import { Cpu, CheckCircle2, AlertTriangle, ArrowRight, Eye, Droplets, Flame, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';
import craterVolumeData from '../data/ice_volume_mass_estimation_by_crater.json';
import scenariosData from '../data/ice_resource_scenarios_summary.json';
import isruBalancesData from '../data/isru_subsystem_mass_energy_balance.json';

export default function MissionInsightsSection({ onOpenImage }) {
  return (
    <section id="mission-insights" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div className="section-header">
        <span className="section-tag">
          <Cpu size={14} /> PHASE 4 &amp; 5: MISSION SYNTHESIS &amp; INSIGHTS
        </span>
        <h2 className="section-title">Mission Insights, Inversion Tonnages &amp; Limitations</h2>
        <p className="section-desc">
          Holistic synthesis of verified findings: from dielectric mixing water-ice volume inversion to autonomous traverse dynamics, 
          continuous ISRU bipropellant plant sizing, and strict disclosure of scientific boundaries.
        </p>
      </div>

      {/* 6 Mandatory Subsections in 2-column or 3-column structured grid */}
      <div className="grid-2" style={{ gap: 24, marginBottom: 32 }}>
        {/* 1. Established Project Outputs */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} style={{ color: '#34d399' }} /> 1. Established Project Outputs
            </h3>
            <EvidenceBadge category="derived" size="sm" />
          </div>
          <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', paddingLeft: 18, lineHeight: 1.6 }}>
            <li><strong>Data Audit:</strong> 1,844 local repository files cataloged and verified in Phase 1 manifest.</li>
            <li><strong>Coregistered Grid:</strong> Standardized 80m Lunar South Polar Stereographic CRS analytical grid.</li>
            <li><strong>Confidence Tiers:</strong> Stratified 257.43 km² total ice area into Tier 3 (8.95 km²), Tier 2 (10.27 km²), and Tier 1 (238.22 km²).</li>
            <li><strong>Landing Sites:</strong> 97 landing cells evaluated via FCM; discovered prime site LS_38 (slope 2.17°, 100% illumination).</li>
            <li><strong>Rover Path:</strong> DIC3D-A* computed 4.74 km route (47 waypoints, mean slope 3.41°, peak slip 11.7%).</li>
            <li><strong>Ice Inversion:</strong> 52.55 Million Mt nominal water-ice reserves retrieved via LLL mixing model.</li>
            <li><strong>ISRU Sizing:</strong> 114.05 t/yr bipropellant yield (101.38 t LOX + 12.67 t LH2) refueling 3.8 landers annually.</li>
          </ul>
        </div>

        {/* 2. Potentially Useful Observations */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-sky)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} style={{ color: 'var(--accent-sky)' }} /> 2. Potentially Useful Observations
            </h3>
            <EvidenceBadge category="hypothesis" size="sm" />
          </div>
          <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', paddingLeft: 18, lineHeight: 1.6 }}>
            <li><strong>Cabeus B Flank Cold Trap:</strong> Uncataloged deposit CAND_052 on Cabeus B southeast flank exhibits elevated CPR (1.49) and severe depolarization (DOP 0.077).</li>
            <li><strong>Natural Descent Corridor:</strong> A terraced geological bench connects the high-illumination plateau directly to the crater floor, bypassing hazardous 25°–35° crater cliffs.</li>
            <li><strong>Thermal Trap Stability:</strong> 100% spatial overlap observed between Tier 3 high-confidence ice pixels and modelled doubly shadowed pits (&lt; 40 K).</li>
            <li><strong>Sunlit Standoff Safety:</strong> Placing the base station and lander at LS_38 ensures continuous communication and solar power while rovers conduct sortie descents into darkness.</li>
          </ul>
        </div>

        {/* 3. Outstanding Scientific Work */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={16} style={{ color: '#fbbf24' }} /> 3. Outstanding Scientific Work
            </h3>
            <EvidenceBadge category="pending" size="sm" />
          </div>
          <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', paddingLeft: 18, lineHeight: 1.6 }}>
            <li><strong>SAR Telemetry Focusing:</strong> Executing Range-Doppler pulse compression and azimuth focusing on the 5.72 GB Level-0A DFSAR acquisitions using ISRO SAC MIDAS.</li>
            <li><strong>Continuous CPR/DOP Generation:</strong> Computing single-look complex Stokes vectors directly from the focused L-band signal once focused.</li>
            <li><strong>Sub-Meter Optical Ingestion:</strong> Downloading raw 0.25m OHRC image rasters to perform automated boulder-counting algorithms directly across the LS_38 ellipse.</li>
            <li><strong>Geotechnical Soil Testing:</strong> In-situ calibration of lunar regolith shear strength and cohesion parameters in cryogenic cold traps.</li>
          </ul>
        </div>

        {/* 4. Operational Implications */}
        <div className="glass-card" style={{ borderLeft: '4px solid #a855f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} style={{ color: '#c084fc' }} /> 4. Operational Implications
            </h3>
            <EvidenceBadge category="derived" size="sm" />
          </div>
          <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', paddingLeft: 18, lineHeight: 1.6 }}>
            <li><strong>Rim Touchdown Mandate:</strong> Direct touchdown inside crater floors should be strictly avoided due to steep rim walls (15°–35°), total darkness, and extreme cryogenic cold (&lt; 40 K).</li>
            <li><strong>Gated Crater Ingress:</strong> Rovers must delay descent into cold traps until batteries reach 100% SoC along sunlit ridges and pre-warm subsystems via radioisotope heaters.</li>
            <li><strong>Standoff Hauling:</strong> Ice extraction rovers can haul sublimate containers up the 3.41° mean slope corridor to sunlit electrolysis plants at the rim plateau.</li>
            <li><strong>Refueling Economy:</strong> In-situ propellant production eliminates the requirement to launch 114 tonnes of ascent fuel from Earth, saving &gt; $1.14 Billion USD annually.</li>
          </ul>
        </div>

        {/* 5. Documented Limitations */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-red)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={16} style={{ color: '#f87171' }} /> 5. Documented Limitations
            </h3>
            <EvidenceBadge category="pending" customLabel="Methodological Boundaries" size="sm" />
          </div>
          <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', paddingLeft: 18, lineHeight: 1.6 }}>
            <li><strong>Roughness vs Ice Ambiguity:</strong> Blocky crater walls produce elevated CPR without water ice. Mitigated by restricting Tier 3 to slopes ≤ 10° in confirmed PSRs.</li>
            <li><strong>Spatial Resolution Limits:</strong> 80m DEM posting smooths out small obstacles; sub-meter boulders and meter-scale crevices require onboard rover stereo hazard cameras.</li>
            <li><strong>Absence of Direct Drilling:</strong> Remote sensing radar reflections provide dielectric evidence, not physical core samples; ground confirmation requires physical drilling.</li>
            <li><strong>Static Illumination Models:</strong> Current planning utilizes static average solar visibility; dynamic seasonal shadows must be modeled for multi-year missions.</li>
          </ul>
        </div>

        {/* 6. Next Scientific Steps */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowRight size={16} style={{ color: 'var(--accent-cyan)' }} /> 6. Next Scientific Steps
            </h3>
            <EvidenceBadge category="derived" size="sm" />
          </div>
          <ul style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', paddingLeft: 18, lineHeight: 1.6 }}>
            <li><strong>Level-0A Focusing Pipeline:</strong> Run the ISRO SAC MIDAS batch focusing scripts to convert the 5.72 GB echo data into Level-1 Single-Look Complex rasters.</li>
            <li><strong>Full-Stokes Inversion:</strong> Compute Stokes parameters and test the CPR &gt; 1.0 &amp; DOP &lt; 0.13 rule across newly focused DFSAR swaths.</li>
            <li><strong>Sub-Meter Hazard Mapping:</strong> Coregister high-resolution OHRC optical strips to evaluate micro-crater distributions along the 4.74 km Cabeus B traverse corridor.</li>
            <li><strong>Autonomous Self-Recovery Integration:</strong> Extend rover navigation into autonomous fault diagnosis and self-recovery (detailed in Section 10).</li>
          </ul>
        </div>
      </div>

      {/* Subsurface Water-Ice Reserves: 3 Scenarios */}
      <div className="glass-card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="section-tag" style={{ margin: 0 }}>DIELECTRIC INVERSION (LLL MIXING MODEL)</span>
              <EvidenceBadge category="derived" customLabel="3-Phase Dielectric Mixing" size="sm" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
              Subsurface Water-Ice Reserves Across 3 Exploration Scenarios
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Inverting effective dielectric permittivity (ε_eff) into volumetric ice fraction (f_ice) and bulk water-ice mass.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ background: 'var(--bg-card-alt)', padding: '8px 14px', borderRadius: 6, border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Nominal Ice Reserves</div>
              <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>52.55 Mt</div>
            </div>
            <div style={{ background: 'var(--bg-card-alt)', padding: '8px 14px', borderRadius: 6, border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cabeus B Share</div>
              <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>20.35 Mt</div>
            </div>
          </div>
        </div>

        {/* Scenarios Table */}
        <div className="data-table-container" style={{ marginBottom: 16 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Scenario Designation</th>
                <th>Modelled Depth</th>
                <th>Regolith Porosity (φ)</th>
                <th>Ice Volume (Mm³)</th>
                <th>Ice Mass (Million Metric Tonnes)</th>
                <th>Physical Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {scenariosData.map((scen, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700, color: idx === 1 ? '#38bdf8' : '#ffffff' }}>
                    {scen.Scenario}
                  </td>
                  <td className="mono">{scen.Depth_m} m</td>
                  <td className="mono">{scen.Porosity}</td>
                  <td className="mono" style={{ color: 'var(--accent-sky)' }}>{scen.Ice_Volume_Mm3} Mm³</td>
                  <td className="mono" style={{ fontWeight: 700, color: idx === 1 ? '#34d399' : '#fff' }}>
                    {scen.Ice_Mass_Million_Mt} Million Mt
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {scen.Physical_Interpretation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Crater-by-Crater Breakdown Table */}
        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: 10 }}>
            Nominal Ice Tonnage Breakdown by Primary Polar Crater:
          </h4>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Crater Name</th>
                  <th>Core Ice Area (km²)</th>
                  <th>Modelled Depth (m)</th>
                  <th>Mean Ice Fraction (f_ice)</th>
                  <th>Ice Volume (Mm³)</th>
                  <th>Ice Mass (Million Metric Tonnes)</th>
                  <th>Exploration Priority</th>
                </tr>
              </thead>
              <tbody>
                {craterVolumeData.map((c, idx) => {
                  const isCabeusB = c.Crater_name?.includes('Cabeus B');
                  return (
                    <tr key={idx} style={{ background: isCabeusB ? 'rgba(2, 132, 199, 0.15)' : 'transparent' }}>
                      <td style={{ fontWeight: 700, color: isCabeusB ? 'var(--accent-sky)' : '#ffffff' }}>
                        {c.Crater_name} {isCabeusB ? '⭐ (Discovery)' : ''}
                      </td>
                      <td className="mono">{parseFloat(c.Ice_Area_km2).toFixed(2)} km²</td>
                      <td className="mono">{c.Nominal_Depth_m} m</td>
                      <td className="mono">{(c.Mean_Ice_Fraction * 100).toFixed(1)}%</td>
                      <td className="mono">{parseFloat(c.Nominal_Volume_Mm3).toFixed(2)} Mm³</td>
                      <td className="mono" style={{ fontWeight: 700, color: isCabeusB ? '#34d399' : '#fff' }}>
                        {parseFloat(c.Nominal_Mass_Million_Mt).toFixed(2)} Mt
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: isCabeusB ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-card-alt)',
                          color: isCabeusB ? '#38bdf8' : 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          {isCabeusB ? 'PRIORITY 1 (NOVEL)' : `Rank #${idx + 1}`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lunar ISRU Plant Balances */}
      <div className="glass-card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="section-tag" style={{ margin: 0 }}>IN-SITU RESOURCE UTILIZATION (ISRU)</span>
              <EvidenceBadge category="derived" customLabel="Chemical-Mechanical Balances" size="sm" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
              ISRU Plant Engineering Architecture &amp; Propellant Sizing
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Dual RASSOR excavation (4,712 kg/sol regolith) feeding thermal sublimation, carbothermal reduction, and SOXE electrolysis.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card-alt)',
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem'
          }}>
            <div style={{ color: 'var(--text-muted)' }}>Annual Bipropellant Yield</div>
            <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>114.05 Metric Tonnes</div>
            <div style={{ fontSize: '0.72rem', color: '#fbbf24' }}>Refuels 3.8 Human Landers/yr</div>
          </div>
        </div>

        {/* Subsystem Balances Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subsystem Stage</th>
                <th>Process Description</th>
                <th>Daily Mass Feedstock</th>
                <th>Operating Power (kWe)</th>
                <th>Product Yield</th>
                <th>Recycle / Tailings Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {isruBalancesData.map((sub, idx) => (
                <tr key={idx}>
                  <td className="mono" style={{ fontWeight: 700, color: 'var(--accent-sky)' }}>
                    {sub.Subsystem}
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>{sub.Process}</td>
                  <td className="mono">{sub.Feedstock}</td>
                  <td className="mono" style={{ color: '#fbbf24' }}>{sub.Power_kWe} kWe</td>
                  <td className="mono" style={{ fontWeight: 700, color: '#34d399' }}>{sub.Product}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{sub.Efficiency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cartographic Synthesis Maps */}
      <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: 14 }}>
        Mission Synthesis Cartographic Maps
      </h3>

      <div className="grid-3" style={{ gap: 20 }}>
        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/maps/phase5/03_mission_synthesis_master_dashboard_map.png',
            'Master Mission Synthesis Cartographic Map',
            'End-to-end mission map linking touchdown plateau LS_38, rover descent corridor, CAND_052 ice reserves, and rim ISRU plant location.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>Master Mission Synthesis Map</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Enlarge
            </span>
          </div>
          <img
            src="/assets/maps/phase5/03_mission_synthesis_master_dashboard_map.png"
            alt="Master Mission Synthesis Map"
            style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Unified map uniting landing ellipse, 4.74 km route, cold trap, and ISRU station.
          </p>
        </div>

        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/maps/phase5/01_isru_plant_architecture_flowchart.png',
            'ISRU Plant Architecture Flowchart',
            'Seven-stage chemical and mechanical process flow from icy regolith excavation to cryogenic rocket propellant storage.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>ISRU Plant Process Flowchart</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Enlarge
            </span>
          </div>
          <img
            src="/assets/maps/phase5/01_isru_plant_architecture_flowchart.png"
            alt="ISRU Plant Flowchart"
            style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Flowchart of thermal sublimation, carbothermal loop, and cryogenic storage.
          </p>
        </div>

        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/maps/phase5/04_propellant_production_and_mission_support_yield.png',
            '10-Year Cumulative Propellant Production & Lander Support',
            'Ten-year cumulative propellant yield curves illustrating cumulative human lander ascent stage refueling.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>10-Year Propellant Yield Curves</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Enlarge
            </span>
          </div>
          <img
            src="/assets/maps/phase5/04_propellant_production_and_mission_support_yield.png"
            alt="Propellant Yield Curves"
            style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Production trajectory refuelling 38 human landers over 10 years of operations.
          </p>
        </div>
      </div>
    </section>
  );
}
