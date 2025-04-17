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
import { handleRestart, handleChangeName, submitNameAndStartGame, handleTakeACard, handleStand } from './handlers';
import setCardAnimations from './setCardAnimations';
import setDeckAnimation from './setDeckAnimation';
import setUpWebSocket from './setUpWebSocket';
import UserCards from './UserCards';
import ComputerCards from './ComputerCards';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: "var(--stroke-weight-1, 1px) solid var(--theme-input, #E2E8F0)",
  boxShadow: 24,
  p: 4,
  borderRadius: "40px",
  background: "var(--theme-background, #FFF)"
};



import './Game.scss';

const API_URL: string | URL = import.meta.env.VITE_API_URL

// Create audio elements for sounds
const shuffleSound = new Audio('./assets/sounds/shuffle.wav');
const dealSound = new Audio('./assets/sounds/deal.wav');

const Game: React.FC<GameProps> = ({ volume, handleVolumeChange }) => {
  const [cards, setCards] = useState<CardsState>({
    'computer_hidden_card_value': [],
    'computer_visible_card_total_values': [],
    'user_hidden_card_value': [],
    'user_visible_card_total_values': [],
  });
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [state, dispatch] = useReducer(reducer, initialState);

  // setup WebSocket 
  const setUp = useCallback(() => {
    return setUpWebSocket(dispatch, API_URL, setCards, dealSound, setMessageQueue);
  }, []);

  useEffect(() => {
    reset(dispatch, setCards);
    const socketInstance = setUp();

    // Clean up the WebSocket on component unmount
    return () => {
      if (socketInstance)
        socketInstance.close();
    };
  }, [setUp]);

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

  useEffect(() => {
    if(state.showNameInput) {
      playSound(shuffleSound);
    }
  }, [state.showNameInput])

  function restart() {
    handleRestart(state, dispatch, setCards, setUp, reset);
  }

  function changeName(event: ChangeEvent<HTMLInputElement>) {
    handleChangeName(event, dispatch);
  }

  function submitName(event: FormEvent<HTMLFormElement>) {
    submitNameAndStartGame(event, dispatch, state, setMessageQueue)
  }

  function takeACard() {
    handleTakeACard(setMessageQueue);
  }

  function stand() {
    handleStand(setMessageQueue);
  }

  return (
    <>
      <div>
        <div>
          <Modal
            open={state.showNameInput}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography style={{ fontSize: "30px", marginRight: "10px" }} id="modal-modal-title" variant="h6" component="h2">
                Target Score: {state.targetScore}
              </Typography>
            
              <Typography style={{ display: "flex", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", marginBottom: "10px" }} id="modal-modal-description" sx={{ mt: 2 }}>
              Blackjack+ is a twist on classic blackjack. The goal is to get as close as possible to the target score without going over. Unlike traditional blackjack, the target score changes each round!
              </Typography>
              <form onSubmit={submitName}>
                <label>Name: </label>
                <input style={{ display: "block", height: "30px" }} type="text" placeholder="Enter Your Name" onChange={changeName}></input>
                <Button style={{ display: "block", marginTop: "20px" }} type="submit" variant="contained" color="primary" disabled={state.nameButtonDisabled}>
                  Start Game
                </Button>
              </form>
              <Box style={{ marginTop: "20px", display: "flex"}} sx={{ width: 200 }}>
                <p style={{fontSize: '12px'}}>Music Volume:</p>
                <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
                  <VolumeDown />
                  <Slider style={{width: "100px"}}aria-label="Volume" value={volume} onChange={handleVolumeChange} />
                  <VolumeUp />
                </Stack>
              </Box>
            </Box>
          </Modal>
        </div>
        {/* Volume control */}

        {!state.showNameInput ?
          <>
            <Box style={{ position: "fixed", bottom: "10px", width: "400px" }} sx={{ width: 200 }}>
              <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
              <p style={{fontSize: '16px', color: "white"}}>Music Volume:</p>
                <VolumeDown />
                <Slider style={{width: "100px"}} aria-label="Volume" value={volume} onChange={handleVolumeChange} />
                <VolumeUp />
              </Stack>
            </Box>

            <div className='game-container'>

              {/* User card label */}
              {state.name && <p className='card-labels'>{`${state.name}'s cards:`}</p>}

              {/* User cards */}
              <UserCards cards={cards} />
              <div className='middle-container'>
                <Button id='button' variant="contained" onClick={takeACard} disabled={state.gameButtonsDisabled}>Hit</Button>

                <div style={{ display: "flex", flexDirection: "row" }}>
                  <img style={{ position: "static", width: "50px" }} src="/assets/images/trophy.svg" />
                  <h1>
                    Target Score: {state.targetScore}
                  </h1>
                </div>
                <Button id='button' variant="contained" onClick={stand} disabled={state.gameButtonsDisabled}>Stand</Button>
              </div>

              {/* Computer card label */}
              {state.name && <p className='card-labels'>Computer's cards:</p>}

              {/* Computer cards */}
              <ComputerCards cards={cards} gameOver={state.gameOver} />


            </div>
            {/* Game control buttons */}

            {/* Winner text */}s
            {state.winnerText.length > 0 && <div className='card-labels'>{state.winnerText.map((line, index) => <p key={`line ${index}`}>{line}</p>)}</div>}
            <Button style={{
              width: "250px",
              height: "70px",
              position: "fixed",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)"
            }} variant="contained" onClick={restart} disabled={state.restartButtonDisabled}>New Game</Button>
          </> : null}
        {/* Display deck */}
        <div className="deck" id="deck">
          {state.deckCoordinates}
        </div>
      </div >
    </>
  )
}

export default Game
