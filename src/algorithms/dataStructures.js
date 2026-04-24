// Binary Search Tree operations
export function bstInsert(root, val) {
  if (!root) return { val, left: null, right: null, id: Math.random() };
  if (val < root.val) return { ...root, left: bstInsert(root.left, val) };
  if (val > root.val) return { ...root, right: bstInsert(root.right, val) };
  return root;
}

export function bstTraversal(root, type = 'inorder') {
  const steps = [];
  const result = [];

  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    steps.push({ visiting: node.val, result: [...result], explanation: `Visiting node ${node.val} (inorder: left → root → right)` });
    result.push(node.val);
    inorder(node.right);
  }

  function preorder(node) {
    if (!node) return;
    steps.push({ visiting: node.val, result: [...result], explanation: `Visiting node ${node.val} (preorder: root → left → right)` });
    result.push(node.val);
    preorder(node.left);
    preorder(node.right);
  }

  function postorder(node) {
    if (!node) return;
    postorder(node.left);
    postorder(node.right);
    steps.push({ visiting: node.val, result: [...result], explanation: `Visiting node ${node.val} (postorder: left → right → root)` });
    result.push(node.val);
  }

  if (type === 'inorder') inorder(root);
  else if (type === 'preorder') preorder(root);
  else postorder(root);

  return steps;
}

// Graph BFS
export function graphBFS(adjacency, start) {
  const steps = [];
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  const order = [];

  steps.push({ visited: [], queue: [start], current: null, order: [], explanation: `Starting BFS from node ${start}. Adding to queue.` });

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    steps.push({ visited: [...visited], queue: [...queue], current: node, order: [...order], explanation: `Processing node ${node} from queue` });

    for (const neighbor of (adjacency[node] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        steps.push({ visited: [...visited], queue: [...queue], current: node, order: [...order], explanation: `Discovered unvisited neighbor ${neighbor}, adding to queue` });
      }
    }
  }
  steps.push({ visited: [...visited], queue: [], current: null, order: [...order], explanation: `BFS complete! Traversal order: ${order.join(' → ')}` });
  return steps;
}

// Graph DFS
export function graphDFS(adjacency, start) {
  const steps = [];
  const visited = new Set();
  const order = [];
  const stack = [];

  function dfs(node) {
    visited.add(node);
    stack.push(node);
    order.push(node);
    steps.push({ visited: [...visited], stack: [...stack], current: node, order: [...order], explanation: `Visiting node ${node}, adding to stack` });

    for (const neighbor of (adjacency[node] || [])) {
      if (!visited.has(neighbor)) {
        steps.push({ visited: [...visited], stack: [...stack], current: node, order: [...order], explanation: `Exploring unvisited neighbor ${neighbor} from ${node}` });
        dfs(neighbor);
      }
    }
    stack.pop();
    steps.push({ visited: [...visited], stack: [...stack], current: node, order: [...order], explanation: `Backtracking from ${node}` });
  }

  dfs(start);
  steps.push({ visited: [...visited], stack: [], current: null, order: [...order], explanation: `DFS complete! Traversal order: ${order.join(' → ')}` });
  return steps;
}

// Stack operations steps
export function stackOperationSteps(stack, op, val) {
  const steps = [];
  const s = [...stack];

  if (op === 'push') {
    steps.push({ stack: [...s], highlight: -1, explanation: `Pushing ${val} onto stack. Stack grows from top.` });
    s.push(val);
    steps.push({ stack: [...s], highlight: s.length - 1, explanation: `${val} pushed to top of stack. Size: ${s.length}` });
  } else if (op === 'pop') {
    if (s.length === 0) {
      steps.push({ stack: [], highlight: -1, explanation: 'Stack is empty! Cannot pop. Stack Underflow.' });
    } else {
      const top = s[s.length - 1];
      steps.push({ stack: [...s], highlight: s.length - 1, explanation: `Popping top element: ${top}` });
      s.pop();
      steps.push({ stack: [...s], highlight: -1, explanation: `${top} removed. Stack size: ${s.length}` });
    }
  }
  return { steps, newStack: s };
}

// Queue operations steps
export function queueOperationSteps(queue, op, val) {
  const steps = [];
  const q = [...queue];

  if (op === 'enqueue') {
    steps.push({ queue: [...q], front: 0, rear: q.length - 1, highlight: -1, explanation: `Enqueueing ${val}. Added to rear of queue.` });
    q.push(val);
    steps.push({ queue: [...q], front: 0, rear: q.length - 1, highlight: q.length - 1, explanation: `${val} enqueued at rear. Queue size: ${q.length}` });
  } else if (op === 'dequeue') {
    if (q.length === 0) {
      steps.push({ queue: [], front: -1, rear: -1, highlight: -1, explanation: 'Queue is empty! Cannot dequeue. Queue Underflow.' });
    } else {
      const front = q[0];
      steps.push({ queue: [...q], front: 0, rear: q.length - 1, highlight: 0, explanation: `Dequeuing front element: ${front}` });
      q.shift();
      steps.push({ queue: [...q], front: 0, rear: q.length - 1, highlight: -1, explanation: `${front} removed. Queue size: ${q.length}` });
    }
  }
  return { steps, newQueue: q };
}

// Linked List operations
export function linkedListInsert(list, val, position = 'tail') {
  const newNode = { val, id: Math.random() };
  if (position === 'head') return [newNode, ...list];
  if (position === 'tail') return [...list, newNode];
  return list;
}

export function linkedListDelete(list, val) {
  return list.filter(node => node.val !== val);
}
