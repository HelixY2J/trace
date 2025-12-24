export const DEFAULT_WORKFLOW = {
  "nodes": [
    {
      "id": "11",
      "position": {
        "x": 221.87732979831077,
        "y": 142.21854340061486
      },
      "type": "text",
      "data": {
        "kind": "Text",
        "text": "sonos + wifi speaker"
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
        "x": 212.72077648417854,
        "y": 484.36038824208924
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
        "width": 360,
        "height": 246
      },
      "dragging": false
    },
    {
      "id": "33",
      "position": {
        "x": 557.3293432734398,
        "y": 224.1888289535962
      },
      "type": "llm",
      "data": {
        "kind": "LLM",
        "model": "Imagen 4",
        "prompt": "analyze the product "
      },
      "measured": {
        "width": 320,
        "height": 494
      },
      "dragging": false
    },
    {
      "id": "35",
      "position": {
        "x": 907.7820445629421,
        "y": 236.23256759784726
      },
      "type": "text",
      "data": {
        "kind": "Text",
        "text": ""
      },
      "measured": {
        "width": 360,
        "height": 1146
      },
      "dragging": false
    },
    {
      "id": "36",
      "position": {
        "x": 1788.0395784393759,
        "y": 280.7234316540591
      },
      "type": "llm",
      "data": {
        "kind": "LLM",
        "model": "Imagen 4",
        "prompt": "write SEO meta description"
      },
      "measured": {
        "width": 320,
        "height": 494
      },
      "dragging": false
    },
    {
      "id": "37",
      "position": {
        "x": 1308.8683712945178,
        "y": -134.95657647111608
      },
      "type": "llm",
      "data": {
        "kind": "LLM",
        "model": "Imagen 4",
        "prompt": "write amazon lisiting "
      },
      "measured": {
        "width": 320,
        "height": 494
      },
      "dragging": false
    },
    {
      "id": "38",
      "position": {
        "x": 1370.8753463912176,
        "y": 835.1188042035942
      },
      "type": "llm",
      "data": {
        "kind": "LLM",
        "model": "Imagen 4",
        "prompt": "write instagram caption"
      },
      "measured": {
        "width": 320,
        "height": 494
      },
      "dragging": false
    },
    {
      "id": "39",
      "position": {
        "x": 1731.9896250105726,
        "y": -7.737411098125687
      },
      "type": "text",
      "data": {
        "kind": "Text",
        "text": ""
      },
      "measured": {
        "width": 360,
        "height": 1074
      },
      "dragging": false
    },
    {
      "id": "40",
      "position": {
        "x": 1715.4457309011107,
        "y": 866.5437622249556
      },
      "type": "text",
      "data": {
        "kind": "Text",
        "text": ""
      },
      "measured": {
        "width": 360,
        "height": 246
      },
      "dragging": false
    }
  ],
  "edges": [
    {
      "type": "styled",
      "source": "11",
      "sourceHandle": "out:text",
      "target": "33",
      "targetHandle": "in:text",
      "id": "xy-edge__11out:text-33in:text"
    },
    {
      "type": "styled",
      "source": "17",
      "sourceHandle": "out:image",
      "target": "33",
      "targetHandle": "in:image",
      "id": "xy-edge__17out:image-33in:image"
    },
    {
      "type": "styled",
      "source": "33",
      "sourceHandle": "out:text",
      "target": "35",
      "targetHandle": "in:text",
      "id": "xy-edge__33out:text-35in:text"
    },
    {
      "type": "styled",
      "source": "35",
      "sourceHandle": "out:text",
      "target": "37",
      "targetHandle": "in:text",
      "id": "xy-edge__35out:text-37in:text"
    },
    {
      "type": "styled",
      "source": "35",
      "sourceHandle": "out:text",
      "target": "38",
      "targetHandle": "in:text",
      "id": "xy-edge__35out:text-38in:text"
    },
    {
      "type": "styled",
      "source": "35",
      "sourceHandle": "out:text",
      "target": "36",
      "targetHandle": "in:text",
      "id": "xy-edge__35out:text-36in:text"
    },
    {
      "type": "styled",
      "source": "37",
      "sourceHandle": "out:text",
      "target": "39",
      "targetHandle": "in:text",
      "id": "xy-edge__37out:text-39in:text"
    },
    {
      "type": "styled",
      "source": "36",
      "sourceHandle": "out:text",
      "target": "25",
      "targetHandle": "in:text",
      "id": "xy-edge__36out:text-25in:text"
    },
    {
      "type": "styled",
      "source": "38",
      "sourceHandle": "out:text",
      "target": "40",
      "targetHandle": "in:text",
      "id": "xy-edge__38out:text-40in:text"
    }
  ]
  };