let audioContext; // Inicjalizacja AudioContext

function initAudioContext() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)({
    sampleRate: 44100,
  });
}

function playSound(key) {
  if (!audioContext) {
    // Inicjalizuj AudioContext, jeśli jeszcze nie jest zainicjowany
    initAudioContext();
  }

  const audio = document.querySelector(`audio[data-key="${key.dataset.key}"]`);
  if (!audio) return;

  // Załaduj plik dźwiękowy
  fetch(audio.getAttribute("src"))
    .then((response) => response.arrayBuffer())
    .then((data) => audioContext.decodeAudioData(data))
    .then((audioBuffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    })
    .catch((error) => {
      console.error("Błąd podczas ładowania i odtwarzania dźwięku:", error);
    });

  key.classList.add("scale-110", "border-blue-500");
}

function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  const key = e.target;
  key.classList.remove("scale-110", "border-blue-500");
  setTimeout(() => {
    key.classList.remove("scale-110", "border-blue-500");
  }, 70); // Adjust the delay as needed
}

function handleKeydown(e) {
  const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
  if (key) {
    playSound(key);
  }
}

function handleClick(e) {
  if (e.target.classList.contains("key")) {
    playSound(e.target);
  }
}

const keys = Array.from(document.querySelectorAll(".key"));
keys.forEach((key) => {
  key.addEventListener("transitionend", removeTransition);
  key.addEventListener("click", handleClick);
});

const activeTouches = new Set(); // To keep track of active touches

function handleTouch(e) {
  if (e.target.classList.contains("key")) {
    const key = e.target;
    if (!activeTouches.has(key)) {
      activeTouches.add(key);
      playSound(key);
    }
  }
}

function handleTouchEnd(e) {
  if (e.target.classList.contains("key")) {
    const key = e.target;
    activeTouches.delete(key);
  }
}

keys.forEach((key) => {
  key.addEventListener("transitionend", removeTransition);
  key.addEventListener("click", handleClick);
  key.addEventListener("touchstart", handleTouch);
  key.addEventListener("touchend", handleTouchEnd);
});

window.addEventListener("touchstart", () => {
  if (!audioContext) {
    initAudioContext();
  }
});

// Inicjalizacja AudioContext po kliknięciu, jeśli jeszcze nie jest zainicjowany
window.addEventListener("click", () => {
  if (!audioContext) {
    initAudioContext();
  }
});

window.addEventListener("keydown", handleKeydown);
