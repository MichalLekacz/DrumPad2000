function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  e.target.classList.remove('playing');
}

function playSound(key) {
  const audio = document.querySelector(`audio[data-key="${key.dataset.key}"]`);
  if (!audio) return;

  key.classList.add('playing');
  audio.currentTime = 0;
  audio.play();
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