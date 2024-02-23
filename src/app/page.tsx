'use client';

import React, { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  useEdgesState,
  Connection,
  addEdge,
  ReactFlowInstance,
  isEdge,
} from 'reactflow';
import useJsonValidation from './hooks/useJsonValidation'
import useSchemaGenerator from './hooks/useSchemaGenerator';
import destinationExample from '@/data/example-destination';
import sourceExample from '@/data/example-source';
import generatePythonFunction from './utils/generatePythonFunction';

import 'reactflow/dist/style.css';
import generateEdges from './utils/genrateEdges';

const onInit = (reactFlowInstance: ReactFlowInstance) => console.log('flow loaded:', reactFlowInstance);

const Home: React.FC = () => {
  const [generateFunction, setGenerateFunction] = React.useState<string>('');
  const defaultSource: string = JSON.stringify(sourceExample, null, 2);
  const defaultDestination: string = JSON.stringify(destinationExample, null, 2);

  const { value: source, isValid: sourceValid, handleChange: handleSourceChange } = useJsonValidation(defaultSource);
  const { value: destination, isValid: destinationValid, handleChange: handleDestinationChange } = useJsonValidation(defaultDestination);

  const { nodes, onNodesChange, handleNodesGeneration } = useSchemaGenerator(source, destination, destinationValid && sourceValid);

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [lodingEdges, setLoadingEdges] = React.useState<boolean>(false);


  const onConnect = useCallback((params: Edge | Connection) => {
    setEdges((eds) => addEdge(params, eds))
  }, []);

  useEffect(() => {
    if(!edges.length) return;
    setGenerateFunction(generatePythonFunction(edges));
  }, [edges]);

  useEffect(() => {
    if(!nodes.length) return;

    const initEdges = async () => {
      try {
        setLoadingEdges(true);
        const edgesStr = await generateEdges(source, destination);
        const edgesObj = JSON.parse(edgesStr || '{}');

        if(edgesObj?.edges?.length) {
          setEdges(edgesObj.edges.filter((edge: Edge) => isEdge(edge)) as Edge[]);
        }
      } catch (error) {
        console.error('Error generating edges', error);
      } finally {
        setLoadingEdges(false);
      }
    }

    initEdges();
  }, [nodes.length])


  const handleGenerateSchemas = () => {
    handleNodesGeneration();
  }

  return (
    <main className="flex max-w-10xl flex-col items-center p-12 m-auto">
      <div className="flex flex-row w-full max-w-5xl justify-center items-center space-x-4">
        <div className="flex flex-col items-center w-full">
          <h3 className='mb-4'>Source JSON</h3>  
          <Textarea
            className="item mr-4"
            onChange={(e) => handleSourceChange(e.target.value)}
            value={source}
            rows={15}
          />
          <p style={{ color: sourceValid ? "green" : "red" }}>
            {sourceValid ? "✔ Valid JSON" : "✖ Invalid JSON"}
          </p>
        </div>

        <div className="flex flex-col items-center w-full">
          <h3 className='mb-4'>Destination JSON</h3>
          <Textarea
            className="item mr-4"
            onChange={(e) => handleDestinationChange(e.target.value)}
            value={destination}
            rows={15}
          />
          <p style={{ color: destinationValid ? "green" : "red" }}>
            {destinationValid ? "✔ Valid JSON" : "✖ Invalid JSON"}
          </p>
        </div>
      </div>

      <Button
        className="my-4"
        disabled={!sourceValid || !destinationValid}
        onClick={handleGenerateSchemas}
      >
        Generate JSON Schema
      </Button>

      <div className="flex w-full h-screen">

        <div className='w-2/3 h-full p-4 '>
          {lodingEdges && <h2 className='text-yellow-700 mb-4'>
            Edges are being generated, please wait...
          </h2>}

          {!lodingEdges && nodes.length ? <h2 className='mb-4'>
            Modify the edges as required and copy the generated Python function.
          </h2> : null}

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
        </div>
        <div className="relative w-1/3 h-3/4 p-4">
          <h2 className='mb-4'>Generated Python Function</h2>
          <Textarea
            value={generateFunction}
            rows={15}
            readOnly
          />
        </div>
        
      </div>
    </main>
  );
};

export default Home;