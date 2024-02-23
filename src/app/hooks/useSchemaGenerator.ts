import { 
  Node,
  useNodesState,
} from 'reactflow';

interface SchemaType {
  [key: string]: SchemaType | string;
}

const useSchemaGenerator = (sourceJsonString:string, destinationJsonString:string, isValid:boolean) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(<Node[]>([]))

  const generateJSONSchema = (json: Record<string, unknown>): SchemaType => {
    const schema: SchemaType = {};
    for (const key in json) {
      if (typeof json[key] === 'object' && json[key] !== null) {
        schema[key] = generateJSONSchema(json[key] as Record<string, unknown>);
      } else {
        schema[key] = typeof json[key];
      }
    }
    return schema;
  };

  const generateNodes = (schema: SchemaType, type:string = 'input', x: number, y: number = 0, parentKeys: string[] = []) => {
    let nodes: Node[] = [];
    Object.keys(schema).forEach((key, index) => {
      const currentKeys = [...parentKeys, key];
      if (typeof schema[key] === 'object') {
        nodes = nodes.concat(generateNodes(schema[key] as SchemaType, type, x + 100, y + 100 * index, currentKeys));
      } else {
        const nested_key = currentKeys.join('.')
        nodes.push({
          id: nested_key,
          type: type,
          data: {
            label: nested_key + ': ' + schema[key],
          },
          position: { x: x, y: y + 100 * index },
        });
      }
    })
    
    return nodes;
  }

  const handleNodesGeneration = () => {
    if (isValid) {
      try {
        let json = JSON.parse(sourceJsonString);
        const sourceNodes = generateNodes(json, 'input', 0);
        json = JSON.parse(destinationJsonString);
        const destinationNodes = generateNodes(json, 'output', 500);
        setNodes(sourceNodes.concat(destinationNodes));
      } catch (error) {
        console.error('Failed to parse JSON:', error);
      }
    }
  }

  return { nodes, onNodesChange, handleNodesGeneration };
};

export default useSchemaGenerator;