
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TaggedAction, ActionResult, Player } from '../types';

interface PerformanceMatrixProps {
  actions: TaggedAction[];
  playerNameA: string;
  playerNameB: string;
  themeColor?: string;
}

const PerformanceMatrix: React.FC<PerformanceMatrixProps> = ({ 
  actions, 
  playerNameA, 
  playerNameB, 
  themeColor = 'text-emerald-600' 
}) => {
  
  const getCount = (player: Player, result: ActionResult) => {
    return actions.filter(a => a.player === player && a.result === result).length;
  };

  // Preparación de datos para el gráfico
  const data = [
    {
      name: 'Desequilibrio (+)',
      fullActionName: ActionResult.POSITIVE_IMBALANCE,
      [playerNameA]: getCount('A', ActionResult.POSITIVE_IMBALANCE),
      [playerNameB]: getCount('B', ActionResult.POSITIVE_IMBALANCE),
    },
    {
      name: 'Desequilibrio (-)',
      fullActionName: ActionResult.NEGATIVE_IMBALANCE,
      [playerNameA]: getCount('A', ActionResult.NEGATIVE_IMBALANCE),
      [playerNameB]: getCount('B', ActionResult.NEGATIVE_IMBALANCE),
    },
    {
      name: 'Error No Forzado',
      fullActionName: ActionResult.UNFORCED_ERROR,
      [playerNameA]: getCount('A', ActionResult.UNFORCED_ERROR),
      [playerNameB]: getCount('B', ActionResult.UNFORCED_ERROR),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h2 className="font-black text-slate-800 text-sm uppercase tracking-tight">Resumen Técnico Comparativo</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">{playerNameA}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">{playerNameB}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {actions.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  type="number" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight={700}
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}
                />
                <Bar 
                  dataKey={playerNameA} 
                  fill="#ef4444" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                  animationDuration={1000}
                />
                <Bar 
                  dataKey={playerNameB} 
                  fill="#3b82f6" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex flex-col items-center justify-center text-slate-300 space-y-3">
             <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                <svg className="w-6 h-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest">Esperando datos para generar gráfico</p>
          </div>
        )}
      </div>

      {/* Tabla detallada inferior para soporte scouting */}
      <div className="overflow-x-auto border-t border-slate-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-3 border-b border-slate-100">Métrica</th>
              <th className="px-6 py-3 border-b border-slate-100 text-center">{playerNameA}</th>
              <th className="px-6 py-3 border-b border-slate-100 text-center">{playerNameB}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {Object.values(ActionResult).map(res => (
              <tr key={res} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3 font-bold text-slate-600">{res}</td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-block min-w-[24px] px-2 py-0.5 rounded bg-red-50 font-black text-red-600 border border-red-100">
                    {getCount('A', res)}
                  </span>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-block min-w-[24px] px-2 py-0.5 rounded bg-blue-50 font-black text-blue-600 border border-blue-100">
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
