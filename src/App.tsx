import { FormEvent, ChangeEvent, useState, useEffect, useCallback } from 'react'
import Button from '@mui/material/Button';

import './App.scss'

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

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [socketOpen, setSocketOpen] = useState(false);
  const [name, setName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  const [cards, setCards] = useState<CardsState>({
    'computer_hidden_card_value': [],
    'computer_visible_card_total_values': [],
    'user_hidden_card_value': [],
    'user_visible_card_total_values': []
  });
  const [welcomeText, setWelcomeText] = useState<string>('');
  const [winnerText, setWinnerText] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [restartButtonDisabled, setRestartButtonDisabled] = useState<boolean>(true);
  const [nameButtonDisabled, setNameButtonDisabled] = useState<boolean>(false);
  const [gameButtonsDisabled, setGamesButtonsDisabled] = useState<boolean>(false);
  const [deckCoordinates, setDeckCoordinates] = useState<JSX.Element[]>([])



  function reset() {
    setRestartButtonDisabled(true);
    setSocketOpen(false);
    setGamesButtonsDisabled(false);
    setNameButtonDisabled(false);
    setName('');
    setShowNameInput(false);
    setCards({
      'computer_hidden_card_value': [],
      'computer_visible_card_total_values': [],
      'user_hidden_card_value': [],
      'user_visible_card_total_values': []
    });
    setWelcomeText('');
    setWinnerText([]);
    setGameOver(false);
    setMessageQueue([]);
  }

  // Create audio elements for sounds outside of the playSound function to reuse them
  const shuffleSound = new Audio('./assets/sounds/shuffle.wav');
  const dealSound = new Audio('./assets/sounds/deal.wav');

  // Updated playSound function
  const playSound = (sound: HTMLAudioElement, delay: number = 0) => {

    setTimeout(() => {
      if (!sound.paused) {
        sound.currentTime = 0; // Reset the sound if it's already playing
      }
      sound.play().catch((error) => {
        console.error('Error playing sound:', error);
      });
    }, delay);
  };


  const setUp = useCallback(() => {
    playSound(shuffleSound);
    createDeckCoordinates();
    const socketInstance = new WebSocket(API_URL);

    // Event listener for receiving messages
    socketInstance.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const type = data.type;
      const payload = data.payload;
      switch (type) {
        case 'set_instructions':
          // setIntructions(payload);
          setShowNameInput(true);
          break;
        case "welcome_user":
          setWelcomeText(payload);
          break;
        case "print_status":
          dealCards(payload);
          break;
        case "game_end":
          setGamesButtonsDisabled(true);
          setRestartButtonDisabled(false);
          setGameOver(true);
          setWinnerText(payload);
          break;
      }
    }

    function dealCards(newCards: CardsState) {

      setCards((prevCards) => {
        if (prevCards.user_hidden_card_value.length < newCards.user_hidden_card_value.length
          || prevCards.user_visible_card_total_values.length < newCards.user_visible_card_total_values.length
        ) {
          console.log("user play");
          playSound(dealSound);
        }

        if (prevCards.computer_hidden_card_value.length < newCards.computer_hidden_card_value.length
          || prevCards.computer_visible_card_total_values.length < newCards.computer_visible_card_total_values.length
        ) {
          console.log("computer play");
          playSound(dealSound, 400);
        }
        return newCards;
      });

    }

    // Handle the open event and enable sending messages
    socketInstance.addEventListener('open', () => {
      setSocketOpen(true);
      console.log('WebSocket connection opened.');
    });

    socketInstance.addEventListener('close', () => {
      console.log('WebSocket connection closed.');
    });

    setSocket(socketInstance); // Store WebSocket instance

    getInstructions();
    return socketInstance;
  }, []);


  // WebSocket setup
  useEffect(() => {


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
      if (socketOpen && messageQueue.length > 0 && socket) {
        const message = messageQueue[0]; // Get the first message in the queue

        // Try sending the message
        try {
          socket.send(message);
          setMessageQueue(prevMessageQueue => prevMessageQueue.slice(1)); // Remove the sent message from the queue
        } catch (error) {
          console.log("Failed to send message:", error);
        }
      }
    };

    sendMessage();
  }, [messageQueue, socketOpen, socket]);

  useEffect(() => {

    // Select all cards and the deck
    const cardsOnScreen = document.querySelectorAll('.card, .card-paused');
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
    socket?.close();
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
    setName(event.target.value);
  }

  function handleSubmitName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNameButtonDisabled(true);
    const nameMessage = JSON.stringify({
      'type': 'set_name',
      'payload': name
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
    if (deckCoordinates.length > 0) {
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
  }, [deckCoordinates]);



  function createDeckCoordinates() {
    const newDeckCoordinates = [];
    for (let i = 0; i <= 52; i++) {
      newDeckCoordinates.push(
        <div
          key={i}
          className="card card-back"
          style={{ position: "absolute", right: `${i * 0.3}px`, top: `${i * 0.3}px`, border: "1px solid rgba(0, 0, 0, 0.5)" }}
        ></div>
      );
    }
    setDeckCoordinates(newDeckCoordinates); // Update the state with new coordinates
  }



  return (
    <>
      <div>
        <Button variant="contained" onClick={handleRestart} disabled={restartButtonDisabled}>Restart</Button>
        {showNameInput && <form onSubmit={handleSubmitName}>
          <input type="text" placeholder="Enter Your Name" onChange={handleChangeName}></input>
          <Button type="submit" variant="contained" color="primary" disabled={nameButtonDisabled}>
            Submit Name
          </Button>
        </form>}
        <div>
          {welcomeText && <p className='welcome-text'>{welcomeText}</p>}
          {name && <p className='card-labels'>{`${name}'s cards:`}</p>}
          <div className="card-container">
            {cards.user_hidden_card_value.map(card => {
              return (
                <div className={`card ${card.card_suite}`}>
                  <div className="top-left">{card.card_value}</div>
                  <div className="suit">{suiteClasses[card.card_suite]}</div>
                  <div className="bottom-right">{card.card_value}</div>
                </div>
              )
            })}
            {cards.user_visible_card_total_values.map((card, index) => {
              return (
                <div className={`${index === 0 ? 'card-paused' : 'card'} ${card.card_suite}`}>
                  <div className="top-left">{card.card_value}</div>
                  <div className="suit">{suiteClasses[card.card_suite]}</div>
                  <div className="bottom-right">{card.card_value}</div>
                </div>
              )
            })
            }
          </div>
          {name && <p className='card-labels'>Computer's cards:</p>}
          <div className="card-container">
            {cards.computer_hidden_card_value.map(card => {
              return (
                gameOver ?
                  (<div className={`card ${card.card_suite}`}>
                    <div className="top-left">{card.card_value}</div>
                    <div className="suit">{suiteClasses[card.card_suite]}</div>
                    <div className="bottom-right">{card.card_value}</div>
                  </div>) : (<div className="card  card-back"></div>)

              )
            })}
            {cards.computer_visible_card_total_values.map((card) => {
              return (
                <div className={`${gameOver ? "card" : "card-paused"} ${card.card_suite}`}>
                  <div className="top-left">{card.card_value}</div>
                  <div className="suit">{suiteClasses[card.card_suite]}</div>
                  <div className="bottom-right">{card.card_value}</div>
                </div>
              )
            })
            }
          </div>
          <div className="deck" id="deck">
            {deckCoordinates}
          </div>

        </div>
        <div>
          <Button id='button' variant="contained" onClick={handleTakeACard} disabled={gameButtonsDisabled}>Hit</Button>
          <Button id='button' variant="contained" onClick={handleStand} disabled={gameButtonsDisabled}>Stand</Button>
        </div>
        {winnerText.length > 0 && <p className='card-labels'>{winnerText.map(line => <p>{line}</p>)}</p>}
      </div>
    </>
  )
}

export default App
