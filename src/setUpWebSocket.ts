import createDeckCoordinates from "./createDeckCoordinates";
import Action from "./Action";
import dealCards from "./dealCards";
import CardsState from "./CardsState";
import { handleGetInstructions } from "./handlers";
import playSound from "./playSound";

const winnerSound = new Audio('./assets/sounds/Winning-sound.wav');

function setUpWebSocket(dispatch: React.Dispatch<Action>, API_URL: string | URL, setCards: React.Dispatch<React.SetStateAction<CardsState>>, dealSound: HTMLAudioElement, setMessageQueue: React.Dispatch<React.SetStateAction<string[]>>) {
  createDeckCoordinates(dispatch);
  const socketInstance = new WebSocket(API_URL);

  // Event listener for receiving messages
  socketInstance.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const type = data.type;
    const payload = data.payload;
    switch (type) {
      case 'set_instructions':
        dispatch({ type: 'SET_SHOW_NAME_INPUT', payload: true });
        break;
      case "welcome_user":
        dispatch({ type: 'SET_WELCOME_TEXT', payload: payload });
        break;
      case "print_status":
        dealCards(payload, setCards, dealSound);
        break;
      case "game_end":
        dispatch({
          type: 'SET_STATE', payload: {
            gameButtonsDisabled: true,
            restartButtonDisabled: false,
            gameOver: true,
            winnerText: payload.winner_text
          }
        });
        if(payload.winner === 'user')
          playSound(winnerSound);
        break;
    }
  }

  // Handle the open event and enable sending messages
  socketInstance.addEventListener('open', () => {
    dispatch({ type: 'SET_SOCKET_OPEN', payload: true });
    console.log('WebSocket connection opened.');
  });

  socketInstance.addEventListener('close', () => {
    console.log('WebSocket connection closed.');
  });

  dispatch({ type: 'SET_SOCKET', payload: socketInstance }); // Store WebSocket instance

  handleGetInstructions(setMessageQueue);
  return socketInstance;
}

export default setUpWebSocket;