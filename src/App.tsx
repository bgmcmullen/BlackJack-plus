import { useState } from 'react';
import './App.scss';
import Game from './Game';

import BackgroundMusic from './BackgroundMusic';

function App() {
  const [backgroundMusicPlaying, setBackgroundMusicPlaying] = useState(false);

  return (
    <>
      <Game setBackgroundMusicPlaying={setBackgroundMusicPlaying} backgroundMusicPlaying={backgroundMusicPlaying} />
      <BackgroundMusic/>
    </>
  );
}

export default App;
