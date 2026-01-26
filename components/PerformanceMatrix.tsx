
import React from 'react';
import { TaggedAction, ActionResult, Player } from '../types';

interface PerformanceMatrixProps {
  actions: TaggedAction[];
  playerNameA: string;
  playerNameB: string;
  themeColor?: string;
}

const PerformanceMatrix: React.FC<PerformanceMatrixProps> = ({ actions, playerNameA, playerNameB, themeColor = 'text-emerald-600' }) => {
  const getCount = (player: Player, result: ActionResult) => {
    return actions.filter(a => a.player === player && a.result === result).length;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className={`font-bold text-slate-800`}>Rendimiento Técnico</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
              <th className="px-6 py-3 border-b border-slate-200">Resultado / Jugador</th>
              <th className="px-6 py-3 border-b border-slate-200 text-center truncate max-w-[150px]">{playerNameA}</th>
              <th className="px-6 py-3 border-b border-slate-200 text-center truncate max-w-[150px]">{playerNameB}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {Object.values(ActionResult).map(res => (
              <tr key={res} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-700">{res}</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2.5 py-1 rounded-full bg-red-50 font-bold text-red-700 border border-red-100">
                    {getCount('A', res)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 font-bold text-blue-700 border border-blue-100">
                    {getCount('B', res)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceMatrix;
