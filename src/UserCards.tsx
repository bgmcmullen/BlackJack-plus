import CardsState from "./CardsState";
import Card from "./Card";
import { motion, AnimatePresence } from 'framer-motion';


const UserCards: React.FC<{ cards: CardsState }> = ({ cards }) => {
  return (
    <div className="card-container">
      {cards.user_hidden_card_value.map((card, index) => {
        return (
          <Card key={`user_hidden_card_value ${index}`} card={card} appearance="card-animated"/>
        )
      })}

      {cards.user_visible_card_total_values.map((card, index) => {
        return (

          // Set first card to paused animation
          <Card key={`user_visible_card_total_value ${index}`} card={card} appearance={`${index === 0 ? 'card-paused' : 'card-animated'}`}/>
        )
      })
      }
    </div>
  )
}
export default UserCards;

