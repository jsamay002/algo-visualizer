// ============================================================
// CP Algorithm Visualizer - Main Application
// 15 Competitive Programming Techniques
// ============================================================

let currentAlgo = 'binary-search';
let algoState = null;
let autoRunInterval = null;
let isInitialized = false;

// ============================================================
// ALGORITHM DATA - All 15 Techniques
// ============================================================

const algorithmData = {

// -------------------------------------------------------
// 1. BINARY SEARCH
// -------------------------------------------------------
'binary-search': {
  name: 'Binary Search',
  category: 'Searching & Arrays',
  description: 'Efficiently finds a target value in a sorted array by repeatedly dividing the search interval in half. Essential for USACO Bronze/Silver problems involving monotonic functions and search spaces.',
  complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
  defaultInput: '1,3,5,7,9,11,13,15,17,19',
  defaultTarget: 13,
  hasTarget: true,
  python: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
  cpp: `int binarySearch(vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            lo = mid + 1;
        else
            hi = mid - 1;
    }
    return -1;
}`,
  java: `static int binarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            lo = mid + 1;
        else
            hi = mid - 1;
    }
    return -1;
}`,
  initState(arr, target) {
    return { array: arr.slice(), target, lo: 0, hi: arr.length - 1, mid: -1, found: -1, done: false, eliminated: new Set() };
  },
  step(state) {
    if (state.done) return { done: true, description: state.found >= 0 ? `Found ${state.target} at index ${state.found}!` : `${state.target} not found in the array.` };
    if (state.lo > state.hi) {
      state.done = true;
      return { done: true, description: `${state.target} not found in the array.` };
    }
    const mid = Math.floor((state.lo + state.hi) / 2);
    state.mid = mid;
    if (state.array[mid] === state.target) {
      state.found = mid;
      state.done = true;
      return { done: true, description: `Found ${state.target} at index ${mid}!` };
    } else if (state.array[mid] < state.target) {
      for (let i = state.lo; i <= mid; i++) state.eliminated.add(i);
      state.lo = mid + 1;
      return { done: false, description: `arr[${mid}] = ${state.array[mid]} < ${state.target}. Search right half: lo = ${mid + 1}` };
    } else {
      for (let i = mid; i <= state.hi; i++) state.eliminated.add(i);
      state.hi = mid - 1;
      return { done: false, description: `arr[${mid}] = ${state.array[mid]} > ${state.target}. Search left half: hi = ${mid - 1}` };
    }
  }
},

// -------------------------------------------------------
// 2. TWO POINTERS
// -------------------------------------------------------
'two-pointers': {
  name: 'Two Pointers',
  category: 'Searching & Arrays',
  description: 'Uses two pointers moving toward each other to find pairs in a sorted array that sum to a target value. A common and efficient technique in USACO Silver for pair-finding and partitioning problems.',
  complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  defaultInput: '1,2,3,4,5,6,7,8,9',
  defaultTarget: 10,
  hasTarget: true,
  python: `def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        curr_sum = arr[left] + arr[right]
        if curr_sum == target:
            return (left, right)
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return (-1, -1)`,
  cpp: `pair<int,int> twoSumSorted(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target)
            return {left, right};
        else if (sum < target)
            left++;
        else
            right--;
    }
    return {-1, -1};
}`,
  java: `static int[] twoSumSorted(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target)
            return new int[]{left, right};
        else if (sum < target)
            left++;
        else
            right--;
    }
    return new int[]{-1, -1};
}`,
  initState(arr, target) {
    return { array: arr.slice(), target, left: 0, right: arr.length - 1, found: null, done: false };
  },
  step(state) {
    if (state.done) return { done: true, description: state.found ? `Found pair: arr[${state.found[0]}] + arr[${state.found[1]}] = ${state.target}` : 'No pair found.' };
    if (state.left >= state.right) {
      state.done = true;
      return { done: true, description: 'No pair found that sums to the target.' };
    }
    const sum = state.array[state.left] + state.array[state.right];
    if (sum === state.target) {
      state.found = [state.left, state.right];
      state.done = true;
      return { done: true, description: `Found! arr[${state.left}](${state.array[state.left]}) + arr[${state.right}](${state.array[state.right]}) = ${state.target}` };
    } else if (sum < state.target) {
      const desc = `Sum = ${state.array[state.left]} + ${state.array[state.right]} = ${sum} < ${state.target}. Move left pointer right.`;
      state.left++;
      return { done: false, description: desc };
    } else {
      const desc = `Sum = ${state.array[state.left]} + ${state.array[state.right]} = ${sum} > ${state.target}. Move right pointer left.`;
      state.right--;
      return { done: false, description: desc };
    }
  }
},

// -------------------------------------------------------
// 3. PREFIX SUMS
// -------------------------------------------------------
'prefix-sums': {
  name: 'Prefix Sums',
  category: 'Searching & Arrays',
  description: 'Precomputes cumulative sums so that any range sum query can be answered in O(1). A fundamental technique in USACO Silver used for range queries, subarray sums, and 2D grid problems.',
  complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
  defaultInput: '3,1,4,1,5,9,2,6',
  hasTarget: false,
  python: `def build_prefix(arr):
    n = len(arr)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]
    return prefix

def range_sum(prefix, l, r):
    """Sum of arr[l..r] inclusive"""
    return prefix[r + 1] - prefix[l]`,
  cpp: `vector<int> buildPrefix(vector<int>& arr) {
    int n = arr.size();
    vector<int> prefix(n + 1, 0);
    for (int i = 0; i < n; i++)
        prefix[i + 1] = prefix[i] + arr[i];
    return prefix;
}

// Sum of arr[l..r] inclusive
int rangeSum(vector<int>& prefix, int l, int r) {
    return prefix[r + 1] - prefix[l];
}`,
  java: `static int[] buildPrefix(int[] arr) {
    int n = arr.length;
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++)
        prefix[i + 1] = prefix[i] + arr[i];
    return prefix;
}

// Sum of arr[l..r] inclusive
static int rangeSum(int[] prefix, int l, int r) {
    return prefix[r + 1] - prefix[l];
}`,
  initState(arr) {
    return { array: arr.slice(), prefix: new Array(arr.length + 1).fill(0), buildIndex: 0, phase: 'building', done: false };
  },
  step(state) {
    if (state.done) return { done: true, description: 'Prefix sum array complete! Any range query is now O(1).' };
    if (state.phase === 'building') {
      if (state.buildIndex < state.array.length) {
        const i = state.buildIndex;
        state.prefix[i + 1] = state.prefix[i] + state.array[i];
        state.buildIndex++;
        return { done: false, description: `prefix[${i + 1}] = prefix[${i}](${state.prefix[i]}) + arr[${i}](${state.array[i]}) = ${state.prefix[i + 1]}` };
      } else {
        state.done = true;
        return { done: true, description: `Prefix array built! Example: sum(1..4) = prefix[5] - prefix[1] = ${state.prefix[5]} - ${state.prefix[1]} = ${state.prefix[5] - state.prefix[1]}` };
      }
    }
    return { done: true, description: 'Complete.' };
  }
},

// -------------------------------------------------------
// 4. SLIDING WINDOW
// -------------------------------------------------------
'sliding-window': {
  name: 'Sliding Window',
  category: 'Searching & Arrays',
  description: 'Maintains a window of elements sliding across the array to find optimal subarrays. Key technique for USACO Silver/Gold problems involving contiguous subarrays with constraints.',
  complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  defaultInput: '2,1,5,1,3,2,4,3',
  hasTarget: false,
  hasWindow: true,
  defaultWindow: 3,
  python: `def max_sum_subarray(arr, k):
    n = len(arr)
    if n < k:
        return -1
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, n):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum`,
  cpp: `int maxSumSubarray(vector<int>& arr, int k) {
    int n = arr.size();
    if (n < k) return -1;
    int windowSum = 0;
    for (int i = 0; i < k; i++)
        windowSum += arr[i];
    int maxSum = windowSum;
    for (int i = k; i < n; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}`,
  java: `static int maxSumSubarray(int[] arr, int k) {
    int n = arr.length;
    if (n < k) return -1;
    int windowSum = 0;
    for (int i = 0; i < k; i++)
        windowSum += arr[i];
    int maxSum = windowSum;
    for (int i = k; i < n; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}`,
  initState(arr, _, windowSize) {
    const k = windowSize || 3;
    let initSum = 0;
    for (let i = 0; i < Math.min(k, arr.length); i++) initSum += arr[i];
    return { array: arr.slice(), k, windowStart: 0, windowEnd: k - 1, currentSum: initSum, maxSum: initSum, bestStart: 0, phase: 'init', stepNum: 0, done: false };
  },
  step(state) {
    if (state.done) return { done: true, description: `Max sum subarray of size ${state.k}: ${state.maxSum} (starting at index ${state.bestStart})` };
    if (state.phase === 'init') {
      state.phase = 'sliding';
      return { done: false, description: `Initial window [0..${state.k - 1}]: sum = ${state.currentSum}` };
    }
    state.windowStart++;
    state.windowEnd++;
    if (state.windowEnd >= state.array.length) {
      state.done = true;
      return { done: true, description: `Done! Max sum = ${state.maxSum} at window starting index ${state.bestStart}` };
    }
    const removed = state.array[state.windowStart - 1];
    const added = state.array[state.windowEnd];
    state.currentSum = state.currentSum - removed + added;
    if (state.currentSum > state.maxSum) {
      state.maxSum = state.currentSum;
      state.bestStart = state.windowStart;
    }
    return { done: false, description: `Window [${state.windowStart}..${state.windowEnd}]: removed ${removed}, added ${added}, sum = ${state.currentSum}${state.currentSum >= state.maxSum ? ' (new max!)' : ''}` };
  }
},

// -------------------------------------------------------
// 5. BUBBLE SORT
// -------------------------------------------------------
'bubble-sort': {
  name: 'Bubble Sort',
  category: 'Sorting Algorithms',
  description: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Simple but O(n²) - useful for understanding sorting fundamentals and inversion counting.',
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  defaultInput: '64,34,25,12,22,11,90',
  hasTarget: false,
  python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break`,
  cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
  java: `static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
  initState(arr) {
    return { array: arr.slice(), i: 0, j: 0, sorted: new Set(), done: false, comparing: [-1, -1] };
  },
  step(state) {
    if (state.done) return { done: true, description: 'Array is sorted!' };
    const n = state.array.length;
    if (state.i >= n - 1) {
      state.done = true;
      for (let k = 0; k < n; k++) state.sorted.add(k);
      return { done: true, description: 'Array is sorted!' };
    }
    if (state.j < n - state.i - 1) {
      state.comparing = [state.j, state.j + 1];
      let desc;
      if (state.array[state.j] > state.array[state.j + 1]) {
        [state.array[state.j], state.array[state.j + 1]] = [state.array[state.j + 1], state.array[state.j]];
        desc = `Comparing arr[${state.j}]=${state.array[state.j + 1]} > arr[${state.j + 1}]=${state.array[state.j]}. Swapped!`;
      } else {
        desc = `Comparing arr[${state.j}]=${state.array[state.j]} ≤ arr[${state.j + 1}]=${state.array[state.j + 1]}. No swap.`;
      }
      state.j++;
      return { done: false, description: desc };
    } else {
      state.sorted.add(n - state.i - 1);
      state.i++;
      state.j = 0;
      state.comparing = [-1, -1];
      return { done: false, description: `Pass ${state.i} complete. Element at index ${n - state.i} is in place.` };
    }
  }
},

// -------------------------------------------------------
// 6. SELECTION SORT
// -------------------------------------------------------
'selection-sort': {
  name: 'Selection Sort',
  category: 'Sorting Algorithms',
  description: 'Finds the minimum element from the unsorted portion and places it at the beginning. Demonstrates the selection principle that appears in many competitive programming greedy algorithms.',
  complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  defaultInput: '64,25,12,22,11,90,34',
  hasTarget: false,
  python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
  cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
  java: `static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`,
  initState(arr) {
    return { array: arr.slice(), i: 0, j: 0, minIdx: 0, phase: 'find_min', sorted: new Set(), done: false };
  },
  step(state) {
    if (state.done) return { done: true, description: 'Array is sorted!' };
    const n = state.array.length;
    if (state.i >= n) {
      state.done = true;
      return { done: true, description: 'Array is sorted!' };
    }
    if (state.phase === 'find_min') {
      state.minIdx = state.i;
      for (let j = state.i + 1; j < n; j++) {
        if (state.array[j] < state.array[state.minIdx]) state.minIdx = j;
      }
      state.phase = 'swap';
      return { done: false, description: `Found minimum ${state.array[state.minIdx]} at index ${state.minIdx} in unsorted portion [${state.i}..${n - 1}]` };
    } else {
      const desc = state.i !== state.minIdx
        ? `Swapping arr[${state.i}]=${state.array[state.i]} with arr[${state.minIdx}]=${state.array[state.minIdx]}`
        : `arr[${state.i}]=${state.array[state.i]} is already the minimum. No swap needed.`;
      [state.array[state.i], state.array[state.minIdx]] = [state.array[state.minIdx], state.array[state.i]];
      state.sorted.add(state.i);
      state.i++;
      state.phase = 'find_min';
      if (state.i >= n) { state.done = true; for (let k = 0; k < n; k++) state.sorted.add(k); }
      return { done: state.done, description: desc };
    }
  }
},

// -------------------------------------------------------
// 7. INSERTION SORT
// -------------------------------------------------------
'insertion-sort': {
  name: 'Insertion Sort',
  category: 'Sorting Algorithms',
  description: 'Builds the sorted array one element at a time by inserting each new element into its correct position. Efficient for small or nearly-sorted arrays - often used as base case in hybrid sorts.',
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  defaultInput: '12,11,13,5,6,7',
  hasTarget: false,
  python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
  cpp: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
  java: `static void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
  initState(arr) {
    return { array: arr.slice(), i: 1, insertPos: -1, sorted: new Set([0]), done: false };
  },
  step(state) {
    if (state.done) return { done: true, description: 'Array is sorted!' };
    if (state.i >= state.array.length) {
      state.done = true;
      for (let k = 0; k < state.array.length; k++) state.sorted.add(k);
      return { done: true, description: 'Array is sorted!' };
    }
    const key = state.array[state.i];
    let j = state.i - 1;
    while (j >= 0 && state.array[j] > key) {
      state.array[j + 1] = state.array[j];
      j--;
    }
    state.array[j + 1] = key;
    state.insertPos = j + 1;
    state.sorted.add(state.i);
    const desc = `Inserted ${key} at position ${j + 1}. Sorted portion: [0..${state.i}]`;
    state.i++;
    return { done: false, description: desc };
  }
},

// -------------------------------------------------------
// 8. MERGE SORT
// -------------------------------------------------------
'merge-sort': {
  name: 'Merge Sort',
  category: 'Sorting Algorithms',
  description: 'Divides the array into halves, recursively sorts them, and merges the sorted halves. Guaranteed O(n log n) - important for USACO problems requiring stable, efficient sorting and inversion counting.',
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  defaultInput: '38,27,43,3,9,82,10',
  hasTarget: false,
  python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
  cpp: `void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size())
        arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`,
  java: `static void merge(int[] arr, int l, int m, int r) {
    int[] left = Arrays.copyOfRange(arr, l, m + 1);
    int[] right = Arrays.copyOfRange(arr, m + 1, r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.length && j < right.length)
        arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
}

static void mergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`,
  initState(arr) {
    // Bottom-up merge sort for step-by-step visualization
    const steps = [];
    const a = arr.slice();
    const n = a.length;
    for (let size = 1; size < n; size *= 2) {
      for (let left = 0; left < n; left += 2 * size) {
        const mid = Math.min(left + size - 1, n - 1);
        const right = Math.min(left + 2 * size - 1, n - 1);
        if (mid < right) {
          steps.push({ left, mid, right });
        }
      }
    }
    return { array: a, original: arr.slice(), steps, stepIdx: 0, mergeHighlight: null, done: false };
  },
  step(state) {
    if (state.done || state.stepIdx >= state.steps.length) {
      state.done = true;
      return { done: true, description: 'Merge sort complete! Array is sorted.' };
    }
    const { left, mid, right } = state.steps[state.stepIdx];
    // Perform the merge
    const L = state.array.slice(left, mid + 1);
    const R = state.array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < L.length && j < R.length) {
      if (L[i] <= R[j]) state.array[k++] = L[i++];
      else state.array[k++] = R[j++];
    }
    while (i < L.length) state.array[k++] = L[i++];
    while (j < R.length) state.array[k++] = R[j++];
    state.mergeHighlight = { left, mid, right };
    state.stepIdx++;
    return { done: false, description: `Merging subarrays [${left}..${mid}] and [${mid + 1}..${right}]` };
  }
},

// -------------------------------------------------------
// 9. QUICK SORT
// -------------------------------------------------------
'quick-sort': {
  name: 'Quick Sort',
  category: 'Sorting Algorithms',
  description: 'Selects a pivot element and partitions the array so that smaller elements go left and larger go right, then recursively sorts. Average O(n log n) - the most widely used sorting algorithm in practice.',
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
  defaultInput: '10,80,30,90,40,50,70',
  hasTarget: false,
  python: `def quick_sort(arr, lo, hi):
    if lo < hi:
        pivot_idx = partition(arr, lo, hi)
        quick_sort(arr, lo, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, hi)

def partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[hi] = arr[hi], arr[i + 1]
    return i + 1`,
  cpp: `int partition(vector<int>& arr, int lo, int hi) {
    int pivot = arr[hi];
    int i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[hi]);
    return i + 1;
}

void quickSort(vector<int>& arr, int lo, int hi) {
    if (lo < hi) {
        int p = partition(arr, lo, hi);
        quickSort(arr, lo, p - 1);
        quickSort(arr, p + 1, hi);
    }
}`,
  java: `static int partition(int[] arr, int lo, int hi) {
    int pivot = arr[hi];
    int i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[hi];
    arr[hi] = temp;
    return i + 1;
}

static void quickSort(int[] arr, int lo, int hi) {
    if (lo < hi) {
        int p = partition(arr, lo, hi);
        quickSort(arr, lo, p - 1);
        quickSort(arr, p + 1, hi);
    }
}`,
  initState(arr) {
    // Pre-compute partition steps
    const steps = [];
    const a = arr.slice();
    function qs(lo, hi) {
      if (lo < hi) {
        steps.push({ lo, hi, pivotVal: a[hi] });
        const pivot = a[hi];
        let i = lo - 1;
        for (let j = lo; j < hi; j++) {
          if (a[j] <= pivot) { i++; [a[i], a[j]] = [a[j], a[i]]; }
        }
        [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
        const p = i + 1;
        steps[steps.length - 1].pivotFinal = p;
        qs(lo, p - 1);
        qs(p + 1, hi);
      }
    }
    qs(0, a.length - 1);
    return { array: arr.slice(), steps, stepIdx: 0, pivotPositions: new Set(), currentPartition: null, done: false };
  },
  step(state) {
    if (state.done || state.stepIdx >= state.steps.length) {
      state.done = true;
      return { done: true, description: 'Quick sort complete! Array is sorted.' };
    }
    const step = state.steps[state.stepIdx];
    // Perform Lomuto partition
    const pivot = state.array[step.hi];
    let i = step.lo - 1;
    for (let j = step.lo; j < step.hi; j++) {
      if (state.array[j] <= pivot) { i++; [state.array[i], state.array[j]] = [state.array[j], state.array[i]]; }
    }
    [state.array[i + 1], state.array[step.hi]] = [state.array[step.hi], state.array[i + 1]];
    const pivotFinal = i + 1;
    state.pivotPositions.add(pivotFinal);
    state.currentPartition = { lo: step.lo, hi: step.hi, pivot: pivotFinal };
    state.stepIdx++;
    return { done: false, description: `Partition [${step.lo}..${step.hi}]: pivot=${pivot} placed at index ${pivotFinal}` };
  }
},

// -------------------------------------------------------
// 10. BFS
// -------------------------------------------------------
'bfs': {
  name: 'Breadth-First Search (BFS)',
  category: 'Graph Algorithms',
  description: 'Explores a graph level by level using a queue. Finds shortest paths in unweighted graphs. Fundamental USACO Silver/Gold technique used for flood fill, shortest path, and connected components.',
  complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
  isGraph: true,
  defaultInput: '',
  hasTarget: false,
  graph: {
    nodes: [0, 1, 2, 3, 4, 5],
    edges: [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5]],
    positions: { 0:[100,60], 1:[250,60], 2:[100,200], 3:[400,60], 4:[250,200], 5:[400,200] },
    directed: false
  },
  python: `from collections import deque

def bfs(adj, start, n):
    visited = [False] * n
    dist = [-1] * n
    queue = deque([start])
    visited[start] = True
    dist[start] = 0
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in adj[node]:
            if not visited[neighbor]:
                visited[neighbor] = True
                dist[neighbor] = dist[node] + 1
                queue.append(neighbor)
    return order, dist`,
  cpp: `vector<int> bfs(vector<vector<int>>& adj, int start, int n) {
    vector<bool> visited(n, false);
    vector<int> dist(n, -1);
    queue<int> q;
    q.push(start);
    visited[start] = true;
    dist[start] = 0;
    vector<int> order;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                dist[neighbor] = dist[node] + 1;
                q.push(neighbor);
            }
        }
    }
    return order;
}`,
  java: `static List<Integer> bfs(List<List<Integer>> adj, int start, int n) {
    boolean[] visited = new boolean[n];
    int[] dist = new int[n];
    Arrays.fill(dist, -1);
    Queue<Integer> queue = new LinkedList<>();
    queue.add(start);
    visited[start] = true;
    dist[start] = 0;
    List<Integer> order = new ArrayList<>();
    while (!queue.isEmpty()) {
        int node = queue.poll();
        order.add(node);
        for (int neighbor : adj.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                dist[neighbor] = dist[node] + 1;
                queue.add(neighbor);
            }
        }
    }
    return order;
}`,
  initState() {
    const g = this.graph;
    const adj = {};
    g.nodes.forEach(n => adj[n] = []);
    g.edges.forEach(([u, v]) => { adj[u].push(v); if (!g.directed) adj[v].push(u); });
    return { adj, nodes: g.nodes.slice(), edges: g.edges.slice(), positions: { ...g.positions }, visited: new Set(), queue: [0], current: null, done: false, order: [] };
  },
  step(state) {
    if (state.done) return { done: true, description: `BFS complete! Order: ${state.order.join(' → ')}` };
    if (state.queue.length === 0) {
      state.done = true;
      return { done: true, description: `BFS complete! Traversal order: ${state.order.join(' → ')}` };
    }
    const node = state.queue.shift();
    if (state.visited.has(node)) return this.step(state);
    state.visited.add(node);
    state.current = node;
    state.order.push(node);
    for (const neighbor of state.adj[node]) {
      if (!state.visited.has(neighbor) && !state.queue.includes(neighbor)) {
        state.queue.push(neighbor);
      }
    }
    return { done: false, description: `Visit node ${node}. Queue: [${state.queue.join(', ')}]` };
  }
},

// -------------------------------------------------------
// 11. DFS
// -------------------------------------------------------
'dfs': {
  name: 'Depth-First Search (DFS)',
  category: 'Graph Algorithms',
  description: 'Explores a graph by going as deep as possible along each branch before backtracking. Core technique for USACO problems involving connected components, cycle detection, tree traversal, and flood fill.',
  complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
  isGraph: true,
  defaultInput: '',
  hasTarget: false,
  graph: {
    nodes: [0, 1, 2, 3, 4, 5],
    edges: [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5]],
    positions: { 0:[100,60], 1:[250,60], 2:[100,200], 3:[400,60], 4:[250,200], 5:[400,200] },
    directed: false
  },
  python: `def dfs(adj, start, n):
    visited = [False] * n
    order = []

    def helper(node):
        visited[node] = True
        order.append(node)
        for neighbor in adj[node]:
            if not visited[neighbor]:
                helper(neighbor)

    helper(start)
    return order`,
  cpp: `void dfs(vector<vector<int>>& adj, int node,
         vector<bool>& visited, vector<int>& order) {
    visited[node] = true;
    order.push_back(node);
    for (int neighbor : adj[node]) {
        if (!visited[neighbor]) {
            dfs(adj, neighbor, visited, order);
        }
    }
}`,
  java: `static void dfs(List<List<Integer>> adj, int node,
                boolean[] visited, List<Integer> order) {
    visited[node] = true;
    order.add(node);
    for (int neighbor : adj.get(node)) {
        if (!visited[neighbor]) {
            dfs(adj, neighbor, visited, order);
        }
    }
}`,
  initState() {
    const g = this.graph;
    const adj = {};
    g.nodes.forEach(n => adj[n] = []);
    g.edges.forEach(([u, v]) => { adj[u].push(v); if (!g.directed) adj[v].push(u); });
    return { adj, nodes: g.nodes.slice(), edges: g.edges.slice(), positions: { ...g.positions }, visited: new Set(), stack: [0], onStack: new Set([0]), current: null, done: false, order: [] };
  },
  step(state) {
    if (state.done) return { done: true, description: `DFS complete! Order: ${state.order.join(' → ')}` };
    if (state.stack.length === 0) {
      state.done = true;
      return { done: true, description: `DFS complete! Traversal order: ${state.order.join(' → ')}` };
    }
    const node = state.stack.pop();
    state.onStack.delete(node);
    if (state.visited.has(node)) return this.step(state);
    state.visited.add(node);
    state.current = node;
    state.order.push(node);
    const neighbors = state.adj[node].slice().reverse();
    for (const neighbor of neighbors) {
      if (!state.visited.has(neighbor)) {
        state.stack.push(neighbor);
        state.onStack.add(neighbor);
      }
    }
    return { done: false, description: `Visit node ${node}. Stack: [${state.stack.join(', ')}]` };
  }
},

// -------------------------------------------------------
// 12. DIJKSTRA'S ALGORITHM
// -------------------------------------------------------
'dijkstra': {
  name: "Dijkstra's Algorithm",
  category: 'Graph Algorithms',
  description: 'Finds shortest paths from a source vertex to all other vertices in a weighted graph with non-negative edge weights. Critical for USACO Gold shortest path problems.',
  complexity: { best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)', space: 'O(V)' },
  isGraph: true,
  defaultInput: '',
  hasTarget: false,
  graph: {
    nodes: [0, 1, 2, 3, 4],
    edges: [[0,1,4],[0,2,1],[2,1,2],[1,3,1],[2,3,5],[3,4,3]],
    positions: { 0:[80,130], 1:[250,50], 2:[250,210], 3:[420,130], 4:[560,130] },
    directed: true,
    weighted: true
  },
  python: `import heapq

def dijkstra(adj, start, n):
    dist = [float('inf')] * n
    dist[start] = 0
    pq = [(0, start)]  # (distance, node)
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist`,
  cpp: `vector<int> dijkstra(vector<vector<pair<int,int>>>& adj,
                     int start, int n) {
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>,
                   greater<pair<int,int>>> pq;
    dist[start] = 0;
    pq.push({0, start});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
  java: `static int[] dijkstra(List<List<int[]>> adj, int start, int n) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[start] = 0;
    // PQ stores {distance, node}
    PriorityQueue<int[]> pq = new PriorityQueue<>(
        (a, b) -> a[0] - b[0]);
    pq.add(new int[]{0, start});
    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int d = top[0], u = top[1];
        if (d > dist[u]) continue;
        for (int[] edge : adj.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.add(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}`,
  initState() {
    const g = this.graph;
    const adj = {};
    g.nodes.forEach(n => adj[n] = []);
    g.edges.forEach(([u, v, w]) => { adj[u].push({ to: v, weight: w }); });
    const dist = {};
    g.nodes.forEach(n => dist[n] = Infinity);
    dist[0] = 0;
    return { adj, nodes: g.nodes.slice(), edges: g.edges.slice(), positions: { ...g.positions }, dist, finalized: new Set(), pq: [{ node: 0, dist: 0 }], current: null, relaxedEdges: new Set(), done: false };
  },
  step(state) {
    if (state.done) {
      const distStr = state.nodes.map(n => `d[${n}]=${state.dist[n] === Infinity ? '∞' : state.dist[n]}`).join(', ');
      return { done: true, description: `Dijkstra complete! ${distStr}` };
    }
    if (state.pq.length === 0) {
      state.done = true;
      return this.step(state);
    }
    // Extract min
    state.pq.sort((a, b) => a.dist - b.dist);
    const { node: u, dist: d } = state.pq.shift();
    if (d > state.dist[u]) return this.step(state);
    state.finalized.add(u);
    state.current = u;
    let relaxed = [];
    for (const { to: v, weight: w } of state.adj[u]) {
      if (state.dist[u] + w < state.dist[v]) {
        state.dist[v] = state.dist[u] + w;
        state.pq.push({ node: v, dist: state.dist[v] });
        state.relaxedEdges.add(`${u}-${v}`);
        relaxed.push(`d[${v}]: ${state.dist[v]}`);
      }
    }
    if (state.pq.length === 0 || state.finalized.size === state.nodes.length) state.done = true;
    const desc = relaxed.length > 0
      ? `Process node ${u} (dist=${state.dist[u]}). Relaxed: ${relaxed.join(', ')}`
      : `Process node ${u} (dist=${state.dist[u]}). No edges relaxed.`;
    return { done: state.done, description: desc };
  }
},

// -------------------------------------------------------
// 13. TOPOLOGICAL SORT
// -------------------------------------------------------
'topological-sort': {
  name: 'Topological Sort',
  category: 'Graph Algorithms',
  description: "Orders vertices of a directed acyclic graph (DAG) such that for every directed edge u→v, u comes before v. Used in USACO for dependency ordering, scheduling problems, and DP on DAGs (Kahn's Algorithm).",
  complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
  isGraph: true,
  defaultInput: '',
  hasTarget: false,
  graph: {
    nodes: [0, 1, 2, 3, 4, 5],
    edges: [[5,2],[5,0],[4,0],[4,1],[2,3],[3,1]],
    positions: { 5:[80,60], 4:[80,200], 2:[250,60], 0:[250,200], 3:[420,60], 1:[420,200] },
    directed: true
  },
  python: `from collections import deque

def topological_sort(adj, n):
    in_degree = [0] * n
    for u in range(n):
        for v in adj[u]:
            in_degree[v] += 1
    queue = deque()
    for i in range(n):
        if in_degree[i] == 0:
            queue.append(i)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for v in adj[node]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
    return order  # len(order) == n if DAG`,
  cpp: `vector<int> topologicalSort(vector<vector<int>>& adj, int n) {
    vector<int> inDegree(n, 0);
    for (int u = 0; u < n; u++)
        for (int v : adj[u])
            inDegree[v]++;
    queue<int> q;
    for (int i = 0; i < n; i++)
        if (inDegree[i] == 0)
            q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);
        for (int v : adj[node])
            if (--inDegree[v] == 0)
                q.push(v);
    }
    return order;
}`,
  java: `static List<Integer> topologicalSort(List<List<Integer>> adj, int n) {
    int[] inDegree = new int[n];
    for (int u = 0; u < n; u++)
        for (int v : adj.get(u))
            inDegree[v]++;
    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < n; i++)
        if (inDegree[i] == 0)
            queue.add(i);
    List<Integer> order = new ArrayList<>();
    while (!queue.isEmpty()) {
        int node = queue.poll();
        order.add(node);
        for (int v : adj.get(node))
            if (--inDegree[v] == 0)
                queue.add(v);
    }
    return order;
}`,
  initState() {
    const g = this.graph;
    const adj = {};
    const inDegree = {};
    g.nodes.forEach(n => { adj[n] = []; inDegree[n] = 0; });
    g.edges.forEach(([u, v]) => { adj[u].push(v); inDegree[v]++; });
    const queue = g.nodes.filter(n => inDegree[n] === 0);
    return { adj, inDegree: { ...inDegree }, nodes: g.nodes.slice(), edges: g.edges.slice(), positions: { ...g.positions }, queue, processed: new Set(), current: null, order: [], done: false };
  },
  step(state) {
    if (state.done) return { done: true, description: `Topological order: ${state.order.join(' → ')}` };
    if (state.queue.length === 0) {
      state.done = true;
      return { done: true, description: `Topological sort complete! Order: ${state.order.join(' → ')}` };
    }
    const node = state.queue.shift();
    state.processed.add(node);
    state.current = node;
    state.order.push(node);
    for (const v of state.adj[node]) {
      state.inDegree[v]--;
      if (state.inDegree[v] === 0) state.queue.push(v);
    }
    if (state.queue.length === 0 && state.order.length < state.nodes.length) {
      // cycle or all processed
    }
    if (state.order.length === state.nodes.length) state.done = true;
    return { done: state.done, description: `Process node ${node} (in-degree was 0). Order so far: [${state.order.join(', ')}]` };
  }
},

// -------------------------------------------------------
// 14. UNION-FIND (DSU)
// -------------------------------------------------------
'union-find': {
  name: 'Union-Find (DSU)',
  category: 'Advanced Techniques',
  description: 'Disjoint Set Union with path compression and union by rank. Tracks connected components efficiently. Essential for USACO Gold problems involving grouping, connectivity, and minimum spanning trees.',
  complexity: { best: 'O(α(n))', average: 'O(α(n))', worst: 'O(α(n))', space: 'O(n)' },
  isDSU: true,
  defaultInput: '',
  hasTarget: false,
  python: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True`,
  cpp: `struct DSU {
    vector<int> parent, rank;
    DSU(int n) : parent(n), rank(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        if (rank[px] < rank[py]) swap(px, py);
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        return true;
    }
};`,
  java: `class DSU {
    int[] parent, rank;
    DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++)
            parent[i] = i;
    }
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }
    boolean union(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        if (rank[px] < rank[py]) {
            int temp = px; px = py; py = temp;
        }
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        return true;
    }
}`,
  initState() {
    const n = 6;
    const operations = [[0,1],[2,3],[1,3],[4,5],[3,5]];
    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);
    return { n, parent, rank, operations, opIdx: 0, done: false };
  },
  step(state) {
    if (state.done || state.opIdx >= state.operations.length) {
      state.done = true;
      // Build groups
      const groups = {};
      for (let i = 0; i < state.n; i++) {
        const root = find(state.parent, i);
        if (!groups[root]) groups[root] = [];
        groups[root].push(i);
      }
      return { done: true, description: `DSU complete! Groups: ${Object.values(groups).map(g => `{${g.join(',')}}`).join(' ')}` };
    }
    const [x, y] = state.operations[state.opIdx];
    const px = find(state.parent, x);
    const py = find(state.parent, y);
    let desc;
    if (px === py) {
      desc = `union(${x}, ${y}): Already in same set (root=${px})`;
    } else {
      if (state.rank[px] < state.rank[py]) {
        state.parent[px] = py;
      } else if (state.rank[px] > state.rank[py]) {
        state.parent[py] = px;
      } else {
        state.parent[py] = px;
        state.rank[px]++;
      }
      desc = `union(${x}, ${y}): Merged sets containing ${x}(root=${px}) and ${y}(root=${py})`;
    }
    state.opIdx++;
    if (state.opIdx >= state.operations.length) state.done = true;
    return { done: state.done, description: desc };
  }
},

// -------------------------------------------------------
// 15. DP - LONGEST INCREASING SUBSEQUENCE
// -------------------------------------------------------
'dp-lis': {
  name: 'DP: Longest Increasing Subsequence',
  category: 'Advanced Techniques',
  description: 'Finds the length of the longest strictly increasing subsequence using dynamic programming. A classic DP problem that appears frequently in USACO Gold and demonstrates optimal substructure and overlapping subproblems.',
  complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(n)' },
  defaultInput: '10,22,9,33,21,50,41,60',
  hasTarget: false,
  python: `def lis(arr):
    n = len(arr)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

# O(n log n) version using binary search:
from bisect import bisect_left
def lis_fast(arr):
    tails = []
    for x in arr:
        pos = bisect_left(tails, x)
        if pos == len(tails):
            tails.append(x)
        else:
            tails[pos] = x
    return len(tails)`,
  cpp: `int lis(vector<int>& arr) {
    int n = arr.size();
    vector<int> dp(n, 1);
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (arr[j] < arr[i])
                dp[i] = max(dp[i], dp[j] + 1);
    return *max_element(dp.begin(), dp.end());
}

// O(n log n) version:
int lisFast(vector<int>& arr) {
    vector<int> tails;
    for (int x : arr) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}`,
  java: `static int lis(int[] arr) {
    int n = arr.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (arr[j] < arr[i])
                dp[i] = Math.max(dp[i], dp[j] + 1);
    int max = 0;
    for (int val : dp) max = Math.max(max, val);
    return max;
}

// O(n log n) version:
static int lisFast(int[] arr) {
    List<Integer> tails = new ArrayList<>();
    for (int x : arr) {
        int pos = Collections.binarySearch(tails, x);
        if (pos < 0) pos = -(pos + 1);
        if (pos == tails.size()) tails.add(x);
        else tails.set(pos, x);
    }
    return tails.size();
}`,
  initState(arr) {
    const dp = new Array(arr.length).fill(1);
    return { array: arr.slice(), dp, i: 1, j: 0, phase: 'compare', done: false, lisIndices: [] };
  },
  step(state) {
    if (state.done) {
      const maxVal = Math.max(...state.dp);
      return { done: true, description: `LIS length = ${maxVal}. DP array: [${state.dp.join(', ')}]` };
    }
    if (state.i >= state.array.length) {
      state.done = true;
      // Backtrack to find LIS
      const maxVal = Math.max(...state.dp);
      let len = maxVal;
      const indices = [];
      for (let k = state.array.length - 1; k >= 0 && len > 0; k--) {
        if (state.dp[k] === len) {
          indices.unshift(k);
          len--;
        }
      }
      state.lisIndices = indices;
      return { done: true, description: `LIS length = ${maxVal}. One possible LIS: [${indices.map(i => state.array[i]).join(', ')}]` };
    }
    if (state.phase === 'compare') {
      // Do all j comparisons for current i in one step
      for (let j = 0; j < state.i; j++) {
        if (state.array[j] < state.array[state.i]) {
          state.dp[state.i] = Math.max(state.dp[state.i], state.dp[j] + 1);
        }
      }
      const desc = `dp[${state.i}] = ${state.dp[state.i]} (arr[${state.i}]=${state.array[state.i]}). Checked all j < ${state.i} where arr[j] < arr[${state.i}].`;
      state.i++;
      return { done: false, description: desc };
    }
    return { done: true, description: 'Complete.' };
  }
}

}; // end algorithmData

// ============================================================
// HELPER: Union-Find find with path compression
// ============================================================
function find(parent, x) {
  if (parent[x] !== x) parent[x] = find(parent, parent[x]);
  return parent[x];
}

// ============================================================
// UI CONTROLLER
// ============================================================

function initApp() {
  // Sidebar navigation
  document.querySelectorAll('.category-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const cat = btn.dataset.category;
      const items = document.getElementById(`cat-${cat}`);
      if (items) items.classList.toggle('active');
    });
  });

  document.querySelectorAll('.algo-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.algo-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      switchAlgorithm(link.dataset.algo);
    });
  });

  // Code tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.dataset.lang;
      document.getElementById('codeBlockPython').style.display = lang === 'python' ? '' : 'none';
      document.getElementById('codeBlockCpp').style.display = lang === 'cpp' ? '' : 'none';
      document.getElementById('codeBlockJava').style.display = lang === 'java' ? '' : 'none';
    });
  });

  // Controls
  document.getElementById('btnInit').addEventListener('click', initializeAlgorithm);
  document.getElementById('btnStep').addEventListener('click', performStep);
  document.getElementById('btnAutoRun').addEventListener('click', toggleAutoRun);
  document.getElementById('btnReset').addEventListener('click', resetAlgorithm);

  // Speed slider
  const slider = document.getElementById('speedSlider');
  slider.addEventListener('input', () => {
    document.getElementById('speedValue').textContent = slider.value + 'ms';
  });

  // Mobile sidebar toggle
  document.getElementById('toggleSidebar').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Load default algorithm
  switchAlgorithm('binary-search');
}

function switchAlgorithm(key) {
  stopAutoRun();
  currentAlgo = key;
  isInitialized = false;
  algoState = null;

  const algo = algorithmData[key];
  if (!algo) return;

  // Update header
  document.getElementById('algoTitle').textContent = algo.name;
  document.getElementById('algoBadge').textContent = algo.category;
  document.getElementById('algoDescription').textContent = algo.description;

  // Update complexity
  document.getElementById('complexBest').textContent = algo.complexity.best;
  document.getElementById('complexAvg').textContent = algo.complexity.average;
  document.getElementById('complexWorst').textContent = algo.complexity.worst;
  document.getElementById('complexSpace').textContent = algo.complexity.space;

  // Update code
  document.getElementById('pythonCode').textContent = algo.python;
  document.getElementById('cppCode').textContent = algo.cpp;
  document.getElementById('javaCode').textContent = algo.java;

  // Update input controls
  const inputField = document.getElementById('inputField');
  const targetGroup = document.getElementById('targetGroup');
  const windowGroup = document.getElementById('windowGroup');

  if (algo.isGraph || algo.isDSU) {
    inputField.parentElement.style.display = 'none';
  } else {
    inputField.parentElement.style.display = '';
    inputField.value = algo.defaultInput || '';
  }

  targetGroup.style.display = algo.hasTarget ? '' : 'none';
  if (algo.hasTarget) {
    document.getElementById('targetField').value = algo.defaultTarget || '';
  }

  windowGroup.style.display = algo.hasWindow ? '' : 'none';
  if (algo.hasWindow) {
    document.getElementById('windowField').value = algo.defaultWindow || 3;
  }

  // Reset visualization
  clearVisualization();
  updateStatus('Click "Initialize" to set up the algorithm, then step through or auto-run.');

  // Disable step/autorun until initialized
  document.getElementById('btnStep').disabled = true;
  document.getElementById('btnAutoRun').disabled = true;

  // Open the correct sidebar category
  const categoryMap = {
    'Searching & Arrays': 'searching',
    'Sorting Algorithms': 'sorting',
    'Graph Algorithms': 'graphs',
    'Advanced Techniques': 'advanced'
  };
  const cat = categoryMap[algo.category];
  if (cat) {
    const catItems = document.getElementById(`cat-${cat}`);
    const catToggle = document.querySelector(`[data-category="${cat}"]`);
    if (catItems && !catItems.classList.contains('active')) {
      catItems.classList.add('active');
      if (catToggle) catToggle.classList.add('active');
    }
  }
}

function initializeAlgorithm() {
  const algo = algorithmData[currentAlgo];
  if (!algo) return;

  stopAutoRun();

  let arr = [];
  let target = null;
  let windowSize = null;

  if (!algo.isGraph && !algo.isDSU) {
    const input = document.getElementById('inputField').value;
    arr = input.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    if (arr.length === 0) {
      updateStatus('Please enter a valid array (comma-separated numbers).', 'warning');
      return;
    }
  }

  if (algo.hasTarget) {
    target = parseInt(document.getElementById('targetField').value);
    if (isNaN(target)) {
      updateStatus('Please enter a valid target number.', 'warning');
      return;
    }
  }

  if (algo.hasWindow) {
    windowSize = parseInt(document.getElementById('windowField').value);
  }

  algoState = algo.initState.call(algo, arr, target, windowSize);
  isInitialized = true;

  document.getElementById('btnStep').disabled = false;
  document.getElementById('btnAutoRun').disabled = false;

  renderVisualization();
  updateStatus('Initialized! Click "Step" to advance or "Auto-Run" to animate.');
}

function performStep() {
  if (!isInitialized || !algoState) return;
  const algo = algorithmData[currentAlgo];
  const result = algo.step.call(algo, algoState);
  renderVisualization();
  updateStatus(result.description, result.done ? 'success' : '');
  if (result.done) {
    document.getElementById('btnStep').disabled = true;
    document.getElementById('btnAutoRun').textContent = 'Auto-Run';
    stopAutoRun();
  }
}

function toggleAutoRun() {
  if (autoRunInterval) {
    stopAutoRun();
    document.getElementById('btnAutoRun').textContent = 'Auto-Run';
  } else {
    const speed = parseInt(document.getElementById('speedSlider').value) || 500;
    document.getElementById('btnAutoRun').textContent = 'Pause';
    autoRunInterval = setInterval(() => {
      if (!algoState || algoState.done) {
        stopAutoRun();
        document.getElementById('btnAutoRun').textContent = 'Auto-Run';
        return;
      }
      performStep();
    }, speed);
  }
}

function stopAutoRun() {
  if (autoRunInterval) {
    clearInterval(autoRunInterval);
    autoRunInterval = null;
  }
}

function resetAlgorithm() {
  stopAutoRun();
  isInitialized = false;
  algoState = null;
  clearVisualization();
  document.getElementById('btnStep').disabled = true;
  document.getElementById('btnAutoRun').disabled = true;
  document.getElementById('btnAutoRun').textContent = 'Auto-Run';
  updateStatus('Reset. Click "Initialize" to start again.');
}

function updateStatus(text, type) {
  const bar = document.getElementById('statusBar');
  const span = document.getElementById('statusText');
  span.textContent = text;
  bar.className = 'status-bar' + (type ? ' ' + type : '');
}

function clearVisualization() {
  document.getElementById('arrayContainer').innerHTML = '';
  document.getElementById('arrayContainer').style.display = 'none';
  document.getElementById('graphContainer').innerHTML = '';
  document.getElementById('graphContainer').style.display = 'none';
}

// ============================================================
// RENDERING
// ============================================================

function renderVisualization() {
  if (!algoState) return;
  const algo = algorithmData[currentAlgo];

  if (algo.isGraph) {
    renderGraph();
  } else if (algo.isDSU) {
    renderDSU();
  } else {
    renderArrayBars();
  }
}

// --- Array Bar Rendering ---
function renderArrayBars() {
  const container = document.getElementById('arrayContainer');
  container.style.display = 'flex';
  document.getElementById('graphContainer').style.display = 'none';
  container.innerHTML = '';

  const algo = algorithmData[currentAlgo];
  const state = algoState;
  const arr = state.array;
  const maxVal = Math.max(...arr, 1);
  const maxBarHeight = 250;

  // Check if we need secondary display (prefix sums, DP)
  const needsSecondary = currentAlgo === 'prefix-sums' || currentAlgo === 'dp-lis';
  if (needsSecondary) {
    container.classList.add('with-secondary');
  } else {
    container.classList.remove('with-secondary');
  }

  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'vis-wrapper';

  // Primary array
  const primary = document.createElement('div');
  primary.className = 'array-container';
  if (needsSecondary) primary.classList.add('with-secondary');

  arr.forEach((val, i) => {
    const bar = document.createElement('div');
    bar.className = 'array-bar';

    // Determine bar class based on algorithm state
    const barClass = getBarClass(currentAlgo, state, i);
    if (barClass) bar.classList.add(barClass);

    const valueEl = document.createElement('div');
    valueEl.className = 'bar-value';
    valueEl.textContent = val;

    const fillEl = document.createElement('div');
    fillEl.className = 'bar-fill';
    fillEl.style.height = Math.max(20, (val / maxVal) * maxBarHeight) + 'px';

    const indexEl = document.createElement('div');
    indexEl.className = 'bar-index';
    indexEl.textContent = i;

    bar.appendChild(valueEl);
    bar.appendChild(fillEl);
    bar.appendChild(indexEl);

    // Add pointer labels
    addPointerLabels(bar, currentAlgo, state, i);

    primary.appendChild(bar);
  });

  wrapper.appendChild(primary);

  // Secondary array for prefix sums
  if (currentAlgo === 'prefix-sums' && state.prefix) {
    const label = document.createElement('div');
    label.className = 'secondary-label';
    label.textContent = 'Prefix Sum Array';
    wrapper.appendChild(label);

    const secondary = document.createElement('div');
    secondary.className = 'secondary-array-container';
    state.prefix.forEach((val, i) => {
      if (i > state.array.length) return;
      const cell = document.createElement('div');
      cell.className = 'array-cell';
      if (i === state.buildIndex) cell.classList.add('active');
      if (i > 0 && i <= state.buildIndex) cell.classList.add('highlight');

      const cellVal = document.createElement('div');
      cellVal.className = 'cell-value';
      cellVal.textContent = i <= state.buildIndex ? val : '?';

      const cellLabel = document.createElement('div');
      cellLabel.className = 'cell-label';
      cellLabel.textContent = `p[${i}]`;

      cell.appendChild(cellVal);
      cell.appendChild(cellLabel);
      secondary.appendChild(cell);
    });
    wrapper.appendChild(secondary);
  }

  // Secondary array for DP LIS
  if (currentAlgo === 'dp-lis' && state.dp) {
    const label = document.createElement('div');
    label.className = 'secondary-label';
    label.textContent = 'DP Array (LIS length ending at each index)';
    wrapper.appendChild(label);

    const secondary = document.createElement('div');
    secondary.className = 'secondary-array-container';
    state.dp.forEach((val, i) => {
      const cell = document.createElement('div');
      cell.className = 'array-cell';
      if (i === state.i - 1) cell.classList.add('active');
      if (state.lisIndices && state.lisIndices.includes(i)) cell.classList.add('highlight');

      const cellVal = document.createElement('div');
      cellVal.className = 'cell-value';
      cellVal.textContent = i < state.i ? val : '?';

      const cellLabel = document.createElement('div');
      cellLabel.className = 'cell-label';
      cellLabel.textContent = `dp[${i}]`;

      cell.appendChild(cellVal);
      cell.appendChild(cellLabel);
      secondary.appendChild(cell);
    });
    wrapper.appendChild(secondary);
  }

  container.innerHTML = '';
  container.appendChild(wrapper);
}

function getBarClass(algoKey, state, i) {
  switch (algoKey) {
    case 'binary-search':
      if (state.found === i) return 'found';
      if (state.eliminated.has(i)) return 'eliminated';
      if (i === state.mid) return 'mid';
      if (i === state.lo) return 'lo';
      if (i === state.hi) return 'hi';
      return '';
    case 'two-pointers':
      if (state.found && (i === state.found[0] || i === state.found[1])) return 'found';
      if (i === state.left) return 'left-ptr';
      if (i === state.right) return 'right-ptr';
      return '';
    case 'prefix-sums':
      if (i === state.buildIndex - 1) return 'active';
      if (i < state.buildIndex) return 'sorted';
      return '';
    case 'sliding-window':
      if (i >= state.windowStart && i <= state.windowEnd) return 'in-window';
      return '';
    case 'bubble-sort':
      if (state.sorted.has(i)) return 'sorted';
      if (state.comparing.includes(i)) return 'comparing';
      return '';
    case 'selection-sort':
      if (state.sorted.has(i)) return 'sorted';
      if (i === state.minIdx && state.phase === 'swap') return 'pivot';
      if (i === state.i && state.phase === 'swap') return 'comparing';
      return '';
    case 'insertion-sort':
      if (state.sorted.has(i) && i < state.i) return 'sorted';
      if (i === state.insertPos) return 'comparing';
      return '';
    case 'merge-sort':
      if (state.mergeHighlight) {
        const { left, mid, right } = state.mergeHighlight;
        if (i >= left && i <= mid) return 'left-part';
        if (i > mid && i <= right) return 'right-part';
      }
      if (state.done) return 'sorted';
      return '';
    case 'quick-sort':
      if (state.pivotPositions.has(i)) return 'sorted';
      if (state.currentPartition) {
        if (i === state.currentPartition.pivot) return 'pivot';
        if (i >= state.currentPartition.lo && i < state.currentPartition.pivot) return 'left-part';
        if (i > state.currentPartition.pivot && i <= state.currentPartition.hi) return 'right-part';
      }
      if (state.done) return 'sorted';
      return '';
    case 'dp-lis':
      if (state.lisIndices && state.lisIndices.includes(i)) return 'lis-member';
      if (i === state.i - 1) return 'dp-current';
      if (i < state.i) return 'active';
      return '';
    default:
      return '';
  }
}

function addPointerLabels(bar, algoKey, state, i) {
  if (algoKey === 'binary-search') {
    if (i === state.lo && !state.eliminated.has(i)) addLabel(bar, 'lo', 'lo', 'top');
    if (i === state.hi && !state.eliminated.has(i)) addLabel(bar, 'hi', 'hi', 'top');
    if (i === state.mid) addLabel(bar, 'mid', 'mid', 'top');
  }
  if (algoKey === 'two-pointers') {
    if (i === state.left) addLabel(bar, 'L', 'left', 'top');
    if (i === state.right) addLabel(bar, 'R', 'right', 'top');
  }
  if (algoKey === 'sliding-window') {
    if (i === state.windowStart) addLabel(bar, 'start', 'left', 'top');
    if (i === state.windowEnd) addLabel(bar, 'end', 'right', 'top');
  }
}

function addLabel(bar, text, className, position) {
  const label = document.createElement('div');
  label.className = `pointer-label ${className} ${position}`;
  label.textContent = text;
  bar.appendChild(label);
}

// --- Graph Rendering ---
function renderGraph() {
  const container = document.getElementById('graphContainer');
  container.style.display = 'block';
  document.getElementById('arrayContainer').style.display = 'none';
  container.innerHTML = '';

  const state = algoState;
  const algo = algorithmData[currentAlgo];
  const isDirected = algo.graph.directed;
  const isWeighted = algo.graph.weighted;

  // Draw edges first
  state.edges.forEach((edge, idx) => {
    const u = edge[0], v = edge[1];
    const w = edge[2]; // weight if exists
    const posU = state.positions[u];
    const posV = state.positions[v];

    const edgeEl = document.createElement('div');
    edgeEl.className = 'graph-edge';

    // Calculate edge position and rotation
    const dx = posV[0] - posU[0];
    const dy = posV[1] - posU[1];
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Offset from center of node
    const offsetStart = 22;
    const offsetEnd = 22;
    const ratio = offsetStart / length;
    const startX = posU[0] + dx * ratio;
    const startY = posU[1] + dy * ratio;
    const adjustedLength = length - offsetStart - offsetEnd;

    edgeEl.style.left = (startX + 22) + 'px';
    edgeEl.style.top = (startY + 22) + 'px';
    edgeEl.style.width = adjustedLength + 'px';
    edgeEl.style.transform = `rotate(${angle}deg)`;

    // Edge state
    if (currentAlgo === 'dijkstra' && state.relaxedEdges.has(`${u}-${v}`)) {
      edgeEl.classList.add('relaxed');
    } else if (state.visited && state.visited.has(u) && state.visited.has(v)) {
      edgeEl.classList.add('visited');
    }

    container.appendChild(edgeEl);

    // Weight label
    if (isWeighted && w !== undefined) {
      const label = document.createElement('div');
      label.className = 'graph-edge-label';
      label.textContent = w;
      label.style.left = ((posU[0] + posV[0]) / 2 + 15) + 'px';
      label.style.top = ((posU[1] + posV[1]) / 2 - 5) + 'px';
      container.appendChild(label);
    }

    // Arrow for directed graphs
    if (isDirected) {
      const arrowSize = 8;
      const endRatio = 1 - offsetEnd / length;
      const arrowX = posU[0] + dx * endRatio;
      const arrowY = posU[1] + dy * endRatio;
      const arrow = document.createElement('div');
      arrow.className = 'graph-edge-arrow';
      arrow.style.left = (arrowX + 22 - arrowSize / 2) + 'px';
      arrow.style.top = (arrowY + 22 - arrowSize / 2) + 'px';
      arrow.style.width = '0';
      arrow.style.height = '0';
      arrow.style.borderLeft = `${arrowSize}px solid transparent`;
      arrow.style.borderRight = `${arrowSize}px solid transparent`;
      arrow.style.borderBottom = `${arrowSize}px solid ${edgeEl.classList.contains('relaxed') ? 'var(--primary)' : edgeEl.classList.contains('visited') ? 'var(--success)' : 'var(--border)'}`;
      arrow.style.transform = `rotate(${angle + 90}deg)`;
      container.appendChild(arrow);
    }
  });

  // Draw nodes
  state.nodes.forEach(nodeId => {
    const pos = state.positions[nodeId];
    const nodeEl = document.createElement('div');
    nodeEl.className = 'graph-node';

    // Node state
    if (nodeId === state.current) {
      nodeEl.classList.add('current');
    } else if (currentAlgo === 'dijkstra' && state.finalized && state.finalized.has(nodeId)) {
      nodeEl.classList.add('finalized');
    } else if (currentAlgo === 'topological-sort' && state.processed && state.processed.has(nodeId)) {
      nodeEl.classList.add('visited');
    } else if (state.visited && state.visited.has(nodeId)) {
      nodeEl.classList.add('visited');
    } else if (currentAlgo === 'bfs' && state.queue && state.queue.includes(nodeId)) {
      nodeEl.classList.add('in-queue');
    } else if (currentAlgo === 'dfs' && state.onStack && state.onStack.has(nodeId)) {
      nodeEl.classList.add('on-stack');
    } else if (currentAlgo === 'topological-sort' && state.queue && state.queue.includes(nodeId)) {
      nodeEl.classList.add('in-degree-zero');
    }

    nodeEl.style.left = pos[0] + 'px';
    nodeEl.style.top = pos[1] + 'px';

    // Node content
    let content = nodeId.toString();
    if (currentAlgo === 'dijkstra' && state.dist) {
      const d = state.dist[nodeId];
      content = d === Infinity ? `${nodeId}\n∞` : `${nodeId}\n${d}`;
      nodeEl.innerHTML = `<div style="text-align:center;line-height:1.2"><div style="font-size:12px">${nodeId}</div><div style="font-size:10px;color:var(--text-secondary)">${d === Infinity ? '∞' : d}</div></div>`;
    } else if (currentAlgo === 'topological-sort' && state.inDegree) {
      nodeEl.innerHTML = `<div style="text-align:center;line-height:1.2"><div style="font-size:14px;font-weight:700">${nodeId}</div></div>`;
      const degreeLabel = document.createElement('div');
      degreeLabel.className = 'node-label';
      degreeLabel.style.position = 'absolute';
      degreeLabel.style.bottom = '-18px';
      degreeLabel.style.fontSize = '10px';
      degreeLabel.style.color = 'var(--text-secondary)';
      degreeLabel.style.width = '44px';
      degreeLabel.style.textAlign = 'center';
      degreeLabel.textContent = `in:${state.inDegree[nodeId]}`;
      nodeEl.appendChild(degreeLabel);
    } else {
      nodeEl.textContent = content;
    }

    container.appendChild(nodeEl);
  });

  // Legend / info overlay
  const info = document.createElement('div');
  info.className = 'graph-info-overlay';
  if (currentAlgo === 'bfs') {
    info.innerHTML = `
      <div class="info-row"><div class="info-dot" style="background:var(--warning)"></div> Current</div>
      <div class="info-row"><div class="info-dot" style="background:var(--info)"></div> In Queue</div>
      <div class="info-row"><div class="info-dot" style="background:var(--success)"></div> Visited</div>
    `;
  } else if (currentAlgo === 'dfs') {
    info.innerHTML = `
      <div class="info-row"><div class="info-dot" style="background:var(--warning)"></div> Current</div>
      <div class="info-row"><div class="info-dot" style="background:#ec4899"></div> On Stack</div>
      <div class="info-row"><div class="info-dot" style="background:var(--success)"></div> Visited</div>
    `;
  } else if (currentAlgo === 'dijkstra') {
    info.innerHTML = `
      <div class="info-row"><div class="info-dot" style="background:var(--warning)"></div> Processing</div>
      <div class="info-row"><div class="info-dot" style="background:var(--success)"></div> Finalized</div>
      <div class="info-row"><div class="info-dot" style="background:var(--primary)"></div> Relaxed Edge</div>
    `;
  } else if (currentAlgo === 'topological-sort') {
    info.innerHTML = `
      <div class="info-row"><div class="info-dot" style="background:var(--warning)"></div> Processing</div>
      <div class="info-row"><div class="info-dot" style="background:var(--success)"></div> Ordered</div>
    `;
  }
  container.appendChild(info);

  // Topological sort result display
  if (currentAlgo === 'topological-sort' && state.order.length > 0) {
    const result = document.createElement('div');
    result.className = 'topo-result';
    result.style.position = 'absolute';
    result.style.bottom = '10px';
    result.style.left = '50%';
    result.style.transform = 'translateX(-50%)';
    state.order.forEach((n, i) => {
      if (i > 0) {
        const arrow = document.createElement('span');
        arrow.className = 'topo-arrow';
        arrow.textContent = '→';
        result.appendChild(arrow);
      }
      const node = document.createElement('div');
      node.className = 'topo-node';
      node.textContent = n;
      result.appendChild(node);
    });
    container.appendChild(result);
  }
}

// --- DSU Rendering ---
function renderDSU() {
  const container = document.getElementById('graphContainer');
  container.style.display = 'block';
  document.getElementById('arrayContainer').style.display = 'none';
  container.innerHTML = '';

  const state = algoState;
  const dsuContainer = document.createElement('div');
  dsuContainer.className = 'dsu-container';

  // Group nodes by their root
  const groups = {};
  for (let i = 0; i < state.n; i++) {
    const root = find(state.parent, i);
    if (!groups[root]) groups[root] = [];
    groups[root].push(i);
  }

  Object.entries(groups).forEach(([root, members]) => {
    const group = document.createElement('div');
    group.className = 'dsu-group';
    if (state.opIdx > 0 && state.opIdx <= state.operations.length) {
      const lastOp = state.operations[state.opIdx - 1];
      if (lastOp && (members.includes(lastOp[0]) || members.includes(lastOp[1]))) {
        group.classList.add('active');
      }
    }

    const label = document.createElement('div');
    label.className = 'dsu-group-label';
    label.textContent = `Root: ${root}`;
    group.appendChild(label);

    const nodesRow = document.createElement('div');
    nodesRow.style.display = 'flex';
    nodesRow.style.gap = '6px';
    nodesRow.style.flexWrap = 'wrap';
    nodesRow.style.justifyContent = 'center';

    members.forEach(m => {
      const node = document.createElement('div');
      node.className = 'dsu-node';
      if (m === parseInt(root)) node.classList.add('root');
      node.textContent = m;
      nodesRow.appendChild(node);
    });

    group.appendChild(nodesRow);
    dsuContainer.appendChild(group);
  });

  // Show operations list
  const opList = document.createElement('div');
  opList.style.width = '100%';
  opList.style.textAlign = 'center';
  opList.style.padding = '10px';
  opList.style.fontSize = '13px';
  opList.style.color = 'var(--text-secondary)';

  let opHtml = '<strong>Operations:</strong> ';
  state.operations.forEach((op, i) => {
    const style = i < state.opIdx ? 'color: var(--success); font-weight: 600;' : i === state.opIdx ? 'color: var(--warning); font-weight: 600;' : '';
    opHtml += `<span style="${style}">union(${op[0]},${op[1]})</span>`;
    if (i < state.operations.length - 1) opHtml += ' → ';
  });
  opList.innerHTML = opHtml;

  container.appendChild(dsuContainer);
  container.appendChild(opList);
}

// ============================================================
// INITIALIZE APP
// ============================================================
document.addEventListener('DOMContentLoaded', initApp);
