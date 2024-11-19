import CardType from "./CardType";
import suiteClasses from "./suiteClasses";


const Card: React.FC<{ card: CardType, appearance: string}> = ({ card, appearance }) => {
  return (
    <div className={`${appearance} ${card.card_suite}`}>
      <div className="top-left">{card.card_value}</div>
      <div className="suit">{suiteClasses[card.card_suite]}</div>
      <div className="bottom-right">{card.card_value}</div>
    </div>
  )
}
export default Card;
