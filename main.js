const startBtn = document.getElementById("start-btn");
const verseInput = document.getElementById("verse-input");
const shuffledWordsContainer = document.getElementById("shuffled-words");
const guessZone = document.getElementById("guess-zone");
const hintBtn = document.getElementById("hint-btn");
const hintMessage = document.getElementById("hint-message");
const gameSection = document.getElementById("game-section");

let originalWords = [];
let shuffledWords = [];

// Start Game
startBtn.addEventListener("click", () => {
  const verse = verseInput.value.trim();
  if (!verse) return alert("Please enter a verse!");

  originalWords = verse.split(" ");
  shuffledWords = [...originalWords].sort(() => Math.random() - 0.5);

  displayShuffledWords();
  displayDropBoxes();
  gameSection.classList.remove("hidden");
  hintMessage.textContent = "";

  // Clear the input field after starting the game
  verseInput.value = "";
});

// Display shuffled words
function displayShuffledWords() {
  shuffledWordsContainer.innerHTML = "";
  shuffledWords.forEach((word) => {
    const wordElem = document.createElement("div");
    wordElem.classList.add("word");
    wordElem.textContent = word;
    wordElem.draggable = true;
    wordElem.addEventListener("dragstart", handleDragStart);
    shuffledWordsContainer.appendChild(wordElem);
  });
}

// Create drop boxes with numbers
function displayDropBoxes() {
  guessZone.innerHTML = "";
  originalWords.forEach((_, index) => {
    const dropBox = document.createElement("div");
    dropBox.classList.add("drop-box");
    dropBox.setAttribute("data-index", index + 1); // Add numbering
    dropBox.addEventListener("dragover", (e) => e.preventDefault());
    dropBox.addEventListener("drop", handleDrop);
    dropBox.draggable = true;
    dropBox.addEventListener("dragstart", handleDragStartFromBox);
    guessZone.appendChild(dropBox);
  });
}

// Drag and Drop Handlers
let draggedWord = null;
let sourceContainer = null;

function handleDragStart(event) {
  draggedWord = event.target;
  sourceContainer = event.target.parentElement;
}

function handleDragStartFromBox(event) {
  if (event.target.textContent) {
    draggedWord = event.target;
    sourceContainer = event.target;
  }
}

function handleDrop(event) {
  event.preventDefault();
  if (draggedWord) {
    // If dropping into a drop box
    if (event.target.classList.contains("drop-box")) {
      // If the target drop box already has a word, reset it
      if (event.target.textContent) {
        resetDropBox(event.target);
      }

      // Place the dragged word into the drop box
      event.target.textContent = draggedWord.textContent;
      checkPosition(event.target);

      // Remove the dragged word from the source container if it's the shuffled list
      if (sourceContainer === shuffledWordsContainer) {
        draggedWord.remove();
      } else if (sourceContainer.classList.contains("drop-box")) {
        sourceContainer.textContent = "";
        sourceContainer.classList.remove("correct", "incorrect");
      }

      draggedWord = null;
    }
  }
}

// Reset a drop box to its original state
function resetDropBox(dropBox) {
  dropBox.textContent = "";
  dropBox.classList.remove("correct", "incorrect");
}

// Check if the word is in the correct position
function checkPosition(dropBox) {
  const index = Array.from(guessZone.children).indexOf(dropBox);
  if (dropBox.textContent === originalWords[index]) {
    dropBox.classList.add("correct");
    dropBox.classList.remove("incorrect");
  } else {
    dropBox.classList.add("incorrect");
    dropBox.classList.remove("correct");
  }
}

// Allow words to be dragged back to the shuffled list
shuffledWordsContainer.addEventListener("dragover", (e) => e.preventDefault());
shuffledWordsContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  if (draggedWord && sourceContainer !== shuffledWordsContainer) {
    // Add the dragged word back to the shuffled list if dropped here
    const wordElem = document.createElement("div");
    wordElem.classList.add("word");
    wordElem.textContent = draggedWord.textContent;
    wordElem.draggable = true;
    wordElem.addEventListener("dragstart", handleDragStart);
    shuffledWordsContainer.appendChild(wordElem);

    // Reset the drop box from which the word was dragged
    sourceContainer.textContent = "";
    sourceContainer.classList.remove("correct", "incorrect");

    draggedWord = null;
  }
});

// Hint Functionality
hintBtn.addEventListener("click", () => {
  const emptyBox = Array.from(guessZone.children).find((box) => !box.textContent);
  if (emptyBox) {
    const index = Array.from(guessZone.children).indexOf(emptyBox);
    emptyBox.textContent = originalWords[index];
    emptyBox.classList.add("correct");

    // Remove the word from the shuffled list
    const wordElem = Array.from(shuffledWordsContainer.children).find(
      (elem) => elem.textContent === originalWords[index]
    );
    if (wordElem) wordElem.remove();
  } else {
    hintMessage.textContent = "All boxes are filled!";
  }
});
