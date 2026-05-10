import { useEffect, useRef, useCallback, useState } from 'react';
import { useStore } from '../../store';
import { SORTING_ALGORITHMS } from '../../algorithms/sorting';
import { generateRandomArray } from '../../utils';
import PlaybackControls from '../shared/PlaybackControls';
import CodePanel from '../shared/CodePanel';
import { Shuffle, Settings2 } from 'lucide-react';

const BAR_COLORS = {
  default:   'linear-gradient(180deg, #00e5ff, #0066aa)',
  comparing: 'linear-gradient(180deg, #ffb300, #ff6600)',
  swapping:  'linear-gradient(180deg, #ff00aa, #aa0066)',
  sorted:    'linear-gradient(180deg, #00ff88, #00aa55)',
  pivot:     'linear-gradient(180deg, #7c3aed, #4c1d95)',
};

function getBarColor(index, step) {
  if (!step) return BAR_COLORS.default;
  const sortedArr = Array.isArray(step.sorted) ? step.sorted : [];
  if (sortedArr.includes(index))      return BAR_COLORS.sorted;
  if (step.pivot === index)           return BAR_COLORS.pivot;
  if (step.swapping?.includes(index)) return BAR_COLORS.swapping;
  if (step.comparing?.includes(index))return BAR_COLORS.comparing;
  return BAR_COLORS.default;
}

export default function SortingVisualizer() {
  const {
    sortArray, setSortArray,
    sortSteps, setSortSteps,
    sortCurrentStep, setSortCurrentStep,
    sortIsPlaying, setSortIsPlaying,
    sortSpeed, setSortSpeed,
    sortArraySize, setSortArraySize,
    activeAlgorithm, setActiveAlgorithm,
  } = useStore();

  const [customInput, setCustomInput] = useState('');
  const [elapsedMs, setElapsedMs] = useState(0);

  // Refs for imperative control — avoid stale closure bugs
  const currentStepRef = useRef(sortCurrentStep);
  useEffect(() => { currentStepRef.current = sortCurrentStep; }, [sortCurrentStep]);
  const playRef = useRef(false);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const stepsRef = useRef(sortSteps);
  useEffect(() => { stepsRef.current = sortSteps; }, [sortSteps]);
  const speedRef = useRef(sortSpeed);
  useEffect(() => { speedRef.current = sortSpeed; }, [sortSpeed]);

  // Fall back to bubble if activeAlgorithm isn't a sort key (e.g. 'bfs')
  const algoKey = SORTING_ALGORITHMS[activeAlgorithm] ? activeAlgorithm : 'bubble';
  const algo = SORTING_ALGORITHMS[algoKey];
  const currentStep = sortSteps[sortCurrentStep] ?? null;

  // Generate array — depends on algoKey string not object ref
  const generateArray = useCallback((size) => {
    const sz = size ?? sortArraySize;
    const arr = generateRandomArray(sz);
    const steps = SORTING_ALGORITHMS[algoKey].generate(arr);
    setSortArray(arr);
    setSortSteps(steps);
    setSortIsPlaying(false);
    setElapsedMs(0);
    playRef.current = false;
    clearInterval(timerRef.current);
  }, [algoKey, sortArraySize, setSortArray, setSortSteps, setSortIsPlaying]);

  useEffect(() => { generateArray(); }, [algoKey]);

  // Timer display
  useEffect(() => {
    if (sortIsPlaying) {
      startTimeRef.current = Date.now() - elapsedMs;
      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [sortIsPlaying]);

  // Async play loop — uses refs so it always has current step and speed
  useEffect(() => {
    if (!sortIsPlaying) { playRef.current = false; return; }
    playRef.current = true;
    const run = async () => {
      while (playRef.current) {
        await new Promise(r => setTimeout(r, speedRef.current));
        if (!playRef.current) break;
        const next = currentStepRef.current + 1;
        const total = stepsRef.current.length;
        if (next >= total) {
          setSortCurrentStep(total - 1);
          setSortIsPlaying(false);
          playRef.current = false;
          break;
        }
        setSortCurrentStep(next);
      }
    };
    run();
  }, [sortIsPlaying, sortSteps, setSortCurrentStep, setSortIsPlaying]);

  const handlePlayPause = () => {
    if (sortCurrentStep >= sortSteps.length - 1) return;
    setSortIsPlaying(!sortIsPlaying);
  };

  const handleReset = () => {
    playRef.current = false;
    setSortIsPlaying(false);
    setSortCurrentStep(0);
    setElapsedMs(0);
    clearInterval(timerRef.current);
  };

  const handleStepBack = () => {
    if (sortIsPlaying) { setSortIsPlaying(false); playRef.current = false; }
    if (sortCurrentStep > 0) setSortCurrentStep(sortCurrentStep - 1);
  };

  const handleStepForward = () => {
    if (sortIsPlaying) { setSortIsPlaying(false); playRef.current = false; }
    if (sortCurrentStep < sortSteps.length - 1) setSortCurrentStep(sortCurrentStep + 1);
  };

  // FIX #3: Instantly set to final step — no loop, no setTimeout chain
  const handleJumpToEnd = () => {
    playRef.current = false;
    setSortIsPlaying(false);
    clearInterval(timerRef.current);
    const last = sortSteps.length - 1;
    if (last >= 0) setSortCurrentStep(last);
  };

  // FIX #1: Uses the unified setter — sidebar stays in sync automatically
  const handleAlgoChange = (key) => {
    if (key === algoKey) return;
    playRef.current = false;
    setSortIsPlaying(false);
    setActiveAlgorithm(key);
  };

  const handleCustomInput = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    try {
      const arr = trimmed.split(',').map(s => {
        const n = parseInt(s.trim(), 10);
        if (isNaN(n) || n < 1 || n > 500) throw new Error();
        return n;
      });
      if (arr.length < 2 || arr.length > 80) throw new Error();
      const steps = algo.generate([...arr]);
      setSortArray(arr);
      setSortSteps(steps);
      setSortIsPlaying(false);
      setElapsedMs(0);
      playRef.current = false;
    } catch {
      alert('Enter 2–80 comma-separated integers between 1 and 500.');
    }
  };

  const displayArray = currentStep?.array ?? sortArray;
  const maxVal = displayArray.length > 0 ? Math.max(...displayArray, 1) : 1;
  const displayOps = currentStep?.operations ?? 0;

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto" style={{ minHeight: '100%' }}>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {algo.name}
          </h1>
          <div className="flex flex-wrap gap-3 mt-1 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            <span>Best: <span style={{ color: '#00ff88' }}>{algo.timeComplexity.best}</span></span>
            <span>· Avg: <span style={{ color: '#ffb300' }}>{algo.timeComplexity.average}</span></span>
            <span>· Worst: <span style={{ color: '#ff6600' }}>{algo.timeComplexity.worst}</span></span>
            <span>· Space: <span style={{ color: '#00e5ff' }}>{algo.spaceComplexity}</span></span>
          </div>
        </div>

        {/* Top algorithm tabs — FIX #1: algoKey mirrors activeAlgorithm */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(SORTING_ALGORITHMS).map(([key, a]) => (
            <button
              key={key}
              onClick={() => handleAlgoChange(key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
              style={{
                background: algoKey === key ? 'rgba(0,229,255,0.15)' : 'var(--bg-card)',
                color:      algoKey === key ? 'var(--accent-cyan)'    : 'var(--text-secondary)',
                border:     `1px solid ${algoKey === key ? 'var(--accent-cyan)' : 'var(--border)'}`,
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
          { label: 'Operations', value: displayOps,                            color: 'var(--accent-cyan)'   },
          { label: 'Array Size', value: displayArray.length,                   color: 'var(--accent-purple)' },
          { label: 'Step',       value: `${sortCurrentStep + 1} / ${sortSteps.length || 1}`, color: 'var(--accent-amber)' },
        ].map(m => (
          <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-display font-bold tabular-nums" style={{ color: m.color }}>{m.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap text-xs">
        {[
          { label: 'Default',   color: '#00e5ff' },
          { label: 'Comparing', color: '#ffb300' },
          { label: 'Swapping',  color: '#ff00aa' },
          { label: 'Sorted',    color: '#00ff88' },
          { label: 'Pivot',     color: '#7c3aed' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: l.color }} />
            <span style={{ color: 'var(--text-muted)' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Bar chart — fixed height so it never collapses */}
      <div
        className="rounded-xl p-4 flex items-end gap-px overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', height: '240px', flexShrink: 0 }}
      >
        {displayArray.map((val, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm relative group cursor-default"
            style={{
              height: `${(val / maxVal) * 100}%`,
              background: getBarColor(i, currentStep),
              minWidth: '3px',
              transition: 'height 0.08s ease, background 0.12s ease',
            }}
          >
            {displayArray.length <= 30 && (
              <div
                className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-mono
                            pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap' }}
              >
                {val}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <Settings2 size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>ARRAY SETTINGS</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs w-20 shrink-0" style={{ color: 'var(--text-secondary)' }}>Size: {sortArraySize}</span>
            <input
              type="range" min={5} max={80} value={sortArraySize}
              onChange={e => setSortArraySize(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: 'var(--accent-cyan)' }}
            />
          </div>
          <button
            onClick={() => generateArray()}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,229,255,0.3)' }}
          >
            <Shuffle size={14} /> Generate Random Array
          </button>
          <div className="flex gap-2">
            <input
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder="e.g. 5, 12, 3, 8, 21"
              className="flex-1 px-3 py-1.5 rounded-lg text-xs font-mono"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)', outline: 'none' }}
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

        <PlaybackControls
          isPlaying={sortIsPlaying}
          onPlayPause={handlePlayPause}
          onReset={handleReset}
          onStepBack={handleStepBack}
          onStepForward={handleStepForward}
          onJumpToEnd={handleJumpToEnd}
          currentStep={sortCurrentStep}
          totalSteps={sortSteps.length}
          speed={sortSpeed}
          onSpeedChange={setSortSpeed}
        />
      </div>

      {/* Code panel — FIX #2: no maxHeight, grows naturally */}
      <CodePanel
        code={algo.code}
        activeLine={currentStep?.codeLine ?? -1}
        explanation={currentStep?.explanation ?? 'Press Play or use step controls to begin.'}
        complexity={algo}
        algorithmName={algo.name}
      />
    </div>
  );
}
