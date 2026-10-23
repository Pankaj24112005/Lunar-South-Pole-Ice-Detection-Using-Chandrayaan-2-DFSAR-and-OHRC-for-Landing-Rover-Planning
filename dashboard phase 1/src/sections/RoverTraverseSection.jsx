import React, { useState } from 'react';
import EvidenceBadge from '../components/EvidenceBadge';
import { Navigation, Play, Pause, RotateCcw, Maximize2, Minimize2, Eye, ShieldCheck, Battery, Zap, AlertTriangle, Compass } from 'lucide-react';
import waypointsData from '../data/rover_traverse_waypoints_cabeus_b.json';

export default function RoverTraverseSection({ onOpenImage }) {
  const [selectedAnim, setSelectedAnim] = useState('mission'); // 'mission' or 'perspective'
  const [selectedWaypointIndex, setSelectedWaypointIndex] = useState(0);
  const [is3DFullscreen, setIs3DFullscreen] = useState(false);

  const activeWaypoint = waypointsData[selectedWaypointIndex] || waypointsData[0];

  const handleReset3D = () => {
    const iframe = document.getElementById('plotly-3d-iframe');
    if (iframe) {
      iframe.src = iframe.src; // Reloads iframe to reset camera position
    }
  };

  return (
    <section id="rover-planning" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div className="section-header">
        <span className="section-tag">
          <Navigation size={14} /> PHASE 4: AUTONOMOUS ROVER NAVIGATION &amp; 3D SIMULATION
        </span>
        <h2 className="section-title">Autonomous Rover Path Planning &amp; Real 3D Lunar Mesh</h2>
        <p className="section-desc">
          Preserving and executing the project’s real Plotly 3D interactive lunar mesh model and high-resolution mission animations. 
          The DIC3D-A* algorithm charts a 4.74 km traversable corridor from touchdown (LS_38) down to candidate deposit CAND_052.
        </p>
      </div>

      {/* Trajectory Specifications Spotlight */}
      <div className="grid-4" style={{ marginBottom: 24, gap: 14 }}>
        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Traverse Corridor</div>
          <div className="mono" style={{ fontSize: '1.7rem', fontWeight: 800, color: '#38bdf8' }}>4.74 km</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>47 discrete waypoints (WP_000 to WP_046)</div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Mean Slope Angle</div>
          <div className="mono" style={{ fontSize: '1.7rem', fontWeight: 800, color: '#34d399' }}>3.41°</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Peak slope: 11.66° (&lt; 15.0° rollover limit)</div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Wheel Slip Safety</div>
          <div className="mono" style={{ fontSize: '1.7rem', fontWeight: 800, color: '#34d399' }}>11.7% max</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Average slip: 3.2% (Bekker-Wong model)</div>
        </div>

        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Descent Profile</div>
          <div className="mono" style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fbbf24' }}>-438.5 m</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>From -1,320.2 m (rim) to -1,758.7 m (floor)</div>
        </div>
      </div>

      {/* REAL 3D HTML MODEL INTEGRATION */}
      <div className="glass-card" style={{ marginBottom: 32, padding: is3DFullscreen ? '16px' : '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="mono" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700 }}>
                INTERACTIVE 3D LUNAR MESH
              </span>
              <EvidenceBadge category="derived" customLabel="Plotly WebGL Elevation Surface" size="sm" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginTop: 4 }}>
              Cabeus B 3D Topography &amp; Autonomous Traverse Trajectory
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Embedded from <span className="mono">output_from_masterplan/3d_animation/cabeus_b_3d_interactive_model.html</span>. Click and drag to rotate in 3D; scroll to zoom.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleReset3D}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              title="Reset 3D camera to default viewpoint"
            >
              <RotateCcw size={14} /> Reset View
            </button>
            <button
              onClick={() => setIs3DFullscreen(!is3DFullscreen)}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {is3DFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              {is3DFullscreen ? 'Exit Fullscreen' : 'Expand 3D View'}
            </button>
          </div>
        </div>

        {/* 3D Model Iframe Container */}
        <div
          style={{
            width: '100%',
            height: is3DFullscreen ? '85vh' : '560px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            background: '#000004',
            position: 'relative'
          }}
        >
          <iframe
            id="plotly-3d-iframe"
            src="/assets/models/cabeus_b_3d_interactive_model.html"
            title="Cabeus B 3D Terrain & Rover Traverse Model"
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
          />
        </div>

        <div style={{
          marginTop: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <span>
            <strong>Controls:</strong> Left-click + drag to rotate • Right-click + drag to pan • Scroll to zoom • Hover waypoints for real-time telemetry.
          </span>
          <span className="mono" style={{ color: 'var(--accent-sky)' }}>
            Surface Grid: 77 × 83 nodes • Elevation range: -1,308 m to -4,345 m
          </span>
        </div>
      </div>

      {/* REAL RESEARCH GIF INTEGRATION */}
      <div className="glass-card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="mono" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700 }}>
                GENUINE PROJECT MISSION ANIMATION
              </span>
              <EvidenceBadge category="derived" customLabel="Kinematic Traverse Animation" size="sm" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginTop: 4 }}>
              Dynamic Rover Mission Animation: Cabeus B Crater Descent
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Source asset: <span className="mono">output_from_masterplan/3d_animation/rover_traverse_cabeus_b_mission_animation.gif</span> (23.11 MB).
            </p>
          </div>

          {/* Toggle between the two real GIFs */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setSelectedAnim('mission')}
              className={`tab-pill ${selectedAnim === 'mission' ? 'active' : ''}`}
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              Mission Camera View
            </button>
            <button
              onClick={() => setSelectedAnim('perspective')}
              className={`tab-pill ${selectedAnim === 'perspective' ? 'active' : ''}`}
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              3D Perspective Angle
            </button>
          </div>
        </div>

        {/* GIF Player with responsive aspect ratio */}
        <div style={{
          width: '100%',
          maxHeight: '520px',
          background: '#070a12',
          borderRadius: '10px',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid var(--border-subtle)',
          position: 'relative'
        }}>
          <img
            src={
              selectedAnim === 'mission'
                ? '/assets/animations/rover_traverse_cabeus_b_mission_animation.gif'
                : '/assets/animations/rover_traverse_3d_perspective_animation.gif'
            }
            alt="Rover Traverse Dynamic Animation"
            style={{
              maxWidth: '100%',
              maxHeight: '520px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>

        <div style={{ marginTop: 14, background: 'var(--bg-card-alt)', padding: '12px 18px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <strong style={{ color: '#ffffff', fontSize: '0.85rem' }}>Scientific Demonstration: </strong>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            This animated simulation demonstrates the autonomous DIC3D-A* rover navigating the 4.74 km descent corridor from touchdown plateau LS_38 (-1,320.2 m) 
            down the terraced southern ramp into permanently shadowed cold-trap CAND_052 (-1,758.7 m). The vehicle maintains 100% solar power along the sunlit rim 
            before gating its ingress into the cryogenic shadow zone, maintaining safe wheel traction (maximum slip 11.7% &lt; 15% limit).
          </span>
        </div>
      </div>

      {/* Interactive Waypoint Telemetry Inspector */}
      <div className="glass-card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>
              47-Waypoint Telemetry Inspector (Cabeus B Descent)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Step through individual waypoints along the 4.74 km traverse route to inspect slope, soil slip, and power reserves.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Select Waypoint:</span>
            <input
              type="range"
              min="0"
              max={waypointsData.length - 1}
              value={selectedWaypointIndex}
              onChange={(e) => setSelectedWaypointIndex(parseInt(e.target.value))}
              style={{ width: '180px', accentColor: 'var(--accent-sky)' }}
            />
            <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-sky)', minWidth: 60 }}>
              {activeWaypoint.Waypoint_ID}
            </span>
          </div>
        </div>

        {/* Selected Waypoint Telemetry Cards */}
        <div className="grid-4" style={{ gap: 14, marginBottom: 18 }}>
          <div style={{ background: 'var(--bg-card-alt)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CUMULATIVE DISTANCE</div>
            <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              {activeWaypoint.Cum_Distance_km} km ({activeWaypoint.Cum_Distance_m} m)
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>From touchdown pad (LS_38)</div>
          </div>

          <div style={{ background: 'var(--bg-card-alt)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SURFACE ELEVATION</div>
            <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24' }}>
              {activeWaypoint.Elevation_m} m
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Local LOLA laser height</div>
          </div>

          <div style={{ background: 'var(--bg-card-alt)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LOCAL SLOPE &amp; SLIP</div>
            <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: activeWaypoint.Slope_deg <= 8 ? '#34d399' : '#fbbf24' }}>
              {activeWaypoint.Slope_deg}° &nbsp;|&nbsp; {activeWaypoint.Wheel_Slip_Pct}% slip
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Bekker-Wong soil mechanics</div>
          </div>

          <div style={{ background: 'var(--bg-card-alt)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>THERMAL &amp; BATTERY</div>
            <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: activeWaypoint.Thermal_Regime.includes('Sunlit') ? '#fbbf24' : '#38bdf8' }}>
              {activeWaypoint.Battery_State_Pct}% SoC
            </div>
            <div style={{ fontSize: '0.72rem', color: activeWaypoint.Thermal_Regime.includes('Sunlit') ? '#fbbf24' : '#38bdf8' }}>
              {activeWaypoint.Thermal_Regime}
            </div>
          </div>
        </div>

        {/* Waypoints Data Table Preview */}
        <div className="data-table-container" style={{ maxHeight: '280px', overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Waypoint</th>
                <th>Distance (km)</th>
                <th>Coordinates (Lat, Lon)</th>
                <th>Elevation (m)</th>
                <th>Slope</th>
                <th>Wheel Slip</th>
                <th>Thermal Regime</th>
                <th>Battery SoC</th>
              </tr>
            </thead>
            <tbody>
              {waypointsData.map((wp, idx) => {
                const isSelected = idx === selectedWaypointIndex;
                return (
                  <tr
                    key={wp.Waypoint_ID}
                    onClick={() => setSelectedWaypointIndex(idx)}
                    style={{ cursor: 'pointer', background: isSelected ? 'rgba(2, 132, 199, 0.25)' : 'transparent' }}
                  >
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--accent-sky)' }}>
                      {wp.Waypoint_ID}
                    </td>
                    <td className="mono">{wp.Cum_Distance_km} km</td>
                    <td className="mono" style={{ fontSize: '0.75rem' }}>{wp.Latitude}°, {wp.Longitude}°</td>
                    <td className="mono">{wp.Elevation_m} m</td>
                    <td className="mono" style={{ color: wp.Slope_deg <= 8 ? '#34d399' : '#fbbf24' }}>{wp.Slope_deg}°</td>
                    <td className="mono">{wp.Wheel_Slip_Pct}%</td>
                    <td style={{ color: wp.Thermal_Regime.includes('Sunlit') ? '#fbbf24' : '#38bdf8', fontSize: '0.78rem' }}>
                      {wp.Thermal_Regime}
                    </td>
                    <td className="mono">{wp.Battery_State_Pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cartographic Traverse Profiles Gallery */}
      <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: 14 }}>
        Publication Navigation Maps &amp; Telemetry Profiles
      </h3>

      <div className="grid-3" style={{ gap: 20 }}>
        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/maps/phase4/01_rover_traverse_path_cabeus_b_map.png',
            'Cabeus B 47-Waypoint Autonomous Rover Traverse Map',
            'Full 4.74 km traverse path superimposed on LOLA slope contours and permanently shadowed cold-trap boundary.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>Cabeus B Traverse Map</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Enlarge
            </span>
          </div>
          <img
            src="/assets/maps/phase4/01_rover_traverse_path_cabeus_b_map.png"
            alt="Cabeus B Traverse Map"
            style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Cartographic route map of the 47-waypoint descent from LS_38 to CAND_052.
          </p>
        </div>

        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/maps/phase4/02_rover_traverse_elevation_slope_profile.png',
            'Rover Traverse Multi-Panel Telemetry Profile',
            'Four-panel telemetric breakdown: elevation descent, slope variations, wheel slip percentage, and battery charge.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>Telemetry Elevation &amp; Slope Profile</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Enlarge
            </span>
          </div>
          <img
            src="/assets/maps/phase4/02_rover_traverse_elevation_slope_profile.png"
            alt="Telemetry Elevation Profile"
            style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Continuous cross-sectional profiles of elevation, slope, slip, and battery SoC.
          </p>
        </div>

        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/maps/phase4/03_rover_traverse_haworth_benchmark_map.png',
            'Haworth Crater Benchmark Rover Traverse Map',
            '55-waypoint comparative traverse down Haworth crater rim demonstrating steeper wall descent challenges.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>Haworth Benchmark Traverse</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Enlarge
            </span>
          </div>
          <img
            src="/assets/maps/phase4/03_rover_traverse_haworth_benchmark_map.png"
            alt="Haworth Benchmark Traverse"
            style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Comparative Haworth traverse showing steeper wall gradients (&gt; 14°).
          </p>
        </div>
      </div>
    </section>
  );
}
