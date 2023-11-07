import React from "react";
import Graph from "react-graph-vis";

export default function ReactGraphVis({
  graphOptions = { nodes: [], edges: [] },
  nodeSelected = () => null,
}) {
  const options = {
    autoResize: true,
    layout: {
      hierarchical: false,
    },
    edges: {
      color: "#000000",
      smooth: {
        enabled: true,
        type: "discrete",
        roundness: 0.5,
      },
      font: {
        size: 16,
      },
    },
    height: "400px",
    nodes: {
      font: {
        size: 30,
      },
    },
    interaction: {
      hover: true,
      hoverConnectedEdges: false,
      selectable: false,
      selectConnectedEdges: false,
      zoomView: false,
      dragView: false,
    },
  };

  const events = {
    select: function (event) {
      nodeSelected(event?.node);
    },
    hoverNode: function (event) {
      nodeSelected(event?.node);
    },
    blurNode: function (event) {
      nodeSelected(null);
    },
  };

  return <Graph graph={graphOptions} options={options} events={events} />;
}
