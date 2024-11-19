import CardType from "./CardType";

const suiteClasses: { [key in CardType['card_suite']]: string } = {
  hearts: '♥',
  spades: '♠',
  diamonds: '♦',
  clubs: '♣',
};

export default suiteClasses;