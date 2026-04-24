import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { SORTING_ALGORITHMS } from '../../algorithms/sorting';
import { generateRandomArray } from '../../utils';
import PlaybackControls from '../shared/PlaybackControls';
import CodePanel from '../shared/CodePanel';
import { Shuffle, Settings2, BarChart2 } from 'lucide-react';

const BAR_COLORS = {
  default: 'linear-gradient(180deg, #00e5ff, #0066aa)',
  comparing: 'linear-gradient(180deg, #ffb300, #ff6600)',
  swapping: 'linear-gradient(180deg, #ff00aa, #aa0066)',
  sorted: 'linear-gradient(180deg, #00ff88, #00aa55)',
  pivot: 'linear-gradient(180deg, #7c3aed, #4c1d95)',
};

function getBarColor(i, step) {
  if (!step) return BAR_COLORS.default;
  const sortedArr = Array.isArray(step.sorted) ? step.sorted : [];
  if (sortedArr.includes(i)) return BAR_COLORS.sorted;
  if (step.pivot === i) return BAR_COLORS.pivot;
  if (step.swapping && step.swapping.includes(i)) return BAR_COLORS.swapping;
  if (step.comparing && step.comparing.includes(i)) return BAR_COLORS.comparing;
  return BAR_COLORS.default;
}

export default function SortingVisualizer() {
  const {
    sortArray, setSortArray, sortSteps, setSortSteps,
    sortCurrentStep, setSortCurrentStep, sortIsPlaying, setSortIsPlaying,
    sortSpeed, setSortSpeed, sortAlgorithm, setSortAlgorithm,
    sortArraySize, setSortArraySize,
  } = useStore();

  const [customInput, setCustomInput] = useState('');
  const [metrics, setMetrics] = useState({ operations: 0, time: 0 });
  const [startTime, setStartTime] = useState(null);
  const timerRef = useRef(null);
  const playRef = useRef(false);

  const algo = SORTING_ALGORITHMS[sortAlgorithm];
  const currentStep = sortSteps[sortCurrentStep];

  const generateArray = useCallback((size = sortArraySize) => {
    const arr = generateRandomArray(size);
    setSortArray(arr);
    const steps = algo.generate(arr);
    setSortSteps(steps);
    setSortIsPlaying(false);
    setMetrics({ operations: 0, time: 0 });
    playRef.current = false;
    clearInterval(timerRef.current);
  }, [sortArraySize, algo]);

  useEffect(() => { generateArray(); }, [sortAlgorithm]);

  useEffect(() => {
    if (sortIsPlaying) {
      setStartTime(Date.now());
      timerRef.current = setInterval(() => {
        setMetrics(m => ({ ...m, time: Date.now() - startTime }));
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [sortIsPlaying]);

  useEffect(() => {
    playRef.current = sortIsPlaying;
    if (!sortIsPlaying) return;
    const run = async () => {
      let step = sortCurrentStep;
      while (step < sortSteps.length - 1 && playRef.current) {
        await new Promise(r => setTimeout(r, sortSpeed));
        if (!playRef.current) break;
        step++;
        setSortCurrentStep(step);
        setMetrics(m => ({ ...m, operations: sortSteps[step]?.operations || m.operations }));
        if (step >= sortSteps.length - 1) { setSortIsPlaying(false); break; }
      }
    };
    run();
  }, [sortIsPlaying]);

  const handlePlayPause = () => {
    if (sortCurrentStep >= sortSteps.length - 1) return;
    setSortIsPlaying(!sortIsPlaying);
  };

  const handleReset = () => {
    setSortIsPlaying(false);
    playRef.current = false;
    setSortCurrentStep(0);
    setMetrics({ operations: 0, time: 0 });
  };

  const handleStepBack = () => {
    if (sortCurrentStep > 0) setSortCurrentStep(sortCurrentStep - 1);
  };

  const handleStepForward = () => {
    if (sortCurrentStep < sortSteps.length - 1) setSortCurrentStep(sortCurrentStep + 1);
  };

  const handleCustomInput = () => {
    try {
      const arr = customInput.split(',').map(s => {
        const n = parseInt(s.trim());
        if (isNaN(n) || n < 1 || n > 200) throw new Error();
        return n;
      });
      if (arr.length < 2 || arr.length > 50) throw new Error();
      setSortArray(arr);
      const steps = algo.generate(arr);
      setSortSteps(steps);
      setSortCurrentStep(0);
      setSortIsPlaying(false);
      setMetrics({ operations: 0, time: 0 });
    } catch {
      alert('Please enter 2–50 comma-separated numbers between 1 and 200.');
    }
  };

  const displayArray = currentStep?.array || sortArray;
  const maxVal = Math.max(...displayArray, 1);

  return (
    <div className="flex flex-col h-full gap-4 p-4 overflow-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {algo.name}
          </h1>
          <div className="flex gap-3 mt-1 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            <span>⏱ Best: <span style={{ color: '#00ff88' }}>{algo.timeComplexity.best}</span></span>
            <span>· Avg: <span style={{ color: '#ffb300' }}>{algo.timeComplexity.average}</span></span>
            <span>· Worst: <span style={{ color: '#ff6600' }}>{algo.timeComplexity.worst}</span></span>
            <span>· Space: <span style={{ color: '#00e5ff' }}>{algo.spaceComplexity}</span></span>
          </div>
        </div>

        {/* Algorithm selector */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(SORTING_ALGORITHMS).map(([key, a]) => (
            <button
              key={key}
              onClick={() => { setSortAlgorithm(key); setSortIsPlaying(false); playRef.current = false; }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
              style={{
                background: sortAlgorithm === key ? 'rgba(0,229,255,0.15)' : 'var(--bg-card)',
                color: sortAlgorithm === key ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: `1px solid ${sortAlgorithm === key ? 'var(--accent-cyan)' : 'var(--border)'}`,
              }}
            >
              {a.name.replace(' Sort', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Operations', value: currentStep?.operations ?? metrics.operations, color: 'var(--accent-cyan)' },
          { label: 'Array Size', value: displayArray.length, color: 'var(--accent-purple)' },
          { label: 'Step', value: `${sortCurrentStep + 1}/${sortSteps.length}`, color: 'var(--accent-amber)' },
        ].map(m => (
          <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-display font-bold" style={{ color: m.color }}>{m.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap text-xs">
        {[
          { label: 'Default', color: '#00e5ff' },
          { label: 'Comparing', color: '#ffb300' },
          { label: 'Swapping', color: '#ff00aa' },
          { label: 'Sorted', color: '#00ff88' },
          { label: 'Pivot', color: '#7c3aed' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
            <span style={{ color: 'var(--text-muted)' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Bars visualization */}
      <div
        className="flex-1 rounded-xl p-4 flex items-end gap-px overflow-hidden relative"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minHeight: '220px' }}
      >
        {displayArray.map((val, i) => {
          const color = getBarColor(i, currentStep);
          const heightPct = (val / maxVal) * 100;
          return (
            <motion.div
              key={i}
              layout
              className="flex-1 rounded-t-sm relative group cursor-default"
              style={{
                height: `${heightPct}%`,
                background: color,
                minWidth: '4px',
                transition: 'height 0.1s ease, background 0.15s ease',
              }}
            >
              {displayArray.length <= 30 && (
                <div
                  className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap' }}
                >
                  {val}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Controls row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Settings */}
        <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Settings2 size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>ARRAY SETTINGS</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs w-20" style={{ color: 'var(--text-secondary)' }}>Size: {sortArraySize}</span>
            <input
              type="range" min={5} max={80} value={sortArraySize}
              onChange={e => setSortArraySize(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'var(--accent-cyan)' }}
            />
          </div>

          <button
            onClick={() => generateArray()}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,229,255,0.3)' }}
          >
            <Shuffle size={14} /> Generate Random
          </button>

          <div className="flex gap-2">
            <input
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder="e.g. 5, 12, 3, 8, 21"
              className="flex-1 px-3 py-1.5 rounded-lg text-xs font-mono"
              style={{
                background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                border: '1px solid var(--border)', outline: 'none'
              }}
              onKeyDown={e => e.key === 'Enter' && handleCustomInput()}
            />
            <button
              onClick={handleCustomInput}
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'rgba(124,58,237,0.2)', color: 'var(--accent-purple)', border: '1px solid rgba(124,58,237,0.4)' }}
            >
              Apply
            </button>
          </div>
        </div>

        {/* Playback */}
        <PlaybackControls
          isPlaying={sortIsPlaying}
          onPlayPause={handlePlayPause}
          onReset={handleReset}
          onStepBack={handleStepBack}
          onStepForward={handleStepForward}
          currentStep={sortCurrentStep}
          totalSteps={sortSteps.length}
          speed={sortSpeed}
          onSpeedChange={setSortSpeed}
        />
      </div>

      {/* Code + explanation */}
      <CodePanel
        code={algo.code}
        activeLine={currentStep?.codeLine ?? -1}
        explanation={currentStep?.explanation || 'Press Play or use step controls to begin.'}
        complexity={algo}
        algorithmName={algo.name}
      />
    </div>
  );
}
