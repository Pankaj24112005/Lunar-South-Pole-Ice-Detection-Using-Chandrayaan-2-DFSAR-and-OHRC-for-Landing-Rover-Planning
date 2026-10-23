import React, { useEffect } from 'react';
import { X, ZoomIn, Download, ExternalLink } from 'lucide-react';

export default function ImageViewerModal({ isOpen, onClose, imageSrc, title, caption, badgeCategory, badgeLabel, metadata }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(7, 9, 14, 0.92)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        animation: 'fadeIn 0.2s ease-in-out'
      }}
      onClick={onClose}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto 16px auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: 4 }}>
            {title || 'Scientific Map Inspector'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {caption}
          </p>
        </div>

        <button
          onClick={onClose}
          className="btn btn-outline"
          style={{ padding: '8px 12px', borderRadius: '50%' }}
          title="Close (Esc)"
        >
          <X size={20} />
        </button>
      </div>

      {/* Image container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto',
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageSrc}
          alt={title || 'Enlarged map'}
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
          }}
        />
      </div>

      {/* Footer / Meta info */}
      {metadata && (
        <div
          style={{
            marginTop: '12px',
            maxWidth: '1400px',
            width: '100%',
            margin: '12px auto 0 auto',
            padding: '10px 16px',
            background: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <span>{metadata}</span>
          <span style={{ color: 'var(--text-secondary)' }}>Click background or press ESC to dismiss</span>
        </div>
      )}
    </div>
  );
}
