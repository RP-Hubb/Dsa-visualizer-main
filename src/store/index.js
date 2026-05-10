import { create } from 'zustand';

/**
 * SINGLE SOURCE OF TRUTH DESIGN:
 *
 * Previously the store had BOTH `activeAlgorithm` (used by Sidebar) and
 * `sortAlgorithm` (used by SortingVisualizer's top tabs). These were never
 * synced, causing the desync bug.
 *
 * Fix: `sortAlgorithm` is removed entirely.
 * `activeAlgorithm` is now the one canonical field for which algorithm
 * is selected — both the Sidebar and the top tab buttons read/write it.
 *
 * For the sorting section, `activeAlgorithm` will be one of:
 *   'bubble' | 'selection' | 'insertion' | 'merge' | 'quick'
 *
 * For datastructures section:
 *   'array' | 'linkedlist' | 'stack' | 'queue' | 'bst'
 *
 * For graph section:
 *   'bfs' | 'dfs'
 */
export const useStore = create((set) => ({
  // ─── Theme ───────────────────────────────────────────────────────────
  theme: 'dark',
  toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

  // ─── Navigation (single source of truth) ─────────────────────────────
  activeSection: 'sorting',
  activeAlgorithm: 'bubble',      // THE canonical selected algorithm
  setActiveSection: (section) => set({ activeSection: section }),
  setActiveAlgorithm: (algo) => set({ activeAlgorithm: algo }),

  // ─── Sorting playback state ───────────────────────────────────────────
  sortArray: [],
  sortSteps: [],
  sortCurrentStep: 0,
  sortIsPlaying: false,
  sortSpeed: 300,        // milliseconds between steps (lower = faster)
  sortArraySize: 20,

  setSortArray: (arr) => set({ sortArray: arr }),
  // When new steps are loaded always reset to step 0
  setSortSteps: (steps) => set({ sortSteps: steps, sortCurrentStep: 0 }),
  setSortCurrentStep: (step) => set({ sortCurrentStep: step }),
  setSortIsPlaying: (playing) => set({ sortIsPlaying: playing }),
  setSortSpeed: (speed) => set({ sortSpeed: speed }),
  setSortArraySize: (size) => set({ sortArraySize: size }),

  // ─── Data structure state ─────────────────────────────────────────────
  stackData: [],
  queueData: [],
  linkedListData: [],
  bstRoot: null,

  setStackData: (data) => set({ stackData: data }),
  setQueueData: (data) => set({ queueData: data }),
  setLinkedListData: (data) => set({ linkedListData: data }),
  setBstRoot: (root) => set({ bstRoot: root }),

  // ─── UI ──────────────────────────────────────────────────────────────
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  // ─── Quiz ─────────────────────────────────────────────────────────────
  quizScore: 0,
  quizTotal: 0,
  setQuizScore: (score) => set({ quizScore: score }),
  setQuizTotal: (total) => set({ quizTotal: total }),
}));
