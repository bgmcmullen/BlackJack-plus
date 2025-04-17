import createDeckCoordinates from "./createDeckCoordinates";
import Action from "./Action";
import dealCards from "./dealCards";
import CardsState from "./CardsState";
import { handleGetTargetScore } from "./handlers";
import playSound from "./playSound";
import confetti from 'canvas-confetti';




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
      case 'set_target_score':
        dispatch({ type: 'SET_SHOW_NAME_INPUT', payload: true });
        dispatch({ type: 'SET_TARGET_SCORE', payload: payload });
        break;

      case "welcome_user":
        dispatch({ type: 'SET_WELCOME_TEXT', payload: payload });
        break;

      case "set_card_status":
        dealCards(payload, setCards, dealSound);
        break;

      case "game_end":
        dispatch({
          type: 'SET_STATE', payload: {
            gameButtonsDisabled: true,
            restartButtonDisabled: false,
            gameOver: true,
            winnerText: payload.winner_text,
          }
        });

        // If user won play winning fanfare
        if (payload.winner === 'user') {
          playSound(winnerSound);
          confetti();
        }
        break;
    }
  }

  // Handle the open event and enable sending messages
  socketInstance.addEventListener('open', () => {
    dispatch({ type: 'SET_SOCKET_OPEN', payload: true });
  });



  dispatch({ type: 'SET_SOCKET', payload: socketInstance }); // Store WebSocket instance

  handleGetTargetScore(setMessageQueue);
  return socketInstance;
}

export default setUpWebSocket;