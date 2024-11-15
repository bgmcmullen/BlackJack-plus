import { useEffect } from 'react';
import { playAudio, stopAudio, setVolume } from './audioController';

interface BackgroundMusicProps {
  isPlaying: boolean;
  volume: number;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ isPlaying, volume }) => {
  useEffect(() => {
    if (isPlaying) {
      playAudio();
    } else {
      stopAudio();
    }
  }, [isPlaying]);

  useEffect(() => {
    setVolume(volume);
  }, [volume]);

  return null; // No UI needed
};

export default BackgroundMusic;
