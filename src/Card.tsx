import CardType from "./CardType";
import suiteClasses from "./suiteClasses";


const Card: React.FC<{ card: CardType, appearance: string}> = ({ card, appearance }) => {
  function calculateAnimDuration() {
    if(!card.surety) return undefined;
    else if(card.surety < 4) return { animationDuration: `1.6s` };
    else if(card.surety < 6) return { animationDuration: `1.2s` };
    else if(card.surety < 8) return { animationDuration: `.8s` };
    else if(card.surety < 10) return { animationDuration: `.6s` };
    else return { animationDuration: `.4s` };;
  }
  return (
    <div className={`${appearance} ${card.card_suite}`}
    style={calculateAnimDuration()}
    >
      <div className="top-left">{card.card_value}</div>
      <div className="suit">{suiteClasses[card.card_suite]}</div>
      <div className="bottom-right">{card.card_value}</div>
    </div>
  )
}
export default Card;
