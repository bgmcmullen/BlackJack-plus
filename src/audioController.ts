// audioController.js

const audioElement = document.getElementById('background-audio') as HTMLAudioElement;

export const playAudio = () => {
  if (audioElement) {
    audioElement.play();
  }
};

export const stopAudio = () => {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0; // Reset to start
  }
};

export const setVolume = (volume: number) => {
  if (audioElement) {
    audioElement.volume = Math.max(0, Math.min(1, volume * 0.6 / 100)); // Volume between 0 and 1
  }
};
