import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  onAddPlayer: (name: string) => void;
}

export function VoiceInput({ onAddPlayer }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const name = event.results[0][0].transcript;
        onAddPlayer(name);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  return (
    <button
      onClick={startListening}
      className={`p-2 rounded-full transition-all ${
        isListening 
          ? 'bg-red-500 text-white animate-pulse' 
          : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
      }`}
      title="Add player using voice command"
    >
      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  );
}