import CardsState from "./CardsState";
import Card from "./Card";
import suiteClasses from "./suiteClasses";

const ComputerCards: React.FC<{ cards: CardsState, gameOver: boolean }> = ({ cards, gameOver }) => {
  return (
    <div className="card-container">
      {cards.computer_hidden_card_value.map(card => {
        return (
          gameOver ?
            (
              <div className={`card-flipped ${card.card_suite}`}>
                <div className="top-left">{card.card_value}</div>
                <div className="suit">{suiteClasses[card.card_suite]}</div>
                <div className="bottom-right">{card.card_value}</div>
                <div className="hidden-card-back"></div>
              </div>
            ) : (<div className="card  card-back"></div>)
        )
      })}
      {cards.computer_visible_card_total_values.map((card) => {
        return (
          <Card card={card} appearance={`${gameOver ? "card" : "card-paused"} ${card.card_suite}`} />
        )
      })
      }
    </div>
  )
}
export default ComputerCards;
