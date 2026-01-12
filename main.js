// ======== Grab HTML elements ========
const algoSelect = document.getElementById("algo");
const arrayInput = document.getElementById("array");
const startBtn = document.getElementById("start");
const stepBtn = document.getElementById("step");
const visualDiv = document.getElementById("visual");

// ======== Global state ========
let array = [];
let currentAlgo = null;
let stepState = null;

// ======== Event Listeners ========
startBtn.addEventListener("click", () => {
  // Parse array input
  array = arrayInput.value.split(",").map(num => parseInt(num.trim()));
  
  // Reset visualizer
  visualDiv.innerHTML = "";
  
  // Reset step state
  stepState = null;

  // Pick algorithm
  currentAlgo = algoSelect.value;

  // Initialize the selected algorithm
  initializeAlgo(currentAlgo, array);
});

stepBtn.addEventListener("click", () => {
  if (!currentAlgo || !stepState) {
    alert("Please click Start first!");
    return;
  }

  // Perform one step of the algorithm
  stepState = performStep(currentAlgo, stepState);

  // Update visualizer
  updateVisualizer(stepState);
});

// ======== Functions to implement later ========
function initializeAlgo(algo, arr) {
  // Setup initial state for the selected algorithm
  // e.g., for binary search: l=0, r=arr.length-1
  stepState = {
    array: arr,
    pointer1: null,
    pointer2: null,
    // add more state as needed per algorithm
  };
}

function performStep(algo, state) {
  // Execute one step of the selected algorithm
  // Return updated state
  return state; // placeholder
}

function updateVisualizer(state) {
  // Update #visual div based on state
  visualDiv.innerHTML = state.array.join(", ");
  // Later: highlight pointers, etc.
}
