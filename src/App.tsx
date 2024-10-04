import { useState } from 'react'
import Button from '@mui/material/Button';

import './App.css'



function App() {
  const [intructions, setIntructions] = useState('Instructions');

  return (
    <>
      <div>
        <Button variant="contained">Start</Button>
        <p>Instructions: {intructions}</p>
      </div>
    </>
  )
}

export default App
