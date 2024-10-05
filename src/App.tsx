import { FormEvent, ChangeEvent, useState } from 'react'
import Button from '@mui/material/Button';
import axios from 'axios';

import './App.css'

const API_URL: string | null = import.meta.env.VITE_API_URL

function App() {
  const [intructions, setIntructions] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  const [mainText, setMainText] = useState<string[]>([]);

  const socket = new WebSocket('ws://localhost:8000/ws/game/');

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
        setMainText([...mainText, payload]);
        break;
      case "print_status":
        setMainText([...mainText, payload]);
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
          {
            mainText.map((element, index) => <p key={index}>{element}</p>)
          }
        </div>
      </div>
    </>
  )
}

export default App
