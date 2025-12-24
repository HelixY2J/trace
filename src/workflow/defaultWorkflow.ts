export const DEFAULT_WORKFLOW = {
  "nodes": [
    {
      "id": "11",
      "position": {
        "x": 138.06133224386718,
        "y": 86.03419339159223
      },
      "type": "text",
      "data": {
        "kind": "Text",
        "text": "Analyze the product - sonos "
      },
      "measured": {
        "width": 260,
        "height": 162
      },
      "dragging": false
    },
    {
      "id": "17",
      "position": {
        "x": 103.11524122067533,
        "y": 386.72856691493513
      },
      "type": "image",
      "data": {
        "kind": "Image",
        "name": "sonos2.jpg"
      },
      "measured": {
        "width": 260,
        "height": 346
      },
      "dragging": false
    },
    {
      "id": "25",
      "position": {
        "x": 2110.8769830422884,
        "y": 435.5014706139934
      },
      "type": "text",
      "data": {
        "kind": "Text",
        "text": ""
      },
      "measured": {
        "width": 260,
        "height": 162
      }
    },
    {
      "id": "35",
      "position": {
        "x": 861.4629907148411,
        "y": 133.25772946609968
      },
      "type": "text",
      "data": {
        "kind": "Text",
        "text": "write instagram caption"
      },
      "measured": {
        "width": 260,
        "height": 162
      },
      "dragging": false
    },
    {
      "id": "42",
      "position": {
        "x": 482.3948764199349,
        "y": 284.2970070670025
      },
      "type": "llmPrompt",
      "data": {
        "kind": "LLMPrompt",
        "model": "Imagen 4",
        "prompt": ""
      },
      "measured": {
        "width": 320,
        "height": 224
      },
      "dragging": false
    },
    {
      "id": "45",
      "position": {
        "x": 862.2910092867178,
        "y": 395.54451333752746
      },
      "type": "text",
      "data": {
        "kind": "Text",
        "text": "write seo + meta description "
      },
      "measured": {
        "width": 260,
        "height": 162
      },
      "dragging": false
    },
    {
      "id": "46",
      "position": {
        "x": 840.4413468718843,
        "y": 586.7290594673198
      },
      "type": "text",
      "data": {
        "kind": "Text",
        "text": "write amazon Listing "
      },
      "measured": {
        "width": 260,
        "height": 162
      },
      "dragging": false
    },
    {
      "id": "47",
      "position": {
        "x": 1191.8567507104553,
        "y": 149.73581117065137
      },
      "type": "llmPrompt",
      "data": {
        "kind": "LLMPrompt",
        "model": "Imagen 4",
        "prompt": ""
      },
      "measured": {
        "width": 320,
        "height": 224
      },
      "dragging": false
    },
    {
      "id": "49",
      "position": {
        "x": 1150.8886336826426,
        "y": 685.0525403340704
      },
      "type": "llmPrompt",
      "data": {
        "kind": "LLMPrompt",
        "model": "Imagen 4",
        "prompt": ""
      },
      "measured": {
        "width": 320,
        "height": 224
      },
      "dragging": false
    },
    {
      "id": "50",
      "position": {
        "x": 1166.3654778931498,
        "y": 409.2005523467983
      },
      "type": "llmPrompt",
      "data": {
        "kind": "LLMPrompt",
        "model": "Imagen 4",
        "prompt": ""
      },
      "measured": {
        "width": 320,
        "height": 224
      },
      "dragging": false
    }
  ],
  "edges": [
    {
      "type": "styled",
      "source": "17",
      "sourceHandle": "out:image",
      "target": "42",
      "targetHandle": "in:image",
      "id": "xy-edge__17out:image-42in:image"
    },
    {
      "type": "styled",
      "source": "11",
      "sourceHandle": "out:text",
      "target": "42",
      "targetHandle": "in:text",
      "id": "xy-edge__11out:text-42in:text"
    },
    {
      "type": "styled",
      "source": "42",
      "sourceHandle": "out:text",
      "target": "35",
      "targetHandle": "in:text",
      "id": "xy-edge__42out:text-35in:text"
    },
    {
      "type": "styled",
      "source": "42",
      "sourceHandle": "out:text",
      "target": "45",
      "targetHandle": "in:text",
      "id": "xy-edge__42out:text-45in:text"
    },
    {
      "type": "styled",
      "source": "42",
      "sourceHandle": "out:text",
      "target": "46",
      "targetHandle": "in:text",
      "id": "xy-edge__42out:text-46in:text"
    },
    {
      "type": "styled",
      "source": "35",
      "sourceHandle": "out:text",
      "target": "47",
      "targetHandle": "in:text",
      "id": "xy-edge__35out:text-47in:text"
    },
    {
      "type": "styled",
      "source": "45",
      "sourceHandle": "out:text",
      "target": "50",
      "targetHandle": "in:text",
      "id": "xy-edge__45out:text-50in:text"
    },
    {
      "type": "styled",
      "source": "46",
      "sourceHandle": "out:text",
      "target": "49",
      "targetHandle": "in:text",
      "id": "xy-edge__46out:text-49in:text"
    }
  ]
  };