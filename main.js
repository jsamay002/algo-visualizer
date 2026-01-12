let chart;
let algoState = {};
let currentAlgo = null;

// Sorting algorithms and their details
const algorithms = {
  bubble: {
    name: "Bubble Sort",
    code: `
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
}`,
    complexity: "Best: O(n), Average: O(n²), Worst: O(n²)",
    step: bubbleSortStep,
  },
  selection: {
    name: "Selection Sort",
    code: `
function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
}`,
    complexity: "Best: O(n²), Average: O(n²), Worst: O(n²)",
    step: selectionSortStep,
  },
  insertion: {
    name: "Insertion Sort",
    code: `
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
    complexity: "Best: O(n), Average: O(n²), Worst: O(n²)",
    step: insertionSortStep,
  },
  merge: {
    name: "Merge Sort",
    code: `
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) result.push(left.shift());
    else result.push(right.shift());
  }
  return result.concat(left, right);
}`,
    complexity: "Best: O(n log n), Average: O(n log n), Worst: O(n log n)",
    step: mergeSortStep,
  },
  quick: {
    name: "Quick Sort",
    code: `
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = arr.filter((el, i) => el <= pivot && i !== arr.length - 1);
  const right = arr.filter(el => el > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
    complexity: "Best: O(n log n), Average: O(n log n), Worst: O(n²)",
    step: quickSortStep,
  },
  heap: {
    name: "Heap Sort",
    code: `
function heapSort(arr) {
  buildMaxHeap(arr);
  for (let i = arr.length - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, 0, i);
  }
}

function buildMaxHeap(arr) {
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    heapify(arr, i, arr.length);
  }
}

function heapify(arr, i, size) {
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  let largest = i;
  if (left < size && arr[left] > arr[largest]) largest = left;
  if (right < size && arr[right] > arr[largest]) largest = right;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, largest, size);
  }
}`,
    complexity: "Best: O(n log n), Average: O(n log n), Worst: O(n log n)",
    step: heapSortStep,
  },
  bogo: {
    name: "Bogo Sort",
    code: `
function bogoSort(arr) {
  while (!isSorted(arr)) {
    for (let i = 0; i < arr.length; i++) {
      const j = Math.floor(Math.random() * arr.length);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
}

function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}`,
    complexity: "Best: O(n), Average: O((n+1)!), Worst: O(∞)",
    step: bogoSortStep,
  },
};

// Display algorithm details
function displayAlgorithmDetails(algo) {
  const details = algorithms[algo];
  if (!details) return;

  document.getElementById("code").textContent = details.code;
  document.getElementById("complexity").textContent = `Time Complexity: ${details.complexity}`;
}

// Event listeners
document.getElementById("algo").addEventListener("change", (e) => {
  currentAlgo = e.target.value;
  displayAlgorithmDetails(currentAlgo);
});

document.getElementById("start").addEventListener("click", initializeAlgo);
document.getElementById("step").addEventListener("click", performStep);