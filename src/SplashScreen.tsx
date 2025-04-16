import Title from './Title';
import './SplashScreen.scss'

const SplashScreen = () => {

  return (
    <>
      <Title />
      <div className='button-container'>
        <div className='start-button'>
          <img src='public/assets/images/start.svg' />
        </div>
      </div>
    </>
  )
}

export default SplashScreen;