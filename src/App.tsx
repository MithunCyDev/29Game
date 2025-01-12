import React from 'react';
import { Users, Trash2, RotateCcw } from 'lucide-react';
import { PlayerCard } from './components/PlayerCard';
import { AddPlayerForm } from './components/AddPlayerForm';
import { VoiceInput } from './components/VoiceInput';
import { useGameBoard } from './hooks/useGameBoard';

function App() {
  const {
    players,
    addPlayer,
    removePlayer,
    updatePlayerName,
    setInitialValue,
    updateCalculation,
    adjustPoints,
    clearGameBoard,
    undoClear,
    showUndo,
    gameOver,
    winner,
    getPlayerPosition
  } = useGameBoard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">29 Game Paper</h1>
             
          </div>
        <div className="text-center mb-8 md:mb-12">
          <p className="text-emerald-200 text-base md:text-lg mb-2">A classic card game score tracker</p>
          <div className="flex items-center justify-center gap-2 text-emerald-100">
            <Users size={20} />
            <span>Players: {players.length}/4</span>
             
          </div>
          
          {gameOver && winner && (
            <div className="mt-4">
              <div className="text-yellow-300 text-xl md:text-2xl font-bold animate-pulse mb-2">
                🎉 {winner.name} wins! 🎉
              </div>
              <div className="text-emerald-200 text-sm">
                Game Over - Final Rankings
              </div>
            </div>
          )}
        </div>
        
        {players.length < 4 && !gameOver && <AddPlayerForm onAddPlayer={addPlayer} />}
        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onRemove={removePlayer}
              onUpdateName={updatePlayerName}
              onSetInitialValue={setInitialValue}
              onUpdateCalculation={updateCalculation}
              onAdjustPoints={adjustPoints}
              isWinner={gameOver && winner?.id === player.id}
              gameOver={gameOver}
              position={getPlayerPosition(player.id)}
            />
          ))}
        </div>

        <div className="flex justify-center gap-3">
        
          {players.length > 0 && (
            <button
              onClick={clearGameBoard}
              className="bg-red-500/80 hover:bg-red-400 text-white px-4 py-1.5 rounded-md flex items-center gap-1.5 transition-colors text-sm"
            >
              <Trash2 size={14} /> Clear Board
              
            </button>
          )}
          <VoiceInput onAddPlayer={addPlayer} />
          {showUndo && (
            <button
              onClick={undoClear}
              className="bg-emerald-600/80 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-md flex items-center gap-1.5 transition-colors text-sm"
            >
              <RotateCcw size={14} /> Undo Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;