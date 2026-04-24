export function generateRandomArray(size = 20, min = 5, max = 95) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export const COMPLEXITY_COLORS = {
  'O(1)': '#00ff88',
  'O(log n)': '#00e5ff',
  'O(n)': '#7c3aed',
  'O(n log n)': '#ffb300',
  'O(n²)': '#ff6600',
  'O(2ⁿ)': '#ff0044',
};

export const getComplexityColor = (c) => COMPLEXITY_COLORS[c] || '#8888aa';

// Default graph for visualization
export const DEFAULT_GRAPH = {
  nodes: [
    { id: 'A', x: 300, y: 80 },
    { id: 'B', x: 160, y: 200 },
    { id: 'C', x: 440, y: 200 },
    { id: 'D', x: 80, y: 330 },
    { id: 'E', x: 240, y: 330 },
    { id: 'F', x: 370, y: 330 },
    { id: 'G', x: 510, y: 330 },
  ],
  edges: [
    ['A', 'B'], ['A', 'C'],
    ['B', 'D'], ['B', 'E'],
    ['C', 'F'], ['C', 'G'],
    ['D', 'E'],
  ],
  adjacency: {
    A: ['B', 'C'],
    B: ['A', 'D', 'E'],
    C: ['A', 'F', 'G'],
    D: ['B', 'E'],
    E: ['B', 'D'],
    F: ['C'],
    G: ['C'],
  },
};

export const QUIZ_QUESTIONS = [
  {
    question: 'What is the time complexity of Bubble Sort in the worst case?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    answer: 2,
    explanation: 'Bubble Sort compares adjacent elements and repeats n-1 times, giving O(n²).',
  },
  {
    question: 'Which data structure follows LIFO (Last In First Out)?',
    options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
    answer: 1,
    explanation: 'Stack follows LIFO — the last element pushed is the first to be popped.',
  },
  {
    question: 'What is the best case time complexity of Quick Sort?',
    options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(log n)'],
    answer: 2,
    explanation: 'Quick Sort best case is O(n log n) when the pivot consistently divides the array into equal halves.',
  },
  {
    question: 'Which traversal visits: Left → Root → Right?',
    options: ['Preorder', 'Inorder', 'Postorder', 'Level-order'],
    answer: 1,
    explanation: 'Inorder traversal visits Left subtree, then Root, then Right subtree.',
  },
  {
    question: 'What is the space complexity of Merge Sort?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    answer: 2,
    explanation: 'Merge Sort requires O(n) auxiliary space for the temporary arrays during merging.',
  },
  {
    question: 'Which algorithm uses a queue for graph traversal?',
    options: ['DFS', 'BFS', 'Dijkstra', 'Bellman-Ford'],
    answer: 1,
    explanation: 'BFS (Breadth-First Search) uses a queue to explore neighbors level by level.',
  },
  {
    question: 'Insertion Sort is efficient for:',
    options: ['Large random arrays', 'Nearly sorted arrays', 'Reverse sorted arrays', 'All cases equally'],
    answer: 1,
    explanation: 'Insertion Sort runs in O(n) for nearly sorted arrays, making it very efficient in that case.',
  },
  {
    question: 'What is the height of a balanced BST with n nodes?',
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
    answer: 2,
    explanation: 'A balanced BST has height O(log n), giving O(log n) search/insert/delete.',
  },
];
