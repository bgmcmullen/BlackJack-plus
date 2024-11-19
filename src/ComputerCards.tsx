import CardsState from "./CardsState";
import Card from "./Card";

const ComputerCards: React.FC<{ cards: CardsState, gameOver: boolean }> = ({ cards, gameOver }) => {
  return (
    <div className="card-container">
      {cards.computer_hidden_card_value.map(card => {
        return (
          gameOver ?
            (
              <Card card={card} appearance="card" />
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
