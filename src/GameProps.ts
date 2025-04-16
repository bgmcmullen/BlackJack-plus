interface GameProps {
  backgroundMusicPlaying: boolean;
  volume: number;
  handleVolumeChange: (_event: Event, newValue: number | number[]) => void;
}

export default GameProps;