import React, { useState, useEffect } from 'react';
import { Compass, Satellite, Layers, Radio, MapPin, Navigation, Orbit, Cpu, BookOpen, Rocket, Menu, X } from 'lucide-react';

const SECTIONS = [
  { id: 'overview', label: '1. Overview', icon: Compass },
  { id: 'ingestion', label: '2. Ingestion', icon: Satellite },
  { id: 'preprocessing', label: '3. Preprocessing', icon: Layers },
  { id: 'radar-ice', label: '4. Radar & Ice', icon: Radio },
  { id: 'candidates', label: '5. Candidates', icon: Orbit },
  { id: 'landing-sites', label: '6. Landing Sites', icon: MapPin },
  { id: 'rover-planning', label: '7. Rover & 3D', icon: Navigation },
  { id: 'mission-insights', label: '8. Insights', icon: Cpu },
  { id: 'methodology', label: '9. Methodology', icon: BookOpen },
  { id: 'future-work', label: '10. Future Work', icon: Rocket, highlight: true }
];

export default function Navbar({ activeSection, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        backgroundColor: scrolled ? 'rgba(7, 9, 14, 0.95)' : 'rgba(12, 16, 23, 0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'all 0.3s ease',
        padding: '12px 0'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Brand */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
          onClick={() => handleLinkClick('overview')}
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0c4a6e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)',
            border: '1px solid rgba(56, 189, 248, 0.4)'
          }}>
            <Orbit size={24} style={{ color: '#38bdf8' }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.01em'
              }}>
                TEAM SHAURYAM
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
              Chandrayaan-2 DFSAR + OHRC Lunar South Pole Architecture
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            overflowX: 'auto',
            maxWidth: 'calc(100% - 380px)',
            padding: '4px 0'
          }}
          className="desktop-nav"
        >
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => handleLinkClick(sec.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#ffffff' : sec.highlight ? 'var(--accent-sky)' : 'var(--text-secondary)',
                  backgroundColor: isActive
                    ? 'rgba(2, 132, 199, 0.28)'
                    : sec.highlight
                    ? 'rgba(14, 165, 233, 0.1)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid var(--accent-sky)'
                    : sec.highlight
                    ? '1px solid rgba(56, 189, 248, 0.3)'
                    : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={14} style={{ color: isActive ? 'var(--accent-sky)' : 'currentColor' }} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Badge / Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '5px 10px',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            color: '#34d399',
            fontFamily: 'var(--font-mono)'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            <span>Local Research Build</span>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-outline mobile-menu-btn"
            style={{ padding: '6px 10px', display: 'none' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleLinkClick(sec.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(2, 132, 199, 0.25)' : 'var(--bg-card-alt)',
                  border: isActive ? '1px solid var(--accent-sky)' : '1px solid var(--border-subtle)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--accent-sky)' : 'var(--text-dim)' }} />
                <span style={{ fontWeight: 600 }}>{sec.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
