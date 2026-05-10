import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import {
  BarChart2, Cpu, ChevronLeft, ChevronRight,
  Moon, Sun, Layers, Network, Share2, HelpCircle,
} from 'lucide-react';

/**
 * FIX #1 — Algorithm state synchronization:
 *
 * Previously the sidebar called setActiveAlgorithm() and the top tabs in
 * SortingVisualizer called setSortAlgorithm() — two independent fields.
 * They were never linked, so clicking one didn't update the other.
 *
 * Fix:
 * - `sortAlgorithm` is deleted from the store entirely.
 * - Both the sidebar and the SortingVisualizer top tabs now read/write the
 *   single `activeAlgorithm` field.
 * - The sidebar's sub-item click calls setActiveAlgorithm(algo.id) — the same
 *   setter the SortingVisualizer listens to via its useEffect([algoKey]).
 * - No additional sync needed: there is only one field to keep in sync.
 */

const SECTIONS = [
  {
    id: 'sorting',
    label: 'Sorting Algorithms',
    icon: BarChart2,
    algorithms: [
      { id: 'bubble',    label: 'Bubble Sort'    },
      { id: 'selection', label: 'Selection Sort' },
      { id: 'insertion', label: 'Insertion Sort' },
      { id: 'merge',     label: 'Merge Sort'     },
      { id: 'quick',     label: 'Quick Sort'     },
    ],
  },
  {
    id: 'datastructures',
    label: 'Data Structures',
    icon: Layers,
    algorithms: [
      { id: 'array',      label: 'Array'               },
      { id: 'linkedlist', label: 'Linked List'          },
      { id: 'stack',      label: 'Stack'                },
      { id: 'queue',      label: 'Queue'                },
      { id: 'bst',        label: 'Binary Search Tree'   },
    ],
  },
  {
    id: 'graph',
    label: 'Graph Algorithms',
    icon: Network,
    algorithms: [
      { id: 'bfs', label: 'Breadth-First Search' },
      { id: 'dfs', label: 'Depth-First Search'   },
    ],
  },
  {
    id: 'comparison',
    label: 'Comparison Mode',
    icon: Share2,
    algorithms: [],
  },
  {
    id: 'quiz',
    label: 'Quiz Mode',
    icon: HelpCircle,
    algorithms: [],
  },
];

export default function Sidebar() {
  const {
    sidebarOpen, toggleSidebar,
    activeSection, setActiveSection,
    activeAlgorithm, setActiveAlgorithm,
    theme, toggleTheme,
  } = useStore();

  /**
   * When the user clicks a section header:
   * - Switch to that section
   * - If the section has sub-items and none of them matches the current
   *   activeAlgorithm, default to the first sub-item so the panel always
   *   shows something sensible.
   */
  const handleSectionClick = (section) => {
    setActiveSection(section.id);
    if (section.algorithms.length > 0) {
      const alreadyInSection = section.algorithms.some(a => a.id === activeAlgorithm);
      if (!alreadyInSection) {
        setActiveAlgorithm(section.algorithms[0].id);
      }
    }
  };

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 240 : 60 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-full border-r overflow-hidden shrink-0"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))' }}
        >
          <Cpu size={16} color="#fff" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="font-display font-bold text-sm truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              DSA Visualizer
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {SECTIONS.map(section => {
          const Icon = section.icon;
          const isSectionActive = activeSection === section.id;

          return (
            <div key={section.id} className="mb-1">
              {/* Section header button */}
              <button
                onClick={() => handleSectionClick(section)}
                title={!sidebarOpen ? section.label : undefined}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
                style={{
                  background: isSectionActive ? 'rgba(0,229,255,0.1)'            : 'transparent',
                  color:      isSectionActive ? 'var(--accent-cyan)'              : 'var(--text-secondary)',
                  border:     isSectionActive ? '1px solid rgba(0,229,255,0.2)'   : '1px solid transparent',
                }}
              >
                <Icon size={18} className="shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium truncate text-left"
                    >
                      {section.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Sub-algorithm list */}
              <AnimatePresence>
                {sidebarOpen && isSectionActive && section.algorithms.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {section.algorithms.map(algo => {
                      const isAlgoActive = activeAlgorithm === algo.id;
                      return (
                        <button
                          key={algo.id}
                          onClick={() => setActiveAlgorithm(algo.id)}
                          className="w-full flex items-center gap-2 pl-9 pr-3 py-1.5 rounded-lg text-xs transition-all duration-150"
                          style={{
                            color:      isAlgoActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                            background: isAlgoActive ? 'rgba(0,229,255,0.07)' : 'transparent',
                            fontWeight: isAlgoActive ? '600' : '400',
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                            style={{ background: isAlgoActive ? 'var(--accent-cyan)' : 'var(--text-muted)' }}
                          />
                          {algo.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className="p-2 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={toggleTheme}
          title={sidebarOpen ? undefined : (theme === 'dark' ? 'Light mode' : 'Dark mode')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-white/5"
          style={{ color: 'var(--text-secondary)' }}
        >
          {theme === 'dark'
            ? <Sun  size={18} className="shrink-0" />
            : <Moon size={18} className="shrink-0" />
          }
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={toggleSidebar}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-white/5"
          style={{ color: 'var(--text-secondary)' }}
        >
          {sidebarOpen
            ? <ChevronLeft  size={18} className="shrink-0" />
            : <ChevronRight size={18} className="shrink-0" />
          }
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
