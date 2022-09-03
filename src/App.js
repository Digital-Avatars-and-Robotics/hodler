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
    </Store>
    </>
  );
}

export default App;
