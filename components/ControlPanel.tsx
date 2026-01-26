
import React, { useState } from 'react';
import { Player, ActionResult, StrokeType, Direction } from '../types';

interface ControlPanelProps {
  onRegister: (player: Player, result: ActionResult, stroke: StrokeType, direction: Direction) => void;
  playerNameA: string;
  playerNameB: string;
  primaryColor?: string;
  primaryHover?: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onRegister, 
  playerNameA, 
  playerNameB,
  primaryColor = 'bg-emerald-500',
  primaryHover = 'hover:bg-emerald-600'
}) => {
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [activeResult, setActiveResult] = useState<ActionResult | null>(null);
  const [activeStroke, setActiveStroke] = useState<StrokeType | null>(null);
  const [activeDirection, setActiveDirection] = useState<Direction | null>(null);

  const handleRegister = () => {
    if (activePlayer && activeResult && activeStroke && activeDirection) {
      onRegister(activePlayer, activeResult, activeStroke, activeDirection);
      // Reset after registration
      setActiveResult(null);
      setActiveStroke(null);
      setActiveDirection(null);
    }
  };

  const isComplete = activePlayer && activeResult && activeStroke && activeDirection;

  return (
    <div className="space-y-6">
      {/* Player Selection */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-tight">Seleccionar Jugador</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setActivePlayer('A')}
            className={`py-4 rounded-xl font-bold transition-all truncate px-2 uppercase text-xs sm:text-sm ${
              activePlayer === 'A' 
              ? 'bg-red-600 text-white shadow-lg shadow-red-200 border-transparent' 
              : 'bg-white text-slate-600 border border-slate-200 hover:border-red-400'
            }`}
          >
            {playerNameA}
          </button>
          <button
            onClick={() => setActivePlayer('B')}
            className={`py-4 rounded-xl font-bold transition-all truncate px-2 uppercase text-xs sm:text-sm ${
              activePlayer === 'B' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 border-transparent' 
              : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400'
            }`}
          >
            {playerNameB}
          </button>
        </div>
      </section>

      {/* Action Result */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-tight">Resultado de Acción</h3>
        <div className="flex flex-wrap gap-2">
          {Object.values(ActionResult).map((res) => (
            <button
              key={res}
              onClick={() => setActiveResult(res)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeResult === res 
                ? `${primaryColor} text-white shadow-md border-transparent` 
                : 'bg-white border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </section>

      {/* Stroke Type */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-tight">Tipo de Golpe</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.values(StrokeType).map((stroke) => (
            <button
              key={stroke}
              onClick={() => setActiveStroke(stroke)}
              className={`px-3 py-3 rounded-lg text-xs font-semibold transition-all ${
                activeStroke === stroke 
                ? 'bg-indigo-600 text-white shadow-md border-transparent' 
                : 'bg-white border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {stroke}
            </button>
          ))}
        </div>
      </section>

      {/* Direction */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-tight">Zona / Dirección</h3>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(Direction).map((dir) => (
            <button
              key={dir}
              onClick={() => setActiveDirection(dir)}
              className={`px-3 py-3 rounded-lg text-xs font-semibold transition-all ${
                activeDirection === dir 
                ? 'bg-slate-800 text-white shadow-md border-transparent' 
                : 'bg-white border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {dir}
            </button>
          ))}
        </div>
      </section>

      {/* Action Trigger */}
      <button
        disabled={!isComplete}
        onClick={handleRegister}
        className={`w-full py-5 rounded-xl text-lg font-bold transition-all shadow-xl ${
          isComplete 
          ? `${primaryColor} ${primaryHover} text-white active:scale-95` 
          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        REGISTRAR ACCIÓN
      </button>
    </div>
  );
};

export default ControlPanel;
