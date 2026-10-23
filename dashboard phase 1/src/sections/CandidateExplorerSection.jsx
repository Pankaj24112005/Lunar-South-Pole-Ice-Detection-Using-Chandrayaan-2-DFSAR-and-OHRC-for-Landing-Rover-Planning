import React, { useState, useMemo } from 'react';
import EvidenceBadge from '../components/EvidenceBadge';
import { Orbit, Search, Filter, Eye, Sparkles, CheckCircle2, AlertCircle, ArrowUpDown } from 'lucide-react';
import candidatesData from '../data/ranked_crater_candidates.json';

export default function CandidateExplorerSection({ onOpenImage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCraterFilter, setSelectedCraterFilter] = useState('ALL');
  const [selectedCandidateId, setSelectedCandidateId] = useState('CAND_052'); // Default to our research breakthrough candidate!

  // Distinct craters
  const craters = ['ALL', 'Cabeus B', 'Haworth', 'Shoemaker', 'Faustini', 'South Polar Highlands'];

  // Filtered candidates
  const filteredCandidates = useMemo(() => {
    return candidatesData.filter((c) => {
      const matchesCrater =
        selectedCraterFilter === 'ALL'
          ? true
          : c.Crater_name?.toLowerCase().includes(selectedCraterFilter.toLowerCase());

      const matchesSearch =
        searchTerm === '' ||
        c.Candidate_ID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.Crater_name?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCrater && matchesSearch;
    });
  }, [selectedCraterFilter, searchTerm]);

  // Selected candidate object
  const activeCandidate = candidatesData.find((c) => c.Candidate_ID === selectedCandidateId) || candidatesData[0];

  return (
    <section id="candidates" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div className="section-header">
        <span className="section-tag">
          <Orbit size={14} /> PHASE 2 &amp; MASTER PLAN: CANDIDATE REGION EXPLORER
        </span>
        <h2 className="section-title">Candidate-Region Explorer &amp; Cold-Trap Ranking</h2>
        <p className="section-desc">
          Systematic characterization of 28 discrete polar cold traps combining CPR volumetric scattering, permanent thermal shadow, 
          low floor slope, and high-resolution boulder rejection.
        </p>
      </div>

      {/* Novel Discovery Highlight: CAND_052 */}
      <div className="glass-card" style={{
        marginBottom: 30,
        borderLeft: '4px solid var(--accent-sky)',
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="mono" style={{ background: 'var(--accent-blue)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700 }}>
                PRIMARY RESEARCH DISCOVERY
              </span>
              <EvidenceBadge category="hypothesis" customLabel="Uncataloged Candidate Deposit" size="sm" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
              CAND_052: Southeast Flank of Cabeus B Crater
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.6, marginTop: 4, maxWidth: 980 }}>
              Located at <strong>Lat -87.5390°, Lon -51.4439°</strong> (elevation -1,758.7 m), deposit <strong>CAND_052</strong> exhibits 
              strong volumetric ice scattering (<span className="mono">Median CPR = 1.49, Median DOP = 0.077</span>) inside 100% permanently shadowed cold-trap terrain. 
              Its proximity (2.83 km) to the smooth, sunlit Cabeus B plateau establishes it as the prime target for India's future lunar polar surface exploration.
            </p>
          </div>

          <button
            onClick={() => setSelectedCandidateId('CAND_052')}
            className="btn btn-primary btn-sm"
            style={{ alignSelf: 'center', whiteSpace: 'nowrap' }}
          >
            Inspect CAND_052 in Detail
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Table + Detail Inspector */}
      <div className="grid-2" style={{ gap: 24, marginBottom: 32 }}>
        {/* Left Column: Interactive Table */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Ranked Candidate Cold Traps</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {craters.map((crater) => (
                <button
                  key={crater}
                  onClick={() => setSelectedCraterFilter(crater)}
                  className={`tab-pill ${selectedCraterFilter === crater ? 'active' : ''}`}
                  style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                >
                  {crater === 'ALL' ? 'All (28)' : crater}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by candidate ID or crater..."
              className="search-input"
              style={{ paddingLeft: 36, fontSize: '0.82rem', padding: '8px 12px 8px 36px' }}
            />
          </div>

          {/* Table */}
          <div className="data-table-container" style={{ maxHeight: '480px', overflowY: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Candidate ID</th>
                  <th>Crater Name</th>
                  <th>Area (km²)</th>
                  <th>CPR</th>
                  <th>DOP</th>
                  <th>Score S</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((c) => {
                  const isSelected = c.Candidate_ID === activeCandidate?.Candidate_ID;
                  return (
                    <tr
                      key={c.Candidate_ID}
                      onClick={() => setSelectedCandidateId(c.Candidate_ID)}
                      style={{ cursor: 'pointer', background: isSelected ? 'rgba(2, 132, 199, 0.2)' : 'transparent' }}
                      className={isSelected ? 'selected' : ''}
                    >
                      <td className="mono" style={{ fontWeight: 700, color: c.Final_rank <= 3 ? '#34d399' : '#ffffff' }}>
                        #{c.Final_rank}
                      </td>
                      <td className="mono" style={{ fontWeight: 700, color: 'var(--accent-sky)' }}>
                        {c.Candidate_ID}
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{c.Crater_name}</td>
                      <td className="mono" style={{ fontSize: '0.8rem' }}>{parseFloat(c.Area_km2).toFixed(2)}</td>
                      <td className="mono" style={{ fontSize: '0.8rem', color: '#38bdf8' }}>{parseFloat(c.Median_CPR).toFixed(2)}</td>
                      <td className="mono" style={{ fontSize: '0.8rem', color: '#fbbf24' }}>{parseFloat(c.Median_DOP).toFixed(3)}</td>
                      <td className="mono" style={{ fontWeight: 700, color: '#34d399' }}>{parseFloat(c.Score_S).toFixed(4)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Active Candidate Detail Inspector */}
        <div className="glass-card" style={{ borderTop: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                  {activeCandidate.Candidate_ID}
                </span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)'
                }}>
                  RANK #{activeCandidate.Final_rank}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--accent-sky)', fontWeight: 600 }}>
                {activeCandidate.Crater_name} Cold Trap
              </p>
            </div>

            <EvidenceBadge category="hypothesis" customLabel="Characterized Candidate" size="sm" />
          </div>

          {/* Quick Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            background: 'var(--bg-card-alt)',
            padding: 14,
            borderRadius: 8,
            border: '1px solid var(--border-subtle)',
            marginBottom: 18
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Coordinates</div>
              <div className="mono" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                {parseFloat(activeCandidate.Latitude).toFixed(4)}°, {parseFloat(activeCandidate.Longitude).toFixed(4)}°
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Deposit Area</div>
              <div className="mono" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                {parseFloat(activeCandidate.Area_km2).toFixed(3)} km²
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Final Score S</div>
              <div className="mono" style={{ fontSize: '0.88rem', fontWeight: 800, color: '#34d399' }}>
                {parseFloat(activeCandidate.Score_S).toFixed(4)}
              </div>
            </div>
          </div>

          {/* Detailed Evidence Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(30, 41, 59, 0.6)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Median Circular Polarization Ratio (CPR):</span>
              <span className="mono" style={{ fontWeight: 700, color: activeCandidate.Median_CPR > 1.0 ? '#38bdf8' : '#fff' }}>
                {activeCandidate.Median_CPR} {activeCandidate.Median_CPR > 1.0 ? '(Volumetric Ice Signature)' : ''}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(30, 41, 59, 0.6)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Median Degree of Polarization (DOP):</span>
              <span className="mono" style={{ fontWeight: 700, color: activeCandidate.Median_DOP < 0.13 ? '#34d399' : '#fbbf24' }}>
                {activeCandidate.Median_DOP} {activeCandidate.Median_DOP < 0.13 ? '(Depolarized &lt; 0.13)' : ''}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(30, 41, 59, 0.6)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Permanently Shadowed Region (PSR):</span>
              <span className="mono" style={{ fontWeight: 600, color: '#fff' }}>
                {activeCandidate.PSR_percentage}% coverage ({activeCandidate.DSC_flag === '1' ? 'Doubly Shadowed Pit' : 'Standard Cold Trap'})
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(30, 41, 59, 0.6)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Floor Slope / Trafficability:</span>
              <span className="mono" style={{ fontWeight: 600, color: activeCandidate.Median_slope_deg <= 10 ? '#34d399' : '#fbbf24' }}>
                {activeCandidate.Median_slope_deg}° {activeCandidate.Median_slope_deg <= 10 ? '(Flat floor ≤ 10°)' : '(Ramp slope)'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(30, 41, 59, 0.6)' }}>
              <span style={{ color: 'var(--text-muted)' }}>OHRC Boulder Density Proxy:</span>
              <span className="mono" style={{ fontWeight: 600, color: '#fff' }}>
                {activeCandidate.OHRC_boulder_density} boulders/100m²
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(30, 41, 59, 0.6)' }}>
              <span style={{ color: 'var(--text-muted)' }}>LOLA DEM Elevation Uncertainty:</span>
              <span className="mono" style={{ fontWeight: 600, color: '#fff' }}>
                ±{activeCandidate.DEM_error_m} meters
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Model Ice Probability / Uncertainty:</span>
              <span className="mono" style={{ fontWeight: 700, color: '#38bdf8' }}>
                {(activeCandidate.Model_probability * 100).toFixed(1)}% (±{(activeCandidate.Uncertainty * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Evidence: Random Forest Validation Maps */}
      <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: 14 }}>
        Multi-Sensor Machine Learning Evidence &amp; Model Validation
      </h3>

      <div className="grid-4" style={{ gap: 16 }}>
        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/figures/model_evidence/feature_importance.png',
            'Random Forest Feature Importance Analysis',
            'Relative feature contribution: DFSAR CPR and DOP drive primary separation, followed by LOLA slope and PSR permanence.'
          )}
        >
          <h4 style={{ fontSize: '0.85rem', color: '#ffffff', marginBottom: 6 }}>Feature Importance</h4>
          <img
            src="/assets/figures/model_evidence/feature_importance.png"
            alt="Feature Importance"
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 6 }}>
            DFSAR polarimetric features contribute &gt;55% of predictive power.
          </p>
        </div>

        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/figures/model_evidence/roc_pr_curves.png',
            'Crater-Partitioned ROC and PR Curves',
            'Independent crater validation (Haworth & Shoemaker held out) confirming zero data leakage across spatial boundaries.'
          )}
        >
          <h4 style={{ fontSize: '0.85rem', color: '#ffffff', marginBottom: 6 }}>ROC &amp; PR Curves</h4>
          <img
            src="/assets/figures/model_evidence/roc_pr_curves.png"
            alt="ROC Curves"
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 6 }}>
            Out-of-crater validation confirming high physical generalizability.
          </p>
        </div>

        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/figures/model_evidence/threshold_sensitivity_heatmap.png',
            'Threshold Sensitivity Grid (9-Cell)',
            'Sensitivity analysis across varying CPR thresholds (0.8–1.2) and DOP thresholds (0.13–0.30).'
          )}
        >
          <h4 style={{ fontSize: '0.85rem', color: '#ffffff', marginBottom: 6 }}>Sensitivity Heatmap</h4>
          <img
            src="/assets/figures/model_evidence/threshold_sensitivity_heatmap.png"
            alt="Threshold Sensitivity Heatmap"
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 6 }}>
            86.7% to 100% spatial overlap stability across radar thresholds.
          </p>
        </div>

        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/figures/model_evidence/crater_level_validation.png',
            'Crater-Level Cross Validation',
            'Spatial cross-validation performance across Faustini, Cabeus B, Haworth, and Shoemaker craters.'
          )}
        >
          <h4 style={{ fontSize: '0.85rem', color: '#ffffff', marginBottom: 6 }}>Crater Validation</h4>
          <img
            src="/assets/figures/model_evidence/crater_level_validation.png"
            alt="Crater Level Validation"
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 6 }}>
            Validation confirming stability across distinct polar crater geologies.
          </p>
        </div>
      </div>
    </section>
  );
}
