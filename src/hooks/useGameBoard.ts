import { useState, useEffect } from 'react';
import { Player } from '../types';
import { useToast } from '../context/ToastContext';

export function useGameBoard() {
  const { showToast } = useToast();
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem('gamePlayers');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });
  
  const [previousState, setPreviousState] = useState<Player[]>([]);
  const [showUndo, setShowUndo] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [rankings, setRankings] = useState<Player[]>([]);

  useEffect(() => {
    localStorage.setItem('gamePlayers', JSON.stringify(players));
    
    const winningPlayer = players.find(p => Number(p.points) >= 29);
    if (winningPlayer && !gameOver) {
      setGameOver(true);
      setWinner(winningPlayer);
      const sortedPlayers = [...players].sort((a, b) => Number(b.points) - Number(a.points));
      setRankings(sortedPlayers);
    }
  }, [players]);

  const addPlayer = (name: string) => {
    if (players.length >= 4) {
      showToast('Maximum 4 players allowed');
      return;
    }
    
    if (!name.trim()) {
      showToast('Please enter a player name');
      return;
    }

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: name.trim(),
      points: '0',
      calculation: '',
      hasInitialValue: false
    };

    setPlayers([...players, newPlayer]);
  };

  const validateCalculation = (calculation: string): boolean => {
    try {
      const result = eval(calculation.replace(/\s/g, ''));
      return typeof result === 'number' && !isNaN(result) && result <= 9;
    } catch {
      return false;
    }
  };

  const setInitialValue = (id: string, calculation: string) => {
    if (!validateCalculation(calculation)) {
      showToast('Please enter a value between 0 and 9');
      return;
    }

    try {
      const result = eval(calculation.replace(/\s/g, ''));
      setPlayers(players.map(p => 
        p.id === id ? { 
          ...p, 
          calculation: '', 
          points: String(result),
          hasInitialValue: true 
        } : p
      ));
    } catch {
      showToast('Invalid calculation');
    }
  };

  const adjustPoints = (id: string, isAddition: boolean) => {
    const player = players.find(p => p.id === id);
    if (!player) return;

    try {
      const calcValue = player.calculation ? eval(player.calculation.replace(/\s/g, '')) : 0;
      if (!validateCalculation(player.calculation)) {
        showToast('Please enter a value between 0 and 9');
        return;
      }

      const currentPoints = Number(player.points) || 0;
      const newPoints = isAddition ? currentPoints + calcValue : currentPoints - calcValue;

      setPlayers(players.map(p => 
        p.id === id ? { ...p, points: String(newPoints), calculation: '' } : p
      ));
    } catch {
      showToast('Invalid calculation');
    }
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(players.map(p => 
      p.id === id ? { ...p, name } : p
    ));
  };

  const updateCalculation = (id: string, calculation: string) => {
    setPlayers(players.map(p => 
      p.id === id ? { ...p, calculation } : p
    ));
  };

  const clearGameBoard = () => {
    setPreviousState(players);
    setShowUndo(true);
    setPlayers([]);
    setGameOver(false);
    setWinner(null);
    setRankings([]);
  };

  const undoClear = () => {
    setPlayers(previousState);
    setShowUndo(false);
  };

  const getPlayerPosition = (playerId: string): number => {
    return rankings.findIndex(p => p.id === playerId) + 1;
  };

  return {
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
    getPlayerPosition,
    rankings
  };
}