import CardType from "./CardType";

interface CardsState {
  user_hidden_card_value: CardType[];
  user_visible_card_total_values: CardType[];
  computer_hidden_card_value: CardType[];
  computer_visible_card_total_values: CardType[];
}

export default CardsState;