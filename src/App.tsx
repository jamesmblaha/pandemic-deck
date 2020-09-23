import React from 'react';
import { Game } from './Game';
import GameStart from './GameStart';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Infection Deck</h1>
      </header>
      <Game cards={new GameStart().getInitialCards()} />
    </div>
  );
}

export default App;
