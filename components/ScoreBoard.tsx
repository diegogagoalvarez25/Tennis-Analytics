
import React from 'react';
import { Score, Player } from '../types';
import { POINT_LABELS } from '../utils/tennisLogic';

interface ScoreBoardProps {
  score: Score;
  playerNameA: string;
  playerNameB: string;
  themeColor?: string;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, playerNameA, playerNameB, themeColor = 'emerald-400' }) => {
  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-2xl p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
        <span className="w-1/3">Jugador</span>
        <div className="flex w-2/3 justify-end gap-8">
          <span className="w-8 text-center">Set</span>
          <span className="w-8 text-center">Gms</span>
          <span className="w-12 text-center">Pts</span>
        </div>
      </div>

      <PlayerRow 
        name={playerNameA} 
        set={score.setsA} 
        game={score.gamesA} 
        pt={score.pointsA} 
        setColor="text-red-400"
        themeColor={themeColor}
      />
      <div className="h-px bg-slate-800" />
      <PlayerRow 
        name={playerNameB} 
        set={score.setsB} 
        game={score.gamesB} 
        pt={score.pointsB} 
        setColor="text-blue-400"
        themeColor={themeColor}
      />
    </div>
  );
};

const PlayerRow: React.FC<{ name: string; set: number; game: number; pt: number; setColor: string; themeColor: string }> = ({ 
  name, set, game, pt, setColor, themeColor
}) => (
  <div className="flex justify-between items-center">
    <span className="w-1/3 text-lg font-semibold truncate">{name}</span>
    <div className="flex w-2/3 justify-end gap-8 items-center">
      <span className={`w-8 text-center text-xl font-medium ${setColor}`}>{set}</span>
      <span className="w-8 text-center text-xl font-medium">{game}</span>
      <span className={`w-12 text-center text-2xl font-bold text-${themeColor} bg-${themeColor}/20 rounded py-1`}>
        {POINT_LABELS[pt]}
      </span>
    </div>
  </div>
);

export default ScoreBoard;
