import Store from "./helper/Store";
import React, { useState, useEffect, useRef } from 'react'
import Inputs from './components/Inputs';
import Leaderboard from "./components/Leaderboard";

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

function App() {
  const [height, setHeight] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    setHeight(ref.current.clientHeight)
    const maxHeight = 900;
  })

  return (
    <div ref={ref}>
    <Store >
        <Box sx={{ width: '100%', height: "4px" }}>
          <LinearProgress id="progressBar" sx={{ display: 'none'}}/>
        </Box>
      <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
        <Inputs/>
        <Leaderboard/>
      
        <a href="https://mintersworld.com"
        target="_blank"
        style={{
        margin: "0,auto,0,auto",
        textAlign: "center",
        maxHeight: "5vh",
        color: "rgb(228, 231, 231)",
        }}>
          <h3 style={{margin: 0}}>Hodler</h3>
          by Mintersworld
        </a>
      </div>
    </Store>
    </div>
  );
}

export default App;
