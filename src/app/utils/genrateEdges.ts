import OpenAI from 'openai';

// This is just for the demo, you should never expose your API key in the frontend
// The best practice is to create a backend service to handle the API requests
const openai = new OpenAI({
  apiKey: 'OPENAI_KEY_HERE',
  dangerouslyAllowBrowser: true,
});

const systemPrompt = `
Task: Generate edges to map keys from a source JSON to a target JSON. 
Make sure to handle nested keys and return the generated edges in JSON format.
Only use the keys from the source JSON and the target JSON

Return the generated edges in JSON format like in the following example:

Example:

Source JSON:
{
  "name": "Alice",
  "age": 30,
  "address": {
    "city": "Wonderland",
    "country": "Fantasia"
  }
}

Target JSON:
{
  "full_name": "Alice",
  "years_old": 30,
  "location": {
    "city": "Wonderland",
    "country": "Fantasia"
  }
}


Output
{
  "edges": [
    {
      "source": "name",
      "sourceHandle": null,
      "target": "full_name",
      "targetHandle": null,
      "id": "reactflow__edge-name-full_name"
    },
    {
      "source": "age",
      "sourceHandle": null,
      "target": "years_old",
      "targetHandle": null,
      "id": "reactflow__edge-age-years_old"
    },
    {
      "source": "address.city",
      "sourceHandle": null,
      "target": "location.city",
      "targetHandle": null,
      "id": "reactflow__edge-address.city-location.city"
    },
    {
      "source": "address.country",
      "sourceHandle": null,
      "target": "location.country",
      "targetHandle": null,
      "id": "reactflow__edge-address.country-location.country"
    }
  ]
}

`;

export default async function generateEdges(sourceJson: string, destinationJson: string) {
  const userPrompt = `
    Source JSON:
    ${sourceJson}

    Target JSON:
    ${destinationJson}
  `
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    model: 'gpt-3.5-turbo-1106',
    response_format: {
      type: 'json_object',
    }
  });

  return chatCompletion.choices[0].message.content;
}
