import React from 'react';

const perfectSquares = [4, 9, 16, 25, 36, 49, 64];

export default function ControlPanel({ p, q, setP, setQ, error, onVisualize, onReset, currentStage, isPlaying }) {
  return (
    <section className="panel control-panel">
      <div className="panel-header">
        <h2>Input Controls</h2>
        <span className="badge">4–64 nodes</span>
      </div>
      <p className="muted">
        Enter mesh size <strong>p</strong> and shift amount <strong>q</strong>. Only perfect-square values are allowed for p.
      </p>

      <div className="form-grid">
        <label>
          <span>p (perfect square)</span>
          <input
            type="number"
            min="4"
            max="64"
            step="1"
            value={p}
            onChange={(event) => setP(Number(event.target.value))}
            list="perfect-squares"
          />
          <datalist id="perfect-squares">
            {perfectSquares.map((value) => (
              <option key={value} value={value} />
            ))}
          </datalist>
        </label>

        <label>
          <span>q (1 to p − 1)</span>
          <input
            type="number"
            min="1"
            max={Math.max(1, p - 1)}
            step="1"
            value={q}
            onChange={(event) => setQ(Number(event.target.value))}
          />
        </label>
      </div>

      {error ? <div className="error-box">{error}</div> : <div className="success-box">Inputs are valid.</div>}

      <div className="button-row">
        <button className="primary-btn" onClick={onVisualize}>Visualize Shift</button>
        <button className="secondary-btn" onClick={onReset}>Reset</button>
      </div>

      <div className="status-line">
        <span>Current stage:</span>
        <strong>{currentStage}</strong>
        {isPlaying && <span className="playing-dot">Animating</span>}
      </div>
    </section>
  );
}
