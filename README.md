# DSA Visualizer

An interactive, production-grade visualizer for Data Structures and Algorithms — built with React 19, Vite, TailwindCSS v4, Framer Motion, and Zustand.

Watch sorting algorithms race in real time, manipulate data structures step by step, traverse graphs with draggable nodes, compare algorithm performance side by side, and test your knowledge with a built-in quiz — all in a dark-themed, responsive dashboard.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Algorithm Reference](#algorithm-reference)
- [Architecture Notes](#architecture-notes)
- [Future Improvements](#future-improvements)

---

## Features

### Sorting Algorithms
Five algorithms visualized as an animated bar chart with color-coded states:

| Color | Meaning |
|-------|---------|
| Cyan | Default / unsorted |
| Amber | Being compared |
| Magenta | Being swapped |
| Green | Sorted in place |
| Purple | Pivot element |

Controls available:
- Play / Pause / Step forward / Step back / Reset
- **Jump to End** — instantly shows the fully sorted final state
- Adjustable animation speed (Fast → Slow slider)
- Adjustable array size (5 – 80 elements)
- Custom input — type your own comma-separated values
- Random array generation
- Live operations counter and step tracker
- Code panel with line-by-line highlighting as the animation runs

### Data Structures

**Array**
Insert at any index, delete by clicking, linear search with scan animation, reverse in place. Shows memory addresses beneath each cell.

**Linked List**
Singly and doubly linked list modes. Insert at head or tail, delete any node, animated pointer arrows. Complexity table included.

**Stack**
LIFO visualization with push / pop animations. Shows TOP label and a base indicator. Live metrics: size, top value, empty state.

**Queue**
FIFO horizontal visualization with enqueue / dequeue animations. Shows FRONT and REAR labels with index numbers.

**Binary Search Tree**
SVG-rendered tree that updates live as you insert values. Animated inorder, preorder, and postorder traversal with the result sequence shown step by step. Load a pre-built example tree with one click.

### Graph Algorithms

- BFS (Breadth-First Search) and DFS (Depth-First Search) on a 7-node undirected graph
- Nodes are **fully draggable** — rearrange the graph layout by clicking and dragging
- Live queue/stack display showing which nodes are pending
- Traversal order shown as an animated sequence of badges
- Color-coded nodes: unvisited → in queue/stack → visited → current
- Adjustable traversal speed
- Selectable start node

### Comparison Mode

Race two sorting algorithms against each other on the exact same dataset:
- Independent progress bars for each algorithm
- Live operation counters per algorithm
- Winner banner when both finish — shows total operation count comparison
- Full complexity comparison table beneath the race

### Quiz Mode

8 multiple-choice questions covering sorting, data structures, graph traversal, and complexity analysis. Questions are randomized on each session.

- Instant right/wrong feedback after each answer
- Explanation shown for every question
- Score tracked throughout
- Final results screen with letter grade (S / A / B / C / F)
- Full answer review on the results screen
- Restart button to try again

### UI / UX
- Dark theme by default with a full light theme toggle
- Collapsible sidebar navigation
- Smooth page transitions via Framer Motion
- Responsive layout — works across screen sizes
- Custom scrollbar styling
- Grid background on the main content area
- Google Fonts: Inter (body), Syne (headings), Space Mono (code and numbers)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| Vite | 8 | Build tool and dev server |
| TailwindCSS | 4 | Utility-first styling |
| @tailwindcss/vite | 4 | Vite plugin for Tailwind v4 |
| Framer Motion | 12 | Animations and page transitions |
| Zustand | 5 | Global state management |
| Lucide React | 1.9 | Icon library |

---

## Project Structure

```
dsa-visualizer/
├── public/
├── src/
│   ├── algorithms/
│   │   ├── sorting.js           # Step generators for all 5 sorting algorithms
│   │   └── dataStructures.js    # BST, Graph BFS/DFS, Stack, Queue, LinkedList logic
│   │
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Sidebar.jsx          # Collapsible navigation sidebar
│   │   │   ├── PlaybackControls.jsx # Play/Pause/Step/Reset/JumpToEnd + speed slider
│   │   │   ├── CodePanel.jsx        # Code / Explain / Complexity tabbed panel
│   │   │   └── QuizMode.jsx         # Interactive quiz with scoring
│   │   │
│   │   ├── sorting/
│   │   │   ├── SortingVisualizer.jsx  # Main sorting visualization with bar chart
│   │   │   └── ComparisonMode.jsx     # Side-by-side algorithm race
│   │   │
│   │   ├── datastructures/
│   │   │   ├── ArrayVisualizer.jsx
│   │   │   ├── LinkedListVisualizer.jsx
│   │   │   ├── StackQueue.jsx         # StackVisualizer + QueueVisualizer
│   │   │   └── BSTVisualizer.jsx
│   │   │
│   │   └── graph/
│   │       └── GraphVisualizer.jsx    # SVG graph with draggable nodes
│   │
│   ├── store/
│   │   └── index.js             # Zustand store — single source of truth for all state
│   │
│   ├── utils/
│   │   └── index.js             # Helpers, complexity colours, quiz questions, graph data
│   │
│   ├── App.jsx                  # Root component — layout and panel routing
│   ├── main.jsx                 # React entry point
│   └── index.css                # CSS variables, global styles, theme definitions
│
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

Check your versions:
```bash
node --version
npm --version
```

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/dsa-visualizer.git
cd dsa-visualizer
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other commands

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview

# Run the linter
npm run lint
```

The production build output goes to the `dist/` folder and can be deployed to any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## Usage Guide

### Sorting Visualizer

1. Select an algorithm from the **sidebar** or the **tab-bar** at the top of the panel — both stay in sync automatically.
2. Use **Generate Random** to create a new array, or type values into the custom input field (e.g. `38, 27, 43, 3, 9`) and click **Apply**.
3. Drag the **Size** slider to control how many elements are generated.
4. Press **Play** to start the animation. Press **Pause** to stop mid-way.
5. Use the **chevron buttons** to step backward or forward one step at a time.
6. Press the **skip-forward button** (⏭) to jump instantly to the final sorted state.
7. Press **Reset** (↺) to return to step 1.
8. Drag the **Speed** slider left for faster animation, right for slower.
9. Switch tabs in the bottom panel between **Code** (highlighted pseudocode), **Explain** (plain-English description of the current step), and **Complexity** (Big-O analysis).

### Data Structures

- Each structure has an input field for entering a value and action buttons (Push, Pop, Insert, Enqueue, Dequeue, etc.).
- Leaving the value field empty generates a random value.
- In the **Linked List** view, toggle between Singly and Doubly modes using the buttons at the top.
- In the **BST** view, click **Load Example** to populate a pre-built tree, then pick a traversal type and click **Traverse** to animate it.

### Graph Traversal

1. Choose **BFS** or **DFS** using the toggle buttons.
2. Select a **Start node** from the dropdown.
3. Click **Start BFS** or **Start DFS** to begin the animation.
4. **Drag any node** to rearrange the graph layout while it runs or at rest.
5. Click **Reset** to clear the traversal state.

### Comparison Mode

1. Select **Algorithm 1** and **Algorithm 2** from their respective panels.
2. Click **Generate** to create a shared random dataset. Adjust the size slider first if needed.
3. Click **Race!** to run both algorithms simultaneously.
4. The algorithm with fewer total operations is declared the winner.
5. Click **Reset** to replay with the same dataset, or **Generate** again for a new one.

### Quiz Mode

- Read each question and click one of the four answer options.
- Feedback and a full explanation appear immediately after answering.
- Click **Next Question** to continue.
- After all 8 questions your grade, score, and a full answer review are shown.
- Click **Try Again** to restart with a freshly shuffled question order.

---

## Algorithm Reference

### Sorting

| Algorithm | Best Case | Average Case | Worst Case | Space | Stable |
|-----------|-----------|--------------|------------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |

A **stable** sort preserves the relative order of elements that compare as equal.

### Data Structures

| Structure | Access | Search | Insert | Delete | Notes |
|-----------|--------|--------|--------|--------|-------|
| Array | O(1) | O(n) | O(n) | O(n) | O(1) insert at end (amortized) |
| Singly Linked List | O(n) | O(n) | O(1) head | O(1) head | O(n) elsewhere |
| Doubly Linked List | O(n) | O(n) | O(1) head/tail* | O(1) head | *with tail pointer |
| Stack | O(n) | O(n) | O(1) | O(1) | LIFO — push/pop at top |
| Queue | O(n) | O(n) | O(1) | O(1) | FIFO — enqueue rear, dequeue front |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | Degrades to O(n) if unbalanced |

### Graph Algorithms

| Algorithm | Time | Space | Data Structure Used |
|-----------|------|-------|---------------------|
| BFS | O(V + E) | O(V) | Queue |
| DFS | O(V + E) | O(V) | Stack (call stack) |

V = number of vertices, E = number of edges.

---

## Architecture Notes

### State Management

All global state lives in `src/store/index.js` (Zustand). The key design decision is that **`activeAlgorithm` is the single source of truth** for which algorithm is selected across the entire application. The sidebar sub-items, the top tab-bar inside `SortingVisualizer`, and any other algorithm picker all read and write this one field — making it physically impossible for the sidebar and the visualizer to show different selections.

When a section header is clicked, `setActiveSection` atomically resets `activeAlgorithm` to that section's default (defined in `SECTION_DEFAULTS`), preventing cross-section stale keys (e.g. `bfs` from the graph section accidentally landing in the sorting visualizer).

### Playback Loop

The async animation loop in `SortingVisualizer` uses refs (`speedRef`, `stepsRef`) that are updated on every render. The loop reads from these refs on each iteration rather than from the closed-over values at the time Play was pressed. This means live speed changes take effect immediately without needing to stop and restart playback.

### Layout

`SortingVisualizer` uses a two-region vertical layout:
- **Top region** (`flex-1`, `overflow-y-auto`) — bar chart and controls, scrolls if the viewport is very short
- **Bottom region** (fixed `300px`) — `CodePanel`, always visible at a comfortable reading height

`App.jsx` uses `overflow-hidden` on the panel wrapper so each panel fully owns its internal scroll behaviour. `CodePanel` itself has no `maxHeight` constraint — it fills whatever height its parent gives it.

---

## Future Improvements

- Dijkstra's shortest path with weighted edge visualization
- Heap / Priority Queue with heapify animation
- Hash Table with separate chaining and open addressing collision modes
- AVL Tree and Red-Black Tree with rotation animations
- Recursion call-stack overlay for Merge Sort and Quick Sort
- Benchmarking mode with real wall-clock timing across array sizes
- Export animation as a GIF or MP4
- Mobile touch support for draggable graph nodes
- User-editable graph — add and remove nodes and edges interactively
- Persistent settings (speed preference, theme) via localStorage
- More quiz questions with difficulty levels

---

## License

MIT — free to use, modify, and distribute.
