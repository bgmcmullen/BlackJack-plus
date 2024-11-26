import CardsState from "./CardsState";

const initialState = {
  socket: null as WebSocket | null,
  socketOpen: false,
  name: '',
  targetScore: 0,
  showNameInput: true,
  cards: {
    computer_hidden_card_value: [],
    computer_visible_card_total_values: [],
    user_hidden_card_value: [],
    user_visible_card_total_values: [], 
    surety: 0
  } as CardsState,
  welcomeText: '',
  winnerText: [] as string[],
  gameOver: false,
  messageQueue: [] as string[],
  restartButtonDisabled: true,
  nameButtonDisabled: false,
  gameButtonsDisabled: true,
  deckCoordinates: [] as JSX.Element[]
};

export default initialState;