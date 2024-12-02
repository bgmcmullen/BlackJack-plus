import CardType from "./CardType";
import suiteClasses from "./suiteClasses";

import './Card.scss';

const Card: React.FC<{ card: CardType, appearance: string}> = ({ card, appearance }) => {

  // If a surety value is provided calculate the correct animation duration
  function calculateAnimDuration() {
    if(!card.surety) return undefined;

    // Computer takes card more quickly when more "sure" of the move
    else if(card.surety < 4) return { animationDuration: `1.6s` };
    else if(card.surety < 6) return { animationDuration: `1.2s` };
    else if(card.surety < 8) return { animationDuration: `.8s` };
    else if(card.surety < 10) return { animationDuration: `.6s` };
    else return { animationDuration: `.4s` };
  }
  return (
    // Set suite and value of card
    <div className={`${appearance} ${card.card_suite}`}
    style={calculateAnimDuration()}
    >
      {/* Display the cards value in top left and bottom right and the suit */}
      <div className="top-left">{card.card_value}</div>
      <div className="suit">{suiteClasses[card.card_suite]}</div>
      <div className="bottom-right">{card.card_value}</div>
      {appearance === "card-flipped"  ? <div className="hidden-card-back"></div> : null}
    </div>
  )
}
export default Card;
