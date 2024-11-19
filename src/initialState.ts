import CardsState from "./CardsState";

const initialState = {
  socket: null as WebSocket | null,
  socketOpen: false,
  name: '',
  showNameInput: true,
  cards: {
    computer_hidden_card_value: [],
    computer_visible_card_total_values: [],
    user_hidden_card_value: [],
    user_visible_card_total_values: []
  } as CardsState,
  welcomeText: '',
  winnerText: [] as string[],
  gameOver: false,
  messageQueue: [] as string[],
  restartButtonDisabled: true,
  nameButtonDisabled: false,
  gameButtonsDisabled: false,
  deckCoordinates: [] as JSX.Element[]
};

export default initialState;