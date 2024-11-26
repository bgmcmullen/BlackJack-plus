import { FormEvent, ChangeEvent, useState, useReducer, useEffect, useCallback } from 'react'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import './App.scss';
import playSound from './playSound';
import CardsState from './CardsState';
import GameProps from './GameProps';
import initialState from './initialState';
import reducer from './reducer';
import reset from './reset';
import { handleRestart, handleChangeName, handleSubmitName, handleTakeACard, handleStand } from './handlers';
import setCardAnimations from './setCardAnimations';
import setDeckAnimation from './setDeckAnimation';
import setUpWebSocket from './setUpWebSocket';
import UserCards from './UserCards';
import ComputerCards from './ComputerCards';

const API_URL: string | URL = import.meta.env.VITE_API_URL

// Create audio elements for sounds
const shuffleSound = new Audio('./assets/sounds/shuffle.wav');
const dealSound = new Audio('./assets/sounds/deal.wav');

const Game: React.FC<GameProps> = ({ backgroundMusicPlaying, setBackgroundMusicPlaying, volume, handleVolumeChange }) => {
  const [cards, setCards] = useState<CardsState>({
    'computer_hidden_card_value': [],
    'computer_visible_card_total_values': [],
    'user_hidden_card_value': [],
    'user_visible_card_total_values': [],
    'surety': 0
  });
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState);

  const setUp = useCallback(() => {
    return setUpWebSocket(dispatch, API_URL, setCards, dealSound, setMessageQueue);
  }, []);

  // WebSocket setup
  useEffect(() => {
    reset(dispatch, setCards);
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
    setCardAnimations();
  }, [cards]);

  useEffect(() => {
    setDeckAnimation(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.deckCoordinates]);

  function restart() {
    handleRestart(state, playSound, dispatch, setCards, setUp, shuffleSound, reset);
  }

  function changeName(event: ChangeEvent<HTMLInputElement>) {
    handleChangeName(event, dispatch);
  }

  function submitName(event: FormEvent<HTMLFormElement>) {
    handleSubmitName(event, dispatch, state, setMessageQueue, backgroundMusicPlaying, setBackgroundMusicPlaying)
  }

  function takeACard() {
    handleTakeACard(setMessageQueue);
  }

  function stand() {
    handleStand(setMessageQueue);
  }
  console.log('state.cards', state.cards)

  return (
    <>
      <Box sx={{ width: 200 }}>
        <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
          <VolumeDown />
          <Slider aria-label="Volume" value={volume} onChange={handleVolumeChange} />
          <VolumeUp />
        </Stack>
      </Box>
      <h1>
        Target Score: {state.targetScore}
      </h1>
      <h1>
        Surety: {cards.surety}
      </h1>
      <div>
        <Button variant="contained" onClick={restart} disabled={state.restartButtonDisabled}>Restart</Button>
        {state.showNameInput && <form onSubmit={submitName}>
          <input type="text" placeholder="Enter Your Name" onChange={changeName}></input>
          <Button type="submit" variant="contained" color="primary" disabled={state.nameButtonDisabled}>
            Submit Name
          </Button>
        </form>}
        <div>
          {state.welcomeText && <p className='welcome-text'>{state.welcomeText}</p>}
          {state.name && <p className='card-labels'>{`${state.name}'s cards:`}</p>}
          <UserCards cards={cards}/>
          {state.name && <p className='card-labels'>Computer's cards:</p>}
          <ComputerCards cards={cards} gameOver={state.gameOver}/>
          <div className="deck" id="deck">
            {state.deckCoordinates}
          </div>

        </div>
        <div>
          <Button id='button' variant="contained" onClick={takeACard} disabled={state.gameButtonsDisabled}>Hit</Button>
          <Button id='button' variant="contained" onClick={stand} disabled={state.gameButtonsDisabled}>Stand</Button>
        </div>
        {state.winnerText.length > 0 && <p className='card-labels'>{state.winnerText.map(line => <p>{line}</p>)}</p>}
      </div>
    </>
  )
}

export default Game
