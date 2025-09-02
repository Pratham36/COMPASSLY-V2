"use client";

import React, { useCallback, useState, useMemo } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const levelColors = {
  Fundamentals: "#60A5FA",
  Core: "#34D399",
  Advanced: "#FBBF24",
  Specialization: "#F472B6",
};


const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 60;

function getLayoutedElements(nodes, edges, direction = "TB") {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const { x, y } = dagreGraph.node(node.id);
    node.position = { x: x - nodeWidth / 2, y: y - nodeHeight / 2 };
  });

  return { nodes, edges };
}

export default function CareerRoadmap({ roadmap }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState(false);

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);

    if (window.innerWidth < 768) {
      setIsMobileDialogOpen(true);
    }
  }, []);

  const rawNodes = useMemo(() => {
    return (
      roadmap?.initialNodes?.map((node, index) => ({
        id: node.id?.toString() || `node-${index}`,
        type: "default",
        data: {
          label: node.data?.title || `Node ${index + 1}`,
          description: node.data?.description || "",
          link: node.data?.link || null,
          level: node.data?.level || "Fundamentals",
        },
        position: { x: 0, y: 0 },
        style: {
          background: levelColors[node.data?.level] || "#1F2937",
          color: "#fff",
          padding: 10,
          borderRadius: 12,
          border: "1px solid #374151",
          fontSize: 14,
          width: nodeWidth,
        },
      })) || []
    );
  }, [roadmap]);

  const rawEdges = useMemo(() => {
    return (
      roadmap?.initialEdges?.map((edge, i) => ({
        id: edge.id?.toString() || `edge-${i}`,
        source: edge.source?.toString(),
        target: edge.target?.toString(),
        type: "smoothstep",
        animated: true, 
        style: { stroke: "#9CA3AF" },
      })) || []
    );
  }, [roadmap]);



  const { nodes, edges } = useMemo(() => {
    return getLayoutedElements([...rawNodes], [...rawEdges], "TB");
  }, [rawNodes, rawEdges]);


  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-950 text-gray-100">
      <div className="hidden md:block w-72 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-2">
          {roadmap?.roadmapTitle || "Career Roadmap"}
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          {roadmap?.description || "No description available."}
        </p>

        {selectedNode ? (
          <div className="p-4 bg-gray-800 rounded-xl shadow-md">
            <h3 className="font-semibold text-white mb-2">
              {selectedNode.data?.label || "Node Details"}
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              {selectedNode.data?.description || "No description available."}
            </p>
            {selectedNode.data?.link && (
              <a
                href={selectedNode.data.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-sm underline"
              >
                Learn more →
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Click on a node to see details here.
          </p>
        )}
      </div>
      <div className="flex-1 bg-gray-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
          className="bg-gray-950"
        >
          <Controls />
          <Background gap={16} color="#374151" />
        </ReactFlow>
      </div>
      <Dialog open={isMobileDialogOpen} onOpenChange={setIsMobileDialogOpen}>
        <DialogContent className="bg-gray-900 text-gray-100 rounded-xl">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle>
              {selectedNode?.data?.label || "Node Details"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-300 mt-2">
            {selectedNode?.data?.description || "No description available."}
          </DialogDescription>
          {selectedNode?.data?.link && (
            <a
              href={selectedNode.data.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm underline mt-3 block"
            >
              Learn more →
            </a>
          )}
          <div className="flex justify-center mt-6">
            <Button
              className="bg-blue-600 hover:bg-blue-700 px-6 text-white rounded-lg"
              onClick={() => setIsMobileDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
