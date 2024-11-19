function setCardAnimations() {
  // Select all cards and the deck
  const cardsOnScreen = document.querySelectorAll('.card-back, .card-paused, .card-animated');
  const deck = document.getElementById('deck');

  // Get the deck's position
  const deckRect = deck?.getBoundingClientRect();

  cardsOnScreen.forEach((card, index) => {
    const cardElement = card as HTMLElement; // Cast to HTMLElement
    const cardRect = cardElement.getBoundingClientRect();

    // Calculate the differences in position

    if (!deckRect)
      return;
    const startX = deckRect.left - cardRect.left;
    const startY = deckRect.top - cardRect.top;

    // Set the CSS variables for the animation
    cardElement.style.setProperty('--start-x', `${startX}px`);
    cardElement.style.setProperty('--start-y', `${startY}px`);

    // Set the animation delay for staggering
    const delay = index * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--delay-step'));
    cardElement.style.animationDelay = `${delay}s`;
  });
}

export default setCardAnimations;