import { FormEvent, ChangeEvent, useState } from 'react'
import Button from '@mui/material/Button';
import axios from 'axios';

import './App.css'

const API_URL: string | null = import.meta.env.VITE_API_URL

function App() {
  const [intructions, setIntructions] = useState('');
  const [name, setName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [mainText, setMainText] = useState('');

  async function handleStart() {
    const response = await axios.get(`${API_URL}instructions/`);
    setIntructions(response.data);
    setShowNameInput(true);
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
    const response = await axios.post(`${API_URL}set_user_name/`, {name}, 
      {headers: {"X-CSRFTOKEN": csrftoken}, withCredentials: true});
    setMainText(response.data);
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
        <p>Main text: {mainText}</p>
      </div>
    </>
  )
}

export default App
