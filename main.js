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

function handleDragStart(event) {
  draggedWord = event.target;
}

function handleDragStartFromBox(event) {
  if (event.target.textContent) {
    draggedWord = event.target;
  }
}

function handleDrop(event) {
  event.preventDefault();
  if (draggedWord) {
    // If dropping into a drop box
    if (event.target.classList.contains("drop-box")) {
      // If the target drop box already has a word, swap them
      if (event.target.textContent) {
        const temp = event.target.textContent;
        event.target.textContent = draggedWord.textContent;
        draggedWord.textContent = temp;
      } else {
        event.target.textContent = draggedWord.textContent;
        draggedWord.textContent = "";
      }
      checkPosition(event.target);
    }

    // If dropping into the shuffled words container
    if (event.target === shuffledWordsContainer && draggedWord.classList.contains("drop-box")) {
      resetWordToShuffled(draggedWord);
    }

    if (draggedWord.classList.contains("drop-box")) {
      checkPosition(draggedWord);
    }
    draggedWord = null;
  }
}

// Reset word back to shuffled words container
function resetWordToShuffled(dropBox) {
  if (dropBox.textContent) {
    const wordElem = document.createElement("div");
    wordElem.classList.add("word");
    wordElem.textContent = dropBox.textContent;
    wordElem.draggable = true;
    wordElem.addEventListener("dragstart", handleDragStart);
    shuffledWordsContainer.appendChild(wordElem);
    dropBox.textContent = "";
    dropBox.classList.remove("correct", "incorrect");
  }
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

// Hint Functionality
hintBtn.addEventListener("click", () => {
  const emptyBox = Array.from(guessZone.children).find((box) => !box.textContent);
  if (emptyBox) {
    const index = Array.from(guessZone.children).indexOf(emptyBox);
    emptyBox.textContent = originalWords[index];
    emptyBox.classList.add("correct");
    const wordElem = Array.from(shuffledWordsContainer.children).find(
      (elem) => elem.textContent === originalWords[index]
    );
    if (wordElem) wordElem.remove();
  } else {
    hintMessage.textContent = "All boxes are filled!";
  }
});
