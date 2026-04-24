import { useState } from 'react';
import { Code2, Info } from 'lucide-react';
import { getComplexityColor } from '../../utils';

export default function CodePanel({ code = [], activeLine = -1, explanation = '', complexity = null, algorithmName = '' }) {
  const [tab, setTab] = useState('code');

  return (
    <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
        {['code', 'explain', 'complexity'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2.5 text-xs font-medium capitalize transition-colors"
            style={{
              color: tab === t ? 'var(--accent-cyan)' : 'var(--text-muted)',
              borderBottom: tab === t ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              background: 'transparent',
            }}
          >
            {t === 'code' ? '{ } Code' : t === 'explain' ? '💬 Explain' : '📊 Complexity'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-3" style={{ maxHeight: '320px' }}>
        {tab === 'code' && (
          <div className="font-mono text-xs space-y-0.5">
            {code.map((line, i) => (
              <div
                key={i}
                className={`code-line rounded ${i === activeLine ? 'active' : ''}`}
                style={{ color: i === activeLine ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}
              >
                <span className="select-none mr-4" style={{ color: 'var(--text-muted)', minWidth: '20px', display: 'inline-block' }}>
                  {i + 1}
                </span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'explain' && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.15)' }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {explanation || 'Press Play to start the visualization and see step-by-step explanations here.'}
              </p>
            </div>
            {activeLine >= 0 && (
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Code2 size={12} />
                <span>Executing line {activeLine + 1}</span>
              </div>
            )}
          </div>
        )}

        {tab === 'complexity' && complexity && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>TIME COMPLEXITY</h4>
              <div className="grid grid-cols-3 gap-2">
                {['best', 'average', 'worst'].map(c => (
                  <div key={c} className="p-2 rounded-lg text-center" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="text-xs mb-1 capitalize" style={{ color: 'var(--text-muted)' }}>{c}</div>
                    <div className="text-sm font-mono font-bold" style={{ color: getComplexityColor(complexity.timeComplexity[c]) }}>
                      {complexity.timeComplexity[c]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>SPACE COMPLEXITY</h4>
              <div className="p-2 rounded-lg inline-block" style={{ background: 'var(--bg-secondary)' }}>
                <span className="text-sm font-mono font-bold" style={{ color: getComplexityColor(complexity.spaceComplexity) }}>
                  {complexity.spaceComplexity}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Stable sort:</span>
              <span className="text-xs font-mono" style={{ color: complexity.stable ? 'var(--accent-green)' : 'var(--accent-magenta)' }}>
                {complexity.stable ? '✓ Yes' : '✗ No'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
