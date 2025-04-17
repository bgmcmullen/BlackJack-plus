import Action from "./Action";
import CardsState from "./CardsState";

function reset(dispatch: React.Dispatch<Action>, setCards: React.Dispatch<React.SetStateAction<CardsState>>) {

  // Hide game play buttons
  dispatch({ type: "SET_GAME_BUTTONS_DISABLED", payload: false });

  localStorage.setItem("Blackjack_Cards", JSON.stringify({
    'computer_hidden_card_value': [],
    'computer_visible_card_total_values': [],
    'user_hidden_card_value': [],
    'user_visible_card_total_values': []
  }));

  // Clear cards
  setCards({
    'computer_hidden_card_value': [],
    'computer_visible_card_total_values': [],
    'user_hidden_card_value': [],
    'user_visible_card_total_values': []
  });

  // Reset state
  dispatch({
    type: 'SET_STATE', payload: {
      restartButtonDisabled: true,
      socketOpen: false,
      gameButtonsDisabled: true,
      nameButtonDisabled: false,
      name: '',
      showNameInput: true,
      welcomeText: '',
      winnerText: [],
      gameOver: false,
      messageQueue: [],
      deckCoordinates: []
    }
  })
}

export default reset;