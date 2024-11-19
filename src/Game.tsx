import { FormEvent, ChangeEvent, useState, useReducer, useEffect, useCallback } from 'react'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import './App.scss';
import playSound from './playSound';

const API_URL: string | URL = import.meta.env.VITE_API_URL

interface Card {
  card_value: string | number;
  card_suite: string;
}

interface CardsState {
  user_hidden_card_value: Card[];
  user_visible_card_total_values: Card[];
  computer_hidden_card_value: Card[];
  computer_visible_card_total_values: Card[];
}

interface GameProps {
  backgroundMusicPlaying: boolean;
  setBackgroundMusicPlaying: (isPlaying: boolean) => void;
  volume: number;
  handleVolumeChange: (_event: Event, newValue: number | number[]) => void;
}

// Create audio elements for sounds

const shuffleSound = new Audio('./assets/sounds/shuffle.wav');
const dealSound = new Audio('./assets/sounds/deal.wav');


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


type Action =
  | { type: 'SET_STATE'; payload: Partial<typeof initialState> }
  | { type: 'SET_SOCKET'; payload: WebSocket | null }
  | { type: 'SET_SOCKET_OPEN'; payload: boolean }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_SHOW_NAME_INPUT'; payload: boolean }
  | { type: 'SET_CARDS'; payload: CardsState }
  | { type: 'SET_WELCOME_TEXT'; payload: string }
  | { type: 'SET_WINNER_TEXT'; payload: string[] }
  | { type: 'SET_GAME_OVER'; payload: boolean }
  | { type: 'SET_MESSAGE_QUEUE'; payload: string[] }
  | { type: 'SET_RESTART_BUTTON_DISABLED'; payload: boolean }
  | { type: 'SET_NAME_BUTTON_DISABLED'; payload: boolean }
  | { type: 'SET_GAME_BUTTONS_DISABLED'; payload: boolean }
  | { type: 'SET_DECK_COORDINATES'; payload: JSX.Element[] };



const Game: React.FC<GameProps> = ({ backgroundMusicPlaying, setBackgroundMusicPlaying, volume, handleVolumeChange }) => {
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  // const [socketOpen, setSocketOpen] = useState(false);
  // const [name, setName] = useState<string>('');
  // const [showNameInput, setShowNameInput] = useState<boolean>(true);
  const [cards, setCards] = useState<CardsState>({
    'computer_hidden_card_value': [],
    'computer_visible_card_total_values': [],
    'user_hidden_card_value': [],
    'user_visible_card_total_values': []
  });
  // const [welcomeText, setWelcomeText] = useState<string>('');
  // const [winnerText, setWinnerText] = useState<string[]>([]);
  // const [gameOver, setGameOver] = useState<boolean>(false);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  // const [restartButtonDisabled, setRestartButtonDisabled] = useState<boolean>(true);
  // const [nameButtonDisabled, setNameButtonDisabled] = useState<boolean>(false);
  // const [gameButtonsDisabled, setGamesButtonsDisabled] = useState<boolean>(false);
  // const [deckCoordinates, setDeckCoordinates] = useState<JSX.Element[]>([]);

  const [state, dispatch] = useReducer(reducer, initialState);


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




  function reset() {
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
        gameButtonsDisabled: false,
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
    //   setRestartButtonDisabled(true);
    //   setSocketOpen(false);
    //   setGamesButtonsDisabled(false);
    //   setNameButtonDisabled(false);
    //   setName('');
    //   setShowNameInput(false);
    //   setCards({
    //     'computer_hidden_card_value': [],
    //     'computer_visible_card_total_values': [],
    //     'user_hidden_card_value': [],
    //     'user_visible_card_total_values': []
    //   });
    //   setWelcomeText('');
    //   setWinnerText([]);
    //   setGameOver(false);
    //   setMessageQueue([]);
    //   setDeckCoordinates([]);
  }

  const setUp = useCallback(() => {

    createDeckCoordinates();
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
          dealCards(payload);
          break;
        case "game_end":
          dispatch({
            type: 'SET_STATE', payload: {
              gameButtonsDisabled: true,
              restartButtonDisabled: false,
              gameOver: true,
              winnerText: payload
            }
          })
          break;
        }
      }
        // switch (type) {
        //   case 'set_instructions':
        //     // setIntructions(payload);
        //     setShowNameInput(true);
        //     break;
        //   case "welcome_user":
        //     setWelcomeText(payload);
        //     break;
        //   case "print_status":
        //     dealCards(payload);
        //     break;
        //   case "game_end":
        //     setGamesButtonsDisabled(true);
        //     setRestartButtonDisabled(false);
        //     setGameOver(true);
        //     setWinnerText(payload);
        //     break;
        // }

      function dealCards(newCards: CardsState) {

        setCards((prevCards) => {
          if (prevCards.user_hidden_card_value.length < newCards.user_hidden_card_value.length
            || prevCards.user_visible_card_total_values.length < newCards.user_visible_card_total_values.length
          ) {
            playSound(dealSound);
          }

          if (prevCards.computer_hidden_card_value.length < newCards.computer_hidden_card_value.length
            || prevCards.computer_visible_card_total_values.length < newCards.computer_visible_card_total_values.length
          ) {
            playSound(dealSound, 400);
          }
          return newCards;
        });
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

      getInstructions();
      return socketInstance;
    }, []);


  // WebSocket setup
  useEffect(() => {
    reset();
    const socketInstance = setUp();

    // Clean up the WebSocket on component unmount
    return () => {
      if (socketInstance)
        socketInstance.close();
    };
  }, [setUp]); // Run only once when component mounts

  // Handle message sending with queue
  useEffect(() => {
    const sendMessage = async () => {
      if (state.socketOpen && messageQueue.length > 0 && state.socket) {
        const message = messageQueue[0]; // Get the first message in the queue

        // Try sending the message
        try {
          state.socket.send(message);
          setMessageQueue(prevMessageQueue => prevMessageQueue.slice(1)); // Remove the sent message from the queue
        } catch (error) {
          console.log("Failed to send message:", error);
        }
      }
    };

    sendMessage();
  }, [messageQueue, state.socketOpen, state.socket]);

  useEffect(() => {

    // Select all cards and the deck
    const cardsOnScreen = document.querySelectorAll('.card-back, .card-paused, .card-animated');
    const deck = document.getElementById('deck');

    // Get the deck's position
    const deckRect = deck?.getBoundingClientRect();


    cardsOnScreen.forEach((card, index) => {
      const cardElement = card as HTMLElement; // Cast to HTMLElement
      const cardRect = cardElement.getBoundingClientRect();

      // Calculate the differences in position

      if (!deckRect)
        return;
      const startX = deckRect.left - cardRect.left;
      const startY = deckRect.top - cardRect.top;

      // Set the CSS variables for the animation
      cardElement.style.setProperty('--start-x', `${startX}px`);
      cardElement.style.setProperty('--start-y', `${startY}px`);

      // Set the animation delay for staggering
      const delay = index * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--delay-step'));
      cardElement.style.animationDelay = `${delay}s`;


    });
  }, [cards]);


  function handleRestart() {
    state.socket?.close();
    playSound(shuffleSound);
    createDeckCoordinates();
    reset();
    setUp();
  }

  function getInstructions() {
    const message = JSON.stringify({
      'type': 'get_instructions',
      'payload': ''
    });
    setMessageQueue(prevMessageQueue => [...prevMessageQueue, message]);

  }

  function handleChangeName(event: ChangeEvent<HTMLInputElement>) {
    dispatch({ type: 'SET_NAME', payload: event.target.value });
  }

  function handleSubmitName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!backgroundMusicPlaying)
      setBackgroundMusicPlaying(true);
    dispatch({ type: 'SET_NAME_BUTTON_DISABLED', payload: true });
    const nameMessage = JSON.stringify({
      'type': 'set_name',
      'payload': state.name
    });

    setMessageQueue(prevMessageQueue => [...prevMessageQueue, nameMessage]);

    const runMessage = JSON.stringify({
      'type': 'run',
      'payload': ''
    });

    setMessageQueue(prevMessageQueue => [...prevMessageQueue, runMessage]);
  }

  function handleTakeACard() {
    const takeCardMessage = JSON.stringify({
      'type': 'take_a_card',
      'payload': ''
    });
    setMessageQueue(prevMessageQueue => [...prevMessageQueue, takeCardMessage]);
  }

  function handleStand() {
    const standMessage = JSON.stringify({
      'type': 'stand',
      'payload': ''
    });
    setMessageQueue(prevMessageQueue => [...prevMessageQueue, standMessage]);
  }

  const suiteClasses: { [key in Card['card_suite']]: string } = {
    hearts: '♥',
    spades: '♠',
    diamonds: '♦',
    clubs: '♣',
  };

  useEffect(() => {
    if (state.deckCoordinates.length > 0) {
      // Select all cards with the class 'card-back'
      const cardBacks = document.querySelectorAll('.card-back') as NodeListOf<HTMLElement>;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      cardBacks.forEach((card: HTMLElement, index: number) => {


        card.style.animation = 'none'; // Remove animation
        void card.offsetHeight; // Force reflow
        card.style.animation = ''; // Reapply animation

        // Assign the card index for the animation delay
        card.style.setProperty('--card-index', index.toString());

        // Randomly select one of the edges of the screen for the card to start from
        const edge = Math.floor(Math.random() * 2);
        let startX = '';
        let startY = '';

        switch (edge) {
          case 0: // Top edge
            startX = `-${Math.random() * windowWidth}px`;
            startY = `-${windowHeight}px`;
            break;
          case 1: // Left edge
            startX = `-${windowWidth}px`;
            startY = `-${Math.random() * windowHeight}px`;
            break;
        }

        // Set the CSS variables for the card's starting position
        card.style.setProperty('--start-x', startX);
        card.style.setProperty('--start-y', startY);

        // Make the card visible
        card.style.visibility = 'visible';
      });
    }
  }, [state.deckCoordinates]);



  function createDeckCoordinates() {
    const newDeckCoordinates = [];
    for (let i = 0; i <= 25; i++) {
      newDeckCoordinates.push(
        <div
          key={i}
          className="card card-back"
          style={{ position: "absolute", right: `${i * 0.3}px`, top: `${i * 0.3}px`, border: "1px solid rgba(0, 0, 0, 0.5)" }}
        ></div>
      );
    }
    dispatch({ type: 'SET_DECK_COORDINATES', payload: newDeckCoordinates}); // Update the state with new coordinates
  }



  return (
    <>
      <Box sx={{ width: 200 }}>
        <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
          <VolumeDown />
          <Slider aria-label="Volume" value={volume} onChange={handleVolumeChange} />
          <VolumeUp />
        </Stack>

      </Box>
      <div>
        <Button variant="contained" onClick={handleRestart} disabled={state.restartButtonDisabled}>Restart</Button>
        {state.showNameInput && <form onSubmit={handleSubmitName}>
          <input type="text" placeholder="Enter Your Name" onChange={handleChangeName}></input>
          <Button type="submit" variant="contained" color="primary" disabled={state.nameButtonDisabled}>
            Submit Name
          </Button>
        </form>}
        <div>
          {state.welcomeText && <p className='welcome-text'>{state.welcomeText}</p>}
          {state.name && <p className='card-labels'>{`${state.name}'s cards:`}</p>}
          <div className="card-container">
            {cards.user_hidden_card_value.map(card => {
              return (
                <div className={`card-animated ${card.card_suite}`}>
                  <div className="top-left">{card.card_value}</div>
                  <div className="suit">{suiteClasses[card.card_suite]}</div>
                  <div className="bottom-right">{card.card_value}</div>
                </div>
              )
            })}
            {cards.user_visible_card_total_values.map((card, index) => {
              return (
                <div className={`${index === 0 ? 'card-paused' : 'card-animated'} ${card.card_suite}`}>
                  <div className="top-left">{card.card_value}</div>
                  <div className="suit">{suiteClasses[card.card_suite]}</div>
                  <div className="bottom-right">{card.card_value}</div>
                </div>
              )
            })
            }
          </div>
          {state.name && <p className='card-labels'>Computer's cards:</p>}
          <div className="card-container">
            {cards.computer_hidden_card_value.map(card => {
              return (
                state.gameOver ?
                  (<div className={`card ${card.card_suite}`}>
                    <div className="top-left">{card.card_value}</div>
                    <div className="suit">{suiteClasses[card.card_suite]}</div>
                    <div className="bottom-right">{card.card_value}</div>
                  </div>) : (<div className="card  card-back"></div>)

              )
            })}
            {cards.computer_visible_card_total_values.map((card) => {
              return (
                <div className={`${state.gameOver ? "card" : "card-paused"} ${card.card_suite}`}>
                  <div className="top-left">{card.card_value}</div>
                  <div className="suit">{suiteClasses[card.card_suite]}</div>
                  <div className="bottom-right">{card.card_value}</div>
                </div>
              )
            })
            }
          </div>
          <div className="deck" id="deck">
            {state.deckCoordinates}
          </div>

        </div>
        <div>
          <Button id='button' variant="contained" onClick={handleTakeACard} disabled={state.gameButtonsDisabled}>Hit</Button>
          <Button id='button' variant="contained" onClick={handleStand} disabled={state.gameButtonsDisabled}>Stand</Button>
        </div>
        {state.winnerText.length > 0 && <p className='card-labels'>{state.winnerText.map(line => <p>{line}</p>)}</p>}
      </div>
    </>
  )
}

export default Game
