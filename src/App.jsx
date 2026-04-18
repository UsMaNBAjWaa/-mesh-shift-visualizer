import React, { useEffect, useMemo, useState } from 'react';
import ControlPanel from './components/ControlPanel';
import MeshGrid from './components/MeshGrid';
import ComplexityPanel from './components/ComplexityPanel';
import { buildMovementSummary, computeCircularShift, validateInputs } from './utils/shiftLogic';

const STAGES = ['Before Shift', 'Stage 1 — Row Shift', 'Stage 2 — Column Shift'];

function getInitialConfig() {
  const params = new URLSearchParams(window.location.search);
  const qp = Number(params.get('p') || 16);
  const qq = Number(params.get('q') || 5);
  const qstage = Number(params.get('stage') || 0);
  return {
    p: Number.isFinite(qp) ? qp : 16,
    q: Number.isFinite(qq) ? qq : 5,
    stage: Math.max(0, Math.min(2, Number.isFinite(qstage) ? qstage : 0))
  };
}

export default function App() {
  const initialConfig = getInitialConfig();
  const [p, setP] = useState(initialConfig.p);
  const [q, setQ] = useState(initialConfig.q);
  const [stageIndex, setStageIndex] = useState(initialConfig.stage);
  const [isPlaying, setIsPlaying] = useState(false);

  const error = validateInputs(p, q);

  const result = useMemo(() => {
    try {
      return computeCircularShift(p, q);
    } catch (err) {
      return computeCircularShift(16, 5);
    }
  }, [p, q]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (stageIndex >= STAGES.length - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setStageIndex((prev) => prev + 1);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [isPlaying, stageIndex]);

  useEffect(() => {
    setStageIndex(0);
    setIsPlaying(false);
  }, [p, q]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('p', String(p));
    params.set('q', String(q));
    params.set('stage', String(stageIndex));
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [p, q, stageIndex]);

  const movementSummary = useMemo(
    () => buildMovementSummary(result.initialNodes, result.afterColumnShift),
    [result]
  );

  const handleVisualize = () => {
    if (error) return;
    setStageIndex(0);
    setIsPlaying(true);
    window.setTimeout(() => setStageIndex(1), 400);
  };

  const handleReset = () => {
    setP(16);
    setQ(5);
    setStageIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">Parallel Computing Visual Lab</p>
          <h1>Mesh Circular Shift Visualizer</h1>
          <p className="hero-copy">
            Simulate the circular q-shift permutation on a 2D mesh using a two-stage strategy: row shift first, then column shift.
          </p>
          <p className="deployment-label">Deployment URL: https://your-app-name.vercel.app</p>
        </div>
        <div className="hero-stats">
          <div>
            <span>Current p</span>
            <strong>{result.p}</strong>
          </div>
          <div>
            <span>Current q</span>
            <strong>{result.q}</strong>
          </div>
          <div>
            <span>Current stage</span>
            <strong>{STAGES[stageIndex]}</strong>
          </div>
        </div>
      </header>

      <main className="main-grid">
        <div className="left-column">
          <ControlPanel
            p={p}
            q={q}
            setP={setP}
            setQ={setQ}
            error={error}
            onVisualize={handleVisualize}
            onReset={handleReset}
            currentStage={STAGES[stageIndex]}
            isPlaying={isPlaying}
          />
          <ComplexityPanel result={result} />
          <section className="panel summary-panel">
            <div className="panel-header">
              <h2>Worked Mapping Summary</h2>
              <span className="badge">Final placement</span>
            </div>
            <ul className="mapping-list">
              {movementSummary.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="right-column">
          <section className="panel step-panel">
            <div className="panel-header">
              <h2>Step Controls</h2>
              <span className="badge">Manual + Auto</span>
            </div>
            <div className="button-row">
              <button className="secondary-btn" onClick={() => { setIsPlaying(false); setStageIndex((prev) => Math.max(0, prev - 1)); }}>Previous</button>
              <button className="secondary-btn" onClick={() => { setIsPlaying(false); setStageIndex((prev) => Math.min(2, prev + 1)); }}>Next</button>
              <button className="primary-btn" onClick={handleVisualize}>Replay Animation</button>
            </div>
          </section>
          <div className="mesh-layout">
            <MeshGrid
              title="Before Shift"
              subtitle="Initial data distribution across the mesh."
              nodes={result.initialNodes}
              dimension={result.dimension}
              active={stageIndex === 0}
            />
            <MeshGrid
              title="After Stage 1 — Row Shift"
              subtitle={`Each node moves by q mod √p = ${result.rowShift} position(s) inside its row.`}
              nodes={result.afterRowShift}
              dimension={result.dimension}
              arrows={stageIndex >= 1 ? result.rowArrows : []}
              active={stageIndex === 1}
            />
            <MeshGrid
              title="After Stage 2 — Column Shift"
              subtitle={`Each node moves by ⌊q / √p⌋ = ${result.columnShift} position(s) inside its column.`}
              nodes={result.afterColumnShift}
              dimension={result.dimension}
              arrows={stageIndex >= 2 ? result.columnArrows : []}
              active={stageIndex === 2}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
