"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const levelColors = {
  Fundamentals: "#60A5FA",
  Core: "#34D399",
  Advanced: "#FBBF24",
  Specialization: "#F472B6",
};

// Dagre layout function
const dagreLayout = (nodes, edges, direction = "LR") => {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction });

  nodes.forEach((node) => g.setNode(node.id, { width: 180, height: 60 }));
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));

  dagre.layout(g);

  return nodes.map((node) => {
    const { x, y } = g.node(node.id);
    return { ...node, position: { x: x - 90, y: y - 30 } };
  });
};

export default function CareerRoadmap({ roadmap }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize nodes and edges with styles
  useEffect(() => {
    if (!roadmap) return;

    const styledNodes = roadmap.initialNodes.map((n) => ({
      ...n,
      style: {
        background: levelColors[n.data.level] || "#374151", // same color for mobile & desktop
        color: "#fff",
        borderRadius: 12,
        padding: 10,
        fontWeight: 600,
        fontSize: "0.85rem",
        minWidth: 140,
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      },
      data: { ...n.data, label: n.data.title },
    }));

    const styledEdges = roadmap.initialEdges.map((e) => ({
      ...e,
      style: { stroke: "#9CA3AF", strokeWidth: 2, opacity: 0.6 },
      animated: true,
      type: "smoothstep",
    }));

    // Layout direction based on screen
    const direction = isMobile ? "TB" : "LR"; // TB = top-bottom for mobile, LR = left-right for desktop
    setNodes(dagreLayout(styledNodes, styledEdges, direction));
    setEdges(styledEdges);
  }, [roadmap, isMobile]);

  // Fit view when nodes/edges change
  useEffect(() => {
    if (rfInstance && nodes.length > 0) {
      rfInstance.fitView({ padding: 0.2 });
    }
  }, [nodes, edges, rfInstance]);

  // Refit on window resize
  useEffect(() => {
    const handleResize = () => {
      if (rfInstance) rfInstance.fitView({ padding: 0.2 });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [rfInstance]);

  // Node click handler
  const onNodeClick = useCallback(
    (_, node) => {
      setSelectedNode(node.data);
      if (isMobile) setIsNodeDialogOpen(true); // popup only on mobile
    },
    [isMobile]
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-neutral-950 text-white">
      {/* Sidebar only for desktop */}
      <div className="hidden md:flex w-80 border-r border-neutral-800 flex-col bg-neutral-900/70 backdrop-blur-md">
        <div className="p-4">
          <h2 className="text-xl font-bold">{roadmap?.roadmapTitle || "Career Roadmap"}</h2>
          <p className="text-sm text-neutral-400">{roadmap?.description}</p>
        </div>
        {selectedNode && (
          <div className="m-4 p-3 bg-neutral-800 rounded-lg">
            <h3 className="font-bold">{selectedNode.title}</h3>
            <p className="text-sm text-neutral-300 mt-1">{selectedNode.description}</p>
            {selectedNode.link && (
              <a
                href={selectedNode.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm font-medium"
              >
                📖 Learn More
              </a>
            )}
          </div>
        )}
      </div>

      {/* Flowchart Canvas */}
      <div
        ref={reactFlowWrapper}
        className="flex-1 relative bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 min-h-[500px] w-full"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          onNodeClick={onNodeClick}
          onInit={(instance) => {
            setRfInstance(instance);
            instance.fitView({ padding: 0.2 }); // ensure fit on first load
          }}
          panOnDrag={true}       // pan only on desktop
          zoomOnScroll={true}
          zoomOnPinch={true}          // pinch zoom on mobile
          style={{ width: "100%", height: "100%" }}
        >
          <Controls className="bg-neutral-800/80 rounded-lg" />
          <Background color="#444" gap={20} />
        </ReactFlow>
      </div>

      {/* Node Popup for Mobile */}
      {isMobile && (
        <Dialog open={isNodeDialogOpen} onOpenChange={setIsNodeDialogOpen}>
          <DialogContent className="bg-neutral-900 text-white border-neutral-700 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">{selectedNode?.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-2 text-sm text-neutral-300">{selectedNode?.description}</div>
            {selectedNode?.link && (
              <a
                href={selectedNode.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline mt-2 block"
              >
                📖 Learn More
              </a>
            )}
            <DialogFooter className="flex justify-end mt-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 px-6"
                onClick={() => setIsNodeDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
