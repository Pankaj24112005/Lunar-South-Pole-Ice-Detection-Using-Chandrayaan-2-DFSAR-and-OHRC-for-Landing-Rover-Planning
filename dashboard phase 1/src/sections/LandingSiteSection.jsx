import React, { useState, useMemo } from 'react';
import EvidenceBadge from '../components/EvidenceBadge';
import { MapPin, Search, Filter, Eye, CheckCircle2, Shield, Compass, Sun, Mountain } from 'lucide-react';
import landingSitesData from '../data/ranked_landing_sites.json';
import criteriaData from '../data/landing_site_evaluation_criteria.json';

export default function LandingSiteSection({ onOpenImage, onSelectSiteForTraverse }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedSiteId, setSelectedSiteId] = useState('LS_38'); // Default to prime site!

  const filteredSites = useMemo(() => {
    return landingSitesData.filter((site) => {
      const matchesFilter =
        selectedFilter === 'ALL'
          ? true
          : selectedFilter === 'NOVEL'
          ? site.Designation?.includes('Novel')
          : site.Target_Crater?.toLowerCase().includes(selectedFilter.toLowerCase());

      const matchesSearch =
        searchTerm === '' ||
        site.Site_ID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.Site_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.Target_Crater?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, searchTerm]);

  const activeSite = landingSitesData.find((s) => s.Site_ID === selectedSiteId) || landingSitesData[0];

  return (
    <section id="landing-sites" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div className="section-header">
        <span className="section-tag">
          <MapPin size={14} /> PHASE 3: TOUCHDOWN SITE SELECTION &amp; SAFETY ASSESSMENT
        </span>
        <h2 className="section-title">Landing-Site Assessment &amp; Touchdown Suitability</h2>
        <p className="section-desc">
          Evaluating 97 landing candidate cells across the south polar plateau using Fuzzy Cognitive Maps (FCM). 
          Touchdown locations are strictly conditioned on lander tipping limits (slope ≤ 8°), continuous solar illumination, and direct proximity to verified ice.
        </p>
      </div>

      {/* Prime Landing Site Spotlight: LS_38 */}
      <div className="glass-card highlight" style={{ marginBottom: 32, padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="mono" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#fff', padding: '3px 10px', borderRadius: 4, fontSize: '0.74rem', fontWeight: 700 }}>
                PRIME NOVEL TOUCHDOWN SITE (RANK #1)
              </span>
              <EvidenceBadge category="derived" customLabel="FCM Evaluated Selection" size="sm" />
            </div>

            <h3 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: 4 }}>
              LS_38: Cabeus B Sunlit Plateau (LSI Score: 0.8845)
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--accent-sky)', fontWeight: 600, marginBottom: 12 }}>
              Coordinates: Lat -87.3901°, Lon -51.6070° | Elevation: -1,320.2 m
            </p>

            <p style={{ fontSize: '0.9rem', color: '#e2e8f0', maxWidth: 1000, lineHeight: 1.65 }}>
              Discovered on the elevated rim plateau overlooking deposit CAND_052. 
              <strong>LS_38</strong> provides an unprecedented operational combination: a near-horizontal landing surface (slope <strong>2.17°</strong>, well below the 8.0° hazard threshold), 
              <strong> 100% uninterrupted solar illumination</strong> during the operational window, and an immediate standoff distance of exactly <strong>2.83 km</strong> to the water-ice boundary. 
              A natural terraced descent ramp allows an autonomous rover to traverse safely into the cold trap without encountering steep crater cliffs.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card-alt)',
            border: '1px solid var(--accent-sky)',
            borderRadius: '10px',
            padding: '16px 20px',
            textAlign: 'center',
            minWidth: 200
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Touchdown Slope</div>
            <div className="mono" style={{ fontSize: '2.1rem', fontWeight: 800, color: '#34d399' }}>2.17°</div>
            <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 600 }}>≤ 8.0° Safety Limit</div>
          </div>
        </div>

        {/* 4 Key Pillars of LS_38 */}
        <div className="grid-4" style={{ marginTop: 20, gap: 14 }}>
          <div style={{ background: 'rgba(12, 16, 23, 0.7)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-sky)', marginBottom: 4 }}>
              <Mountain size={16} /> <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>SLOPE SAFETY</span>
            </div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>2.17° mean</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Max slope 5.59° (Zero tip risk)</div>
          </div>

          <div style={{ background: 'rgba(12, 16, 23, 0.7)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fbbf24', marginBottom: 4 }}>
              <Sun size={16} /> <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>SOLAR ILLUMINATION</span>
            </div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>100.0%</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Continuous daylight power</div>
          </div>

          <div style={{ background: 'rgba(12, 16, 23, 0.7)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-cyan)', marginBottom: 4 }}>
              <Compass size={16} /> <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>ICE STANDOFF DISTANCE</span>
            </div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>2.83 km</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Target: CAND_052 deposit</div>
          </div>

          <div style={{ background: 'rgba(12, 16, 23, 0.7)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34d399', marginBottom: 4 }}>
              <Shield size={16} /> <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>ROUGHNESS INDEX</span>
            </div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>2.62 m</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>100m RMS height deviation</div>
          </div>
        </div>
      </div>

      {/* FCM Criteria Reference */}
      <div className="glass-card" style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: 12 }}>
          Fuzzy Cognitive Map (FCM) Multi-Criteria Evaluation Model
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
          Site suitability is computed using Kosko's recurrent fuzzy inference across 5 physical criteria documented in Team Proposal PDF (Page 4):
        </p>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Criterion</th>
                <th>Physical Parameter</th>
                <th>Threshold Constraint</th>
                <th>Weight (ω)</th>
                <th>Optimization Direction</th>
                <th>Scientific Rationale</th>
              </tr>
            </thead>
            <tbody>
              {criteriaData.map((crit, idx) => (
                <tr key={idx}>
                  <td className="mono" style={{ fontWeight: 700, color: 'var(--accent-sky)' }}>
                    {crit.Criterion}
                  </td>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>
                    {crit.Parameter}
                  </td>
                  <td className="mono" style={{ color: '#34d399' }}>
                    {crit.Threshold}
                  </td>
                  <td className="mono" style={{ fontWeight: 700 }}>
                    {crit.Weight}
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: crit.Direction === 'Minimize' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: crit.Direction === 'Minimize' ? '#f87171' : '#34d399'
                    }}>
                      {crit.Direction}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {crit.Rationale}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Table of 97 Landing Sites */}
      <div className="glass-card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: 2 }}>
              Ranked Candidate Landing Sites (97 Cells Evaluated)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Click any site to inspect its terrain coordinates and target cold-trap correlation.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['ALL', 'NOVEL', 'Cabeus B', 'de Gerlache', 'Faustini'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`tab-pill ${selectedFilter === f ? 'active' : ''}`}
                style={{ fontSize: '0.74rem', padding: '4px 10px' }}
              >
                {f === 'ALL' ? 'All Sites (97)' : f === 'NOVEL' ? 'Novel Discoveries' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Site ID (e.g., LS_38), crater name, or coordinates..."
            className="search-input"
            style={{ paddingLeft: 36, fontSize: '0.84rem' }}
          />
        </div>

        {/* Table */}
        <div className="data-table-container" style={{ maxHeight: '420px', overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Site ID</th>
                <th>Name / Crater</th>
                <th>Designation</th>
                <th>Coordinates</th>
                <th>Slope</th>
                <th>Ice Dist</th>
                <th>Illum %</th>
                <th>LSI Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredSites.map((site) => {
                const isSelected = site.Site_ID === activeSite.Site_ID;
                const isNovel = site.Designation?.includes('Novel');
                return (
                  <tr
                    key={site.Site_ID}
                    onClick={() => setSelectedSiteId(site.Site_ID)}
                    style={{ cursor: 'pointer', background: isSelected ? 'rgba(2, 132, 199, 0.2)' : 'transparent' }}
                    className={isSelected ? 'selected' : ''}
                  >
                    <td className="mono" style={{ fontWeight: 700, color: site.Final_Rank <= 3 ? '#34d399' : '#fff' }}>
                      #{site.Final_Rank}
                    </td>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--accent-sky)' }}>
                      {site.Site_ID}
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      <strong>{site.Site_Name}</strong> ({site.Target_Crater})
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: isNovel ? 'rgba(56, 189, 248, 0.15)' : 'rgba(148, 163, 184, 0.1)',
                        color: isNovel ? '#38bdf8' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {site.Designation}
                      </span>
                    </td>
                    <td className="mono" style={{ fontSize: '0.78rem' }}>
                      {parseFloat(site.Latitude).toFixed(3)}°, {parseFloat(site.Longitude).toFixed(3)}°
                    </td>
                    <td className="mono" style={{ color: site.Mean_Slope_deg <= 3 ? '#34d399' : '#fbbf24' }}>
                      {site.Mean_Slope_deg}°
                    </td>
                    <td className="mono" style={{ color: site.Dist_to_Ice_km <= 3 ? '#34d399' : '#fff' }}>
                      {site.Dist_to_Ice_km} km
                    </td>
                    <td className="mono" style={{ color: site.Illumination_Availability_Pct >= 80 ? '#fbbf24' : '#fff' }}>
                      {site.Illumination_Availability_Pct}%
                    </td>
                    <td className="mono" style={{ fontWeight: 700, color: '#34d399' }}>
                      {site.LSI_Score}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cartographic Landing Site Maps */}
      <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: 14 }}>
        Cartographic Landing Site Maps &amp; Zooms
      </h3>

      <div className="grid-3" style={{ gap: 20 }}>
        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/maps/phase3/06_zoom_cabeus_b_novel_landing_site.png',
            '35 km Zoom: Novel Landing Site LS_38 on Cabeus B Plateau',
            'High-resolution landing ellipse and slope contours on the gentle sunlit plateau overlooking deposit CAND_052.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>LS_38 Cabeus B Zoom (35 km)</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Enlarge
            </span>
          </div>
          <img
            src="/assets/maps/phase3/06_zoom_cabeus_b_novel_landing_site.png"
            alt="LS_38 Cabeus B Zoom"
            style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Primary novel site LS_38 (slope 2.17°) with direct terraced descent corridor to cold trap.
          </p>
        </div>

        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/maps/phase3/05_top_candidate_landing_sites_map.png',
            'Top Candidate Landing Sites Master Map',
            'Regional polar distribution of all 97 evaluated landing sites color-coded by Landing Site Suitability Index.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>Polar Landing Sites (Regional)</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Enlarge
            </span>
          </div>
          <img
            src="/assets/maps/phase3/05_top_candidate_landing_sites_map.png"
            alt="Polar Landing Sites"
            style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Master distribution of safe landing zones across the 300 km polar domain.
          </p>
        </div>

        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/maps/phase3/08_landing_site_to_target_ice_distance_map.png',
            'Landing Site to Target Ice Distance Map',
            'Dimensioned standoff distance vectors connecting safe touchdown plateaus to target permanently shadowed cold traps.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff' }}>Ice Proximity Distance Vectors</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> Enlarge
            </span>
          </div>
          <img
            src="/assets/maps/phase3/08_landing_site_to_target_ice_distance_map.png"
            alt="Distance Map"
            style={{ width: '100%', height: '210px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Direct distance vectors proving safe touchdown standoff (&lt; 3 km) outside cryogenic traps.
          </p>
        </div>
      </div>
    </section>
  );
}
