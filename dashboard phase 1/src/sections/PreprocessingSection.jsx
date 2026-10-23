import React, { useState } from 'react';
import EvidenceBadge from '../components/EvidenceBadge';
import { Layers, CheckCircle, ArrowRight, Eye, Sliders, ShieldAlert } from 'lucide-react';

const PIPELINE_STAGES = [
  {
    id: 'crs',
    title: '1. Coordinate Standardization',
    badge: 'derived',
    input: 'NASA LOLA LDEM (80m), LPSR (20m), DFSAR ICY_CRATERS_SP (25m)',
    operation: 'Projected all multi-sensor inputs to Lunar South Polar Stereographic CRS (IAU 2000 Moon, Origin Lat: -90°, Central Meridian: 0°, R = 1,737.4 km).',
    output: 'Coregistered 3,750 × 3,750 analytical raster grid (300 km × 300 km bounding box).',
    params: 'Pixel scale: 80.0 m/pixel fixed; Extent: [-150000, -150000, +150000, +150000] meters.',
    checks: 'Verified zero spatial drift across crater rims; confirmed bounds with LOLA laser ground tracks.',
    limitations: 'High-latitude polar convergence requires polar stereographic projection; equirectangular would cause extreme distortion.'
  },
  {
    id: 'dem',
    title: '2. Topographic & Slope Derivation',
    badge: 'derived',
    input: 'LOLA Elevation Raster (`LDEM_80S_80MPP_ADJ.tiff`)',
    operation: 'Extracted elevations and computed bidirectional slope gradient using Horn’s 3×3 finite difference algorithm.',
    output: '`lola_slope_80m_cropped_core_sp.tif` and `fig03_lola_south_pole_slope.png`.',
    params: 'Kernel: 3×3; Slope formula: arctan(sqrt(dz/dx² + dz/dy²)) in degrees.',
    checks: 'Checked against crater floor benchmarks; verified slope <= 8.0° zones for safe lander criteria.',
    limitations: 'Micro-scale roughness (<80m) smoothed out by pixel resolution; requires sub-meter proxy for boulder detection.'
  },
  {
    id: 'psr',
    title: '3. PSR Cold Trap Alignment',
    badge: 'reference',
    input: 'NASA LOLA Permanently Shadowed Regions 20m (`LPSR_80S_20MPP_ADJ.tiff`)',
    operation: 'Nearest-neighbor categorical spatial resampling from native 20m down to standardized 80m core grid.',
    output: '`lola_psr_80m_aligned_lola.tif` (100% categorical shadow preservation).',
    params: 'Resampling method: `Resampling.nearest` (protects binary 0/1 meaning without interpolation blurring).',
    checks: 'Shadow edge cross-check with 18.6-year solar ephemeris model; confirmed 0% fractional probability artifacts.',
    limitations: 'Sub-pixel micro-cold-traps (<20m) inside boulder shadows are not resolved.'
  },
  {
    id: 'coherence',
    title: '4. Spatial Coherence Boosting',
    badge: 'derived',
    input: 'Peer-reviewed DFSAR radar ice candidate pixel clusters',
    operation: 'Applied connected component labeling and logarithmic cluster area scaling to boost true spatial deposits.',
    output: '`fig12_ice_mask_coherence_filter_comparison.png` and candidate inventory.',
    params: 'Formula: IPS_final = IPS * (1 + α * log10(A)) where α = 0.08, A = cluster size in pixels.',
    checks: 'Eliminated isolated single-pixel radar noise spikes while reinforcing contiguous deposits.',
    limitations: 'Small genuine ice exposures (<3 connected pixels) receive lower confidence scores.'
  },
  {
    id: 'radar-gap',
    title: '5. Level-0A Telemetry Quality Gate',
    badge: 'pending',
    input: 'Newly ingested DFSAR L-band Level-0A raw signal datasets (5.72 GB)',
    operation: 'Bitstream verification, packet decoding, and header extraction via PDS4 XML labels.',
    output: 'Verified telemetry inventory (`dfsar_level0a_inventory.json`).',
    params: 'Format: SignedByte I/Q samples; Azimuth lines: ~125,000; Range bins: 4,096.',
    checks: 'File integrity and checksum verification; identified required SAR focusing toolchain (ISRO SAC MIDAS).',
    limitations: 'Raw time-domain echo telemetry cannot yield calibrated CPR/DOP without Range-Doppler pulse compression.'
  }
];

export default function PreprocessingSection({ onOpenImage }) {
  const [activeStageId, setActiveStageId] = useState('crs');
  const activeStage = PIPELINE_STAGES.find((s) => s.id === activeStageId) || PIPELINE_STAGES[0];

  return (
    <section id="preprocessing" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div className="section-header">
        <span className="section-tag">
          <Layers size={14} /> PHASE 1 &amp; 2: PREPROCESSING &amp; QUALITY CONTROL
        </span>
        <h2 className="section-title">Spatial Coregistration, Topographic Filtering &amp; Coherence</h2>
        <p className="section-desc">
          Rigorous geospatial alignment of multi-sensor datasets on the standardized 80.0 m/pixel Lunar South Polar Stereographic grid, 
          guaranteeing zero spatial offset across radar, optical, and elevation layers.
        </p>
      </div>

      {/* Interactive Pipeline Selector */}
      <div className="glass-card" style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: 14 }}>
          Interactive Preprocessing Pipeline Stages
        </h3>

        {/* Stage selection buttons */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 20 }}>
          {PIPELINE_STAGES.map((stg) => {
            const isActive = stg.id === activeStageId;
            return (
              <button
                key={stg.id}
                onClick={() => setActiveStageId(stg.id)}
                className="btn"
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%)' : 'var(--bg-card-alt)',
                  borderColor: isActive ? 'var(--accent-sky)' : 'var(--border-subtle)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{stg.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Details Card */}
        <div style={{
          background: 'var(--bg-card-alt)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '22px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <h4 style={{ fontSize: '1.2rem', color: '#ffffff' }}>{activeStage.title}</h4>
            <EvidenceBadge category={activeStage.badge} />
          </div>

          <div className="grid-2" style={{ gap: 20 }}>
            <div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Input Dataset:</span>
                <p style={{ fontSize: '0.86rem', color: '#ffffff', marginTop: 2 }}>{activeStage.input}</p>
              </div>

              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Operation Executed:</span>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.5 }}>{activeStage.operation}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Output Artifact:</span>
                <p className="mono" style={{ fontSize: '0.84rem', color: 'var(--accent-sky)', marginTop: 2 }}>{activeStage.output}</p>
              </div>
            </div>

            <div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Parameters &amp; Method:</span>
                <p className="mono" style={{ fontSize: '0.82rem', color: '#e2e8f0', marginTop: 2 }}>{activeStage.params}</p>
              </div>

              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Quality Control Verification:</span>
                <p style={{ fontSize: '0.84rem', color: '#34d399', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={14} /> {activeStage.checks}
                </p>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#f87171', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldAlert size={12} /> Known Limitation:
                </span>
                <p style={{ fontSize: '0.8rem', color: '#fca5a5', marginTop: 2 }}>{activeStage.limitations}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Before and After Visual QC Previews */}
      <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: 16 }}>
        Verified Preprocessing Quality Control Previews
      </h3>

      <div className="grid-3" style={{ gap: 20 }}>
        {/* DEM Filter */}
        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/figures/phase1/fig11_dem_filter_comparison_raw_vs_smooth.png',
            'DEM Filter Comparison: Raw vs Curvature Smoothed',
            'Quality comparison between raw LOLA laser track interpolation and Gaussian curvature-smoothed digital elevation model.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>DEM Smoothing Comparison</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Inspect
            </span>
          </div>
          <img
            src="/assets/figures/phase1/fig11_dem_filter_comparison_raw_vs_smooth.png"
            alt="DEM Filter Comparison"
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Raw LOLA altimeter tracks vs curvature-smoothed DEM preventing stepping artifacts.
          </p>
        </div>

        {/* Coherence Filter */}
        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/figures/phase1/fig12_ice_mask_coherence_filter_comparison.png',
            'Spatial Coherence Boosting Filter Comparison',
            'Application of logarithmic area scaling to suppress isolated pixel noise and reinforce contiguous ice deposits.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>Coherence Boosting Filter</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Inspect
            </span>
          </div>
          <img
            src="/assets/figures/phase1/fig12_ice_mask_coherence_filter_comparison.png"
            alt="Coherence Filter Comparison"
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Comparison showing suppression of single-pixel noise and enhancement of cold-trap clusters.
          </p>
        </div>

        {/* Spatial Overlap Diagnostic */}
        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/figures/phase1/fig13_spatial_overlap_and_enclosure_diagnostic.png',
            'Spatial Overlap & Enclosure Diagnostic',
            'Cross-correlation diagnostic verifying that high-confidence radar ice pixels lie within confirmed thermal cold traps.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>Spatial Enclosure Diagnostic</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Inspect
            </span>
          </div>
          <img
            src="/assets/figures/phase1/fig13_spatial_overlap_and_enclosure_diagnostic.png"
            alt="Spatial Overlap Diagnostic"
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Enclosure diagnostic confirming radar ice alignment inside crater floor thermal traps.
          </p>
        </div>
      </div>
    </section>
  );
}
