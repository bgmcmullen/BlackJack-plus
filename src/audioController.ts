// class AudioController {
//   private audio: HTMLAudioElement;

//   constructor() {
//     // Initialize audio instance only once
//     this.audio = new Audio('/assets/sounds/BlackJack_soundtrack_updated.wav');
//     this.audio.loop = true; // Enable looping

//     // Play the audio if allowed by browser policies
//     document.addEventListener('click', this.initAudioPlayback);
//   }

//   // Manual initialization on the first user interaction (if needed)
//   private initAudioPlayback = () => {
//     this.play();
//     document.removeEventListener('click', this.initAudioPlayback); // Remove listener after initial play
//   };

//   play() {
//     if (this.audio.paused) {
//       this.audio.play().catch((error) => console.error('Error playing audio:', error));
//     }
//   }

//   pause() {
//     if (!this.audio.paused) {
//       this.audio.pause();
//     }
//   }
// }

// export default new AudioController();
