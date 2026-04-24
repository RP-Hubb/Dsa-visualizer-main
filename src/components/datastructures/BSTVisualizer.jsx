import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { bstInsert, bstTraversal } from '../../algorithms/dataStructures';
import { Plus, Trash2 } from 'lucide-react';

function getPositions(node, x, y, spread) {
  if (!node) return [];
  const positions = [{ val: node.val, x, y }];
  if (node.left) positions.push(...getPositions(node.left, x - spread, y + 70, spread / 1.8));
  if (node.right) positions.push(...getPositions(node.right, x + spread, y + 70, spread / 1.8));
  return positions;
}

function getEdges(node, x, y, spread) {
  if (!node) return [];
  const edges = [];
  if (node.left) {
    edges.push({ x1: x, y1: y, x2: x - spread, y2: y + 70 });
    edges.push(...getEdges(node.left, x - spread, y + 70, spread / 1.8));
  }
  if (node.right) {
    edges.push({ x1: x, y1: y, x2: x + spread, y2: y + 70 });
    edges.push(...getEdges(node.right, x + spread, y + 70, spread / 1.8));
  }
  return edges;
}

export default function BSTVisualizer() {
  const { bstRoot, setBstRoot } = useStore();
  const [inputVal, setInputVal] = useState('');
  const [visitingNode, setVisitingNode] = useState(null);
  const [traversalResult, setTraversalResult] = useState([]);
  const [traversalType, setTraversalType] = useState('inorder');
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const playRef = useRef(false);
  const svgRef = useRef();
  const [svgDims, setSvgDims] = useState({ w: 600, h: 400 });

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      for (const e of entries) setSvgDims({ w: e.contentRect.width, h: Math.max(e.contentRect.height, 300) });
    });
    if (svgRef.current) obs.observe(svgRef.current);
    return () => obs.disconnect();
  }, []);

  const cx = svgDims.w / 2;
  const positions = bstRoot ? getPositions(bstRoot, cx, 50, cx * 0.4) : [];
  const edges = bstRoot ? getEdges(bstRoot, cx, 50, cx * 0.4) : [];

  const handleInsert = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    const newRoot = bstInsert(bstRoot, val);
    setBstRoot(newRoot);
    setMessage(`Inserted ${val} into BST`);
    setInputVal('');
  };

  const handleTraverse = async () => {
    if (!bstRoot) return;
    const steps = bstTraversal(bstRoot, traversalType);
    setSteps(steps);
    setStepIdx(0);
    setIsPlaying(true);
    playRef.current = true;
    setTraversalResult([]);

    for (let i = 0; i < steps.length; i++) {
      if (!playRef.current) break;
      await new Promise(r => setTimeout(r, 600));
      setVisitingNode(steps[i].visiting);
      setTraversalResult([...steps[i].result]);
      setMessage(steps[i].explanation);
      setStepIdx(i);
    }
    setIsPlaying(false);
    playRef.current = false;
    setTimeout(() => setVisitingNode(null), 800);
  };

  const handleClear = () => {
    setBstRoot(null);
    setVisitingNode(null);
    setTraversalResult([]);
    setSteps([]);
    setMessage('');
    playRef.current = false;
    setIsPlaying(false);
  };

  const loadDefault = () => {
    let root = null;
    for (const v of [50, 30, 70, 20, 40, 60, 80, 10, 35]) {
      root = bstInsert(root, v);
    }
    setBstRoot(root);
    setMessage('Default BST loaded with values: 50, 30, 70, 20, 40, 60, 80, 10, 35');
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-auto">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Binary Search Tree</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          BST property: left child &lt; parent &lt; right child. Search/Insert/Delete: O(log n) avg.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <input
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Enter number"
          className="px-3 py-2 rounded-lg text-sm font-mono w-36"
          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', outline: 'none' }}
          onKeyDown={e => e.key === 'Enter' && handleInsert()}
        />
        <button onClick={handleInsert}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'rgba(0,229,255,0.15)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,229,255,0.4)' }}>
          <Plus size={14} /> Insert
        </button>
        <button onClick={loadDefault}
          className="px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--accent-purple)', border: '1px solid rgba(124,58,237,0.4)' }}>
          Load Example
        </button>
        <button onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'rgba(255,0,170,0.15)', color: 'var(--accent-magenta)', border: '1px solid rgba(255,0,170,0.4)' }}>
          <Trash2 size={14} /> Clear
        </button>

        <div className="flex gap-1.5 ml-auto">
          {['inorder', 'preorder', 'postorder'].map(t => (
            <button key={t} onClick={() => setTraversalType(t)}
              className="px-2.5 py-1.5 rounded-lg text-xs capitalize"
              style={{
                background: traversalType === t ? 'rgba(0,255,136,0.15)' : 'var(--bg-card)',
                color: traversalType === t ? 'var(--accent-green)' : 'var(--text-secondary)',
                border: `1px solid ${traversalType === t ? 'var(--accent-green)' : 'var(--border)'}`,
              }}>
              {t}
            </button>
          ))}
          <button onClick={handleTraverse} disabled={!bstRoot || isPlaying}
            className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40"
            style={{ background: 'rgba(0,255,136,0.15)', color: 'var(--accent-green)', border: '1px solid var(--accent-green)' }}>
            Traverse
          </button>
        </div>
      </div>

      {/* Traversal result */}
      {traversalResult.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Result:</span>
          {traversalResult.map((v, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 py-0.5 rounded-md text-xs font-mono"
              style={{ background: 'rgba(0,255,136,0.15)', color: 'var(--accent-green)', border: '1px solid rgba(0,255,136,0.3)' }}
            >
              {v}
            </motion.span>
          ))}
        </div>
      )}

      {/* SVG Tree */}
      <div ref={svgRef} className="flex-1 rounded-xl relative overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minHeight: '300px' }}>
        {!bstRoot ? (
          <div className="absolute inset-0 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
            <div className="text-center">
              <div className="text-4xl mb-2">🌳</div>
              <p className="text-sm">Insert values or load an example to build the tree</p>
            </div>
          </div>
        ) : (
          <svg width="100%" height={svgDims.h} style={{ overflow: 'visible' }}>
            {/* Edges */}
            {edges.map((e, i) => (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke="var(--border-bright)" strokeWidth="1.5" strokeDasharray="4,4" />
            ))}
            {/* Nodes */}
            {positions.map(({ val, x, y }) => {
              const isVisiting = visitingNode === val;
              return (
                <g key={val} transform={`translate(${x},${y})`}>
                  <circle r={22}
                    fill={isVisiting ? 'rgba(0,229,255,0.3)' : 'var(--bg-secondary)'}
                    stroke={isVisiting ? 'var(--accent-cyan)' : 'var(--border-bright)'}
                    strokeWidth={isVisiting ? 2.5 : 1.5}
                    style={{ transition: 'all 0.3s' }}
                  />
                  <text textAnchor="middle" dominantBaseline="middle"
                    fill={isVisiting ? 'var(--accent-cyan)' : 'var(--text-primary)'}
                    fontSize="12" fontFamily="Space Mono" fontWeight="bold">
                    {val}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {message && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.15)' }}>
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{message}</p>
        </div>
      )}
    </div>
  );
}
