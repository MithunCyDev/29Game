import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';

interface AddPlayerFormProps {
  onAddPlayer: (name: string) => void;
}

export function AddPlayerForm({ onAddPlayer }: AddPlayerFormProps) {
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleSubmit = () => {
    onAddPlayer(newPlayerName);
    setNewPlayerName('');
  };

  return (
    <div className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-center gap-3">
      <div className="relative w-full sm:w-auto">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Enter player name"
          className="w-full sm:w-64 px-4 sm:px-6 py-3 rounded-md border-2 border-emerald-600/30 bg-emerald-900/30 text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-400 transition-all"
        />
        <Users className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-400/50" size={20} />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full sm:w-auto bg-emerald-600 text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors shadow-lg hover:shadow-xl"
      >
        <Plus size={20} /> Add Player
      </button>
    </div>
  );
}