let audioContext;
const audioElements = {};

function initAudioContext() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function loadAudioBuffer(audioElement) {
  const key = audioElement.dataset.key;

  if (!audioElements[key]) {
    return fetch(audioElement.getAttribute("src"))
      .then((response) => response.arrayBuffer())
      .then((data) => audioContext.decodeAudioData(data))
      .then((audioBuffer) => {
        audioElements[key] = audioBuffer;
        return audioBuffer;
      });
  } else {
    return Promise.resolve(audioElements[key]);
  }
}

function playSound(key) {
  if (!audioContext) {
    initAudioContext();
  }

  const audioElement = document.querySelector(
    `audio[data-key="${key.dataset.key}"]`
  );
  if (!audioElement) return;

  loadAudioBuffer(audioElement)
    .then((audioBuffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    })
    .catch((error) => {
      console.error("Error loading and playing audio:", error);
    });

  key.classList.add("scale-110", "border-blue-500");
}

const keys = Array.from(document.querySelectorAll(".key"));
keys.forEach((key) => {
  key.addEventListener("transitionend", removeTransition);

  // Add click event handling for desktop
  key.addEventListener("click", () => playSound(key));

  // Add touchstart event handling for mobile
  key.addEventListener("touchstart", (event) => {
    event.preventDefault(); // Prevent double playback on mobile
    playSound(key);
  });
});

window.addEventListener("keydown", (e) => {
  const pressedKey = keys.find(
    (key) => key.dataset.key === e.keyCode.toString()
  );
  if (pressedKey) {
    playSound(pressedKey);
  }
});

function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  const key = e.target;
  key.classList.remove("scale-110", "border-blue-500");
  setTimeout(() => {
    key.classList.remove("scale-110", "border-blue-500");
  }, 70);
}
const activeTouches = new Set();

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
