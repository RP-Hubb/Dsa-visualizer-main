import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search } from 'lucide-react';

export default function ArrayVisualizer() {
  const [arr, setArr] = useState([15, 8, 42, 3, 27, 19, 55, 11]);
  const [inputVal, setInputVal] = useState('');
  const [inputIdx, setInputIdx] = useState('');
  const [highlighted, setHighlighted] = useState([]);
  const [found, setFound] = useState(null);
  const [message, setMessage] = useState('Click an operation to begin.');

  const flash = (indices, duration = 1200) => {
    setHighlighted(indices);
    setTimeout(() => setHighlighted([]), duration);
  };

  const handleInsert = () => {
    const val = parseInt(inputVal);
    const idx = parseInt(inputIdx);
    if (isNaN(val)) { setMessage('Enter a valid number'); return; }
    const newArr = [...arr];
    const insertAt = isNaN(idx) ? newArr.length : Math.min(Math.max(idx, 0), newArr.length);
    newArr.splice(insertAt, 0, val);
    setArr(newArr);
    setMessage(`Inserted ${val} at index ${insertAt}. Shifted ${arr.length - insertAt} elements right. O(n)`);
    flash([insertAt]);
    setInputVal(''); setInputIdx('');
  };

  const handleDelete = (idx) => {
    const val = arr[idx];
    const newArr = arr.filter((_, i) => i !== idx);
    setArr(newArr);
    setMessage(`Deleted ${val} at index ${idx}. Shifted ${arr.length - idx - 1} elements left. O(n)`);
  };

  const handleSearch = () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) { setMessage('Enter a value to search'); return; }
    const idx = arr.indexOf(val);
    if (idx === -1) {
      setMessage(`${val} not found. Linear search scanned all ${arr.length} elements. O(n)`);
      setFound(null);
      flash(arr.map((_, i) => i), 2000);
    } else {
      setMessage(`Found ${val} at index ${idx}! Linear search took ${idx + 1} comparisons.`);
      setFound(idx);
      flash([idx]);
    }
  };

  const handleReverse = () => {
    setArr([...arr].reverse());
    setMessage(`Array reversed in O(n) time by swapping from both ends.`);
    flash(arr.map((_, i) => i), 800);
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-auto">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Array</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Contiguous memory. O(1) access by index, O(n) insert/delete (due to shifting).
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Length', value: arr.length },
          { label: 'Min', value: arr.length ? Math.min(...arr) : '—' },
          { label: 'Max', value: arr.length ? Math.max(...arr) : '—' },
          { label: 'Sum', value: arr.reduce((a, b) => a + b, 0) },
        ].map(m => (
          <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-display font-bold" style={{ color: 'var(--accent-green)' }}>{m.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <input value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="Value"
          className="px-3 py-2 rounded-lg text-sm font-mono w-24"
          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', outline: 'none' }} />
        <input value={inputIdx} onChange={e => setInputIdx(e.target.value)} placeholder="Index"
          className="px-3 py-2 rounded-lg text-sm font-mono w-24"
          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', outline: 'none' }} />
        <button onClick={handleInsert}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'rgba(0,255,136,0.15)', color: 'var(--accent-green)', border: '1px solid var(--accent-green)' }}>
          <Plus size={14} /> Insert
        </button>
        <button onClick={handleSearch}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'rgba(0,229,255,0.15)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,229,255,0.4)' }}>
          <Search size={14} /> Search
        </button>
        <button onClick={handleReverse}
          className="px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--accent-purple)', border: '1px solid rgba(124,58,237,0.4)' }}>
          Reverse
        </button>
      </div>

      {/* Array display */}
      <div className="rounded-xl p-6 overflow-x-auto"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minHeight: '160px' }}>
        {arr.length === 0 ? (
          <div className="flex items-center justify-center h-24" style={{ color: 'var(--text-muted)' }}>
            <p className="text-sm">Array is empty</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Index row */}
            <div className="flex gap-1 min-w-max">
              {arr.map((_, i) => (
                <div key={i} className="w-14 text-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{i}</div>
              ))}
            </div>
            {/* Value row */}
            <div className="flex gap-1 min-w-max">
              <AnimatePresence>
                {arr.map((val, i) => {
                  const isHighlighted = highlighted.includes(i);
                  const isFound = found === i;
                  return (
                    <motion.div
                      key={`${i}-${val}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative group"
                    >
                      <div className="w-14 h-14 flex items-center justify-center font-mono font-bold text-sm rounded-lg border-2 transition-all duration-200"
                        style={{
                          background: isFound ? 'rgba(0,255,136,0.2)' : isHighlighted ? 'rgba(0,229,255,0.15)' : 'var(--bg-secondary)',
                          borderColor: isFound ? 'var(--accent-green)' : isHighlighted ? 'var(--accent-cyan)' : 'var(--border)',
                          color: isFound ? 'var(--accent-green)' : isHighlighted ? 'var(--accent-cyan)' : 'var(--text-primary)',
                          boxShadow: isFound ? '0 0 12px rgba(0,255,136,0.4)' : isHighlighted ? '0 0 8px rgba(0,229,255,0.3)' : 'none',
                        }}>
                        {val}
                      </div>
                      <button
                        onClick={() => handleDelete(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(255,0,170,0.9)', color: 'white' }}>
                        ×
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            {/* Memory address row */}
            <div className="flex gap-1 min-w-max">
              {arr.map((_, i) => (
                <div key={i} className="w-14 text-center" style={{ fontSize: '9px', fontFamily: 'Space Mono', color: 'var(--text-muted)' }}>
                  0x{(1000 + i * 4).toString(16).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {message && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)' }}>
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{message}</p>
        </div>
      )}

      {/* Complexity table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <table className="w-full text-xs font-mono">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
              <th className="px-3 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Operation</th>
              <th className="px-3 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Average</th>
              <th className="px-3 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Access by index', 'O(1)', 'Direct memory address calculation'],
              ['Search (unsorted)', 'O(n)', 'Linear scan required'],
              ['Insert at end', 'O(1)*', 'Amortized with dynamic array'],
              ['Insert at i', 'O(n)', 'Shift n-i elements'],
              ['Delete', 'O(n)', 'Shift elements to fill gap'],
            ].map(([op, c, n]) => (
              <tr key={op} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{op}</td>
                <td className="px-3 py-2" style={{ color: '#ffb300' }}>{c}</td>
                <td className="px-3 py-2" style={{ color: 'var(--text-muted)' }}>{n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
