import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Minus, Trophy, Medal, Pencil, Save } from 'lucide-react';
import { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  onRemove: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  onSetInitialValue: (id: string, calculation: string) => void;
  onUpdateCalculation: (id: string, calculation: string) => void;
  onAdjustPoints: (id: string, isAddition: boolean) => void;
  isWinner: boolean;
  gameOver: boolean;
  position: number;
}

const getPositionColor = (position: number) => {
  switch (position) {
    case 1: return 'text-yellow-500';
    case 2: return 'text-gray-400';
    case 3: return 'text-amber-700';
    default: return 'text-emerald-800';
  }
};

const getPositionGradient = (position: number) => {
  switch (position) {
    case 1: return 'from-yellow-400 to-yellow-600';
    case 2: return 'from-gray-400 to-gray-600';
    case 3: return 'from-amber-700 to-amber-900';
    default: return 'from-emerald-400 to-emerald-600';
  }
};

const getPositionIcon = (position: number) => {
  switch (position) {
    case 1: return <Trophy className="text-yellow-500" size={24} />;
    case 2: return <Medal className="text-gray-400" size={24} />;
    case 3: return <Medal className="text-amber-700" size={24} />;
    default: return <span className="text-sm font-bold text-gray-500">#{position}</span>;
  }
};

export function PlayerCard({
  player,
  onRemove,
  onUpdateName,
  onSetInitialValue,
  onUpdateCalculation,
  onAdjustPoints,
  isWinner,
  gameOver,
  position
}: PlayerCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(player.name);
  const [showInput, setShowInput] = useState(true);
  const [callValue, setCallValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const positionColor = getPositionColor(position);
  const gradientColors = getPositionGradient(position);
  const positionIcon = getPositionIcon(position);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleNameSubmit = () => {
    onUpdateName(player.id, tempName);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
  };

  const handleCalculationBlur = () => {
    if (player.hasInitialValue && player.calculation) {
      setShowInput(false);
      setCallValue(player.calculation);
    }
  };

  const handleCalculationFocus = () => {
    setShowInput(true);
  };

  const handleAdjustPoints = (isAddition: boolean) => {
    onAdjustPoints(player.id, isAddition);
    setShowInput(true);
    setCallValue('');
  };

  return (
    <div className={`relative group ${position === 1 ? 'animate-bounce' : ''}`}>
      
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors} rounded-md transform rotate-1 opacity-50 group-hover:rotate-2 transition-transform`}></div>
      <div className={`relative bg-white rounded-md p-4 md:p-6 shadow-xl transform hover:-translate-y-1 transition-all ${gameOver && position > 1 ? 'opacity-75' : ''}`}>
        <div className="flex justify-between items-center mb-4 md:mb-6">
          {isEditing ? (
            <div className="flex-1 mr-2">
              <input
                ref={inputRef}
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full text-xl md:text-2xl font-bold bg-transparent border-b-2 border-emerald-200 focus:border-emerald-500 focus:outline-none transition-colors"
                disabled={gameOver}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold">{player.name}</span>
              {!gameOver && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>
          )}
          {isEditing ? (
            <button
              onClick={handleNameSubmit}
              className="text-emerald-500 hover:text-emerald-600 transition-colors"
            >
              <Save size={20} />
            </button>
          ) : (
            gameOver ? (
              positionIcon
            ) : (
              <button
                onClick={() => onRemove(player.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-full"
              >
                <X size={20} />
              </button>
            )
          )}
        </div>

        <div className="space-y-4">
          {showInput ? (
            <input
              type="text"
              value={player.calculation}
              onChange={(e) => onUpdateCalculation(player.id, e.target.value)}
              onBlur={handleCalculationBlur}
              placeholder={player.hasInitialValue ? "Enter value to add/subtract" : "Enter initial value"}
              disabled={gameOver}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-md border-2 border-emerald-100 focus:border-emerald-500 focus:outline-none transition-colors text-center text-base md:text-lg disabled:opacity-50"
            />
          ) : (
            <div
              onClick={handleCalculationFocus}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-md border-2 border-emerald-100 bg-emerald-50 cursor-pointer hover:bg-emerald-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-emerald-700 font-medium">Calls: </span>
                <span className="ml-2 text-emerald-600">{callValue}</span>
              </div>
            </div>
          )}

          <div className={`text-4xl md:text-5xl font-bold text-center ${positionColor} my-4 md:my-6`}>
            {player.points}
          </div>

          {gameOver && (
            <div className="text-center text-gray-600 font-semibold">
              {position === 1 ? '🏆 Winner!' : `${position}${position === 2 ? 'nd' : position === 3 ? 'rd' : 'th'} Place`}
            </div>
          )}

          {!player.hasInitialValue ? (
            <button
              onClick={() => onSetInitialValue(player.id, player.calculation)}
              disabled={gameOver}
              className="w-full bg-emerald-600 text-white py-2 md:py-3 rounded-md flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors shadow-md hover:shadow-lg text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} /> Add Initial Value
            </button>
          ) : (
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={() => handleAdjustPoints(true)}
                disabled={gameOver}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 md:py-3 rounded-md flex items-center justify-center gap-1 md:gap-2 transition-colors shadow-md hover:shadow-lg text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} /> Plus
              </button>
              <button
                onClick={() => handleAdjustPoints(false)}
                disabled={gameOver}
                className="flex-1 bg-red-500 hover:bg-red-400 text-white py-2 md:py-3 rounded-md flex items-center justify-center gap-1 md:gap-2 transition-colors shadow-md hover:shadow-lg text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={18} /> Minus
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}