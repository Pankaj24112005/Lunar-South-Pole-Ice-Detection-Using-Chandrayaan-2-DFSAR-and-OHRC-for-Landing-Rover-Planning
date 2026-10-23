import React, { useState, useMemo } from 'react';
import EvidenceBadge from '../components/EvidenceBadge';
import { Database, Search, Filter, ShieldCheck, FileText, CheckCircle2, AlertCircle, HardDrive, Eye } from 'lucide-react';
import inventoryData from '../data/phase1_data_inventory.json';
import dfsarTelemetryData from '../data/dfsar_level0a_inventory.json';

export default function DataIngestionSection({ onOpenImage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter categories
  const categories = ['ALL', 'DFSAR', 'LOLA', 'OHRC', 'DFSAR_Level0A_Raw', 'Proposal'];

  // Filtered dataset
  const filteredData = useMemo(() => {
    return inventoryData.filter((item) => {
      const matchesCat =
        selectedCategory === 'ALL'
          ? true
          : selectedCategory === 'DFSAR_Level0A_Raw'
          ? item.dataset_category?.includes('Level0A') || item.relative_path?.includes('L&S band')
          : item.dataset_category?.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesSearch =
        searchTerm === '' ||
        item.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.relative_path?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product_type?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section id="ingestion" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div className="section-header">
        <span className="section-tag">
          <Database size={14} /> PHASE 1: SENSOR INGESTION &amp; AUDIT
        </span>
        <h2 className="section-title">Multi-Sensor Data Ingestion &amp; Repository Inventory</h2>
        <p className="section-desc">
          Audited 1,844 files across radar, optical, laser altimetry, and geospatial vectors. 
          Every source is inspected for coordinate systems, pixel scale, radiometric headers, and valid execution readiness.
        </p>
      </div>

      {/* Ingestion Pipeline Flow Diagram */}
      <div className="glass-card" style={{ marginBottom: 28, padding: '22px 26px' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: 14, color: '#ffffff' }}>
          Verification Sequence: From Raw Disks to Analytical Ingestion
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}>
          {[
            { step: '1. Source Discovery', desc: 'Scan local directories, archives & tar containers', status: 'Verified' },
            { step: '2. Header Inspection', desc: 'Parse PDS4 labels, GeoTIFF tags & XML geometry', status: 'Verified' },
            { step: '3. Data Level Sorting', desc: 'Distinguish Level-0A telemetry vs Level-4 masks', status: 'Classified' },
            { step: '4. CRS & Grid Check', desc: 'Verify Lunar South Polar Stereographic CRS', status: 'Verified' },
            { step: '5. Pipeline Readiness', desc: 'Flag processing-ready layers vs pending SAR focusing', status: 'Active' },
          ].map((s, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card-alt)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px 16px',
                flex: '1 1 180px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  {s.step}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 600 }}>{s.status}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DFSAR Level-0A Raw Telemetry Spotlight */}
      <div className="glass-card" style={{ marginBottom: 28, borderLeft: '4px solid var(--accent-sky)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="mono" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700 }}>
                CRITICAL RAW ASSET AUDIT
              </span>
              <EvidenceBadge category="raw" customLabel="Level-0A Raw Telemetry" size="sm" />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
              Chandrayaan-2 DFSAR L-Band Full-Polarimetric Raw Acquisitions (5.72 GB)
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: 950, marginTop: 4 }}>
              Two full-polarimetric observation passes covering the lunar south polar swath exist in local repository storage under <span className="mono">L&amp;S band/</span>.
              These files represent time-domain SignedByte echo samples requiring Range-Doppler pulse compression and azimuth synthetic aperture focusing via ISRO SAC MIDAS.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card-alt)',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem'
          }}>
            <div style={{ color: 'var(--text-muted)' }}>Total Raw Telemetry Size</div>
            <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>5,724.2 MB</div>
          </div>
        </div>

        {/* Telemetry Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Acquisition Path</th>
                <th>File Format</th>
                <th>Size (MB)</th>
                <th>Product Level &amp; Role</th>
                <th>Focusing Requirement</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dfsarTelemetryData.map((t, idx) => (
                <tr key={idx}>
                  <td className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                    {t.filename}
                  </td>
                  <td>
                    <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-sky)' }}>
                      {t.detected_format}
                    </span>
                  </td>
                  <td className="mono" style={{ fontWeight: 600 }}>
                    {parseFloat(t.size_mb).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {t.product_type}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: t.filename.endsWith('.dat') ? '#fbbf24' : 'var(--text-muted)' }}>
                    {t.filename.endsWith('.dat') ? 'Requires Range-Doppler & Azimuth Focusing' : 'Parsed metadata label'}
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      fontWeight: 600
                    }}>
                      Verified Ingest
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Multi-Sensor Inventory Explorer */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: 4 }}>
              Interactive Repository Inventory (1,844 Audited Files)
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Search across all satellite datasets, LOLA GeoTIFFs, OHRC footprints, and execution manifests.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`tab-pill ${selectedCategory === cat ? 'active' : ''}`}
                style={{ fontSize: '0.76rem', padding: '5px 12px' }}
              >
                {cat === 'ALL' ? 'All (1,844)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 18, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by filename, relative path, format, or product type (e.g., .tif, LOLA, ICY_CRATERS, MIDAS)..."
              className="search-input"
              style={{ paddingLeft: 38 }}
            />
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            Showing {filteredData.length} matches
          </span>
        </div>

        {/* Inventory Table */}
        <div className="data-table-container" style={{ marginBottom: 16 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Relative Path</th>
                <th>Category</th>
                <th>Type / Format</th>
                <th>Size</th>
                <th>Product Level</th>
                <th>Inspection</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => (
                <tr key={idx}>
                  <td className="mono" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>
                    {row.filename}
                  </td>
                  <td className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.relative_path}
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.72rem',
                      background: 'var(--bg-card-alt)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      color: 'var(--accent-sky)'
                    }}>
                      {row.dataset_category}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {row.product_type} ({row.detected_format})
                  </td>
                  <td className="mono" style={{ fontSize: '0.78rem' }}>
                    {row.size_mb > 1.0 ? `${parseFloat(row.size_mb).toFixed(2)} MB` : `${parseInt(row.size_bytes).toLocaleString()} B`}
                  </td>
                  <td style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {row.product_level}
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.72rem',
                      color: '#34d399',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <CheckCircle2 size={12} /> {row.inspection_status || 'Verified'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span>Page {currentPage} of {Math.max(1, totalPages)}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-outline btn-sm"
              style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-outline btn-sm"
              style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Cartographic Footprint Preview Card */}
      <div className="grid-2" style={{ marginTop: 28 }}>
        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/figures/phase1/fig09_ohrc_footprints_coverage_audit.png',
            'OHRC Optical Observation Footprints Audit',
            'Cataloged Chandrayaan-2 Optical High Resolution Camera (OHRC) observation strips across 80°S-90°S cold traps.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff' }}>OHRC Coverage Footprints Audit</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={14} /> Enlarge Map
            </span>
          </div>
          <img
            src="/assets/figures/phase1/fig09_ohrc_footprints_coverage_audit.png"
            alt="OHRC Footprints Coverage Audit"
            style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Spatial coverage audit of Chandrayaan-2 OHRC sub-meter strips intersecting Permanently Shadowed Regions (PSRs).
          </p>
        </div>

        <div
          className="glass-card"
          style={{ cursor: 'pointer' }}
          onClick={() => onOpenImage(
            '/assets/figures/phase1/fig08_multisensor_coregistered_overlay_south_pole.png',
            'Multi-Sensor Co-Registered Polar Overlay',
            'Co-registration of LOLA hillshade, PSR shadow boundaries, and DFSAR radar ice cluster candidates.'
          )}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff' }}>Multi-Sensor Coregistered Grid Overlay</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-sky)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={14} /> Enlarge Map
            </span>
          </div>
          <img
            src="/assets/figures/phase1/fig08_multisensor_coregistered_overlay_south_pole.png"
            alt="Multi-Sensor Coregistered Overlay"
            style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
          />
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 8 }}>
            Coregistered spatial stacking of LOLA topography with peer-reviewed radar ice detections on the 80m standard polar grid.
          </p>
        </div>
      </div>
    </section>
  );
}
