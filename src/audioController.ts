import * as Tone from 'tone';

class AudioController {
  private player: Tone.Player;

  constructor() {
    this.player = new Tone.Player({
      url: "/assets/sounds/BlackJack_soundtrack_updated.wav",
      loop: true,
      autostart: false,
      volume: -12,
    }).toDestination();
  }

  play() {
    this.player.start();
  }

  stop() {
    this.player.stop();
  }

  setVolume(volume: number) {
    this.player.volume.value = volume;
  }

  dispose() {
    this.player.dispose();
  }
}

// Export a single instance (singleton pattern) to keep one consistent audio instance across the app
const audioController = new AudioController();
export default audioController;
