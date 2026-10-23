import React from 'react';
import EvidenceBadge from './EvidenceBadge';

export default function MetricCard({
  title,
  value,
  unit,
  description,
  badgeCategory = 'derived',
  badgeLabel,
  provenance,
  highlight = false,
  icon: Icon
}) {
  return (
    <div className={`glass-card ${highlight ? 'highlight' : ''}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 8 }}>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)'
          }}>
            {title}
          </span>
          {Icon && <Icon size={18} style={{ color: highlight ? 'var(--accent-sky)' : 'var(--text-dim)' }} />}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
          <span style={{
            fontSize: '2.1rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-mono)',
            color: highlight ? '#ffffff' : 'var(--accent-sky)',
            lineHeight: 1
          }}>
            {value}
          </span>
          {unit && (
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {unit}
            </span>
          )}
        </div>

        {description && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
            {description}
          </p>
        )}
      </div>

      <div style={{
        paddingTop: 12,
        borderTop: '1px solid rgba(30, 41, 59, 0.7)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6
      }}>
        <EvidenceBadge category={badgeCategory} customLabel={badgeLabel} size="sm" />
        {provenance && (
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'nowrap'
          }}>
            Src: {provenance}
          </span>
        )}
      </div>
    </div>
  );
}
