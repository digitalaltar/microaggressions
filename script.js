function getRandomSubarray(arr, subarrayLength) {
  const shuffledArray = arr.slice(); // Create a shallow copy of the input array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap the elements
  }
  return shuffledArray.slice(0, subarrayLength);
}

let draggedWordObject = null;

const allWords = ['allyship', 'inclusion', 'empathy', 'equity', 'respect', 'kindness', 'education', 'advocacy', 'anti-racism', 'tolerance', 'diversity', 'community', 'justice', 'love'];

const wordsCount = 8;
const words = getRandomSubarray(allWords, wordsCount);
const userInput = ['homophobia','transphobia','sexism','racism','classism','ableism','xenophobia','colorism'];

function createSpecialWordsArray(userInput) {
  const specialWordsArray = [];

  userInput.forEach((word) => {
    specialWordsArray.push(word);
  });

  return specialWordsArray;
}

const specialWords = createSpecialWordsArray(userInput);

// Set canvas dimensions
const canvasWidth = 1200;
const canvasHeight = 800;

// Set font size range
const minFontSize = 12;
const maxFontSize = 72;

// Set color range
const minColorValue = 30;
const maxColorValue = 255;

// Get canvas element
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const bounceVelocity = 10;

// Set canvas dimensions
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Generate random text
// ... (the rest of the code remains the same)

// Generate random text
let wordObjects = [];
let x = 0;
let y = 0;
while (y < canvasHeight) {
  const wordPool = Math.random() < 0.9 ? words : specialWords;
  const randomIndex = Math.floor(Math.random() * wordPool.length);
  const randomWord = wordPool[randomIndex];
  const randomFontSize = Math.floor(Math.random() * (maxFontSize - minFontSize + 1) + minFontSize);

  // Remove the used special word from the specialWords array
  if (specialWords.includes(randomWord)) {
    const index = specialWords.indexOf(randomWord);
    specialWords.splice(index, 1);
  }

  let initialColor;
  if (words.includes(randomWord)) {
    initialColor = "white";
  } else {
    initialColor = "red";
  }

  ctx.font = `${randomFontSize}px Arial`;
  ctx.fillStyle = initialColor;
  const wordWidth = ctx.measureText(randomWord).width;
  if (x + wordWidth > canvasWidth) {
    x = 0;
    y += randomFontSize + 10;
  }
  const randomBaselineOffset = randomFontSize * 0.75;
  ctx.fillText(randomWord, x, y + randomBaselineOffset);
  const boundingBox = {
    left: x,
    right: x + wordWidth,
    top: y,
    bottom: y + randomBaselineOffset
  };
  wordObjects.push({
    text: randomWord,
    fontSize: randomFontSize,
    color: initialColor,
    boundingBox: boundingBox,
    clicked: false,
    vibrating: false,
  });
  x += wordWidth + 10;

    // Add the used special word back to the specialWords array after creating the word object
  if (userInput.includes(randomWord)) {
    specialWords.push(randomWord);
  }
}

// Create a vibrateWord function to handle the vibration effect
function vibrateWord(wordObject) {
  if (wordObject.vibrating) return;

  wordObject.vibrating = true;
  const originalPosition = { ...wordObject.boundingBox };

  const duration = 10000; // Vibration duration in milliseconds
  const amplitude = 3; // Vibration amplitude
  const frequency = 50; // Vibration frequency in milliseconds

  let elapsedTime = 0;

  const vibrateInterval = setInterval(() => {
    elapsedTime += frequency;

    wordObject.boundingBox.left = originalPosition.left + Math.random() * amplitude - amplitude / 2;
    wordObject.boundingBox.right = originalPosition.right + Math.random() * amplitude - amplitude / 2;
    wordObject.boundingBox.top = originalPosition.top + Math.random() * amplitude - amplitude / 2;
    wordObject.boundingBox.bottom = originalPosition.bottom + Math.random() * amplitude - amplitude / 2;

    if (elapsedTime >= duration) {
      clearInterval(vibrateInterval);
      wordObject.boundingBox = originalPosition;
      wordObject.vibrating = false;
    }
  }, frequency);
}

function handleMouseClick(e) {
  // Get mouse position relative to canvas
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Loop through word objects and check for collision
  let collisionDetected = false;
  wordObjects.forEach((wordObject) => {
    if (
      mouseX >= wordObject.boundingBox.left &&
      mouseX <= wordObject.boundingBox.right &&
      mouseY >= wordObject.boundingBox.top &&
      mouseY <= wordObject.boundingBox.bottom
    ) {
      console.log('Word object clicked:', wordObject);
      wordObject.clicked = true;
      collisionDetected = true;
    }
  });

  if (collisionDetected) {
    // If a collision was detected, play a sound
    const audio = new Audio('bounce.wav');
    audio.play();
  }
}

// Add event listener for mouse clicks
canvas.addEventListener('click', handleMouseClick);

// Function to update canvas
function updateCanvas() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  wordObjects.forEach((wordObject) => {
    // Check if word object was clicked
    if (wordObject.clicked) {
      // Set new vertical position
      wordObject.boundingBox.top -= bounceVelocity;
      wordObject.boundingBox.bottom -= bounceVelocity;

      // Reset clicked state and apply bounce effect
      wordObject.clicked = false;

      // Add delay to prevent continuous bouncing
      setTimeout(() => {
        // Restore original position
        wordObject.boundingBox.top += bounceVelocity;
        wordObject.boundingBox.bottom += bounceVelocity;
      }, 300);
    }

    // Draw word on canvas
// Draw word on canvas
ctx.font = `${wordObject.fontSize}px Arial`;
ctx.fillStyle = wordObject.color;
ctx.fillText(wordObject.text, wordObject.boundingBox.left, wordObject.boundingBox.bottom);
  });

  // Request animation frame to update canvas again
  requestAnimationFrame(updateCanvas);
}

// Start animation
updateCanvas();

// ... (the rest of the code remains the same)

function handleInteraction(e) {
  e.preventDefault(); // Prevents default behavior like scrolling

  if (e.type === 'mousedown' || e.type === 'touchstart') {

    // Get interaction position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const interactionX = (e.clientX || e.touches[0].clientX) - rect.left;
    const interactionY = (e.clientY || e.touches[0].clientY) - rect.top;

    // Loop through word objects and check for collision
    wordObjects.forEach((wordObject) => {
      if (
        interactionX >= wordObject.boundingBox.left &&
        interactionX <= wordObject.boundingBox.right &&
        interactionY >= wordObject.boundingBox.top &&
        interactionY <= wordObject.boundingBox.bottom
      ) {
        increaseWordFontSize(wordObject); // Call the new function to increase the font size
        if (specialWords.includes(wordObject.text)) {
          // Make the clicked special word vibrate and push away other words
          vibrateWord(wordObject);
          pushAwayWords(wordObject, wordObjects);
        } else {
          // Change the color of the clicked regular word
          changeWordColor(wordObject);
        }
        // Set draggedWordObject and store offset
        draggedWordObject = wordObject;
        draggedWordObject.offsetX = interactionX - wordObject.boundingBox.left;
        draggedWordObject.offsetY = interactionY - wordObject.boundingBox.top;
      }
    });
  }
}

function dragWord(interactionX, interactionY) {
  if (draggedWordObject) {
    // Calculate new position for the dragged word object
    const newX = interactionX - draggedWordObject.offsetX;
    const newY = interactionY - draggedWordObject.offsetY;

    // Update the bounding box
    const wordWidth = ctx.measureText(draggedWordObject.text).width;
    draggedWordObject.boundingBox.left = newX;
    draggedWordObject.boundingBox.right = newX + wordWidth;
    draggedWordObject.boundingBox.top = newY;
    draggedWordObject.boundingBox.bottom = newY + draggedWordObject.fontSize;
  }
}

function increaseWordFontSize(wordObject) {
  const fontSizeIncrement = 10;
  wordObject.fontSize += fontSizeIncrement;

  // Update the word's bounding box
  const wordWidth = ctx.measureText(wordObject.text).width;
  wordObject.boundingBox.right = wordObject.boundingBox.left + wordWidth;
}

function changeWordColor(wordObject) {
  const randomRed = Math.floor(Math.random() * (maxColorValue - minColorValue + 1) + minColorValue);
  const randomGreen = Math.floor(Math.random() * (maxColorValue - minColorValue + 1) + minColorValue);
  const randomBlue = Math.floor(Math.random() * (maxColorValue - minColorValue + 1) + minColorValue);
  const randomColor = `rgb(${randomRed}, ${randomGreen}, ${randomBlue})`;
  wordObject.color = randomColor;
}

function pushAwayWords(clickedWordObject, allWordObjects) {
  const pushDistance = 20;
  allWordObjects.forEach((otherWordObject) => {
    if (clickedWordObject !== otherWordObject) {
      if (otherWordObject.boundingBox.left < clickedWordObject.boundingBox.left) {
        otherWordObject.boundingBox.left -= pushDistance;
        otherWordObject.boundingBox.right -= pushDistance;
      } else {
        otherWordObject.boundingBox.left += pushDistance;
        otherWordObject.boundingBox.right += pushDistance;
      }
      if (otherWordObject.boundingBox.top < clickedWordObject.boundingBox.top) {
        otherWordObject.boundingBox.top -= pushDistance;
        otherWordObject.boundingBox.bottom -= pushDistance;
      } else {
        otherWordObject.boundingBox.top += pushDistance;
        otherWordObject.boundingBox.bottom += pushDistance;
      }
    }
  });
}

function handleMouseMove(e) {
  e.preventDefault();
  if (draggedWordObject) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    dragWord(mouseX, mouseY);
  }
}

function handleMouseUp() {
  // Release the dragged word object
  draggedWordObject = null;
}

// Add event listeners for touch events
function handleTouchMove(e) {
  e.preventDefault();
  if (draggedWordObject) {
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const touchY = e.touches[0].clientY - rect.top;
    dragWord(touchX, touchY);
  }
}

function handleTouchEnd() {
  // Release the dragged word object
  draggedWordObject = null;
}

// Add event listeners for mouse and touch events
canvas.addEventListener('mousedown', handleInteraction);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);

canvas.addEventListener('touchstart', handleInteraction);
canvas.addEventListener('touchend', handleTouchEnd);
canvas.addEventListener('touchmove', handleTouchMove);