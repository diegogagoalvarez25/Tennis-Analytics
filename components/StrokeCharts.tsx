
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TaggedAction, Player, StrokeType } from '../types';

interface StrokeChartsProps {
  actions: TaggedAction[];
  playerNameA: string;
  playerNameB: string;
}

// Colores únicos por tipo de golpe para consistencia visual
const STROKE_COLORS: Record<string, string> = {
  [StrokeType.SERVE]: '#FBBF24', // Ámbar
  [StrokeType.FOREHAND]: '#10B981', // Esmeralda
  [StrokeType.BACKHAND]: '#3B82F6', // Azul
  [StrokeType.INSIDE_OUT_FOREHAND]: '#F97316', // Naranja
  [StrokeType.INSIDE_OUT_BACKHAND]: '#8B5CF6', // Violeta
  [StrokeType.VOLLEY_FOREHAND]: '#14B8A6', // Teal
  [StrokeType.VOLLEY_BACKHAND]: '#06B6D4', // Cian
  [StrokeType.SMASH]: '#F43F5E', // Rosa
};

const StrokeCharts: React.FC<StrokeChartsProps> = ({ actions, playerNameA, playerNameB }) => {
  const getChartData = (player: Player) => {
    const playerActions = actions.filter(a => a.player === player);
    const total = playerActions.length;
    
    if (total === 0) return [];

    const distribution = playerActions.reduce((acc, curr) => {
      acc[curr.stroke] = (acc[curr.stroke] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value: Number(value),
      percentage: ((Number(value) / total) * 100).toFixed(1)
    })).sort((a, b) => b.value - a.value);
  };

  const dataA = getChartData('A');
  const dataB = getChartData('B');

  // Renderizador de etiqueta interna (%)
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Solo mostrar si la porción es lo suficientemente grande (>5%)
    if (percent < 0.05) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-[10px] font-black"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderChart = (player: Player, data: any[]) => {
    const indicatorColor = player === 'A' ? 'bg-red-500' : 'bg-blue-500';
    const playerName = player === 'A' ? playerNameA : playerNameB;

    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 truncate pr-2">
            <div className={`w-3 h-3 rounded-full shrink-0 ${indicatorColor} ring-4 ring-slate-100`} />
            Tipos de Golpe: {playerName}
          </h3>
          {data.length > 0 && (
             <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
               {data.reduce((acc, d) => acc + d.value, 0)} TOTAL
             </span>
          )}
        </div>
        <div className="flex-1 min-h-[380px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={4}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  animationBegin={0}
                  animationDuration={600}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STROKE_COLORS[entry.name as StrokeType] || '#CBD5E1'} 
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth={2}
                      className="outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    fontSize: '11px',
                    fontWeight: '900',
                    padding: '12px'
                  }}
                  formatter={(value: any, name: any, props: any) => [
                    `${value} golpes (${props.payload.percentage}%)`,
                    name
                  ]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={100} 
                  wrapperStyle={{ fontSize: '10px', paddingTop: '24px' }}
                  formatter={(value: any, entry: any) => {
                    const payload = entry.payload;
                    return (
                      <span className="text-slate-500 font-bold uppercase tracking-tight">
                        {value}: <span className="text-slate-900 font-black">{payload.percentage}%</span>
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 text-xs italic py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                 <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                 </svg>
              </div>
              <p className="font-bold uppercase tracking-widest text-[10px]">Esperando acciones de {playerName}...</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {renderChart('A', dataA)}
      {renderChart('B', dataB)}
    </div>
  );
};

export default StrokeCharts;
