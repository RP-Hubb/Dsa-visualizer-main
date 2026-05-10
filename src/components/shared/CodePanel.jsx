import { useState, useRef, useEffect } from 'react';
import { Code2 } from 'lucide-react';
import { getComplexityColor } from '../../utils';

/**
 * FIX #2 — CodePanel scroll / layout:
 *
 * Root cause: The inner scroll container had `maxHeight: '320px'` hard-coded,
 * which is too small for long algorithms and created awkward nested scrolling
 * inside an already-scrolling page.
 *
 * Fix:
 * - Remove the hard maxHeight cap from the inner div.
 * - The panel now has a min-height so it's always readable, and a reasonable
 *   max-height so it doesn't dominate the page on small screens.
 * - Auto-scroll the active code line into view on each step change.
 * - The Explain tab always shows the full explanation without clipping.
 */
export default function CodePanel({
  code = [],
  activeLine = -1,
  explanation = '',
  complexity = null,
  algorithmName = '',
}) {
  const [tab, setTab] = useState('code');
  const activeLineRef = useRef(null);

  // Auto-scroll the highlighted line into view whenever it changes
  useEffect(() => {
    if (tab === 'code' && activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeLine, tab]);

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        // Grows to fill available space but won't exceed viewport on large screens
        minHeight: '280px',
      }}
    >
      {/* Tab bar */}
      <div className="flex shrink-0 border-b" style={{ borderColor: 'var(--border)' }}>
        {[
          { key: 'code',       label: '{ }  Code'       },
          { key: 'explain',    label: '💬  Explain'      },
          { key: 'complexity', label: '📊  Complexity'   },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2.5 text-xs font-medium transition-colors whitespace-nowrap"
            style={{
              color:        tab === t.key ? 'var(--accent-cyan)' : 'var(--text-muted)',
              borderBottom: tab === t.key ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              background:   'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content — scrollable, no arbitrary maxHeight clipping */}
      <div
        className="flex-1 overflow-auto p-4"
        style={{ minHeight: '200px', maxHeight: '420px' }}
      >

        {/* ── Code tab ── */}
        {tab === 'code' && (
          <div className="font-mono text-xs leading-relaxed">
            {code.length === 0 && (
              <p style={{ color: 'var(--text-muted)' }}>No code available.</p>
            )}
            {code.map((line, i) => (
              <div
                key={i}
                ref={i === activeLine ? activeLineRef : null}
                className={`code-line rounded ${i === activeLine ? 'active' : ''}`}
                style={{
                  color:      i === activeLine ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontWeight: i === activeLine ? '600' : '400',
                }}
              >
                <span
                  className="select-none inline-block text-right mr-4"
                  style={{ color: 'var(--text-muted)', minWidth: '24px' }}
                >
                  {i + 1}
                </span>
                {/* Preserve indentation without trimming */}
                <span style={{ whiteSpace: 'pre' }}>{line}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Explain tab ── */}
        {tab === 'explain' && (
          <div className="space-y-4">
            <div
              className="p-4 rounded-lg"
              style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.15)' }}
            >
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {explanation || 'Press Play to start the visualization and see step-by-step explanations here.'}
              </p>
            </div>
            {activeLine >= 0 && (
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Code2 size={12} />
                <span>Currently executing line {activeLine + 1}</span>
              </div>
            )}
            <div
              className="p-3 rounded-lg text-xs leading-relaxed"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
            >
              <strong style={{ color: 'var(--text-secondary)' }}>Tip:</strong> Switch to the{' '}
              <strong>Code</strong> tab to see the highlighted line, or{' '}
              <strong>Complexity</strong> to review Big-O analysis.
            </div>
          </div>
        )}

        {/* ── Complexity tab ── */}
        {tab === 'complexity' && complexity && (
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-mono font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Time Complexity
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { case: 'best',    val: complexity.timeComplexity.best    },
                  { case: 'average', val: complexity.timeComplexity.average },
                  { case: 'worst',   val: complexity.timeComplexity.worst   },
                ].map(({ case: c, val }) => (
                  <div key={c} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="text-xs mb-1 capitalize" style={{ color: 'var(--text-muted)' }}>{c} case</div>
                    <div className="text-base font-mono font-bold" style={{ color: getComplexityColor(val) }}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Space Complexity
              </h4>
              <div className="p-3 rounded-xl inline-block" style={{ background: 'var(--bg-secondary)' }}>
                <span className="text-base font-mono font-bold" style={{ color: getComplexityColor(complexity.spaceComplexity) }}>
                  {complexity.spaceComplexity}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stable sort:</span>
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold"
                style={{
                  background: complexity.stable ? 'rgba(0,255,136,0.15)' : 'rgba(255,0,170,0.15)',
                  color:      complexity.stable ? 'var(--accent-green)'  : 'var(--accent-magenta)',
                  border:     `1px solid ${complexity.stable ? 'rgba(0,255,136,0.4)' : 'rgba(255,0,170,0.4)'}`,
                }}
              >
                {complexity.stable ? '✓ Yes' : '✗ No'}
              </span>
            </div>

            <div
              className="p-3 rounded-lg text-xs leading-relaxed"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
            >
              <strong style={{ color: 'var(--text-secondary)' }}>What does stable mean?</strong>
              {' '}A stable sort preserves the relative order of equal elements in the input.
              This matters when sorting objects by one field and the original order of ties is meaningful.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
