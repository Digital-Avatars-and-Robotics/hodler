import Store from "./helper/Store";
import React from 'react';
import Inputs from './components/Inputs';
import Leaderboard from "./components/Leaderboard";

function App() {

  return (
    <>
    <Store>
      <div style={{display: "flex", flexDirection: "column", gap: "4vh"}}>
        <Inputs/>
        <Leaderboard/>
      </div>
      <a href="https://mintersworld.com"
      style={{
      position: "absolute",
      margin: "0,auto,0,auto",
      left: 0,
      right: 0,
      textAlign: "center",
      bottom: "5px",
      color: "rgb(228, 231, 231)"
      }}>
        <h3 style={{margin: 0}}>Hodler</h3>
        by Mintersworld
      </a>
    </Store>
    </>
  );
}

export default App;
