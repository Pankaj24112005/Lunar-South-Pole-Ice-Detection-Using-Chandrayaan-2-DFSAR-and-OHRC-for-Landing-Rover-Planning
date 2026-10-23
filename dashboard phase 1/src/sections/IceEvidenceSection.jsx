import React, { useState } from 'react';
import EvidenceBadge from '../components/EvidenceBadge';
import { Radio, AlertTriangle, ShieldCheck, CheckCircle2, Eye, Info, Sparkles, Layers } from 'lucide-react';
import tierData from '../data/confidence_tier_summary.json';
import craterIceData from '../data/crater_ice_inventory.json';

export default function IceEvidenceSection({ onOpenImage }) {
  const [selectedCrater, setSelectedCrater] = useState(null);

  return (
    <section id="radar-ice" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div className="section-header">
        <span className="section-tag">
          <Radio size={14} /> PHASE 2: RADAR POLARIMETRY &amp; ICE CHARACTERIZATION
        </span>
        <h2 className="section-title">Ice-Related Evidence &amp; Polarimetric Analysis</h2>
        <p className="section-desc">
          Separating true subsurface volumetric water-ice scattering from surface rock roughness through rigorous polarimetry, 
          thermal cold-trap constraints, and terrain confidence tiering.
        </p>
      </div>

      {/* CRITICAL SCIENTIFIC INTEGRITY & CPR/DOP STATUS BANNER */}
      <div className="glass-card" style={{
        marginBottom: 32,
        borderLeft: '4px solid var(--accent-gold)',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="mono" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700 }}>
                NON-FABRICATION DISCLOSURE
              </span>
              <EvidenceBadge category="pending" customLabel="New Telemetry: Awaiting SAR Focusing" size="sm" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
              Scientific Status of Radar CPR &amp; DOP Inversion
            </h3>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ background: 'var(--bg-card)', padding: '8px 14px', borderRadius: 6, border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>New Acquisitions CPR</div>
              <div className="mono" style={{ fontSize: '0.86rem', color: '#fbbf24', fontWeight: 700 }}>Pending SAR Focusing</div>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '8px 14px', borderRadius: 6, border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>New Acquisitions DOP</div>
              <div className="mono" style={{ fontSize: '0.86rem', color: '#fbbf24', fontWeight: 700 }}>Pending SAR Focusing</div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.65, marginBottom: 14 }}>
          <strong>Physical Requirement:</strong> The downloaded L&amp;S-band Chandrayaan-2 DFSAR datasets in <span className="mono">L&amp;S band/</span> are 
          <strong> Level-0A Raw Telemetry products</strong> (uncompressed time-domain SignedByte echo samples). Deriving calibrated Stokes parameters 
          (<span className="mono">S0, S1, S2, S3</span>), Circular Polarization Ratio (CPR), and Degree of Polarization (DOP) requires Range-Doppler pulse compression 
          and synthetic aperture azimuth focusing into Level-1 Single-Look Complex (SLC) matrices via the ISRO SAC MIDAS software suite.
        </p>

        <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.65 }}>
          <strong>Compliance with Non-Fabrication Rule:</strong> In strict accordance with planetary remote-sensing standards, placeholder CPR and DOP rasters 
          were <strong>NOT</strong> fabricated. Instead, peer-reviewed Level-4 polarimetric water-ice detections from Putrevu et al. (2023, SAC/ISRO) serve as 
          the authoritative radar ground truth reference, which directly embodies the team's screening criterion.
        </p>
      </div>

      {/* Team Threshold Criterion & Physical Rationale */}
      <div className="grid-2" style={{ marginBottom: 32, gap: 24 }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              TEAM SHAURYAM SCREENING RULE
            </span>
            <EvidenceBadge category="reference" customLabel="Documented Decision Rule" size="sm" />
          </div>

          <div style={{
            background: 'var(--bg-card-alt)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            padding: '16px',
            marginBottom: 14,
            textAlign: 'center'
          }}>
            <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-sky)', letterSpacing: '0.02em' }}>
              CPR &gt; 1.0 &nbsp;&amp;&nbsp; DOP &lt; 0.13
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Documented in Team Proposal PDF (Page 3, Objective 1)
            </div>
          </div>

          <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: 6 }}>Physical Mechanism: Coherent Backscatter</h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Dry silicate regolith exhibits predominantly single-bounce surface reflection (<span className="mono">CPR ≈ 0.3–0.6, DOP ≈ 0.75–0.95</span>). 
            Pure subsurface water ice inclusions induce the <strong>Coherent Backscatter Opposing Effect (CBOE)</strong>, reversing circular polarization helicity 
            to produce high same-sense returns (<span className="mono">CPR &gt; 1.0</span>) accompanied by severe multiple-scattering depolarization (<span className="mono">DOP &lt; 0.13</span>).
          </p>

          <div style={{ background: 'rgba(2, 132, 199, 0.1)', padding: '10px 14px', borderRadius: 6, border: '1px solid rgba(2, 132, 199, 0.25)', marginTop: 14 }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-sky)', fontWeight: 600 }}>Operational Note:</span>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: 2 }}>
              This criterion is verified as the team's documented rule. It is embodied in the Putrevu et al. (2023) published reference layer and will be applied to the new Level-0A acquisitions once focused.
            </p>
          </div>
        </div>

        {/* Surface Roughness vs Ice Ambiguity */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="mono" style={{ fontSize: '0.74rem', color: '#f87171', fontWeight: 700 }}>
              HAZARD MITIGATION
            </span>
            <EvidenceBadge category="derived" customLabel="Terrain Discrimination" size="sm" />
          </div>

          <h4 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: 8 }}>
            Rejecting False Positives from Rocky Crater Walls
          </h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
            Blocky surface boulders and steep crater slopes also generate multiple corner reflections, yielding <span className="mono">CPR &gt; 1.0</span> without 
            containing water ice. However, rocky terrain retains high degree of polarization (<span className="mono">DOP &gt; 0.35</span>). 
            Furthermore, sunlit slopes exceed lunar ice thermal stability limits (<span className="mono">T &gt; 110 K</span>).
          </p>

          <div style={{ background: 'var(--bg-card-alt)', borderRadius: 8, padding: '12px 16px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>
              Three-Tier Discrimination Strategy:
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: 18, lineHeight: 1.5 }}>
              <li><strong>Tier 3 (High):</strong> Flat crater floor (slope ≤ 10°) inside confirmed PSR.</li>
              <li><strong>Tier 2 (Moderate):</strong> Moderate slope (10°–15°) inside PSR.</li>
              <li><strong>Tier 1 (Candidate):</strong> Steep slope (&gt; 15°) or outside PSR (roughness risk).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confidence Tiers Table & Visual Breakdown */}
      <div className="glass-card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="section-tag" style={{ margin: 0 }}>AUTHORITATIVE CLASSIFICATION</span>
              <EvidenceBadge category="derived" customLabel="Project-Derived Stratification" size="sm" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
              Terrain-Conditioned Ice Confidence Tiers (257.43 km² Total Ice Area)
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Pixel-counted metrics derived directly from <span className="mono">outputs/phase2/metadata/confidence_tier_summary.csv</span>.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card-alt)',
            padding: '8px 14px',
            borderRadius: 6,
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            Pixel size: 80m × 80m (0.0064 km²/pixel)
          </div>
        </div>

        {/* Tiers Table */}
        <div className="data-table-container" style={{ marginBottom: 16 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tier Classification</th>
                <th>Physical Criteria</th>
                <th>Pixel Count</th>
                <th>Area (km²)</th>
                <th>% of Total Ice</th>
                <th>Scientific Confidence</th>
              </tr>
            </thead>
            <tbody>
              {tierData.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700, color: idx === 0 ? '#34d399' : idx === 1 ? '#38bdf8' : '#fbbf24' }}>
                    {row.tier_name}
                  </td>
                  <td className="mono" style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
                    {row.criteria}
                  </td>
                  <td className="mono" style={{ fontWeight: 600 }}>
                    {parseInt(row.pixel_count).toLocaleString()}
                  </td>
                  <td className="mono" style={{ fontWeight: 700, color: '#ffffff' }}>
                    {parseFloat(row.area_km2).toFixed(2)} km²
                  </td>
                  <td className="mono">
                    {parseFloat(row.percent_total).toFixed(2)}%
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: idx === 0 ? 'rgba(16, 185, 129, 0.15)' : idx === 1 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: idx === 0 ? '#34d399' : idx === 1 ? '#38bdf8' : '#fbbf24',
                      fontWeight: 600
                    }}>
                      {idx === 0 ? 'Highest (Safe Core)' : idx === 1 ? 'Moderate (Ramp)' : 'Candidate (Rocky)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Historical unverified figures clarification note */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: '12px 16px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Provenance Clarification on Provisional Figures:</strong> Historical draft notes mentioned provisional tier figures (e.g., Tier 1: 73.84 km², Tier 2: 43.46 km², Tier 3: 43.76 km²). 
          Our audit verified that those figures were uncalibrated preliminary estimates. The authoritative, pixel-counted values verified in the current raster dataset (<span className="mono">confidence_tier_summary.csv</span>) are 
          <strong> 8.95 km² (Tier 3)</strong>, <strong>10.27 km² (Tier 2)</strong>, and <strong>238.22 km² (Tier 1)</strong> totaling <strong>257.43 km²</strong>.
        </div>
      </div>

      {/* Crater-Level Distribution & Publication Maps */}
      <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: 14 }}>
        Crater-Level Polarimetric Maps &amp; Case Studies
      </h3>

      <div className="grid-3" style={{ gap: 20 }}>
        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/figures/phase2/fig205_ice_confidence_tiers_classification.png',
            'Ice Confidence Tiers Classification Map',
            'Cartographic distribution of Tier 3 (green, safe flat PSR), Tier 2 (cyan, moderate slope PSR), and Tier 1 (amber, candidate) across south polar craters.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>Confidence Tiers Map</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Enlarge
            </span>
          </div>
          <img
            src="/assets/figures/phase2/fig205_ice_confidence_tiers_classification.png"
            alt="Ice Confidence Tiers Map"
            style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Three-tier classification mapping flat cold-trap ice vs steep wall roughness.
          </p>
        </div>

        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/figures/phase2/fig206_crater_case_studies_haworth_shoemaker.png',
            'Crater Case Studies: Haworth, Shoemaker & Cabeus B',
            'Multi-sensor comparative profiles across primary lunar exploration targets.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>Crater Case Studies</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Enlarge
            </span>
          </div>
          <img
            src="/assets/figures/phase2/fig206_crater_case_studies_haworth_shoemaker.png"
            alt="Crater Case Studies"
            style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Comparative case study profiles for Haworth, Shoemaker, and Cabeus B.
          </p>
        </div>

        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/figures/phase2/fig203_ice_in_psr_cold_traps_correlation.png',
            'Ice in PSR Cold Traps Correlation',
            'Bivariate correlation proving 100% spatial confinement of high-confidence radar ice pixels inside permanent thermal shadows.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>PSR Correlation Diagnostic</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Enlarge
            </span>
          </div>
          <img
            src="/assets/figures/phase2/fig203_ice_in_psr_cold_traps_correlation.png"
            alt="Ice in PSR Correlation"
            style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Correlation verifying that Tier 3 deposits occur strictly inside permanently shadowed traps.
          </p>
        </div>
      </div>
    </section>
  );
}
