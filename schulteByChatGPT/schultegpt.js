// JavaScript for handling clicks on the Schulte table
let currentNumber = 1;
let startTime;
let endTime;

// Function to generate a random Schulte table
function generateTable(size) {
  // Clear the existing table
  let table = document.querySelector("#schulte-table");
  table.innerHTML = "";

  // Generate a random array of numbers from 1 to size^2
  let numbers = [];
  for (let i = 1; i <= size * size; i++) {
    numbers.push(i);
  }
  numbers = shuffle(numbers);

  // Add the numbers to the table as div elements
  for (let i = 0; i < size * size; i++) {
    let div = document.createElement("div");
    div.textContent = numbers[i];
    table.appendChild(div);
  }
}

// Function to shuffle an array in place
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Initialize the Schulte table
generateTable(5);

document.querySelector("#schulte-table").addEventListener("click", function(event) {
  // Ignore clicks on elements that are not divs
  if (event.target.tagName !== "DIV") {
    return;
  }

  // Start the timer on the first click
  if (!startTime) {
    startTime = new Date();
  }

  // Get the number that was clicked on
  let clickedNumber = parseInt(event.target.textContent, 10);

  // If the clicked number is the current number, mark it as selected and move on to the next number
  if (clickedNumber === currentNumber) {
    event.target.classList.add("selected");
    currentNumber++;

    // If the last number has been reached, end the timer and display the elapsed time
    if (currentNumber > size * size) {
      endTime = new Date();
      let elapsedTime = (endTime - startTime) / 1000; // elapsed time in seconds
      alert(`Done! Elapsed time: ${elapsedTime} seconds`);
    }
  }
});

// Reset button handler
document.querySelector("#reset-button").addEventListener("click", function() {
  // Reset the current number and timer
  currentNumber = 1;
  startTime = null;
  endTime = null;

  // Regenerate the Schulte table
  generateTable(5);
});
