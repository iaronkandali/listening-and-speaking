
// let wordSets = [
//   ["Apple", "Book", "Cat", "Dog", "Elephant"],
//   ["Fish", "Giraffe", "Hat", "Igloo", "Jelly"],
//   ["Kite", "Lion", "Monkey", "Nest", "Orange"]
// ];
// let currentSetIndex = 0;
// let currentWords = [];
// let cards = [];
// let reviewWords = [];
// let recognition;

// // Global variables for card dimensions and spacing
// let cardWidth = 150;
// let cardHeight = 200;
// let cardSpacing = 200;
// let reviewing = false;
// let currentTargetWord = null;
// let isRecognizing = false;

// function setup() {
// let canvas = createCanvas(windowWidth, windowHeight * 0.7, WEBGL);
// canvas.parent('canvasContainer');

// // Speech recognition setup (you'll need to implement this fully)
// recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
// recognition.continuous = false;
// recognition.lang = 'en-US';

// recognition.onresult = function(event) {
// let spokenWord = event.results[0][0].transcript;
// checkPronunciation(spokenWord);
// isRecognizing = false;
// };

// recognition.onerror = function() {
// isRecognizing = false;
// };

// loadCards();
// }

// function loadCards() {
// currentWords = wordSets[currentSetIndex];  // Get the current set of words
// cards = [];  // Reset the cards array

// // Calculate the total width of all cards
// let totalWidth = (currentWords.length - 1) * cardSpacing;
// let startX = -totalWidth / 2;  // Center the cards

// // Loop through each word and create a card for it
// for (let i = 0; i < currentWords.length; i++) {
// // Create a graphical representation for the card (text on the front)
// let graphics = createGraphics(cardWidth, cardHeight);
// graphics.background(220);  // Light gray background
// graphics.textAlign(CENTER, CENTER);
// graphics.textSize(24);
// graphics.fill(0);  // Black text
// graphics.text(currentWords[i], cardWidth / 2, cardHeight / 2);

// // Create the card object and push it to the cards array
// cards.push({
//   x: startX + i * cardSpacing,  // Spread cards out horizontally
//   y: 0,  // Centered vertically
//   rotationY: 0,  // Initial rotation angle
//   targetRotationY: 0,  // Target rotation for smooth transitions
//   flipped: false,  // Whether the card is flipped or not
//   word: currentWords[i],  // The word associated with the card
//   frontTexture: graphics,  // Texture for the front (the word graphic)
//   backColor: color(random(100, 255), random(100, 255), random(100, 255)),  // Random color for the back
// });
// }
// }
// function draw() {
// background(240); // Light background color

// // Reset the camera
// camera(0, 0, (height / 2) / tan(PI / 6), 0, 0, 0, 0, 1, 0);

// let floatSpeed = 0.02; // Speed of oscillation
// let floatAmplitude = 20; // Height of floating effect

// for (let card of cards) {
// push();
// let floatY = sin(frameCount * floatSpeed + card.x) * floatAmplitude;
// translate(card.x, card.y + floatY, 0);
// rotateY(card.rotationY);

// // Smooth rotation interpolation
// card.rotationY += (card.targetRotationY - card.rotationY) * 0.1;

// // Draw the card
// if (abs(card.rotationY) % TWO_PI < PI) {
//   texture(card.frontTexture); // Front texture
// } else {
//   fill(card.backColor); // Back color
// }

// box(cardWidth, cardHeight, 10); // Draw the 3D card
// pop();
// }
// }

// // Levenshtein distance function for pronunciation checking
// function levenshteinDistance(str1, str2) {
// const m = str1.length;
// const n = str2.length;
// const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

// for (let i = 0; i <= m; i++) dp[i][0] = i;
// for (let j = 0; j <= n; j++) dp[0][j] = j;

// for (let i = 1; i <= m; i++) {
// for (let j = 1; j <= n; j++) {
//   if (str1[i - 1] === str2[j - 1]) {
//     dp[i][j] = dp[i - 1][j - 1];
//   } else {
//     dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
//   }
// }
// }

// return dp[m][n];
// }


  

// function setup() {
// let canvas = createCanvas(windowWidth, windowHeight * 0.7, WEBGL);
// canvas.parent('canvasContainer');
// loadCards();  // Call to load the cards when setting up the canvas
// }
// function enterReviewMode() {
// reviewing = true;  // Enter review mode after flipping all cards
// displayFeedback('Click on a card and pronounce the word', 'blue');
// }


// function draw() {
// // Rendering the cards and handling their rotation, etc.
// for (let card of cards) {
// push();
// translate(card.x, card.y, 0);

// // Draw the front or back of the card based on rotation
// if (abs(card.rotationY) % TWO_PI < PI) {
//   texture(card.frontTexture); // Front side (word)
// } else {
//   fill(card.backColor); // Back side color indicating pronunciation status
// }

// // Draw card with smooth rotation
// box(cardWidth, cardHeight, 10);
// pop();

// // If in review mode, draw mic icon on front of card
// if (reviewing && abs(card.rotationY) % TWO_PI < PI) {
//   drawMicIcon(card);  // Drawing mic icon
// }
// }
// }

// let currentPage = 0;
// const cardsPerPage = 3;



// function loadReviewCards() {
// const reviewContainer = document.getElementById('reviewCardsContainer');
// reviewContainer.innerHTML = ''; // Clear previous cards

// // Combine all words from all word sets for review
// const allWords = wordSets.flat();

// // Calculate the starting index and the ending index for the current page
// const startIdx = currentPage * cardsPerPage;
// const endIdx = Math.min(startIdx + cardsPerPage, allWords.length);

// // Slice the words to show only the cards for the current page
// const wordsToDisplay = allWords.slice(startIdx, endIdx);

// // Create speech recognition instance outside the loop to reuse
// const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
// recognition.continuous = false;
// recognition.lang = 'en-US';
// recognition.interimResults = false; // Only get final results

// // Display only the words for the current page
// wordsToDisplay.forEach(word => {
// // Create card element
// const cardElement = document.createElement('div');
// cardElement.className = 'card';
// cardElement.textContent = word;

// // Add click event listener for pronunciation check
// cardElement.addEventListener('click', () => {
//   // Prompt to say the word
//   const promptAudio = new SpeechSynthesisUtterance(`Say the word "${word}"`);
//   window.speechSynthesis.speak(promptAudio);
  
//   // Display prompt text
//   displayFeedback(`Click "OK" and say: "${word}"`, 'blue');

//   // Reset recognition
//   recognition.stop();
  
//   // Set up one-time event listener for recognition
//   recognition.onresult = (event) => {
//     // Prevent multiple triggers
//     recognition.onresult = null;
    
//     const spokenWord = event.results[0][0].transcript.trim().toLowerCase();
//     const targetWord = word.toLowerCase();
    
//     // Calculate pronunciation similarity
//     const distance = levenshteinDistance(targetWord, spokenWord);
//     const similarity = 1 - (distance / Math.max(targetWord.length, spokenWord.length));
    
//     // Check pronunciation
//     if (similarity > 0.7) {
//       // Correct pronunciation
//       const correctAudio = new SpeechSynthesisUtterance('Excellent! Your pronunciation is correct.');
//       window.speechSynthesis.speak(correctAudio);
      
//       // Trigger confetti
//       confetti({
//         particleCount: 100,
//         spread: 70,
//         origin: { y: 0.6 },
//         colors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a2', '#fbb1bd', '#f9bec7']
//       });
      
//       // Change card color to green
//       cardElement.style.backgroundColor = '#90EE90'; // Light green
      
//       // Display detailed feedback
//       displayFeedback(`Correct pronunciation of "${word}"! Great job!`, 'green');
//     } else {
//       // Incorrect pronunciation
//       const incorrectAudio = new SpeechSynthesisUtterance(`Not quite right. You said "${spokenWord}". Try pronouncing "${word}" again.`);
//       window.speechSynthesis.speak(incorrectAudio);
      
//       // Change card color to light red
//       cardElement.style.backgroundColor = '#FFCCCB'; // Light red
      
//       // Display detailed feedback
//       displayFeedback(`Oops! You said "${spokenWord}". Try pronouncing "${word}" again.`, 'red');
//     }
//   };
  
//   // Error handling for speech recognition
//   recognition.onerror = (event) => {
//     const errorAudio = new SpeechSynthesisUtterance('Sorry, I could not understand your pronunciation. Please try again.');
//     window.speechSynthesis.speak(errorAudio);
//     displayFeedback('Pronunciation check failed. Please try again.', 'red');
//   };
  
//   // Start recognition with a short delay to allow audio prompt to finish
//   setTimeout(() => {
//     recognition.start();
//   }, 1000);
// });

// // Add card to review container
// reviewContainer.appendChild(cardElement);
// });
// }

// // Function to go to the previous page
// function prevPage() {
// if (currentPage > 0) {
// currentPage--;
// loadReviewCards();
// }
// }

// // Function to go to the next page
// function nextPage() {
// currentPage++;
// loadReviewCards();
// }

// // Function to go to the previous page
// function prevPage() {
// currentPage--;
// loadReviewCards();
// }

// // Set up speech recognition
// recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
// recognition.continuous = false;
// recognition.lang = 'en-US';

// allWords.forEach(word => {
// // Create card element
// const cardElement = document.createElement('div');
// cardElement.className = 'card';
// cardElement.textContent = word;

// // Add click event listener for pronunciation check
// cardElement.addEventListener('click', () => {
//   // Speak the word to help with pronunciation
//   speakWord(word);
  
//   // Start speech recognition
//   recognition.onresult = (event) => {
//     const spokenWord = event.results[0][0].transcript.toLowerCase();
//     const targetWord = word.toLowerCase();
    
//     // Calculate pronunciation similarity
//     const distance = levenshteinDistance(targetWord, spokenWord);
//     const similarity = 1 - (distance / Math.max(targetWord.length, spokenWord.length));
    
//     // Check pronunciation
//     // When correct pronunciation is detected

// if (similarity > 0.7) {
// // Trigger more pronounced confetti
// confetti({
// particleCount: 200,  // Increased number of particles
// spread: 120,         // Wider spread
// origin: { y: 0.5, x: 0.5 },  // Centered on the screen
// colors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a2', '#fbb1bd', '#f9bec7'],
// zIndex: 9999        // Ensure it appears above other elements
// });

// // Optional: Add a burst of confetti for extra celebration
// confetti.create(null, {
// resize: true,
// useWorker: true,
// })({
// particleCount: 100,
// spread: 200,
// origin: { y: 0.5, x: 0.5 },
// colors: ['#00ff00', '#00ff00', '#90EE90']  // Green colors for success
// });

      
//       // Change card color to green
//       cardElement.style.backgroundColor = '#90EE90'; // Light green
      
//       // Display feedback
//       displayFeedback('Correct pronunciation!', 'green');
//     } else {
//       // Incorrect pronunciation
//       const incorrectAudio = new SpeechSynthesisUtterance(`Try again. You said ${spokenWord}`);
//       window.speechSynthesis.speak(incorrectAudio);
      
//       // Change card color to light red
//       cardElement.style.backgroundColor = '#FFCCCB'; // Light red
      
//       // Display feedback
//       displayFeedback(`Try again. You said: "${spokenWord}"`, 'red');
//     }
//   };
  
//   // Start recognition
//   recognition.start();
// });

// // Add card to review container
// reviewContainer.appendChild(cardElement);
// });


// // Levenshtein distance function (same as before)
// function levenshteinDistance(str1, str2) {
// const m = str1.length;
// const n = str2.length;
// const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

// for (let i = 0; i <= m; i++) dp[i][0] = i;
// for (let j = 0; j <= n; j++) dp[0][j] = j;

// for (let i = 1; i <= m; i++) {
// for (let j = 1; j <= n; j++) {
//   if (str1[i - 1] === str2[j - 1]) {
//     dp[i][j] = dp[i - 1][j - 1];
//   } else {
//     dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
//   }
// }
// }

// return dp[m][n];
// }

// function checkPronunciation(spokenWord) {
// const targetWord = currentTargetWord.toLowerCase();
// const similarity = calculateSimilarity(targetWord, spokenWord.toLowerCase());

// if (similarity > 0.7) {
// const correctAudio = new SpeechSynthesisUtterance('Correct!');
// window.speechSynthesis.speak(correctAudio);
// displayFeedback(`Great! You pronounced "${currentTargetWord}" correctly.`, 'green');
// updateCardDisplay(currentTargetWord, true); // Mark as correct
// } else {
// displayFeedback(`Try again! You said "${spokenWord}".`, 'red');
// }
// }

// function displayFeedback(message, color) {
// const feedbackText = document.getElementById('feedbackText');
// feedbackText.textContent = message;
// feedbackText.style.color = color;
// }


// // Modify mousePressed to maintain card interactivity
// function mousePressed() {
// let mx = mouseX - width / 2;
// let my = mouseY - height / 2;

// for (let card of cards) {
// let distance = dist(mx, my, card.x, card.y);

// if (reviewing && distance < cardWidth / 2 && abs(card.rotationY) % TWO_PI < PI) {
//   // Starts speech recognition in review mode
//   startRecognition(card.word);
//   currentTargetWord = card.word;
// } else if (!reviewing && distance < cardWidth / 2 && !card.flipped) {
//   // Flips the card and speaks the word
//   card.targetRotationY += PI;
//   card.flipped = true;
//   speakWord(card.word);
// }
// }
// }

// // Enhanced displayFeedback function to support multi-line text
// function displayFeedback(message, color = 'black') {
// const feedbackElement = document.getElementById('feedbackText');
// feedbackElement.innerHTML = message.replace(/\n/g, '<br>'); // Support line breaks
// feedbackElement.style.color = color;
// feedbackElement.style.fontWeight = 'bold';
// feedbackElement.style.textAlign = 'center';
// feedbackElement.style.padding = '10px';
// }

// // Existing speakWord function
// function speakWord(word) {
// let utterance = new SpeechSynthesisUtterance(word);
// window.speechSynthesis.speak(utterance);
// }

// function mousePressed() {
//   for (let card of cards) {
//     if (dist(mouseX - width / 2, mouseY - height / 2, card.x, card.y) < 75) {
//       card.rotationY += PI;
//       reviewWords.push(card.word);
//       speakWord(card.word);
//     }
//   }
// }

// function loadCards() {
// currentWords = wordSets[currentSetIndex];  // Get the current set of words
// cards = [];  // Reset the cards array
// let startX = -(currentWords.length - 1) * cardSpacing / 2;  // Position the first card

// // Loop through each word and create a card for it
// for (let i = 0; i < currentWords.length; i++) {
// // Create a graphical representation for the card (text on the front)
// let graphics = createGraphics(cardWidth, cardHeight);
// graphics.background(255);
// graphics.fill(0);
// graphics.textAlign(CENTER, CENTER);
// graphics.textSize(24);
// graphics.text(currentWords[i], cardWidth / 2, cardHeight / 2);

// // Create the card object and push it to the cards array
// cards.push({
//   x: startX + i * cardSpacing,  // Position each card with spacing
//   y: 0,  // Y position (static here, can be adjusted for 3D positioning)
//   rotationY: 0,  // Initial rotation angle
//   targetRotationY: 0,  // Target rotation for smooth transitions
//   flipped: false,  // Whether the card is flipped or not
//   word: currentWords[i],  // The word associated with the card
//   frontTexture: graphics,  // Texture for the front (the word graphic)
//   backColor: color(random(100, 255), random(100, 255), random(100, 255)),  // Random color for the back
// });
// }
// }


// function nextWordSet() {
//   currentSetIndex = (currentSetIndex + 1) % wordSets.length;
//   loadCards();

//   if (currentSetIndex === 0) {
//     navigateTo('reviewPage');
//   }
// }

// function speakWord(word) {
//   let utterance = new SpeechSynthesisUtterance(word);
//   window.speechSynthesis.speak(utterance);
// }




// function mousePressed() {
// let mx = mouseX - width / 2;
// let my = mouseY - height / 2;

// for (let card of cards) {
// let distance = dist(mx, my, card.x, card.y);

// if (reviewing && distance < cardWidth / 2 && abs(card.rotationY) % TWO_PI < PI) {
//   // Starts speech recognition in review mode
//   startRecognition(card.word);
//   currentTargetWord = card.word;
// } else if (!reviewing && distance < cardWidth / 2 && !card.flipped) {
//   // Flips the card and speaks the word
//   card.targetRotationY += PI;
//   card.flipped = true;
//   speakWord(card.word);
// }
// }
// }

// function startRecognition(targetWord) {
// if (!isRecognizing) {
// displayFeedback(`Say "${targetWord}"`, 'blue');
// recognition.start();
// isRecognizing = true;
// }
// }
// function checkPronunciation(spokenWord) {
// if (!currentTargetWord) return;

// let distance = levenshteinDistance(currentTargetWord.toLowerCase(), spokenWord.toLowerCase());
// let similarity = 1 - (distance / Math.max(currentTargetWord.length, spokenWord.length));

// for (let card of cards) {
// if (card.word.toLowerCase() === currentTargetWord.toLowerCase()) {
//   if (similarity > 0.7) {
//     card.backColor = color(0, 255, 0); // Green for correct pronunciation
//     displayFeedback('Correct pronunciation!', 'green');
//   } else {
//     card.backColor = color(255, 0, 0); // Red for incorrect pronunciation
//     displayFeedback(`Try again. You said: "${spokenWord}"`, 'red');
//   }
// }
// }

// currentTargetWord = null;
// }

// function displayFeedback(message, color = 'black') {
// const feedbackElement = document.getElementById('feedbackText');
// feedbackElement.textContent = message;
// feedbackElement.style.color = color;
// }
