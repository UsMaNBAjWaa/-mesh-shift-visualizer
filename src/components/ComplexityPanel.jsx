import React from 'react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function ComplexityPanel({ result }) {
  const chartData = [
    { name: 'Mesh', steps: result.meshSteps },
    { name: 'Ring', steps: result.ringSteps }
  ];

  return (
    <section className="panel complexity-panel">
      <div className="panel-header">
        <h2>Complexity Panel</h2>
        <span className="badge emphasis">Real-time</span>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span>Row shift</span>
          <strong>{result.rowShift}</strong>
          <small>q mod √p</small>
        </div>
        <div className="metric-card">
          <span>Column shift</span>
          <strong>{result.columnShift}</strong>
          <small>⌊q / √p⌋</small>
        </div>
        <div className="metric-card">
          <span>Total mesh steps</span>
          <strong>{result.totalCommunicationSteps}</strong>
          <small>(q mod √p) + ⌊q / √p⌋</small>
        </div>
      </div>

      <div className="formula-box">
        <p><strong>Ring steps</strong> = min(q, p − q) = <strong>{result.ringSteps}</strong></p>
        <p><strong>Mesh steps</strong> = (q mod √p) + ⌊q / √p⌋ = <strong>{result.meshSteps}</strong></p>
        <p className="efficiency-note">
          Savings = <strong>{result.ringSteps - result.meshSteps}</strong> step(s)
          {result.ringSteps > result.meshSteps ? ' in favor of the mesh.' : ' compared with the ring.'}
        </p>
      </div>

      <div className="chart-shell">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="steps" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
