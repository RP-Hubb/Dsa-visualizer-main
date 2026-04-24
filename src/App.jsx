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

function getPanel(activeSection, activeAlgorithm) {
  if (activeSection === 'comparison') return <ComparisonMode />;
  if (activeSection === 'quiz') return <QuizMode />;
  if (activeSection === 'graph') return <GraphVisualizer />;
  if (activeSection === 'sorting') return <SortingVisualizer />;
  if (activeSection === 'datastructures') {
    switch (activeAlgorithm) {
      case 'array': return <ArrayVisualizer />;
      case 'linkedlist': return <LinkedListVisualizer />;
      case 'stack': return <StackVisualizer />;
      case 'queue': return <QueueVisualizer />;
      case 'bst': return <BSTVisualizer />;
      default: return <ArrayVisualizer />;
    }
  }
  return <SortingVisualizer />;
}

export default function App() {
  const { theme, activeSection, activeAlgorithm } = useStore();

  useEffect(() => {
    document.documentElement.className = theme === 'light' ? 'light-theme' : '';
    document.body.style.background = 'var(--bg-primary)';
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <main className="flex-1 overflow-hidden relative grid-bg">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeSection}-${activeAlgorithm}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full overflow-y-auto"
          >
            {getPanel(activeSection, activeAlgorithm)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
