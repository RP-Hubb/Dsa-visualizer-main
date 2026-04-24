import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { linkedListInsert, linkedListDelete } from '../../algorithms/dataStructures';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

export default function LinkedListVisualizer() {
  const { linkedListData, setLinkedListData } = useStore();
  const [inputVal, setInputVal] = useState('');
  const [insertPos, setInsertPos] = useState('tail');
  const [message, setMessage] = useState('');
  const [highlightId, setHighlightId] = useState(null);
  const [listType, setListType] = useState('singly'); // singly | doubly

  const handleInsert = () => {
    const val = parseInt(inputVal) || Math.floor(Math.random() * 99) + 1;
    const newList = linkedListInsert(linkedListData, val, insertPos);
    setLinkedListData(newList);
    setMessage(`Inserted ${val} at ${insertPos}. List size: ${newList.length}`);
    const added = insertPos === 'head' ? newList[0] : newList[newList.length - 1];
    setHighlightId(added?.id);
    setTimeout(() => setHighlightId(null), 1000);
    setInputVal('');
  };

  const handleDelete = (id, val) => {
    const newList = linkedListDelete(linkedListData, val);
    setLinkedListData(newList);
    setMessage(`Deleted node with value ${val}`);
  };

  const handleClear = () => {
    setLinkedListData([]);
    setMessage('Linked list cleared');
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-auto">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Linked List</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Dynamic data structure of nodes linked by pointers. Insert/Delete: O(1) at head, O(n) elsewhere.
        </p>
      </div>

      {/* Type toggle */}
      <div className="flex gap-2">
        {['singly', 'doubly'].map(t => (
          <button key={t} onClick={() => setListType(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize"
            style={{
              background: listType === t ? 'rgba(0,229,255,0.15)' : 'var(--bg-card)',
              color: listType === t ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              border: `1px solid ${listType === t ? 'var(--accent-cyan)' : 'var(--border)'}`,
            }}>
            {t} linked list
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Size', value: linkedListData.length },
          { label: 'Head', value: linkedListData[0]?.val ?? '—' },
          { label: 'Tail', value: linkedListData[linkedListData.length - 1]?.val ?? '—' },
        ].map(m => (
          <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-display font-bold" style={{ color: 'var(--accent-purple)' }}>{m.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <input
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Value"
          className="px-3 py-2 rounded-lg text-sm font-mono w-28"
          style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', outline: 'none' }}
          onKeyDown={e => e.key === 'Enter' && handleInsert()}
        />
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          {['head', 'tail'].map(p => (
            <button key={p} onClick={() => setInsertPos(p)}
              className="px-3 py-2 text-xs capitalize"
              style={{
                background: insertPos === p ? 'rgba(124,58,237,0.2)' : 'var(--bg-card)',
                color: insertPos === p ? 'var(--accent-purple)' : 'var(--text-secondary)',
              }}>
              {p}
            </button>
          ))}
        </div>
        <button onClick={handleInsert}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--accent-purple)', border: '1px solid rgba(124,58,237,0.4)' }}>
          <Plus size={14} /> Insert
        </button>
        <button onClick={handleClear} disabled={linkedListData.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
          style={{ background: 'rgba(255,0,170,0.15)', color: 'var(--accent-magenta)', border: '1px solid rgba(255,0,170,0.4)' }}>
          <Trash2 size={14} /> Clear
        </button>
      </div>

      {/* List visualization */}
      <div className="flex-1 rounded-xl p-6 overflow-x-auto"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minHeight: '200px' }}>
        {linkedListData.length === 0 ? (
          <div className="h-full flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
            <div className="text-center">
              <div className="text-4xl mb-2">🔗</div>
              <p className="text-sm">List is empty. Insert some nodes!</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-0 min-w-max">
            {/* NULL pointer at head for doubly */}
            {listType === 'doubly' && (
              <div className="flex items-center gap-1 mr-1">
                <div className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px dashed var(--border)' }}>
                  NULL
                </div>
                <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            )}

            <AnimatePresence>
              {linkedListData.map((node, i) => {
                const isHighlighted = node.id === highlightId;
                const isHead = i === 0;
                const isTail = i === linkedListData.length - 1;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center"
                  >
                    {/* Back arrow for doubly */}
                    {listType === 'doubly' && i > 0 && (
                      <div style={{ color: 'var(--accent-magenta)', fontSize: '10px', marginRight: '-2px' }}>←</div>
                    )}

                    {/* Node box */}
                    <div
                      className="relative group"
                      style={{
                        border: `2px solid ${isHighlighted ? 'var(--accent-cyan)' : isHead ? 'var(--accent-purple)' : 'var(--border-bright)'}`,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                        boxShadow: isHighlighted ? '0 0 12px rgba(0,229,255,0.4)' : 'none',
                      }}
                    >
                      <div className="flex">
                        {/* Value cell */}
                        <div className="w-12 h-12 flex items-center justify-center font-mono font-bold text-sm"
                          style={{
                            background: isHighlighted ? 'rgba(0,229,255,0.2)' : isHead ? 'rgba(124,58,237,0.15)' : 'var(--bg-secondary)',
                            color: isHighlighted ? 'var(--accent-cyan)' : isHead ? 'var(--accent-purple)' : 'var(--text-primary)',
                            borderRight: '1px solid var(--border)',
                          }}>
                          {node.val}
                        </div>
                        {/* Pointer cell */}
                        <div className="w-8 h-12 flex items-center justify-center text-xs"
                          style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                          {isTail ? '∅' : '→'}
                        </div>
                      </div>
                      {/* Label */}
                      <div className="text-center py-0.5 text-xs font-mono"
                        style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)', fontSize: '9px' }}>
                        {isHead ? 'HEAD' : isTail ? 'TAIL' : `[${i}]`}
                      </div>
                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(node.id, node.val)}
                        className="absolute top-0 right-0 w-4 h-4 rounded-bl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(255,0,170,0.8)', color: 'white', fontSize: '8px' }}>
                        ×
                      </button>
                    </div>

                    {/* Forward arrow */}
                    {!isTail && (
                      <div className="flex items-center px-1" style={{ color: listType === 'doubly' ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                        <ArrowRight size={16} />
                      </div>
                    )}

                    {/* NULL at tail */}
                    {isTail && (
                      <div className="flex items-center gap-1 ml-1">
                        <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                        <div className="px-2 py-1 rounded text-xs font-mono"
                          style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px dashed var(--border)' }}>
                          NULL
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {message && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{message}</p>
        </div>
      )}

      {/* Complexity table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <table className="w-full text-xs font-mono">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
              <th className="px-3 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Operation</th>
              <th className="px-3 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Singly</th>
              <th className="px-3 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Doubly</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Insert at head', 'O(1)', 'O(1)'],
              ['Insert at tail', 'O(n)', 'O(1)*'],
              ['Delete at head', 'O(1)', 'O(1)'],
              ['Search', 'O(n)', 'O(n)'],
            ].map(([op, s, d]) => (
              <tr key={op} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{op}</td>
                <td className="px-3 py-2" style={{ color: '#ffb300' }}>{s}</td>
                <td className="px-3 py-2" style={{ color: '#ffb300' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-3 py-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>* With tail pointer</p>
      </div>
    </div>
  );
}
