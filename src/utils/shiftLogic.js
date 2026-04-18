export function isPerfectSquare(value) {
  const root = Math.sqrt(value);
  return Number.isInteger(root);
}

export function validateInputs(p, q) {
  if (!Number.isInteger(p) || p < 4 || p > 64) {
    return 'p must be an integer between 4 and 64.';
  }
  if (!isPerfectSquare(p)) {
    return 'p must be a perfect square (4, 9, 16, 25, 36, 49, 64).';
  }
  if (!Number.isInteger(q) || q < 1 || q > p - 1) {
    return `q must be an integer between 1 and ${p - 1}.`;
  }
  return '';
}

export function createInitialNodes(p) {
  return Array.from({ length: p }, (_, index) => ({
    id: index,
    value: `D${index}`,
    source: index
  }));
}

export function chunkNodes(nodes, dimension) {
  return Array.from({ length: dimension }, (_, row) =>
    nodes.slice(row * dimension, row * dimension + dimension)
  );
}

function flattenGrid(grid) {
  return grid.flat();
}

export function performRowShift(nodes, dimension, shiftAmount) {
  const grid = chunkNodes(nodes, dimension);
  const shifted = grid.map((row) => {
    const nextRow = Array.from({ length: dimension });
    row.forEach((node, index) => {
      nextRow[(index + shiftAmount) % dimension] = { ...node };
    });
    return nextRow;
  });
  return flattenGrid(shifted);
}

export function performColumnShift(nodes, dimension, shiftAmount) {
  const grid = chunkNodes(nodes, dimension);
  const shifted = Array.from({ length: dimension }, () => Array.from({ length: dimension }));

  for (let row = 0; row < dimension; row += 1) {
    for (let col = 0; col < dimension; col += 1) {
      shifted[(row + shiftAmount) % dimension][col] = { ...grid[row][col] };
    }
  }

  return flattenGrid(shifted);
}

export function buildMovementArrows(beforeNodes, afterNodes, dimension) {
  const arrows = [];
  const afterPositions = new Map();

  afterNodes.forEach((node, index) => {
    afterPositions.set(node.source, {
      row: Math.floor(index / dimension),
      col: index % dimension
    });
  });

  beforeNodes.forEach((node, index) => {
    const from = {
      row: Math.floor(index / dimension),
      col: index % dimension
    };
    const to = afterPositions.get(node.source);
    if (to && (to.row !== from.row || to.col !== from.col)) {
      arrows.push({ source: node.source, from, to });
    }
  });

  return arrows;
}

export function computeCircularShift(p, q) {
  const error = validateInputs(p, q);
  if (error) {
    throw new Error(error);
  }

  const dimension = Math.sqrt(p);
  const rowShift = q % dimension;
  const columnShift = Math.floor(q / dimension);
  const initialNodes = createInitialNodes(p);
  const afterRowShift = performRowShift(initialNodes, dimension, rowShift);
  const afterColumnShift = performColumnShift(afterRowShift, dimension, columnShift);
  const ringSteps = Math.min(q, p - q);
  const meshSteps = rowShift + columnShift;

  return {
    p,
    q,
    dimension,
    rowShift,
    columnShift,
    ringSteps,
    meshSteps,
    totalCommunicationSteps: meshSteps,
    initialNodes,
    afterRowShift,
    afterColumnShift,
    rowArrows: buildMovementArrows(initialNodes, afterRowShift, dimension),
    columnArrows: buildMovementArrows(afterRowShift, afterColumnShift, dimension)
  };
}

export function buildMovementSummary(beforeNodes, afterNodes) {
  return beforeNodes.map((node, index) => {
    const destination = afterNodes.findIndex((target) => target.source === node.source);
    return `${node.value}: node ${index} -> node ${destination}`;
  });
}
