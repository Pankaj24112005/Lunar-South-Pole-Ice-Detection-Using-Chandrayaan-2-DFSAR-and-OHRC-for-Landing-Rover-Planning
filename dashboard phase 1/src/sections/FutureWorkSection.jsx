import React, { useState } from 'react';
import EvidenceBadge from '../components/EvidenceBadge';
import { Rocket, Cpu, ShieldCheck, RefreshCw, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Activity, Terminal, HelpCircle } from 'lucide-react';

const ROADMAP_STAGES = [
  {
    stage: 'Stage 1',
    name: 'Lunar Ice Evidence & Landing-Site Assessment',
    status: 'Current Research Project',
    badge: 'derived',
    objective: 'Process multi-sensor lunar remote sensing data (DFSAR, OHRC, LOLA) to detect ice-bearing cold traps, assess landing safety, and support baseline rover routing.',
    inputs: 'Chandrayaan-2 DFSAR L&S data, LRO LOLA DEM/Slope/PSR, OHRC footprints, Putrevu et al. (2023) reference.',
    output: 'Ranked candidate ice maps, 97 landing site suitability scores, and 47-waypoint Cabeus B traverse route.',
    challenges: 'Unfocused Level-0A telemetry, spatial resolution disparity (20m to 80m), and rock roughness vs ice ambiguities.',
    validation: 'Crater-partitioned cross-validation (Haworth/Shoemaker holdouts) achieving zero data leakage.',
    completed: true
  },
  {
    stage: 'Stage 2',
    name: 'Advanced Rover Traverse Planning',
    status: 'Planned Future Work',
    badge: 'hypothesis',
    objective: 'Develop advanced terrain-aware and dynamic-illumination route planning incorporating real-time obstacle avoidance and dynamic battery gating.',
    inputs: 'Multi-temporal shadow models, sub-meter stereoscopic hazard cameras, high-resolution rock density maps.',
    output: 'Dynamic multi-goal graph planning with automated shadow-recharge pauses and real-time path replanning.',
    challenges: 'Extreme computing constraints on space-grade rad-hardened processors; real-time graph search in changing shadows.',
    validation: 'High-fidelity Gazebo / ROS terramechanics simulation with cryogenic lunar regolith wheel slip models.',
    completed: false
  },
  {
    stage: 'Stage 3',
    name: 'Rover Health Monitoring & Fault Detection',
    status: 'Proposed Research & Development',
    badge: 'hypothesis',
    objective: 'Continuously stream and monitor onboard engineering telemetry across rover mobility, power, thermal, and sensor subsystems to detect abnormal operating conditions.',
    inputs: 'Motor currents, wheel tachometers, battery cell voltages/temperatures, IMU vibrations, computing bus health.',
    output: 'Real-time multi-channel anomaly scoring engine with adaptive statistical thresholds and transient filter.',
    challenges: 'Scarcity of real lunar fault logs; high telemetry noise; false alarm reduction under rough surface impacts.',
    validation: 'Hardware-in-the-loop (HIL) testbed with injected sensor dropouts and motor stall transients.',
    completed: false
  },
  {
    stage: 'Stage 4',
    name: 'Autonomous Fault Diagnosis',
    status: 'Proposed Future Development',
    badge: 'hypothesis',
    objective: 'Isolate affected subsystems, estimate the root cause of anomalous telemetry, determine fault severity, and distinguish confirmed failures from insufficient-data states.',
    inputs: 'Multi-subsystem anomaly flags, causal fault trees, Bayesian belief networks, physics-based degradation models.',
    output: 'Explainable diagnostic reports with uncertainty metrics, severity levels, and candidate fault hypotheses.',
    challenges: 'Distinguishing sensor failures from actual mechanical subsystem damage; reasoning under partial observability.',
    validation: 'Fault injection benchmarks simulating wheel entrapment, thermal radiator coating degradation, and sensor drift.',
    completed: false
  },
  {
    stage: 'Stage 5',
    name: 'Autonomous Troubleshooting & Safe Recovery',
    status: 'Long-Term Research Vision',
    badge: 'hypothesis',
    objective: 'Investigate whether verified rover faults can be resolved through safety-checked, deterministic recovery procedures with safe fallbacks and ground authorization gates.',
    inputs: 'Validated diagnostic hypotheses, pre-certified recovery trees, hardware operating envelopes, safe-state policies.',
    output: 'Verified corrective action execution (e.g., software process restart, sensor bus failover, safe slip wiggle maneuver).',
    challenges: 'Strict verification of actions before execution; zero risk of commanding irreversible hazardous maneuvers.',
    validation: 'Physical robotic testbed execution with formal verification guarantees and automatic safe-hold aborts.',
    completed: false
  },
  {
    stage: 'Stage 6',
    name: 'Integrated Autonomous Lunar Rover Intelligence',
    status: 'Long-Term Proposed System',
    badge: 'hypothesis',
    objective: 'Unify remote-sensing target understanding, landing safety, route navigation, health monitoring, fault diagnosis, and verified recovery into a resilient autonomous explorer.',
    inputs: 'Orbital remote sensing maps + onboard stereoscopic perception + vehicle engineering telemetry cascade.',
    output: 'Resilient autonomous surface agent capable of long-duration cryogenic cold-trap exploration without constant human tethering.',
    challenges: 'Complete end-to-end integration, deep-space latency mitigation (2.5s ground delay), and multi-year survivability.',
    validation: 'Full analog lunar field trials in volcanic/cryogenic terrains (e.g., Ladakh / Svalbard analog missions).',
    completed: false
  }
];

export default function FutureWorkSection() {
  const [selectedStageIdx, setSelectedStageIdx] = useState(0);
  const activeStage = ROADMAP_STAGES[selectedStageIdx];

  return (
    <section id="future-work" style={{ paddingTop: 40, paddingBottom: 80 }}>
      {/* Header Banner */}
      <div className="section-header">
        <span className="section-tag" style={{ color: '#c084fc' }}>
          <Rocket size={14} /> FUTURE RESEARCH &amp; PROJECT EXPANSION
        </span>
        <h2 className="section-title" style={{
          background: 'linear-gradient(90deg, #ffffff 0%, #c084fc 60%, #38bdf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          FUTURE WORK — Toward an Autonomous, Self-Recovering Lunar Rover
        </h2>
        <p className="section-desc">
          Our current lunar South Pole ice-detection and landing-site assessment project serves as the foundation of a comprehensive future research and engineering initiative: 
          transforming orbital remote sensing into resilient, post-touchdown surface autonomy.
        </p>
      </div>

      {/* Vision Statement Box */}
      <div className="glass-card" style={{
        marginBottom: 36,
        borderLeft: '4px solid #a855f7',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span className="mono" style={{ background: '#7e22ce', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700 }}>
            LONG-TERM VISION
          </span>
          <EvidenceBadge category="hypothesis" customLabel="Proposed Research Initiative" size="sm" />
        </div>

        <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: 8 }}>
          From Orbital Ice Detection to Autonomous Surface Resilience
        </h3>

        <p style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.7, maxWidth: 1100 }}>
          While our current project successfully utilizes Chandrayaan-2 DFSAR, OHRC, and LOLA datasets to identify prime landing regions and compute initial traverse routes, 
          our long-term goal is to extend this intelligence directly onto the lunar surface. An advanced lunar rover must not only reach its target cold trap, 
          but also actively protect itself against harsh cryogenic operating conditions by <strong>monitoring its own health</strong>, 
          <strong> identifying operational anomalies</strong>, <strong>diagnosing fault causes</strong>, and executing <strong>safety-verified recovery actions</strong> without waiting for delayed Earth ground intervention.
        </p>
      </div>

      {/* VISUAL SYSTEM ARCHITECTURE DIAGRAM */}
      <div className="glass-card" style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="mono" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700 }}>
                INTERACTIVE FLOW
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Proposed Closed-Loop Autonomy Architecture</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>
              Future Autonomous Rover Intelligence &amp; Self-Recovery Flow
            </h3>
          </div>

          <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#34d399' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#10b981' }} /> Current Pipeline
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#c084fc' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#a855f7' }} /> Proposed Extension
            </span>
          </div>
        </div>

        {/* Responsive Architecture Flowchart (HTML/CSS) */}
        <div style={{
          background: 'var(--bg-card-alt)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10,
          padding: '24px 20px',
          overflowX: 'auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: 1050,
            position: 'relative'
          }}>
            {/* Stage 1: Environment */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                borderRadius: 8,
                padding: '12px 10px',
                margin: '0 auto'
              }}>
                <div className="mono" style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>STAGE 1 (CURRENT)</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>Lunar Environment</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>DFSAR, OHRC, LOLA</div>
              </div>
            </div>

            <ArrowRight size={18} style={{ color: 'var(--text-dim)', margin: '0 8px' }} />

            {/* Stage 2: Perception & Planning */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                borderRadius: 8,
                padding: '12px 10px',
                margin: '0 auto'
              }}>
                <div className="mono" style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>STAGE 2 (CURRENT)</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>Landing &amp; Traverse</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>FCM LS_38 &amp; DIC3D-A*</div>
              </div>
            </div>

            <ArrowRight size={18} style={{ color: 'var(--text-dim)', margin: '0 8px' }} />

            {/* Stage 3: Operations & Telemetry */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid #a855f7',
                borderRadius: 8,
                padding: '12px 10px',
                margin: '0 auto'
              }}>
                <div className="mono" style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 700 }}>PROPOSED STAGE 3</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>Health Monitoring</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Telemetry &amp; Anomalies</div>
              </div>
            </div>

            <ArrowRight size={18} style={{ color: 'var(--text-dim)', margin: '0 8px' }} />

            {/* Stage 4: Diagnosis */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid #a855f7',
                borderRadius: 8,
                padding: '12px 10px',
                margin: '0 auto'
              }}>
                <div className="mono" style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 700 }}>PROPOSED STAGE 4</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>Fault Diagnosis</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Severity &amp; Root Cause</div>
              </div>
            </div>

            <ArrowRight size={18} style={{ color: 'var(--text-dim)', margin: '0 8px' }} />

            {/* Stage 5: Recovery Decision */}
            <div style={{ flex: 1.2, textAlign: 'center' }}>
              <div style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid #f59e0b',
                borderRadius: 8,
                padding: '12px 10px',
                margin: '0 auto'
              }}>
                <div className="mono" style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 700 }}>PROPOSED STAGE 5</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>Safety-Checked Action</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Deterministic Recovery Rules</div>
              </div>
            </div>

            <ArrowRight size={18} style={{ color: 'var(--text-dim)', margin: '0 8px' }} />

            {/* Stage 6: Fallback or Continue */}
            <div style={{ flex: 1.1, textAlign: 'center' }}>
              <div style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid #38bdf8',
                borderRadius: 8,
                padding: '12px 10px',
                margin: '0 auto'
              }}>
                <div className="mono" style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700 }}>OUTCOME GATE</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>Verify &amp; Continue</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Replan / Safe Hold / Ground</div>
              </div>
            </div>
          </div>

          {/* Feedback loop annotation */}
          <div style={{
            marginTop: 18,
            paddingTop: 12,
            borderTop: '1px dashed var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            <span>↺ <strong>Autonomous Feedback Loop:</strong> Verified recovery triggers traverse replanning; failed verification immediately initiates safe-hold mode.</span>
            <span style={{ color: '#fbbf24' }}>Critical Safety: Irreversible or hazardous actions require ground confirmation</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE ROADMAP TIMELINE (STAGES 1 - 6) */}
      <div className="glass-card" style={{ marginBottom: 36 }}>
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: 4 }}>
            Six-Stage Evolution Roadmap
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Select any roadmap stage to view its research scope, proposed inputs, outputs, challenges, and validation needs.
          </p>
        </div>

        {/* Stage Timeline Navigation Tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 20 }}>
          {ROADMAP_STAGES.map((stg, idx) => {
            const isSelected = selectedStageIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedStageIdx(idx)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%)' : 'var(--bg-card-alt)',
                  border: isSelected ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  minWidth: 150,
                  whiteSpace: 'nowrap'
                }}
              >
                <div className="mono" style={{ fontSize: '0.7rem', color: stg.completed ? '#34d399' : '#c084fc', fontWeight: 700 }}>
                  {stg.stage} {stg.completed ? '✓' : ''}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: 2 }}>{stg.name}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Card */}
        <div style={{
          background: 'var(--bg-card-alt)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10,
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            <div>
              <span className="mono" style={{ fontSize: '0.78rem', color: activeStage.completed ? '#34d399' : '#c084fc', fontWeight: 700 }}>
                {activeStage.stage.toUpperCase()} — {activeStage.status}
              </span>
              <h4 style={{ fontSize: '1.35rem', color: '#ffffff', marginTop: 4 }}>{activeStage.name}</h4>
            </div>
            <EvidenceBadge category={activeStage.badge} customLabel={activeStage.status} />
          </div>

          <div className="grid-2" style={{ gap: 20 }}>
            <div>
              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Objective:</span>
                <p style={{ fontSize: '0.88rem', color: '#e2e8f0', marginTop: 2, lineHeight: 1.5 }}>{activeStage.objective}</p>
              </div>

              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Potential Telemetry &amp; Sensor Inputs:</span>
                <p className="mono" style={{ fontSize: '0.82rem', color: 'var(--accent-sky)', marginTop: 2 }}>{activeStage.inputs}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Expected Research Output:</span>
                <p style={{ fontSize: '0.84rem', color: '#ffffff', marginTop: 2 }}>{activeStage.output}</p>
              </div>
            </div>

            <div>
              <div style={{ marginBottom: 14, background: 'rgba(245, 158, 11, 0.08)', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={14} /> Key Technical Challenges:
                </span>
                <p style={{ fontSize: '0.82rem', color: '#fed7aa', marginTop: 4, lineHeight: 1.5 }}>{activeStage.challenges}</p>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} /> Validation Needed:
                </span>
                <p style={{ fontSize: '0.82rem', color: '#a7f3d0', marginTop: 4, lineHeight: 1.5 }}>{activeStage.validation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subsection: What Must Be Solved Next */}
      <div className="glass-card" style={{ marginBottom: 36 }}>
        <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: 12 }}>
          What Must Be Solved Next: Core Engineering Challenges
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: 18 }}>
          Reliable autonomous troubleshooting requires substantially more than software dashboards or machine-learning models. 
          It demands a formal, safety-certifiable architecture addressing severe space constraints:
        </p>

        <div className="grid-3" style={{ gap: 16 }}>
          <div style={{ background: 'var(--bg-card-alt)', padding: 16, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-sky)', marginBottom: 6 }}>Telemetry &amp; Fault Data Scarcity</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Space-grade flight logs are sparse and highly proprietary. Ground testbeds and high-fidelity physics simulators are essential to synthesize realistic fault catalogs.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card-alt)', padding: 16, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#fbbf24', marginBottom: 6 }}>Cryogenic Thermal &amp; Rad Shock</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Descent into permanently shadowed craters exposes computing elements to temperatures &lt; 40 K and secondary cosmic rays, requiring radiation-hardened voting logic.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card-alt)', padding: 16, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#34d399', marginBottom: 6 }}>Deterministic Safety Fallback</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              No autonomous agent should execute irreversible physical actions. If verification of recovery fails, the rover must transition into a predefined low-power safe hold.
            </p>
          </div>
        </div>
      </div>

      {/* Closing Vision Statement & Attributions */}
      <div style={{
        textAlign: 'center',
        padding: '36px 24px',
        background: 'linear-gradient(180deg, var(--bg-card) 0%, #07090e 100%)',
        borderRadius: 14,
        border: '1px solid var(--border-subtle)'
      }}>
        <p style={{
          fontSize: '1.15rem',
          color: '#ffffff',
          fontStyle: 'italic',
          maxWidth: 900,
          margin: '0 auto 20px auto',
          lineHeight: 1.7
        }}>
          “Our long-term vision is to move beyond identifying promising lunar exploration regions toward developing a more resilient autonomous rover: 
          one that can understand its environment, plan its movement, monitor its own health, diagnose selected faults, and perform verified recovery actions when safe and feasible.”
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', background: 'var(--bg-card-alt)', borderRadius: 9999, border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontWeight: 800, color: '#ffffff' }}>TEAM SHAURYAM</span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: 'var(--accent-sky)', fontSize: '0.82rem' }}>Chandrayaan-2 Lunar South Pole Mission Architecture</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 10 }}>
          This future-work roadmap represents conceptual research directions and proposed systems engineering extensions.
        </p>
      </div>
    </section>
  );
}
