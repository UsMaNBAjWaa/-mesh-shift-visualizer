import React from 'react';

function ArrowLayer({ arrows, dimension }) {
  if (!arrows.length) return null;

  const cell = 100 / dimension;

  return (
    <svg className="arrow-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <marker id="arrow-head" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="currentColor" />
        </marker>
      </defs>
      {arrows.map((arrow) => {
        const x1 = arrow.from.col * cell + cell / 2;
        const y1 = arrow.from.row * cell + cell / 2;
        const x2 = arrow.to.col * cell + cell / 2;
        const y2 = arrow.to.row * cell + cell / 2;
        return (
          <line
            key={`${arrow.source}-${x1}-${y1}-${x2}-${y2}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            markerEnd="url(#arrow-head)"
            className="move-arrow"
          />
        );
      })}
    </svg>
  );
}

export default function MeshGrid({ title, subtitle, nodes, dimension, arrows = [], active = false }) {
  return (
    <section className={`panel mesh-panel ${active ? 'active-stage' : ''}`}>
      <div className="panel-header">
        <h3>{title}</h3>
        <span className="badge">{dimension} × {dimension}</span>
      </div>
      <p className="muted">{subtitle}</p>
      <div className="mesh-grid-wrapper">
        <div className="mesh-grid" style={{ gridTemplateColumns: `repeat(${dimension}, minmax(0, 1fr))` }}>
          {nodes.map((node, index) => (
            <div className="mesh-node" key={`${title}-${index}-${node.source}`}>
              <div className="node-index">Node {index}</div>
              <div className="node-value">{node.value}</div>
              <div className="node-meta">from source {node.source}</div>
            </div>
          ))}
        </div>
        <ArrowLayer arrows={arrows} dimension={dimension} />
      </div>
    </section>
  );
}
