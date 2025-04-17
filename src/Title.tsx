import './Title.scss'

const Title = () => {

  return (
    <div className='title-container'>
      <div className='main-title-div'>
        <h1 className="main-title-text shadow-only">BlackJack+</h1>
        <h1 className='main-title-text image-fill'>BlackJack+
          <img id='sparkle-large' src="public/assets/images/sparkle-large.svg" />
          <img id='sparkle' src="public/assets/images/sparkle.svg" />
        </h1>
      </div>
    </div>
  );
}

export default Title;

