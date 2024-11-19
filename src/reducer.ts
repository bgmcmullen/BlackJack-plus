import initialState from "./initialState";
import Action from "./Action";

function reducer(state: typeof initialState, action: Action): typeof initialState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
    case 'SET_SOCKET':
      return { ...state, socket: action.payload };
    case 'SET_SOCKET_OPEN':
      return { ...state, socketOpen: action.payload };
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_SHOW_NAME_INPUT':
      return { ...state, showNameInput: action.payload };
    case 'SET_WELCOME_TEXT':
      return { ...state, welcomeText: action.payload };
    case 'SET_WINNER_TEXT':
      return { ...state, winnerText: action.payload };
    case 'SET_GAME_OVER':
      return { ...state, gameOver: action.payload };
    case 'SET_MESSAGE_QUEUE':
      return { ...state, messageQueue: action.payload };
    case 'SET_RESTART_BUTTON_DISABLED':
      return { ...state, restartButtonDisabled: action.payload };
    case 'SET_NAME_BUTTON_DISABLED':
      return { ...state, nameButtonDisabled: action.payload };
    case 'SET_GAME_BUTTONS_DISABLED':
      return { ...state, gameButtonsDisabled: action.payload };
    case 'SET_DECK_COORDINATES':
      return { ...state, deckCoordinates: action.payload };
    default:
      return state;
  }
}

export default reducer;