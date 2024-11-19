interface GameProps {
  backgroundMusicPlaying: boolean;
  setBackgroundMusicPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  volume: number;
  handleVolumeChange: (_event: Event, newValue: number | number[]) => void;
}

export default GameProps;