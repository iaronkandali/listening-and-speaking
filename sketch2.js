let sentenceSets = [
    "Learning is fun!",
    "Communication helps us grow.",
    "Practice makes perfect.",
    "Teamwork leads to success."
  ];
  
  let currentSentenceIndex = 0;
  let sentence = sentenceSets[currentSentenceIndex];
  let cardWidth = 400;
  let cardHeight = 250;
  let frontTexture;
  let isPoppedUp = false;
  let yOffset = 0;
  let myCanvas;
  let recognition;
  let isListeningMode = false;
  
  function setup() {
    let canvas = createCanvas(800, 400, WEBGL);
    canvas.parent('canvasContainer2');
  
    // Create the card's texture
    frontTexture = createGraphics(cardWidth, cardHeight);
    updateCardTexture();
  
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  
  //  lines to prevent self-recognition
  recognition.maxAlternatives = 1;
  recognition.interimResults = false;

  recognition.onresult = handleSpeechResult;
  recognition.onerror = handleSpeechError;
  }
  
  function updateCardTexture() {
    frontTexture.background(255);
    frontTexture.fill(0);
    frontTexture.textAlign(CENTER, CENTER);
    frontTexture.textSize(24);
    frontTexture.text(sentence, cardWidth / 2, cardHeight / 2);
  }
  
  function draw() {
    background(0);
  
    let floatAmount = sin(frameCount * 0.02) * 10;
    yOffset = isPoppedUp ? -50 : floatAmount;
  
    drawCard();
  }
  
  function drawCard() {
    push();
    translate(0, yOffset, 0);
    texture(frontTexture);
    box(cardWidth, cardHeight, 10);
    pop();
  }
  
  function mousePressed() {
    let mx = mouseX - width / 2;
    let my = mouseY - height / 2;
  
    if (mx > -cardWidth / 2 && mx < cardWidth / 2 &&
        my > -cardHeight / 2 && my < cardHeight / 2) {
      if (!isListeningMode) {
        playSentence();
        isPoppedUp = true;
        
        // After a short delay, prompt for user's pronunciation
        setTimeout(() => {
          promptUserPronunciation();
        }, 2000);
      }
    }
  }
  
  function playSentence() {
    let utterance = new SpeechSynthesisUtterance(sentence);
    window.speechSynthesis.speak(utterance);
  }
  
  // Add Levenshtein distance function
function levenshteinDistance(a, b) {
    const matrix = [];
  
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
  
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
  
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
  
    return matrix[b.length][a.length];
  }
  
  function promptUserPronunciation() {
    // Generate a beep tone
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
  
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
  
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
  
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  
    // Reset recognition to prevent multiple triggers
    recognition.stop();
    
    // Display prompt text
    displayFeedbackText(`Click "OK" and say: "${sentence}"`, 'blue');
  
    // Set up one-time event listener for recognition
    recognition.onresult = (event) => {
      // Prevent multiple triggers
      recognition.onresult = null;
      
      const spokenSentence = event.results[0][0].transcript.trim().toLowerCase();
      const targetSentence = sentence.toLowerCase();
      
      // Calculate pronunciation similarity
      const distance = levenshteinDistance(targetSentence, spokenSentence);
      const similarity = 1 - (distance / Math.max(targetSentence.length, spokenSentence.length));
      
      // Check pronunciation
      if (similarity > 0.7) {
        // Correct pronunciation
        const correctUtterance = new SpeechSynthesisUtterance('Excellent! Your pronunciation is correct.');
        window.speechSynthesis.speak(correctUtterance);
        
        // Trigger confetti
        triggerConfetti();
        
        // Display detailed feedback
        displayFeedbackText(`Correct pronunciation of "${sentence}"! Great job!`, 'green');
      } else {
        // Incorrect pronunciation
        const incorrectUtterance = new SpeechSynthesisUtterance(`Not quite right. You said "${spokenSentence}". Try pronouncing "${sentence}" again.`);
        window.speechSynthesis.speak(incorrectUtterance);
        
        // Display detailed feedback
        displayFeedbackText(`Oops! You said "${spokenSentence}". Try pronouncing "${sentence}" again.`, 'red');
      }
      
      // Reset listening mode
      isListeningMode = false;
    };
    
    // Error handling for speech recognition
    recognition.onerror = (event) => {
      const errorUtterance = new SpeechSynthesisUtterance('Sorry, I could not understand your pronunciation. Please try again.');
      window.speechSynthesis.speak(errorUtterance);
      displayFeedbackText('Pronunciation check failed. Please try again.', 'red');
      isListeningMode = false;
    };
    
    // Start recognition with a short delay
    setTimeout(() => {
      isListeningMode = true;
      recognition.start();
    }, 1000);
  }
  
  function handleSpeechResult(event) {
    let spokenSentence = event.results[0][0].transcript.trim();
    
    // Compare spoken sentence with original sentence
    if (spokenSentence.toLowerCase() === sentence.toLowerCase()) {
      // Correct pronunciation
      let correctUtterance = new SpeechSynthesisUtterance("Correct! Well done!");
      window.speechSynthesis.speak(correctUtterance);
      displayFeedbackText("Correct! Well done!", 'green');
      
      // Trigger confetti (optional)
      triggerConfetti();
    } else {
      // Incorrect pronunciation
      let incorrectUtterance = new SpeechSynthesisUtterance(`Oops! You said: ${spokenSentence}. Try again.`);
      window.speechSynthesis.speak(incorrectUtterance);
      displayFeedbackText(`Incorrect. You said: "${spokenSentence}"`, 'red');
    }
    
    // Reset listening mode
    isListeningMode = false;
  }
  
  function handleSpeechError(event) {
    let errorUtterance = new SpeechSynthesisUtterance("Sorry, I couldn't hear you. Please try again.");
    window.speechSynthesis.speak(errorUtterance);
    displayFeedbackText("Speech recognition error. Please try again.", 'red');
    isListeningMode = false;
  }
  
  function nextSentence() {
    if (!isListeningMode) {
      currentSentenceIndex = (currentSentenceIndex + 1) % sentenceSets.length;
      sentence = sentenceSets[currentSentenceIndex];
      updateCardTexture();
      isPoppedUp = false;
      displayFeedbackText("", 'black');
    }
  }
  
  function prevSentence() {
    if (!isListeningMode) {
      currentSentenceIndex = (currentSentenceIndex - 1 + sentenceSets.length) % sentenceSets.length;
      sentence = sentenceSets[currentSentenceIndex];
      updateCardTexture();
      isPoppedUp = false;
      displayFeedbackText("", 'black');
    }
  }
  
  function displayFeedbackText(message, color) {
    let feedbackElement = document.getElementById('feedbackText');
    if (feedbackElement) {
      feedbackElement.textContent = message;
      feedbackElement.style.color = color;
    }
  }
  
  function triggerConfetti() {
    if (window.confetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }