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

  key.classList.add("scale-110", "border-blue-500");

  loadAudioBuffer(audioElement)
    .then((audioBuffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);

      source.onended = () => {
        key.classList.remove("scale-110", "border-blue-500");
      };
    })
    .catch((error) => {
      console.error("Error loading and playing audio:", error);
    });
}

const keys = Array.from(document.querySelectorAll(".key"));
keys.forEach((key) => {
  key.addEventListener("transitionend", removeTransition);

  key.addEventListener("click", () => playSound(key));
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
  e.target.classList.remove("scale-110", "border-blue-500");
}
