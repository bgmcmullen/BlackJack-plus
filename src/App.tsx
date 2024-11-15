import { useState } from 'react';
import './App.scss';
import Game from './Game';

import BackgroundMusic from './BackgroundMusic';

function App() {
  const [backgroundMusicPlaying, setBackgroundMusicPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(80);
  
  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  return (
    <>
      <Game setBackgroundMusicPlaying={setBackgroundMusicPlaying} backgroundMusicPlaying={backgroundMusicPlaying} volume={volume} handleVolumeChange={handleVolumeChange}/>
      <BackgroundMusic isPlaying={backgroundMusicPlaying} volume={volume}/>
    </>
  );
}

export default App;
