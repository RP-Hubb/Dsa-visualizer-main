import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { stackOperationSteps, queueOperationSteps } from '../../algorithms/dataStructures';
import PlaybackControls from '../shared/PlaybackControls';
import { Plus, Minus } from 'lucide-react';

export function StackVisualizer() {
  const { stackData, setStackData } = useStore();
  const [inputVal, setInputVal] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);
  const [message, setMessage] = useState('');

  const step = steps[currentStep];
  const displayStack = step?.stack ?? stackData;
  const highlight = step?.highlight ?? -1;

  const doOp = (op) => {
    const val = op === 'push' ? (parseInt(inputVal) || Math.floor(Math.random() * 99) + 1) : undefined;
    const { steps: newSteps, newStack } = stackOperationSteps(stackData, op, val);
    setSteps(newSteps);
    setCurrentStep(0);
    setMessage(newSteps[newSteps.length - 1]?.explanation || '');
    setStackData(newStack);
    setInputVal('');
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-auto">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Stack</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>LIFO — Last In, First Out. Push to top, pop from top.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Size', value: stackData.length },
          { label: 'Top', value: stackData.length > 0 ? stackData[stackData.length - 1] : '—' },
          { label: 'Empty', value: stackData.length === 0 ? 'Yes' : 'No' },
        ].map(m => (
          <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-display font-bold" style={{ color: 'var(--accent-cyan)' }}>{m.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <input
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Value (optional)"
          className="flex-1 px-3 py-2 rounded-lg text-sm font-mono"
          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', outline: 'none' }}
          onKeyDown={e => e.key === 'Enter' && doOp('push')}
        />
        <button onClick={() => doOp('push')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
          style={{ background: 'rgba(0,255,136,0.15)', color: 'var(--accent-green)', border: '1px solid var(--accent-green)' }}>
          <Plus size={14} /> Push
        </button>
        <button onClick={() => doOp('pop')} disabled={stackData.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 disabled:opacity-40"
          style={{ background: 'rgba(255,0,170,0.15)', color: 'var(--accent-magenta)', border: '1px solid var(--accent-magenta)' }}>
          <Minus size={14} /> Pop
        </button>
      </div>

      {/* Stack visualization */}
      <div className="rounded-xl p-4 flex-1 flex flex-col items-center justify-end gap-0"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minHeight: '280px' }}>
        <div className="flex flex-col-reverse gap-1.5 w-48">
          <AnimatePresence>
            {displayStack.map((val, i) => {
              const isTop = i === displayStack.length - 1;
              const isHighlighted = i === highlight;
              return (
                <motion.div
                  key={`${val}-${i}`}
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="rounded-lg px-4 py-3 text-center font-mono font-bold text-sm relative"
                  style={{
                    background: isHighlighted ? 'rgba(0,229,255,0.2)' : isTop ? 'rgba(0,229,255,0.1)' : 'var(--bg-secondary)',
                    border: isHighlighted ? '2px solid var(--accent-cyan)' : isTop ? '1px solid rgba(0,229,255,0.4)' : '1px solid var(--border)',
                    color: isTop ? 'var(--accent-cyan)' : 'var(--text-primary)',
                  }}
                >
                  {val}
                  {isTop && (
                    <span className="absolute -right-16 top-1/2 -translate-y-1/2 text-xs font-mono"
                      style={{ color: 'var(--accent-cyan)' }}>← TOP</span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          {displayStack.length === 0 && (
            <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
              <div className="text-3xl mb-2">📭</div>
              <p className="text-sm">Stack is empty</p>
            </div>
          )}
        </div>
        {/* Base */}
        <div className="mt-3 w-56 h-1.5 rounded-full" style={{ background: 'var(--border-bright)' }} />
        <div className="text-xs mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>BOTTOM</div>
      </div>

      {message && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.2)' }}>
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{message}</p>
        </div>
      )}

      {/* Code snippet */}
      <div className="rounded-xl p-4 font-mono text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div style={{ color: 'var(--text-muted)' }}>// Stack operations</div>
        <div style={{ color: '#00ff88' }}>class Stack {'{'}</div>
        <div className="pl-4" style={{ color: 'var(--text-secondary)' }}>  push(val) {'{'} this.data.push(val); {'}'} {'// O(1)'}</div>
        <div className="pl-4" style={{ color: 'var(--text-secondary)' }}>  pop()     {'{'} return this.data.pop(); {'}'} {'// O(1)'}</div>
        <div className="pl-4" style={{ color: 'var(--text-secondary)' }}>  peek()    {'{'} return this.data.at(-1); {'}'} {'// O(1)'}</div>
        <div style={{ color: '#00ff88' }}>{'}'}</div>
      </div>
    </div>
  );
}

export function QueueVisualizer() {
  const { queueData, setQueueData } = useStore();
  const [inputVal, setInputVal] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState('');

  const step = steps[currentStep];
  const displayQueue = step?.queue ?? queueData;
  const highlight = step?.highlight ?? -1;

  const doOp = (op) => {
    const val = op === 'enqueue' ? (parseInt(inputVal) || Math.floor(Math.random() * 99) + 1) : undefined;
    const { steps: newSteps, newQueue } = queueOperationSteps(queueData, op, val);
    setSteps(newSteps);
    setCurrentStep(0);
    setMessage(newSteps[newSteps.length - 1]?.explanation || '');
    setQueueData(newQueue);
    setInputVal('');
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-auto">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Queue</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>FIFO — First In, First Out. Enqueue at rear, dequeue from front.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Size', value: queueData.length },
          { label: 'Front', value: queueData.length > 0 ? queueData[0] : '—' },
          { label: 'Rear', value: queueData.length > 0 ? queueData[queueData.length - 1] : '—' },
        ].map(m => (
          <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-display font-bold" style={{ color: 'var(--accent-amber)' }}>{m.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Value (optional)"
          className="flex-1 px-3 py-2 rounded-lg text-sm font-mono"
          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', outline: 'none' }}
          onKeyDown={e => e.key === 'Enter' && doOp('enqueue')}
        />
        <button onClick={() => doOp('enqueue')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
          style={{ background: 'rgba(255,179,0,0.15)', color: 'var(--accent-amber)', border: '1px solid var(--accent-amber)' }}>
          <Plus size={14} /> Enqueue
        </button>
        <button onClick={() => doOp('dequeue')} disabled={queueData.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 disabled:opacity-40"
          style={{ background: 'rgba(255,0,170,0.15)', color: 'var(--accent-magenta)', border: '1px solid var(--accent-magenta)' }}>
          <Minus size={14} /> Dequeue
        </button>
      </div>

      {/* Queue visualization — horizontal */}
      <div className="rounded-xl p-6 flex-1 flex flex-col items-center justify-center"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minHeight: '200px' }}>
        {displayQueue.length === 0 ? (
          <div className="text-center" style={{ color: 'var(--text-muted)' }}>
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm">Queue is empty</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="flex items-center justify-center gap-0 min-w-max mx-auto">
              <div className="text-xs font-mono mr-2" style={{ color: 'var(--accent-amber)' }}>FRONT →</div>
              <AnimatePresence>
                {displayQueue.map((val, i) => (
                  <motion.div
                    key={`${val}-${i}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="relative"
                  >
                    <div
                      className="w-14 h-14 flex items-center justify-center font-mono font-bold text-sm border-y border-r first:border-l first:rounded-l-lg last:rounded-r-lg"
                      style={{
                        background: i === highlight ? 'rgba(255,179,0,0.2)' : i === 0 ? 'rgba(255,179,0,0.1)' : 'var(--bg-secondary)',
                        borderColor: i === highlight ? 'var(--accent-amber)' : i === 0 ? 'rgba(255,179,0,0.5)' : 'var(--border)',
                        color: i === 0 ? 'var(--accent-amber)' : 'var(--text-primary)',
                      }}
                    >
                      {val}
                    </div>
                    <div className="text-xs text-center font-mono mt-1" style={{ color: 'var(--text-muted)' }}>{i}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="text-xs font-mono ml-2" style={{ color: 'var(--accent-magenta)' }}>← REAR</div>
            </div>
          </div>
        )}
      </div>

      {message && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,179,0,0.05)', border: '1px solid rgba(255,179,0,0.2)' }}>
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{message}</p>
        </div>
      )}
    </div>
  );
}
