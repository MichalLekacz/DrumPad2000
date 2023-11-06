// Inicjalizacja AudioContext
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Funkcja do odtwarzania dźwięku
function playSound(key) {
  const audio = document.querySelector(`audio[data-key="${key.dataset.key}"]`);
  if (!audio) return;

  const source = audioContext.createBufferSource();

  // Załaduj plik dźwiękowy
  fetch(audio.getAttribute('src'))
    .then(response => response.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))
    .then(audioBuffer => {
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    })
    .catch(error => {
      console.error('Błąd podczas ładowania i odtwarzania dźwięku:', error);
    });

  key.classList.add('scale-110', 'border-blue-500');
}

function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  e.target.classList.remove('scale-110', 'border-blue-500');
}

function handleKeydown(e) {
  const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
  if (key) {
    playSound(key);
  }
}

function handleClick(e) {
  if (e.target.classList.contains('key')) {
    playSound(e.target);
  }
}

const keys = Array.from(document.querySelectorAll('.key'));
keys.forEach(key => {
  key.addEventListener('transitionend', removeTransition);
  key.addEventListener('click', handleClick);
});

window.addEventListener('keydown', handleKeydown);

// Dodaj obsługę kliknięć myszką na Safari
window.addEventListener('click', () => {
  // Inicjalizuj AudioContext po kliknięciu, jeśli jeszcze nie jest zainicjowany
  if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      console.log('AudioContext zainicjowany po kliknięciu.');
    });
  }
});