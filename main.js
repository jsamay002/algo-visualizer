let chart;
let algoState = {};
let currentAlgo = null;

// ----------------- ALGORITHMS -----------------
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
      if (arr[j] < arr[minIndex]) minIndex = j;
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
}`,
    complexity: "Best/Avg/Worst: O(n²)",
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
    complexity: "Best: O(n), Average/Worst: O(n²)",
    step: insertionSortStep,
  },
};

// ----------------- UI DETAILS -----------------
function displayAlgorithmDetails(key) {
  const details = algorithms[key];
  if (!details) return;
  document.getElementById("code").textContent = details.code;
  document.getElementById("complexity").textContent = "Time Complexity: " + details.complexity;
}

// ----------------- INITIALIZE -----------------
function initializeAlgo() {
  const input = document.getElementById("array").value;
  const array = input.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
  if (array.length === 0) return alert("Enter a valid array");

  currentAlgo = document.getElementById("algo").value;
  algoState = {
    array: array.slice(),
    stepIndex: 0,
    innerIndex: 0,
    minIndex: 0,
    sorted: false
  };

  if (!chart) {
    const ctx = document.getElementById("chart").getContext("2d");
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: array.map((_, i) => i.toString()),
        datasets: [{
          label: "Array",
          data: array,
          backgroundColor: array.map(() => "rgba(100,100,100,0.8)"),
          borderColor: array.map(() => "rgba(100,100,100,1)"),
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400 },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true },
        },
      },
    });
  } else {
    chart.data.labels = array.map((_, i) => i.toString());
    chart.data.datasets[0].data = array;
    chart.data.datasets[0].backgroundColor = array.map(() => "rgba(100,100,100,0.8)");
    chart.update();
  }

  displayAlgorithmDetails(currentAlgo);
  updateVisualizer();
}

// ----------------- STEP -----------------
function performStep() {
  if (!currentAlgo || algoState.sorted) {
    alert("Algorithm completed or not initialized.");
    return;
  }
  const algo = algorithms[currentAlgo];
  if (algo && algo.step) algo.step();
}

// ----------------- BUBBLE SORT -----------------
function bubbleSortStep() {
  const { array } = algoState;
  let { stepIndex, innerIndex } = algoState;

  if (stepIndex >= array.length - 1) {
    algoState.sorted = true;
    updateVisualizer();
    return;
  }

  if (innerIndex < array.length - stepIndex - 1) {
    if (array[innerIndex] > array[innerIndex + 1]) {
      [array[innerIndex], array[innerIndex + 1]] = [array[innerIndex + 1], array[innerIndex]];
    }
    algoState.innerIndex++;
  } else {
    algoState.stepIndex++;
    algoState.innerIndex = 0;
  }

  updateVisualizer();
}

// ----------------- SELECTION SORT -----------------
function selectionSortStep() {
  const { array } = algoState;
  let { stepIndex, minIndex } = algoState;

  if (stepIndex >= array.length - 1) {
    algoState.sorted = true;
    updateVisualizer();
    return;
  }

  minIndex = stepIndex;
  for (let j = stepIndex + 1; j < array.length; j++) {
    if (array[j] < array[minIndex]) minIndex = j;
  }
  [array[stepIndex], array[minIndex]] = [array[minIndex], array[stepIndex]];

  algoState.stepIndex++;
  algoState.minIndex = 0;

  updateVisualizer();
}

// ----------------- INSERTION SORT -----------------
function insertionSortStep() {
  const { array } = algoState;
  let { stepIndex } = algoState;

  if (stepIndex >= array.length) {
    algoState.sorted = true;
    updateVisualizer();
    return;
  }

  let key = array[stepIndex];
  let j = stepIndex - 1;
  while (j >= 0 && array[j] > key) {
    array[j + 1] = array[j];
    j--;
  }
  array[j + 1] = key;

  algoState.stepIndex++;
  updateVisualizer();
}

// ----------------- UPDATE CHART -----------------
function updateVisualizer() {
  const { array, stepIndex, innerIndex } = algoState;

  chart.data.datasets[0].data = array;
  chart.data.datasets[0].backgroundColor = array.map((_, i) => {
    if (currentAlgo === "bubble" && (i === innerIndex || i === innerIndex + 1)) return "rgba(255,0,0,0.8)";
    if (i < stepIndex) return "rgba(0,255,0,0.8)";
    return "rgba(100,100,100,0.8)";
  });
  chart.update();
}

// ----------------- EVENTS -----------------
document.getElementById("start").addEventListener("click", initializeAlgo);
document.getElementById("step").addEventListener("click", performStep);
document.getElementById("algo").addEventListener("change", e => {
  currentAlgo = e.target.value;
  displayAlgorithmDetails(currentAlgo);
});
