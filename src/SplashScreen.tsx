import Title from './Title';
import './SplashScreen.scss'

const SplashScreen: React.FC<{ setGameStarted: React.Dispatch<React.SetStateAction<boolean>>, setBackgroundMusicPlaying: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setGameStarted, setBackgroundMusicPlaying }) => {

  return (
    <>
      <Title />
      <div className='button-container'>
        <div className='start-button' onClick={() => {
          setGameStarted(true);
          setBackgroundMusicPlaying(true);
        }}>
          <img src='public/assets/images/start.svg' />
        </div>
      </div>
      <div className='title-card-container '>
        <img className='king1' src='public/assets/images/King1.png' />
        <img className='ace1' src='public/assets/images/ace1.png' />
        <img className='ace2' src='public/assets/images/ace2.png' />
        <img className='card1' src='public/assets/images/Card1.png' />
        <img className='jack1' src='public/assets/images/jack1.png' />
      </div>

    </>
  )
}

export default SplashScreen;