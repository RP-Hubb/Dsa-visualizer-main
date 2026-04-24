import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Theme
  theme: 'dark',
  toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

  // Navigation
  activeSection: 'sorting',
  activeAlgorithm: 'bubble',
  setActiveSection: (section) => set({ activeSection: section }),
  setActiveAlgorithm: (algo) => set({ activeAlgorithm: algo }),

  // Sorting state
  sortArray: [],
  sortSteps: [],
  sortCurrentStep: 0,
  sortIsPlaying: false,
  sortSpeed: 300,
  sortAlgorithm: 'bubble',
  sortArraySize: 20,
  sortComparisonMode: false,
  sortCompareAlgo: 'quick',

  setSortArray: (arr) => set({ sortArray: arr }),
  setSortSteps: (steps) => set({ sortSteps: steps, sortCurrentStep: 0 }),
  setSortCurrentStep: (step) => set({ sortCurrentStep: step }),
  setSortIsPlaying: (playing) => set({ sortIsPlaying: playing }),
  setSortSpeed: (speed) => set({ sortSpeed: speed }),
  setSortAlgorithm: (algo) => set({ sortAlgorithm: algo }),
  setSortArraySize: (size) => set({ sortArraySize: size }),
  setSortComparisonMode: (mode) => set({ sortComparisonMode: mode }),
  setSortCompareAlgo: (algo) => set({ sortCompareAlgo: algo }),

  // Performance metrics
  totalOperations: 0,
  timeElapsed: 0,
  setTotalOperations: (ops) => set({ totalOperations: ops }),
  setTimeElapsed: (t) => set({ timeElapsed: t }),

  // Data structure state
  dsType: 'stack',
  stackData: [],
  queueData: [],
  linkedListData: [],
  bstRoot: null,
  graphNodes: [],
  graphEdges: [],
  graphAdjacency: {},
  dsSteps: [],
  dsCurrentStep: 0,
  dsIsPlaying: false,

  setDsType: (type) => set({ dsType: type }),
  setStackData: (data) => set({ stackData: data }),
  setQueueData: (data) => set({ queueData: data }),
  setLinkedListData: (data) => set({ linkedListData: data }),
  setBstRoot: (root) => set({ bstRoot: root }),
  setGraphNodes: (nodes) => set({ graphNodes: nodes }),
  setGraphEdges: (edges) => set({ graphEdges: edges }),
  setGraphAdjacency: (adj) => set({ graphAdjacency: adj }),
  setDsSteps: (steps) => set({ dsSteps: steps, dsCurrentStep: 0 }),
  setDsCurrentStep: (step) => set({ dsCurrentStep: step }),
  setDsIsPlaying: (playing) => set({ dsIsPlaying: playing }),

  // Quiz state
  quizScore: 0,
  quizTotal: 0,
  setQuizScore: (score) => set({ quizScore: score }),
  setQuizTotal: (total) => set({ quizTotal: total }),

  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
}));
