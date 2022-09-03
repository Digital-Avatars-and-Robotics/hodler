import Store from "./helper/Store";
import * as React from 'react';
import Inputs from './components/Inputs';
import Leaderboard from "./components/Leaderboard";
function App() {

  return (
    <>
    <Store>
      <Inputs/>
    </Store>
    </>
  );
}

export default App;
