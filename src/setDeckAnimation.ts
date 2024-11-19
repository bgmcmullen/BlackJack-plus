import initialState from "./initialState";

function setDeckAnimation(state: typeof initialState) {
  if (state.deckCoordinates.length > 0) {
    // Select all cards with the class 'card-back'
    const cardBacks = document.querySelectorAll('.card-back') as NodeListOf<HTMLElement>;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    cardBacks.forEach((card: HTMLElement, index: number) => {


      card.style.animation = 'none'; // Remove animation
      void card.offsetHeight; // Force reflow
      card.style.animation = ''; // Reapply animation

      // Assign the card index for the animation delay
      card.style.setProperty('--card-index', index.toString());

      // Randomly select one of the edges of the screen for the card to start from
      const edge = Math.floor(Math.random() * 2);
      let startX = '';
      let startY = '';

      switch (edge) {
        case 0: // Top edge
          startX = `-${Math.random() * windowWidth}px`;
          startY = `-${windowHeight}px`;
          break;
        case 1: // Left edge
          startX = `-${windowWidth}px`;
          startY = `-${Math.random() * windowHeight}px`;
          break;
      }

      // Set the CSS variables for the card's starting position
      card.style.setProperty('--start-x', startX);
      card.style.setProperty('--start-y', startY);

      // Make the card visible
      card.style.visibility = 'visible';
    });
  }
}

export default setDeckAnimation;