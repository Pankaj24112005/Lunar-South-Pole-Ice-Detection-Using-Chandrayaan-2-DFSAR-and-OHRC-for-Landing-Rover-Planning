import React from 'react';

/**
 * Reusable badge for the 4 mandatory scientific evidence categories:
 * 1. Raw Observation
 * 2. Project-Derived Result
 * 3. Published Reference Product
 * 4. Interpretation / Hypothesis
 */
export default function EvidenceBadge({ category, customLabel, size = 'md' }) {
  let badgeClass = 'badge-derived';
  let defaultLabel = 'Project-Derived Result';

  if (!category) {
    category = 'derived';
  }

  const catLower = category.toLowerCase();

  if (catLower.includes('raw') || catLower === 'observation') {
    badgeClass = 'badge-raw';
    defaultLabel = 'Raw Observation';
  } else if (catLower.includes('reference') || catLower.includes('published')) {
    badgeClass = 'badge-reference';
    defaultLabel = 'Published Reference Product';
  } else if (catLower.includes('hypothesis') || catLower.includes('interpretation') || catLower.includes('candidate')) {
    badgeClass = 'badge-hypothesis';
    defaultLabel = 'Interpretation / Hypothesis';
  } else if (catLower.includes('pending') || catLower.includes('blocked') || catLower.includes('unverified')) {
    badgeClass = 'badge-pending';
    defaultLabel = 'Pending / Not Computed';
  } else {
    badgeClass = 'badge-derived';
    defaultLabel = 'Project-Derived Result';
  }

  return (
    <span
      className={`evidence-badge ${badgeClass}`}
      style={{
        fontSize: size === 'sm' ? '0.68rem' : size === 'lg' ? '0.82rem' : '0.74rem',
        padding: size === 'sm' ? '2px 8px' : '4px 10px'
      }}
      title={`Scientific Evidence Classification: ${customLabel || defaultLabel}`}
    >
      <span style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
        display: 'inline-block'
      }} />
      {customLabel || defaultLabel}
    </span>
  );
}
