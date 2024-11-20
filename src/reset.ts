import Action from "./Action";
import CardsState from "./CardsState";

function reset(dispatch: React.Dispatch<Action>, setCards: React.Dispatch<React.SetStateAction<CardsState>>) {
  dispatch({ type: "SET_GAME_BUTTONS_DISABLED", payload: false });
  setCards({
    'computer_hidden_card_value': [],
    'computer_visible_card_total_values': [],
    'user_hidden_card_value': [],
    'user_visible_card_total_values': []
  });
  dispatch({
    type: 'SET_STATE', payload: {
      restartButtonDisabled: true,
      socketOpen: false,
      gameButtonsDisabled: true,
      nameButtonDisabled: false,
      name: '',
      showNameInput: false,
      welcomeText: '',
      winnerText: [],
      gameOver: false,
      messageQueue: [],
      deckCoordinates: []
    }
  })
}

export default reset;