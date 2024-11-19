import playSound from "./playSound";
import CardsState from "./CardsState";

function dealCards(newCards: CardsState, setCards: React.Dispatch<React.SetStateAction<CardsState>>, dealSound: HTMLAudioElement) {

  setCards((prevCards) => {
    if (prevCards.user_hidden_card_value.length < newCards.user_hidden_card_value.length
      || prevCards.user_visible_card_total_values.length < newCards.user_visible_card_total_values.length
    ) {
      console.log("user play");
      playSound(dealSound);
    }

    if (prevCards.computer_hidden_card_value.length < newCards.computer_hidden_card_value.length
      || prevCards.computer_visible_card_total_values.length < newCards.computer_visible_card_total_values.length
    ) {
      console.log("computer play");
      playSound(dealSound, 400);
    }
    return newCards;
  });
}

export default dealCards;