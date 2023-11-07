let audioContexts = new Set(); // Maintain a set of AudioContexts

function initAudioContext() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  audioContexts.add(audioContext); // Store the context for later cleanup
  return audioContext;
}

function loadAudioBuffer(audioElement, audioContext) {
  return fetch(audioElement.getAttribute("src"))
    .then((response) => response.arrayBuffer())
    .then((data) => audioContext.decodeAudioData(data));
}

function playSound(key) {
  const audioElement = document.querySelector(
    `audio[data-key="${key.dataset.key}"]`
  );
  if (!audioElement) return;

  const audioContext = initAudioContext();

  loadAudioBuffer(audioElement, audioContext)
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
  setTimeout(() => {
    key.classList.remove("scale-110", "border-blue-500");
  }, 70); // Adjust the delay as needed
}

// Event listeners
const keys = Array.from(document.querySelectorAll(".key"));
keys.forEach((key) => {
  key.addEventListener("transitionend", removeTransition);
  key.addEventListener("click", () => playSound(key));
});

window.addEventListener("keydown", (e) => {
  const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
  if (key) {
    playSound(key);
  }
});

function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  e.target.classList.remove("scale-110", "border-blue-500");
}

// Clean up AudioContexts
window.addEventListener("beforeunload", () => {
  audioContexts.forEach((audioContext) => audioContext.close());
});
