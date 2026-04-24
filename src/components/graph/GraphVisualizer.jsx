import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { graphBFS, graphDFS } from '../../algorithms/dataStructures';
import { DEFAULT_GRAPH } from '../../utils';
import { Play, RotateCcw } from 'lucide-react';

const NODE_RADIUS = 24;

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState(DEFAULT_GRAPH.nodes);
  const [edges, setEdges] = useState(DEFAULT_GRAPH.edges);
  const [adjacency, setAdjacency] = useState(DEFAULT_GRAPH.adjacency);
  const [traversalType, setTraversalType] = useState('bfs');
  const [startNode, setStartNode] = useState('A');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(null);
  const [order, setOrder] = useState([]);
  const svgRef = useRef();
  const playRef = useRef(false);

  const currentState = steps[currentStep];
  const visitedSet = new Set(currentState?.visited || []);
  const queueOrStack = currentState?.queue || currentState?.stack || [];
  const currentNode = currentState?.current;

  const getNodeColor = (nodeId) => {
    if (nodeId === currentNode) return 'var(--accent-cyan)';
    if (visitedSet.has(nodeId)) return 'var(--accent-green)';
    if (queueOrStack.includes(nodeId)) return 'var(--accent-amber)';
    return 'var(--bg-secondary)';
  };

  const getNodeStroke = (nodeId) => {
    if (nodeId === currentNode) return 'var(--accent-cyan)';
    if (visitedSet.has(nodeId)) return 'var(--accent-green)';
    if (queueOrStack.includes(nodeId)) return 'var(--accent-amber)';
    return 'var(--border-bright)';
  };

  const handleStart = async () => {
    const stepsFn = traversalType === 'bfs' ? graphBFS : graphDFS;
    const newSteps = stepsFn(adjacency, startNode);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    playRef.current = true;
    setOrder([]);

    for (let i = 0; i < newSteps.length; i++) {
      if (!playRef.current) break;
      await new Promise(r => setTimeout(r, speed));
      setCurrentStep(i);
      setMessage(newSteps[i].explanation);
      setOrder(newSteps[i].order || []);
    }
    setIsPlaying(false);
    playRef.current = false;
  };

  const handleReset = () => {
    setIsPlaying(false);
    playRef.current = false;
    setSteps([]);
    setCurrentStep(0);
    setOrder([]);
    setMessage('');
  };

  // Drag handlers
  const handleMouseDown = useCallback((e, nodeId) => {
    e.preventDefault();
    setDragging(nodeId);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setNodes(prev => prev.map(n => n.id === dragging ? { ...n, x, y } : n));
  }, [dragging]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-auto">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Graph Traversal</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Drag nodes to rearrange. BFS uses a queue, DFS uses a stack (recursion).
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap text-xs">
        {[
          { label: 'Unvisited', color: 'var(--border-bright)' },
          { label: 'In Queue/Stack', color: 'var(--accent-amber)' },
          { label: 'Visited', color: 'var(--accent-green)' },
          { label: 'Current', color: 'var(--accent-cyan)' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
            <span style={{ color: 'var(--text-muted)' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          {['bfs', 'dfs'].map(t => (
            <button key={t} onClick={() => setTraversalType(t)}
              className="px-4 py-2 text-sm font-medium uppercase"
              style={{
                background: traversalType === t ? 'rgba(0,229,255,0.15)' : 'var(--bg-card)',
                color: traversalType === t ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              }}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Start:</span>
          <select value={startNode} onChange={e => setStartNode(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm font-mono"
            style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', outline: 'none' }}>
            {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
        </div>

        <button onClick={handleStart} disabled={isPlaying}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 transition-all hover:scale-105"
          style={{ background: 'rgba(0,229,255,0.15)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,229,255,0.4)' }}>
          <Play size={14} /> Start {traversalType.toUpperCase()}
        </button>

        <button onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm"
          style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          <RotateCcw size={14} /> Reset
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Speed</span>
          <input type="range" min={200} max={1200} step={100} value={1200 - speed + 200}
            onChange={e => setSpeed(1200 - Number(e.target.value) + 200)}
            className="w-20 h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: 'var(--accent-cyan)' }} />
        </div>
      </div>

      {/* Queue/Stack display */}
      {queueOrStack.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {traversalType === 'bfs' ? 'Queue:' : 'Stack:'}
          </span>
          {queueOrStack.map((n, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md text-xs font-mono font-bold"
              style={{ background: 'rgba(255,179,0,0.15)', color: 'var(--accent-amber)', border: '1px solid rgba(255,179,0,0.3)' }}>
              {n}
            </span>
          ))}
        </div>
      )}

      {/* SVG Graph */}
      <div className="flex-1 rounded-xl relative overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minHeight: '300px', cursor: dragging ? 'grabbing' : 'default' }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{ minHeight: '300px' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Edges */}
          {edges.map(([a, b], i) => {
            const na = nodeMap[a], nb = nodeMap[b];
            if (!na || !nb) return null;
            const visited = visitedSet.has(a) && visitedSet.has(b);
            return (
              <line key={i}
                x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={visited ? 'var(--accent-green)' : 'var(--border-bright)'}
                strokeWidth={visited ? 2.5 : 1.5}
                style={{ transition: 'stroke 0.3s' }}
              />
            );
          })}
          {/* Nodes */}
          {nodes.map(node => (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}
              style={{ cursor: 'grab' }}
              onMouseDown={e => handleMouseDown(e, node.id)}>
              <circle r={NODE_RADIUS}
                fill={getNodeColor(node.id)}
                stroke={getNodeStroke(node.id)}
                strokeWidth={node.id === currentNode ? 3 : 2}
                style={{ transition: 'fill 0.3s, stroke 0.3s', filter: node.id === currentNode ? 'drop-shadow(0 0 8px var(--accent-cyan))' : 'none' }}
              />
              <text textAnchor="middle" dominantBaseline="middle"
                fill={visitedSet.has(node.id) || node.id === currentNode ? '#000' : 'var(--text-primary)'}
                fontSize="14" fontFamily="Space Mono" fontWeight="bold">
                {node.id}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Traversal order */}
      {order.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Order:</span>
          {order.map((n, i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="px-2 py-0.5 rounded-md text-xs font-mono font-bold"
              style={{ background: 'rgba(0,255,136,0.15)', color: 'var(--accent-green)', border: '1px solid rgba(0,255,136,0.3)' }}>
              {n}
            </motion.span>
          ))}
        </div>
      )}

      {message && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.15)' }}>
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{message}</p>
        </div>
      )}
    </div>
  );
}
