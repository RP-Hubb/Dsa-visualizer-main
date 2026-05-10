import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SORTING_ALGORITHMS } from '../../algorithms/sorting';
import { generateRandomArray } from '../../utils';
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react';

const BAR_COLORS = {
  default: '#00e5ff',
  comparing: '#ffb300',
  swapping: '#ff00aa',
  sorted: '#00ff88',
  pivot: '#7c3aed',
};

function getBarColor(i, step) {
  if (!step) return BAR_COLORS.default;
  const sorted = Array.isArray(step.sorted) ? step.sorted : [];
  if (sorted.includes(i)) return BAR_COLORS.sorted;
  if (step.pivot === i) return BAR_COLORS.pivot;
  if (step.swapping?.includes(i)) return BAR_COLORS.swapping;
  if (step.comparing?.includes(i)) return BAR_COLORS.comparing;
  return BAR_COLORS.default;
}

function MiniSortPanel({ algoKey, steps, currentStep, label, color }) {
  const step = steps[currentStep];
  const arr = step?.array || [];
  const maxVal = Math.max(...arr, 1);

  return (
    <div className="flex-1 rounded-xl overflow-hidden flex flex-col" style={{ background: 'var(--bg-card)', border: `1px solid ${color}44` }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${color}33`, background: `${color}11` }}>
        <span className="font-display font-bold text-sm" style={{ color }}>{label}</span>
        <div className="flex gap-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          <span>Ops: <span style={{ color }}>{step?.operations ?? 0}</span></span>
          <span>Step: <span style={{ color }}>{currentStep + 1}/{steps.length}</span></span>
        </div>
      </div>
      <div className="flex-1 p-3 flex items-end gap-px" style={{ minHeight: '180px' }}>
        {arr.map((val, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all duration-100"
            style={{
              height: `${(val / maxVal) * 100}%`,
              background: getBarColor(i, step),
              minWidth: '3px',
            }}
          />
        ))}
      </div>
      {/* Progress */}
      <div className="px-4 py-2" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0}%`, background: color }}
          />
        </div>
      </div>
      {step?.explanation && (
        <div className="px-4 pb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          {step.explanation.slice(0, 80)}{step.explanation.length > 80 ? '…' : ''}
        </div>
      )}
    </div>
  );
}

const ALGO_COLORS = {
  bubble: '#00e5ff',
  selection: '#ff00aa',
  insertion: '#00ff88',
  merge: '#ffb300',
  quick: '#7c3aed',
};

export default function ComparisonMode() {
  const [algo1, setAlgo1] = useState('bubble');
  const [algo2, setAlgo2] = useState('quick');
  const [arraySize, setArraySize] = useState(25);
  const [steps1, setSteps1] = useState([]);
  const [steps2, setSteps2] = useState([]);
  const [step1, setStep1] = useState(0);
  const [step2, setStep2] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [winner, setWinner] = useState(null);

  // Refs so the async loop always has current values
  const playRef  = useRef(false);
  const step1Ref = useRef(0);
  const step2Ref = useRef(0);
  const steps1Ref = useRef([]);
  const steps2Ref = useRef([]);
  const speedRef  = useRef(speed);

  // Keep refs in sync with state
  useEffect(() => { step1Ref.current = step1; }, [step1]);
  useEffect(() => { step2Ref.current = step2; }, [step2]);
  useEffect(() => { steps1Ref.current = steps1; }, [steps1]);
  useEffect(() => { steps2Ref.current = steps2; }, [steps2]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const generate = useCallback((size = arraySize) => {
    const arr = generateRandomArray(size, 5, 95);
    const s1 = SORTING_ALGORITHMS[algo1].generate([...arr]);
    const s2 = SORTING_ALGORITHMS[algo2].generate([...arr]);
    setSteps1(s1); steps1Ref.current = s1;
    setSteps2(s2); steps2Ref.current = s2;
    setStep1(0);   step1Ref.current = 0;
    setStep2(0);   step2Ref.current = 0;
    setWinner(null);
    setIsPlaying(false);
    playRef.current = false;
  }, [algo1, algo2, arraySize]);

  const handlePlay = () => {
    if (steps1.length === 0) { generate(); return; }
    if (isPlaying) {
      // Pause
      setIsPlaying(false);
      playRef.current = false;
      return;
    }
    // Start / Resume
    setIsPlaying(true);
    playRef.current = true;

    const run = async () => {
      while (playRef.current) {
        await new Promise(r => setTimeout(r, speedRef.current));
        if (!playRef.current) break;

        const s1 = steps1Ref.current;
        const s2 = steps2Ref.current;
        const done1 = step1Ref.current >= s1.length - 1;
        const done2 = step2Ref.current >= s2.length - 1;

        if (!done1) {
          const next = step1Ref.current + 1;
          step1Ref.current = next;
          setStep1(next);
        }
        if (!done2) {
          const next = step2Ref.current + 1;
          step2Ref.current = next;
          setStep2(next);
        }
        if (done1 && done2) {
          const ops1 = s1[s1.length - 1]?.operations || 0;
          const ops2 = s2[s2.length - 1]?.operations || 0;
          setWinner(ops1 <= ops2 ? algo1 : algo2);
          setIsPlaying(false);
          playRef.current = false;
          break;
        }
      }
    };
    run();
  };

  const handleReset = () => {
    setIsPlaying(false);
    playRef.current = false;
    setStep1(0); step1Ref.current = 0;
    setStep2(0); step2Ref.current = 0;
    setWinner(null);
  };

  const ops1 = steps1[steps1.length - 1]?.operations || 0;
  const ops2 = steps2[steps2.length - 1]?.operations || 0;

  return (
    <div className="flex flex-col h-full gap-4 p-4 overflow-auto">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Comparison Mode</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Race two sorting algorithms on the same dataset side-by-side
        </p>
      </div>

      {/* Selector */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { value: algo1, set: setAlgo1, label: 'Algorithm 1' },
          { value: algo2, set: setAlgo2, label: 'Algorithm 2' },
        ].map(({ value, set, label }, idx) => (
          <div key={idx} className="rounded-xl p-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-xs mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>{label}</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(SORTING_ALGORITHMS).map(([key, a]) => (
                <button
                  key={key}
                  onClick={() => set(key)}
                  className="px-2.5 py-1 rounded-lg text-xs transition-all"
                  style={{
                    background: value === key ? `${ALGO_COLORS[key]}22` : 'var(--bg-secondary)',
                    color: value === key ? ALGO_COLORS[key] : 'var(--text-secondary)',
                    border: `1px solid ${value === key ? ALGO_COLORS[key] : 'var(--border)'}`,
                  }}
                >
                  {a.name.replace(' Sort', '')}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={generate} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
          style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,229,255,0.3)' }}>
          <Shuffle size={14} /> Generate ({arraySize} elements)
        </button>

        <button onClick={handlePlay} disabled={steps1.length === 0 && !isPlaying}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 disabled:opacity-40"
          style={{ background: isPlaying ? 'rgba(255,0,170,0.15)' : 'rgba(0,255,136,0.15)', color: isPlaying ? 'var(--accent-magenta)' : 'var(--accent-green)', border: `1px solid ${isPlaying ? 'var(--accent-magenta)' : 'var(--accent-green)'}` }}>
          {isPlaying ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Race!</>}
        </button>

        <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          <RotateCcw size={14} /> Reset
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Size: {arraySize}</span>
          <input type="range" min={10} max={60} value={arraySize} onChange={e => setArraySize(Number(e.target.value))}
            className="w-24 h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: 'var(--accent-cyan)' }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Speed</span>
          <input type="range" min={50} max={600} step={50} value={600 - speed + 50} onChange={e => setSpeed(600 - Number(e.target.value) + 50)}
            className="w-24 h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: 'var(--accent-cyan)' }} />
        </div>
      </div>

      {/* Winner banner */}
      {winner && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4 text-center"
          style={{ background: `${ALGO_COLORS[winner]}22`, border: `1px solid ${ALGO_COLORS[winner]}` }}
        >
          <div className="font-display text-lg font-bold" style={{ color: ALGO_COLORS[winner] }}>
            🏆 {SORTING_ALGORITHMS[winner].name} wins with fewer operations!
          </div>
          <div className="text-xs mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>
            {SORTING_ALGORITHMS[algo1].name}: {ops1} ops · {SORTING_ALGORITHMS[algo2].name}: {ops2} ops
          </div>
        </motion.div>
      )}

      {/* Side-by-side panels */}
      {steps1.length > 0 ? (
        <div className="flex gap-4 flex-1">
          <MiniSortPanel algoKey={algo1} steps={steps1} currentStep={step1} label={SORTING_ALGORITHMS[algo1].name} color={ALGO_COLORS[algo1]} />
          <MiniSortPanel algoKey={algo2} steps={steps2} currentStep={step2} label={SORTING_ALGORITHMS[algo2].name} color={ALGO_COLORS[algo2]} />
        </div>
      ) : (
        <div className="flex-1 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--bg-card)', border: '2px dashed var(--border)' }}>
          <div className="text-center">
            <div className="text-4xl mb-3">⚔️</div>
            <p className="font-display text-lg" style={{ color: 'var(--text-secondary)' }}>Click "Generate" then "Race!" to compare algorithms</p>
          </div>
        </div>
      )}

      {/* Complexity comparison table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <table className="w-full text-xs font-mono">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
              {['Algorithm', 'Best', 'Average', 'Worst', 'Space', 'Stable'].map(h => (
                <th key={h} className="px-3 py-2 text-left" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[algo1, algo2].map((key, ri) => {
              const a = SORTING_ALGORITHMS[key];
              return (
                <tr key={key} style={{ borderBottom: ri === 0 ? '1px solid var(--border)' : 'none' }}>
                  <td className="px-3 py-2 font-bold" style={{ color: ALGO_COLORS[key] }}>{a.name}</td>
                  <td className="px-3 py-2" style={{ color: '#00ff88' }}>{a.timeComplexity.best}</td>
                  <td className="px-3 py-2" style={{ color: '#ffb300' }}>{a.timeComplexity.average}</td>
                  <td className="px-3 py-2" style={{ color: '#ff6600' }}>{a.timeComplexity.worst}</td>
                  <td className="px-3 py-2" style={{ color: '#00e5ff' }}>{a.spaceComplexity}</td>
                  <td className="px-3 py-2" style={{ color: a.stable ? '#00ff88' : '#ff00aa' }}>{a.stable ? '✓ Yes' : '✗ No'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
