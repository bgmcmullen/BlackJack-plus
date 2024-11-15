import { useEffect } from 'react';
import audioController from './AudioController';

interface BackgroundMusicProps {
  isPlaying: boolean;
  volume: number;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ isPlaying, volume }) => {
  useEffect(() => {
    // Play or stop audio based on the isPlaying prop
    if (isPlaying) {
      audioController.play();
    } else {
      audioController.stop();
    }

    // Cleanup on component unmount
    return () => {
      audioController.stop();
    };
  }, [isPlaying]);

  useEffect(() => {
    // Set the volume whenever the volume prop changes
    audioController.setVolume(volume * 0.6 - 60);
  }, [volume]);

  return null; // No UI needed
};

export default BackgroundMusic;
