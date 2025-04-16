import { useEffect, useState } from 'react';
import './App.scss';
import Game from './Game';
import SplashScreen from './SplashScreen';

import BackgroundMusic from './BackgroundMusic';

function App() {
  const [backgroundMusicPlaying, setBackgroundMusicPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(25);


  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  return (
    <>

      {!gameStarted ? <SplashScreen setGameStarted={setGameStarted} setBackgroundMusicPlaying={setBackgroundMusicPlaying} /> :
        <>
          <Game backgroundMusicPlaying={backgroundMusicPlaying} volume={volume} handleVolumeChange={handleVolumeChange} />
          <BackgroundMusic isPlaying={backgroundMusicPlaying} volume={volume} />
        </>}
    </>
  );
}

export default App;
