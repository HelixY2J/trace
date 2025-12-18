export const DEFAULT_WORKFLOW = {
    "nodes": [
    {
      "id": "11",
      "position": {
        "x": 321,
        "y": 238
      },
      "type": "text",
      "data": {
        "kind": "Text",
        "text": "sonos + wifi speaker"
      },
      "measured": {
        "width": 260,
        "height": 162
      }
    },
    {
      "id": "17",
      "position": {
        "x": 284,
        "y": 520
      },
      "type": "image",
      "data": {
        "kind": "Image",
        "name": "sonos2.jpg"
      },
      "measured": {
        "width": 260,
        "height": 320
      }
    },
    {
      "id": "18",
      "position": {
        "x": 675,
        "y": 299
      },
      "type": "llm",
      "data": {
        "kind": "LLM",
        "model": "Imagen 4",
        "prompt": "Analyze the Given product"
      },
      "measured": {
        "width": 320,
        "height": 494
      }
    },
    {
      "id": "19",
      "position": {
        "x": 1100,
        "y": 520
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
      "id": "20",
      "position": {
        "x": 1502.7047454052783,
        "y": 829.6950081252621
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
      }
    },
    {
      "id": "21",
      "position": {
        "x": 1900.3376935577328,
        "y": 624.6656498354491
      },
      "type": "llm",
      "data": {
        "kind": "LLM",
        "model": "Imagen 4",
        "prompt": "Write SEO meta description"
      },
      "measured": {
        "width": 320,
        "height": 494
      }
    },
    {
      "id": "22",
      "position": {
        "x": 1498,
        "y": 153.5
      },
      "type": "llm",
      "data": {
        "kind": "LLM",
        "model": "Imagen 4",
        "prompt": "write amazon listing"
      },
      "measured": {
        "width": 320,
        "height": 494
      }
    },
    {
      "id": "23",
      "position": {
        "x": 1910.825549912271,
        "y": 265.2066210610435
      },
      "type": "text",
      "data": {
        "kind": "Text",
        "text": ""
      },
      "measured": {
        "width": 260,
        "height": 162
      },
      "dragging": false
    },
    {
      "id": "24",
      "position": {
        "x": 1949.961351503439,
        "y": 1276.4303894893949
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
      "id": "25",
      "position": {
        "x": 2272.4981024193357,
        "y": 779.105425195117
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
    }
  ],
  "edges": [
    {
      "id": "xy-edge__18-19",
      "source": "18",
      "target": "19"
    },
    {
      "id": "xy-edge__11-18",
      "source": "11",
      "target": "18"
    },
    {
      "id": "xy-edge__17-18",
      "source": "17",
      "target": "18"
    },
    {
      "id": "xy-edge__19-22",
      "source": "19",
      "target": "22"
    },
    {
      "id": "xy-edge__19-20",
      "source": "19",
      "target": "20"
    },
    {
      "id": "xy-edge__19-21",
      "source": "19",
      "target": "21"
    },
    {
      "id": "xy-edge__22-23",
      "source": "22",
      "target": "23"
    },
    {
      "id": "xy-edge__20-24",
      "source": "20",
      "target": "24"
    },
    {
      "id": "xy-edge__21-25",
      "source": "21",
      "target": "25"
    }
  ]
  };