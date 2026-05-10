import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store';
import Sidebar from './components/shared/Sidebar';
import SortingVisualizer from './components/sorting/SortingVisualizer';
import ComparisonMode from './components/sorting/ComparisonMode';
import { StackVisualizer, QueueVisualizer } from './components/datastructures/StackQueue';
import BSTVisualizer from './components/datastructures/BSTVisualizer';
import LinkedListVisualizer from './components/datastructures/LinkedListVisualizer';
import ArrayVisualizer from './components/datastructures/ArrayVisualizer';
import GraphVisualizer from './components/graph/GraphVisualizer';
import QuizMode from './components/shared/QuizMode';

/**
 * Panel routing.
 *
 * Graph section: both 'bfs' and 'dfs' render GraphVisualizer — the traversal
 * type is passed as a prop and the component handles its own state.
 * Previously the graph section was handled by `activeSection === 'graph'`
 * with no sub-algorithm support, meaning the sidebar BFS/DFS items were
 * displayed but had no effect on behavior.
 */
function getPanel(activeSection, activeAlgorithm) {
  switch (activeSection) {
    case 'comparison':
      return <ComparisonMode />;

    case 'quiz':
      return <QuizMode />;

    case 'graph':
      // Pass the traversal type so GraphVisualizer can default its selector
      return <GraphVisualizer initialTraversal={activeAlgorithm === 'dfs' ? 'dfs' : 'bfs'} />;

    case 'sorting':
      return <SortingVisualizer />;

    case 'datastructures':
      switch (activeAlgorithm) {
        case 'array':      return <ArrayVisualizer />;
        case 'linkedlist': return <LinkedListVisualizer />;
        case 'stack':      return <StackVisualizer />;
        case 'queue':      return <QueueVisualizer />;
        case 'bst':        return <BSTVisualizer />;
        default:           return <ArrayVisualizer />;
      }

    default:
      return <SortingVisualizer />;
  }
}

export default function App() {
  const { theme, activeSection, activeAlgorithm } = useStore();

  // Apply theme class to root element
  useEffect(() => {
    document.documentElement.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />

      <main className="flex-1 overflow-hidden relative grid-bg">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeSection}-${activeAlgorithm}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="h-full overflow-y-auto"
          >
            {getPanel(activeSection, activeAlgorithm)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
