import React from 'react';
import { Edge, MarkerType, Node, Position } from 'reactflow';

export const nodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: {
      label: 'Input Node',
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    type: 'output',
    data: {
      label: 'Output Node',
    },
    position: { x: 300, y: 100 },
  }
];

export const edges: Edge[] = [
  {
    id: '1->2',
    source: '1',
    target: '2',
    sourceHandle: 'a',
    targetHandle: 'b',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];
