import CardsState from "./CardsState";
import Card from "./Card";

const ComputerCards: React.FC<{ cards: CardsState, gameOver: boolean }> = ({ cards, gameOver }) => {
  return (
    <div className="card-container">
      {cards.computer_hidden_card_value.map((card, index) => {
        return (
          // Flip card when game is over
          gameOver ?
            (
              <Card key={`computer_hidden_card_value ${index}`} card={card} appearance={"card-flipped"} />
            ) : (<div key={`computer_hidden_card_value ${index}`} className="card  card-back"></div>)
        )
      })}
      {cards.computer_visible_card_total_values.map((card, index) => {
        return (
          <Card key={`computer_visible_card_total_values ${index}`} card={card} appearance={"card-paused"} />
        )
      })
      }
    </div>
  )
}
export default ComputerCards;
