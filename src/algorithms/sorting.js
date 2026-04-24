// Each algorithm returns an array of steps for visualization
// Each step: { array, comparing, swapping, sorted, pivot, explanation, codeLine, operations }

export const SORTING_ALGORITHMS = {
  bubble: {
    name: 'Bubble Sort',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    code: [
      'function bubbleSort(arr) {',
      '  let n = arr.length;',
      '  for (let i = 0; i < n - 1; i++) {',
      '    for (let j = 0; j < n - i - 1; j++) {',
      '      if (arr[j] > arr[j + 1]) {',
      '        swap(arr, j, j + 1);',
      '      }',
      '    }',
      '  }',
      '  return arr;',
      '}',
    ],
    generate: bubbleSortSteps,
  },
  selection: {
    name: 'Selection Sort',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    code: [
      'function selectionSort(arr) {',
      '  let n = arr.length;',
      '  for (let i = 0; i < n - 1; i++) {',
      '    let minIdx = i;',
      '    for (let j = i + 1; j < n; j++) {',
      '      if (arr[j] < arr[minIdx]) {',
      '        minIdx = j;',
      '      }',
      '    }',
      '    swap(arr, i, minIdx);',
      '  }',
      '  return arr;',
      '}',
    ],
    generate: selectionSortSteps,
  },
  insertion: {
    name: 'Insertion Sort',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    code: [
      'function insertionSort(arr) {',
      '  for (let i = 1; i < arr.length; i++) {',
      '    let key = arr[i];',
      '    let j = i - 1;',
      '    while (j >= 0 && arr[j] > key) {',
      '      arr[j + 1] = arr[j];',
      '      j--;',
      '    }',
      '    arr[j + 1] = key;',
      '  }',
      '  return arr;',
      '}',
    ],
    generate: insertionSortSteps,
  },
  merge: {
    name: 'Merge Sort',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stable: true,
    code: [
      'function mergeSort(arr, l, r) {',
      '  if (l >= r) return;',
      '  let mid = Math.floor((l + r) / 2);',
      '  mergeSort(arr, l, mid);',
      '  mergeSort(arr, mid + 1, r);',
      '  merge(arr, l, mid, r);',
      '}',
      'function merge(arr, l, mid, r) {',
      '  let left = arr.slice(l, mid+1);',
      '  let right = arr.slice(mid+1, r+1);',
      '  let i = 0, j = 0, k = l;',
      '  while (i < left.length && j < right.length) {',
      '    if (left[i] <= right[j]) arr[k++] = left[i++];',
      '    else arr[k++] = right[j++];',
      '  }',
      '  while (i < left.length) arr[k++] = left[i++];',
      '  while (j < right.length) arr[k++] = right[j++];',
      '}',
    ],
    generate: mergeSortSteps,
  },
  quick: {
    name: 'Quick Sort',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stable: false,
    code: [
      'function quickSort(arr, low, high) {',
      '  if (low < high) {',
      '    let pi = partition(arr, low, high);',
      '    quickSort(arr, low, pi - 1);',
      '    quickSort(arr, pi + 1, high);',
      '  }',
      '}',
      'function partition(arr, low, high) {',
      '  let pivot = arr[high];',
      '  let i = low - 1;',
      '  for (let j = low; j < high; j++) {',
      '    if (arr[j] <= pivot) {',
      '      i++;',
      '      swap(arr, i, j);',
      '    }',
      '  }',
      '  swap(arr, i + 1, high);',
      '  return i + 1;',
      '}',
    ],
    generate: quickSortSteps,
  },
};

function bubbleSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  const sorted = [];
  let ops = 0;

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], pivot: -1, explanation: 'Starting Bubble Sort. We repeatedly compare adjacent elements and swap if out of order.', codeLine: 0, operations: ops });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      ops++;
      steps.push({ array: [...a], comparing: [j, j + 1], swapping: [], sorted: [...sorted], pivot: -1, explanation: `Comparing arr[${j}]=${a[j]} and arr[${j+1}]=${a[j+1]}`, codeLine: 4, operations: ops });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ array: [...a], comparing: [], swapping: [j, j + 1], sorted: [...sorted], pivot: -1, explanation: `${a[j+1]} > ${a[j]}, swapping them!`, codeLine: 5, operations: ops });
      }
    }
    sorted.unshift(n - 1 - i);
    steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], pivot: -1, explanation: `Element at position ${n-1-i} is now in its correct place.`, codeLine: 2, operations: ops });
  }
  sorted.unshift(0);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: n}, (_, i) => i), pivot: -1, explanation: 'Array is fully sorted! ✓', codeLine: 9, operations: ops });
  return steps;
}

function selectionSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  const sorted = [];
  let ops = 0;

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], pivot: -1, explanation: 'Starting Selection Sort. We find the minimum element and place it at the beginning.', codeLine: 0, operations: ops });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({ array: [...a], comparing: [i], swapping: [], sorted: [...sorted], pivot: i, explanation: `Finding minimum in unsorted portion starting at index ${i}`, codeLine: 3, operations: ops });
    for (let j = i + 1; j < n; j++) {
      ops++;
      steps.push({ array: [...a], comparing: [j, minIdx], swapping: [], sorted: [...sorted], pivot: minIdx, explanation: `Comparing arr[${j}]=${a[j]} with current min arr[${minIdx}]=${a[minIdx]}`, codeLine: 5, operations: ops });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        steps.push({ array: [...a], comparing: [minIdx], swapping: [], sorted: [...sorted], pivot: minIdx, explanation: `New minimum found: ${a[minIdx]} at index ${minIdx}`, codeLine: 6, operations: ops });
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ array: [...a], comparing: [], swapping: [i, minIdx], sorted: [...sorted], pivot: -1, explanation: `Placing minimum ${a[i]} at position ${i}`, codeLine: 9, operations: ops });
    }
    sorted.push(i);
    steps.push({ array: [...a], comparing: [], swapping: [], sorted: [...sorted], pivot: -1, explanation: `Position ${i} sorted with value ${a[i]}`, codeLine: 2, operations: ops });
  }
  sorted.push(n - 1);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: n}, (_, i) => i), pivot: -1, explanation: 'Array is fully sorted! ✓', codeLine: 11, operations: ops });
  return steps;
}

function insertionSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  let ops = 0;

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [0], pivot: -1, explanation: 'Starting Insertion Sort. We build the sorted array one element at a time.', codeLine: 0, operations: ops });

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    steps.push({ array: [...a], comparing: [i], swapping: [], sorted: Array.from({length: i}, (_, k) => k), pivot: i, explanation: `Taking element ${key} at index ${i} as key to insert`, codeLine: 2, operations: ops });
    while (j >= 0 && a[j] > key) {
      ops++;
      steps.push({ array: [...a], comparing: [j, j+1], swapping: [], sorted: Array.from({length: i}, (_, k) => k), pivot: -1, explanation: `arr[${j}]=${a[j]} > key=${key}, shifting right`, codeLine: 4, operations: ops });
      a[j + 1] = a[j];
      steps.push({ array: [...a], comparing: [], swapping: [j, j+1], sorted: Array.from({length: i}, (_, k) => k), pivot: -1, explanation: `Shifted ${a[j]} to position ${j+1}`, codeLine: 5, operations: ops });
      j--;
    }
    a[j + 1] = key;
    steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: i+1}, (_, k) => k), pivot: -1, explanation: `Inserted ${key} at position ${j+1}`, codeLine: 7, operations: ops });
  }
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: n}, (_, i) => i), pivot: -1, explanation: 'Array is fully sorted! ✓', codeLine: 10, operations: ops });
  return steps;
}

function mergeSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  let ops = 0;

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], pivot: -1, explanation: 'Starting Merge Sort. Divide and conquer: split array in half recursively, then merge.', codeLine: 0, operations: ops });

  function merge(arr, l, mid, r) {
    const left = arr.slice(l, mid + 1);
    const right = arr.slice(mid + 1, r + 1);
    let i = 0, j = 0, k = l;
    steps.push({ array: [...arr], comparing: [l, r], swapping: [], sorted: [], pivot: mid, explanation: `Merging subarrays [${l}..${mid}] and [${mid+1}..${r}]`, codeLine: 7, operations: ops });
    while (i < left.length && j < right.length) {
      ops++;
      steps.push({ array: [...arr], comparing: [l + i, mid + 1 + j], swapping: [], sorted: [], pivot: -1, explanation: `Comparing ${left[i]} and ${right[j]}`, codeLine: 11, operations: ops });
      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }
      steps.push({ array: [...arr], comparing: [], swapping: [k-1], sorted: [], pivot: -1, explanation: `Placed ${arr[k-1]} at position ${k-1}`, codeLine: 12, operations: ops });
    }
    while (i < left.length) { arr[k++] = left[i++]; ops++; }
    while (j < right.length) { arr[k++] = right[j++]; ops++; }
    steps.push({ array: [...arr], comparing: [], swapping: [], sorted: Array.from({length: r-l+1}, (_, x) => l+x), pivot: -1, explanation: `Subarray [${l}..${r}] merged and sorted`, codeLine: 15, operations: ops });
  }

  function sort(arr, l, r) {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    steps.push({ array: [...arr], comparing: [l, r], swapping: [], sorted: [], pivot: mid, explanation: `Dividing array: left [${l}..${mid}], right [${mid+1}..${r}]`, codeLine: 2, operations: ops });
    sort(arr, l, mid);
    sort(arr, mid + 1, r);
    merge(arr, l, mid, r);
  }

  sort(a, 0, a.length - 1);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: a.length}, (_, i) => i), pivot: -1, explanation: 'Array is fully sorted! ✓', codeLine: 0, operations: ops });
  return steps;
}

function quickSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  let ops = 0;
  const sortedSet = new Set();

  steps.push({ array: [...a], comparing: [], swapping: [], sorted: [], pivot: -1, explanation: 'Starting Quick Sort. Pick a pivot, partition array around it, recurse.', codeLine: 0, operations: ops });

  function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    steps.push({ array: [...arr], comparing: [], swapping: [], sorted: [...sortedSet], pivot: high, explanation: `Pivot = ${pivot} at index ${high}. Partitioning [${low}..${high}]`, codeLine: 8, operations: ops });
    for (let j = low; j < high; j++) {
      ops++;
      steps.push({ array: [...arr], comparing: [j, high], swapping: [], sorted: [...sortedSet], pivot: high, explanation: `Comparing arr[${j}]=${arr[j]} with pivot=${pivot}`, codeLine: 10, operations: ops });
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        if (i !== j) steps.push({ array: [...arr], comparing: [], swapping: [i, j], sorted: [...sortedSet], pivot: high, explanation: `arr[${j}]=${arr[j]} <= pivot, swapping with arr[${i}]`, codeLine: 12, operations: ops });
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({ array: [...arr], comparing: [], swapping: [i+1, high], sorted: [...sortedSet], pivot: i+1, explanation: `Placing pivot ${pivot} at its correct position ${i+1}`, codeLine: 14, operations: ops });
    return i + 1;
  }

  function sort(arr, low, high) {
    if (low < high) {
      const pi = partition(arr, low, high);
      sortedSet.add(pi);
      steps.push({ array: [...arr], comparing: [], swapping: [], sorted: [...sortedSet], pivot: -1, explanation: `Pivot ${arr[pi]} is in final position ${pi}. Recursing on subarrays.`, codeLine: 2, operations: ops });
      sort(arr, low, pi - 1);
      sort(arr, pi + 1, high);
    } else if (low === high) {
      sortedSet.add(low);
    }
  }

  sort(a, 0, a.length - 1);
  steps.push({ array: [...a], comparing: [], swapping: [], sorted: Array.from({length: a.length}, (_, i) => i), pivot: -1, explanation: 'Array is fully sorted! ✓', codeLine: 0, operations: ops });
  return steps;
}
