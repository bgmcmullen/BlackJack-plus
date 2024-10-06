import { FormEvent, ChangeEvent, useState } from 'react'
import Button from '@mui/material/Button';
import axios from 'axios';

import './App.scss'

const API_URL: string | URL = import.meta.env.VITE_API_URL

function App() {
  const [intructions, setIntructions] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  const [cards, setCards] = useState<object>({
    'computer_hidden_card_value': [],
    'computer_visible_card_total_values': [],
    'user_hidden_card_value': [],
    'user_visible_card_total_values': []
  });
  const [welcomeText, setWelcomeText] = useState<string>('');
  const [winnerText, setWinnerText] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false)

  const socket = new WebSocket(API_URL);

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const type = data.type;
    const payload = data.payload;
    switch (type) {
      case 'set_instructions':
        setIntructions(payload);
        setShowNameInput(true);
        break;
      case "welcome_user":
        setWelcomeText(payload);
        break;
      case "print_status":
        setCards(payload);
        break;
      case "game_end":
        setGameOver(true);
        setWinnerText(payload);
        break;
    }


  };

  // socket.onopen = function () {
  //   socket.send(JSON.stringify({
  //     'event': 'new_move',
  //     'details': 'Player drew a card'
  //   }));
  // };

  async function handleStart() {
    // const response = await axios.get(`${API_URL}instructions/`);
    socket.send(JSON.stringify({
      'type': 'get_instructions',
      'payload': ''
    }));


  }

  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  function handleChangeName(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  async function handleSubmitName(event: FormEvent<HTMLInputElement>) {
    event.preventDefault();
    const csrftoken = getCookie('csrftoken');
    // const response = await axios.post(`${API_URL}set_user_name/`, { name },
    //   { headers: { "X-CSRFTOKEN": csrftoken }, withCredentials: true });
    socket.send(JSON.stringify({
      'type': 'set_name',
      'payload': name
    }));
    socket.send(JSON.stringify({
      'type': 'run',
      'payload': ''
    }));
  }

  function handleTakeACard() {
    socket.send(JSON.stringify({
      'type': 'take_a_card',
      'payload': ''
    }));
  }

  function handleStand() {
    socket.send(JSON.stringify({
      'type': 'stand',
      'payload': ''
    }));
  }

  const suiteClasses = {
    'hearts': '♥',
    'spades': '♠',
    'diamonds': '♦',
    'clubs': '♣'
  }

  return (
    <>
      <div>
        <Button variant="contained" onClick={handleStart}>Start</Button>
        <p>{intructions}</p>
        {showNameInput && <form onSubmit={handleSubmitName}>
          <input type="text" placeholder="Enter Your Name" onChange={handleChangeName}></input>
          <Button type="submit" variant="contained" color="primary">
            Submit Name
          </Button>
        </form>}
        <div>
          {welcomeText}

          {/* <p key={`${indexI} p`}>{key}</p> */}

          {/* {
              value.map((card: { card_value: string; card_suite: string; }, indexJ: number) => {
                const cardValue: string = card.card_value;
                const cardSuite: string = card.card_suite;
                return (
                  key === 'computer_hidden_card_value' && !gameOver ? <div className="card card-back"></div> :
                    <div key={`${indexI} ${indexJ} div`} className={`card ${cardSuite}`}>
                      <div key={`${indexI} ${indexJ} divT`} className="top-left">{cardValue}</div>
                      <div key={`${indexI} ${indexJ} divS`} className="suit">{suiteClasses[cardSuite]}</div>
                      <div key={`${indexI} ${indexJ} divB`} className="bottom-right">{cardValue}</div>
                    </div>)
              })
            } */}
            <p>{name && `${name}'s cards:`}</p>
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
                <div className={`${index === 0 ? 'card-paused': 'card'} ${card.card_suite}`}>
                  <div className="top-left">{card.card_value}</div>
                  <div className="suit">{suiteClasses[card.card_suite]}</div>
                  <div className="bottom-right">{card.card_value}</div>
                </div>
              )
            })
            }
          </div>
          <p>Computers's cards:</p>
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
            {cards.computer_visible_card_total_values.map((card, index) => {
              return (
                <div className={`card-paused ${card.card_suite}`}>
                  <div className="top-left">{card.card_value}</div>
                  <div className="suit">{suiteClasses[card.card_suite]}</div>
                  <div className="bottom-right">{card.card_value}</div>
                </div>
              )
            })
            }
          </div>



          {winnerText.map(line => <p>{line}</p>)}
          <Button variant="contained" onClick={handleTakeACard}>Hit</Button>
          <Button variant="contained" onClick={handleStand}>Stand</Button>

        </div>
      </div>
    </>
  )
}

export default App
