// couldn't find sound files

const drumPadGrid = document.getElementById("drum-pad-grid");
const audioElements = document.querySelectorAll("audio");

drumPadGrid.addEventListener("click", (event) => {
  const drumPad = event.target;
  const audioId = drumPad.getAttribute("data-key");
  const audio = document.getElementById(audioId);
  
  audio.currentTime = 0; // Reset audio to start if it's currently playing
  audio.play();
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();
  const audio = document.getElementById(key);
  
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
});
