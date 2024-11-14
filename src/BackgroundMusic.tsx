// import React, { memo, useEffect, useRef } from 'react';


// interface BackgroundMusicProps {
//   isPlaying: boolean;
// }


// const BackgroundMusic: React.FC<BackgroundMusicProps> = memo(({isPlaying}) => {
//   // Specify the type of the audioRef as HTMLAudioElement or null
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   useEffect(() => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.play();
//       } else {
//         audioRef.current.pause();
//       }
//     }
//   }, [isPlaying]);

//   console.log("isPlaying: "+  isPlaying);

//   return (
//     <>
//       <audio ref={audioRef} src="/assets/sounds/BlackJack_soundtrack_updated.wav" loop />
//     </>

//   );
// });

// export default BackgroundMusic;


import * as Tone from 'tone';
import { useEffect, useState } from 'react';

function BackgroundMusic() {
  // Use Tone.Player or null as the type for the player state
  const [player, setPlayer] = useState<Tone.Player | null>(null);

  useEffect(() => {
    // Create a new Tone.Player instance and set it to loop
    const tonePlayer = new Tone.Player({
      url: "/assets/sounds/BlackJack_soundtrack_updated.wav",  // Replace with the path to your audio file
      loop: true,
      autostart: true
    }).toDestination();

    // Store the player instance in state
    setPlayer(tonePlayer);

    // Cleanup on component unmount
    return () => {
      tonePlayer.stop();
      tonePlayer.dispose();
    };
  }, []);

  return null; // No UI needed
}

export default BackgroundMusic;


