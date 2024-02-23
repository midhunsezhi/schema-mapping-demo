"use client"

import {
  edges as initialEdges,
  nodes as initialNodes
} from '@/components/elements';
import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  Handle,
  ReactFlowInstance,
  addEdge,
  useEdgesState,
  useNodesState,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';


const onInit = (reactFlowInstance: ReactFlowInstance) => console.log('flow loaded:', reactFlowInstance);
export default function Page() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []);

  return <div className="w-full h-screen">
    <ReactFlow
      className="w-full h-full"
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      fitView
      attributionPosition="top-right"
    >
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  </div>;
}