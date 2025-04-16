import playSound from "./playSound";
import CardsState from "./CardsState";

function dealCards(newCards: CardsState, setCards: React.Dispatch<React.SetStateAction<CardsState>>, dealSound: HTMLAudioElement) {

  setCards((prevCards) => {

    // Play deal sound if user card has been dealt
    if (prevCards.user_hidden_card_value.length < newCards.user_hidden_card_value.length
      || prevCards.user_visible_card_total_values.length < newCards.user_visible_card_total_values.length
    ) {
      playSound(dealSound);
    }

    // Play deal sound if computer with 400 ms delay card has been dealt
    if (prevCards.computer_hidden_card_value.length < newCards.computer_hidden_card_value.length
      || prevCards.computer_visible_card_total_values.length < newCards.computer_visible_card_total_values.length
    ) {
      playSound(dealSound, 400);
    }

    // localStorage.setItem("Blackjack_Cards", JSON.stringify(newCards));
    
    // Set new card deck
    return newCards;
  });
}

export default dealCards;