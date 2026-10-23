import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ImageViewerModal from './components/ImageViewerModal';

import MissionOverviewSection from './sections/MissionOverviewSection';
import DataIngestionSection from './sections/DataIngestionSection';
import PreprocessingSection from './sections/PreprocessingSection';
import IceEvidenceSection from './sections/IceEvidenceSection';
import CandidateExplorerSection from './sections/CandidateExplorerSection';
import LandingSiteSection from './sections/LandingSiteSection';
import RoverTraverseSection from './sections/RoverTraverseSection';
import MissionInsightsSection from './sections/MissionInsightsSection';
import MethodologySection from './sections/MethodologySection';
import FutureWorkSection from './sections/FutureWorkSection';

export default function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [modalState, setModalState] = useState({
    isOpen: false,
    imageSrc: '',
    title: '',
    caption: '',
    metadata: ''
  });

  const handleOpenImage = (imageSrc, title, caption, metadata) => {
    setModalState({
      isOpen: true,
      imageSrc,
      title,
      caption,
      metadata: metadata || 'Chandrayaan-2 DFSAR + NASA LOLA Mission Artifact | Team SHAURYAM'
    });
  };

  const handleCloseImage = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const sectionIds = [
      'overview',
      'ingestion',
      'preprocessing',
      'radar-ice',
      'candidates',
      'landing-sites',
      'rover-planning',
      'mission-insights',
      'methodology',
      'future-work'
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -60% 0px'
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="container" style={{ flex: 1 }}>
        <MissionOverviewSection onNavigate={handleNavigate} onOpenImage={handleOpenImage} />
        <DataIngestionSection onOpenImage={handleOpenImage} />
        <PreprocessingSection onOpenImage={handleOpenImage} />
        <IceEvidenceSection onOpenImage={handleOpenImage} />
        <CandidateExplorerSection onOpenImage={handleOpenImage} />
        <LandingSiteSection onOpenImage={handleOpenImage} onSelectSiteForTraverse={() => handleNavigate('rover-planning')} />
        <RoverTraverseSection onOpenImage={handleOpenImage} />
        <MissionInsightsSection onOpenImage={handleOpenImage} />
        <MethodologySection />
        <FutureWorkSection />
      </main>

      <footer style={{
        backgroundColor: '#05070a',
        borderTop: '1px solid var(--border-subtle)',
        padding: '32px 0 40px 0',
        marginTop: 60
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
              TEAM SHAURYAM | Chandrayaan-2 Lunar South Pole Mission Dashboard
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Detection &amp; Characterization of Subsurface Ice Using DFSAR Radar + OHRC Imagery for Landing Site Selection &amp; Rover Planning.
            </p>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            <div>Mission Architecture • Local Development Build</div>
            <div style={{ marginTop: 2 }}>Folder: <span className="mono">dashboard phase 1/</span></div>
          </div>
        </div>
      </footer>

      {/* High-Resolution Map Inspection Modal */}
      <ImageViewerModal
        isOpen={modalState.isOpen}
        onClose={handleCloseImage}
        imageSrc={modalState.imageSrc}
        title={modalState.title}
        caption={modalState.caption}
        metadata={modalState.metadata}
      />
    </div>
  );
}
