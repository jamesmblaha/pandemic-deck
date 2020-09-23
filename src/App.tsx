import React from 'react';
import { Game } from './Game'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Infection Deck</h1>
      </header>
      <Game cards={['Chicago', 'Washington', 'London', 'Chicago']} />
    </div>
  );
}

export default App;
