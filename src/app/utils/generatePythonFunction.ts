import { Edge } from 'reactflow';

export default function generatePythonFunction(edges: Edge[]): string {
  let pythonFunction = "def map_user(user):\n";
  pythonFunction += "    destination = {}\n";

  edges.forEach(edge => {
    const source = edge.source;
    const target = edge.target;

    const sourceKeys = source.split('.');
    let sourceAssignment = `user`;
    for (let i = 0; i < sourceKeys.length; i++) {
      sourceAssignment += `['${sourceKeys[i]}']`;
    }

    const targetKeys = target.split('.');
    let targetAssignment = `destination`;
    for (let i = 0; i < targetKeys.length - 1; i++) {
      targetAssignment += `['${targetKeys[i]}']`;
    }

    pythonFunction += `    ${targetAssignment}['${targetKeys[targetKeys.length - 1]}'] = ${sourceAssignment}\n`;
  });

  pythonFunction += "    return destination\n";
  
  return pythonFunction;
}