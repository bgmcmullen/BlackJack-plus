const playSound = (sound: HTMLAudioElement, delay: number = 0) => {

  setTimeout(() => {
    if (!sound.paused) {
      sound.currentTime = 0; // Reset the sound if it's already playing
    }
    sound.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
  }, delay);
};

export default playSound;