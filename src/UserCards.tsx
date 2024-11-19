import CardsState from "./CardsState";
import Card from "./Card";


const UserCards: React.FC<{ cards: CardsState }> = ({ cards }) => {
  return (
    <div className="card-container">
      {cards.user_hidden_card_value.map(card => {
        return (
          <Card card={card} appearance="card-animated"/>
        )
      })}
      {cards.user_visible_card_total_values.map((card, index) => {
        return (
          <Card card={card} appearance={`${index === 0 ? 'card-paused' : 'card-animated'} ${card.card_suite}`}/>
        )
      })
      }
    </div>
  )
}
export default UserCards;

