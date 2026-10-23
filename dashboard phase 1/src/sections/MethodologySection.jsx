import React, { useState } from 'react';
import EvidenceBadge from '../components/EvidenceBadge';
import { BookOpen, FileText, ChevronDown, ChevronUp, ExternalLink, ShieldCheck, Check } from 'lucide-react';

const METHOD_ITEMS = [
  {
    title: '1. Radar Radiometric Calibration & Speckle Filtering',
    pdfCite: 'Team Proposal PDF (Page 6, Section 2) & Master Plan Section 5',
    equation: 'σ°_dB = 20 · log10(DN) - k',
    variables: [
      { name: 'DN', desc: 'Digital Number from calibrated SAR intensity product', unit: 'raw count' },
      { name: 'k', desc: 'Instrument calibration constant supplied in DFSAR metadata', unit: 'dB' },
      { name: 'σ°_dB', desc: 'Calibrated radar backscatter coefficient', unit: 'decibels (dB)' }
    ],
    details: 'Applied prior to polarimetric decomposition. Lee refined filter with 5×5 spatial averaging window reduces coherent speckle noise while preserving geological structural boundaries.'
  },
  {
    title: '2. Scattering Matrix & Stokes Vector Representation',
    pdfCite: 'Team Proposal PDF (Page 3, Objective 1)',
    equation: 'S = [[S_HH, S_HV], [S_VH, S_VV]]  →  S1 = σ_HH + σ_VV,  S2 = σ_HH - σ_VV,  S3 = 2·Re[S_HH·S_VV*],  S4 = -2·Im[S_HH·S_VV*]',
    variables: [
      { name: 'S_ij', desc: 'Complex scattering matrix elements (i = transmit, j = receive)', unit: 'complex V/m' },
      { name: 'S1, S2, S3, S4', desc: 'Four real-valued Stokes parameters representing total power and polarization state', unit: 'W/m²' },
      { name: 'C_HHVV', desc: 'Complex covariance between co-polarized channels', unit: 'power' }
    ],
    details: 'Under monostatic reciprocity (S_HV = S_VH), multi-look averaging yields the 3×3 polarimetric covariance matrix from which Stokes vectors are synthesized.'
  },
  {
    title: '3. Circular Polarization Transformation (CPR & DOP)',
    pdfCite: 'Team Proposal PDF (Page 3, Objective 1)',
    equation: 'σ_SC = (σ_HH + σ_VV + 4·σ_HV - 2·Re[S_HH·S_VV*]) / 4 \nσ_OC = (σ_HH + σ_VV + 2·Re[S_HH·S_VV*]) / 4 \nCPR (μ) = σ_SC / σ_OC \nDOP (m) = sqrt(S2² + S3² + S4²) / S1',
    variables: [
      { name: 'σ_SC', desc: 'Same-Sense Circular backscatter power', unit: 'm²/m²' },
      { name: 'σ_OC', desc: 'Opposite-Sense Circular backscatter power', unit: 'm²/m²' },
      { name: 'CPR (μ)', desc: 'Circular Polarization Ratio (primary volumetric ice indicator)', unit: 'unitless ratio' },
      { name: 'DOP (m)', desc: 'Degree of Polarization (measures signal depolarization)', unit: 'unitless [0, 1]' }
    ],
    details: 'Dry lunar regolith surface scatter yields CPR ≈ 0.3–0.6. Subsurface water-ice inclusions induce the Coherent Backscatter Opposing Effect (CBOE), elevating CPR > 1.0 while severely depolarizing the echo (DOP < 0.13).'
  },
  {
    title: '4. Team Screening Rule & Spatial Coherence Boosting',
    pdfCite: 'Team Proposal PDF (Page 3, Objective 1)',
    equation: 'Candidate Pixel: (CPR > 1.0) AND (DOP < 0.13) \nLR = P(CPR, DOP | Ice) / P(CPR, DOP | NonIce) \nIPS_base = LR / (1 + LR) \nIPS_final = IPS_base · (1 + α · log10(A))',
    variables: [
      { name: 'LR', desc: 'Likelihood Ratio modeled via bivariate Gaussian KDE', unit: 'dimensionless' },
      { name: 'IPS', desc: 'Ice Probability Score', unit: '[0, 1]' },
      { name: 'A', desc: 'Cluster area (connected candidate pixel count)', unit: 'pixels' },
      { name: 'α', desc: 'Coherence scaling factor (calibrated as 0.08 in pipeline)', unit: 'constant' }
    ],
    details: 'Candidates with IPS_final ≥ 0.70 are extracted as high-confidence clusters. Single isolated noise pixels are suppressed while contiguous cold-trap deposits are reinforced.'
  },
  {
    title: '5. Fuzzy Cognitive Map (FCM) Landing Site Ranking',
    pdfCite: 'Team Proposal PDF (Page 4, Objective 2)',
    equation: 'A_i^(t+1) = f( Σ_j [ A_j^t · W_ji ] ) \nScore = Σ_j (ω_j · y_j),  where Σ ω_j = 1',
    variables: [
      { name: 'A_i', desc: 'Fuzzy state activation of criterion i at iteration t', unit: '[0, 1]' },
      { name: 'W_ji', desc: 'Cognitive weight matrix encoding relationships between slope, distance, and illumination', unit: 'weights' },
      { name: 'ω_j', desc: 'Criterion weight (Dist: 0.30, Slope: 0.25, Illum: 0.20, Roughness: 0.15, Temp: 0.10)', unit: 'weights' }
    ],
    details: 'Mamdani minimum rule base with Einstein sum aggregation iteratively updates until dynamic equilibrium, ranking safe 1×1 km² landing blocks.'
  },
  {
    title: '6. DIC3D-A* Autonomous Rover Approach & Soil Mechanics',
    pdfCite: 'Team Proposal PDF (Page 5, Objective 3)',
    equation: 'Cost_heuristic = α·Cost_roughness + β·Cost_distance + γ·Cost_slip + δ·Cost_ice \nslip_safe = A · e^(B · θ_l),  slip_unsafe = C · e^(D · φ_r)',
    variables: [
      { name: 'θ_l', desc: 'Longitudinal slope along rover travel vector', unit: 'degrees' },
      { name: 'φ_r', desc: 'Vehicle roll angle across lateral contours', unit: 'degrees' },
      { name: 'A, B, C, D', desc: 'Bekker-Wong soil mechanics constants calibrated for cryogenic lunar simulant', unit: 'empirical' }
    ],
    details: 'Tier 1 global approach plans a 3D spatio-temporal path honoring moving solar illumination. Gate condition at crater rim delays descent until battery reaches 100% SoC.'
  },
  {
    title: '7. Looyenga-Landau-Lifshitz (LLL) Dielectric Inversion',
    pdfCite: 'Team Proposal PDF (Page 6, Objective 4)',
    equation: 'ε_eff^(1/3) = v_reg · ε_reg^(1/3) + v_ice · ε_ice^(1/3) + v_pore · ε_pore^(1/3) \nV_ice = Σ [ pixel_area · depth · f_ice ],  Mass_ice = V_ice · 917 kg/m³',
    variables: [
      { name: 'ε_eff', desc: 'Effective dielectric permittivity retrieved via ANN ensemble from SAR backscatter', unit: 'permittivity' },
      { name: 'ε_reg, ε_ice, ε_pore', desc: 'Constants: regolith = 2.70, pure ice (100 K) = 3.15, pore space = 1.00', unit: 'permittivity' },
      { name: 'v_reg, v_ice, v_pore', desc: 'Volume fractions constrained by porosity: v_reg + v_ice + v_pore = 1.0', unit: 'fractions' },
      { name: 'f_ice', desc: 'Retrieved volumetric ice concentration', unit: 'fraction [0, 1]' }
    ],
    details: 'Evaluated across 3 physical scenarios: Conservative (2m depth, φ = 0.45), Nominal (5m depth, φ = 0.40), and Optimistic (5m depth, φ = 0.35).'
  },
  {
    title: '8. Lunar ISRU Chemical & Thermodynamic Cascade',
    pdfCite: 'Team Proposal PDF (Page 7) & Phase 5 Report',
    equation: 'Sublimation (420 K): Raw Icy Regolith → Dry Tailings + H2O(g) \nCarbothermal: SiO2 + 3C → SiC + 2CO \nMethanation Loop: CO + 3H2 → CH4 + H2O  &  CH4 → C + 2H2 \nElectrolysis (SOXE): 2H2O → 2H2 + O2',
    variables: [
      { name: 'Feedstock', desc: '4,712.2 kg/sol icy regolith (5.81 wt% water ice)', unit: 'kg/day' },
      { name: 'Thermal Power', desc: '420 K heated crucible sublimation yielding 264.4 kg/day raw vapor (96.5% efficiency)', unit: 'kW' },
      { name: 'Bipropellant', desc: 'Cryogenic liquefaction producing 101.38 t/yr LOX + 12.67 t/yr LH2 (8:1 mass ratio)', unit: 'tonnes/year' }
    ],
    details: 'Complete mass and power balance designed to refuel 3.8 human lunar lander ascent stages per year at the Peak of Eternal Light station.'
  }
];

export default function MethodologySection() {
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <section id="methodology" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div className="section-header">
        <span className="section-tag">
          <BookOpen size={14} /> METHODOLOGY, EQUATIONS &amp; PROVENANCE
        </span>
        <h2 className="section-title">Mathematical Formulations &amp; Scientific Citations</h2>
        <p className="section-desc">
          Exact mathematical models, threshold parameters, and physical derivations cited directly from the official 
          <strong> TEAM SHAURYAM Methodology Proposal</strong> (<span className="mono">Team Name TEAM SHAURYAM.pdf</span>) and <strong>Master Plan</strong>.
        </p>
      </div>

      {/* Local Documentation Quick Access Bar */}
      <div className="glass-card" style={{ marginBottom: 28, padding: '18px 24px' }}>
        <h3 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: 10 }}>
          Local Research Documentation &amp; Audit Files:
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-card-alt)', padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)', flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-sky)', fontWeight: 700, fontSize: '0.85rem' }}>
              <FileText size={16} /> source_asset_inventory.md
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Exhaustive inventory of all 1,844 cataloged project files, formats, byte sizes, and browser safety classifications.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card-alt)', padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)', flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.85rem' }}>
              <FileText size={16} /> data_provenance.md
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Strict bidirectional traceability mapping every displayed metric to its originating script, raster, or table.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card-alt)', padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)', flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f87171', fontWeight: 700, fontSize: '0.85rem' }}>
              <FileText size={16} /> scientific_limitations.md
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Transparent disclosure of Level-0A telemetry focusing requirements, OHRC data volume boundaries, and LLL assumptions.
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Mathematical Models Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {METHOD_ITEMS.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '18px 24px',
                borderLeft: isExpanded ? '4px solid var(--accent-sky)' : '1px solid var(--border-subtle)',
                transition: 'all 0.2s ease'
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
              >
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: isExpanded ? 'var(--accent-sky)' : '#ffffff', marginBottom: 4 }}>
                    {item.title}
                  </h3>
                  <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Source Citation: {item.pdfCite}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <EvidenceBadge category="derived" customLabel="Verified Formulation" size="sm" />
                  <button className="btn btn-outline" style={{ padding: '6px 8px', borderRadius: '50%' }}>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                  {/* Fenced Code / Formula Box */}
                  <div style={{
                    background: '#070a12',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    padding: '14px 18px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.92rem',
                    color: 'var(--accent-sky)',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                    marginBottom: 16
                  }}>
                    {item.equation}
                  </div>

                  {/* Variables table */}
                  <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                    Variables &amp; Parameter Definitions:
                  </h4>
                  <div className="data-table-container" style={{ marginBottom: 14 }}>
                    <table className="data-table" style={{ fontSize: '0.82rem' }}>
                      <thead>
                        <tr>
                          <th>Symbol</th>
                          <th>Definition</th>
                          <th>Unit / Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.variables.map((v, vIdx) => (
                          <tr key={vIdx}>
                            <td className="mono" style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                              {v.name}
                            </td>
                            <td>{v.desc}</td>
                            <td className="mono" style={{ color: 'var(--text-secondary)' }}>{v.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <strong>Scientific Details:</strong> {item.details}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
