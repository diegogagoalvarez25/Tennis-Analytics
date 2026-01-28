
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Player, 
  ActionResult, 
  StrokeType, 
  Direction, 
  Score, 
  TaggedAction 
} from './types';
import { calculateNewScore, determineWinnerFromAction, exportToCSV } from './utils/tennisLogic';
import ScoreBoard from './components/ScoreBoard';
import ControlPanel from './components/ControlPanel';
import PerformanceMatrix from './components/PerformanceMatrix';
import StrokeCharts from './components/StrokeCharts';

type Surface = 'clay' | 'hard' | 'grass';

const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [playerNameA, setPlayerNameA] = useState<string>('Ostapenko');
  const [playerNameB, setPlayerNameB] = useState<string>('Suárez Navarro');
  const [actions, setActions] = useState<TaggedAction[]>([]);
  const [surface, setSurface] = useState<Surface>('hard');
  const [score, setScore] = useState<Score>({
    pointsA: 0, pointsB: 0,
    gamesA: 0, gamesB: 0,
    setsA: 0, setsB: 0
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  // Mapeo de temas por superficie
  const themes = {
    clay: {
      primary: '#c2410c', // Naranja rojizo
      secondary: '#fff7ed', // Fondo crema tierra
      brand: 'bg-orange-700',
      text: 'text-orange-700',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-800'
    },
    hard: {
      primary: '#1d4ed8', // Azul pista dura
      secondary: '#f0f9ff', // Fondo azul muy claro
      brand: 'bg-blue-700',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-800'
    },
    grass: {
      primary: '#15803d', // Verde hierba
      secondary: '#f0fdf4', // Fondo verde muy claro
      brand: 'bg-green-700',
      text: 'text-green-700',
      border: 'border-green-200',
      hover: 'hover:bg-green-800'
    }
  };

  const currentTheme = themes[surface];

  // Aplicar variables de tema global
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-theme', currentTheme.primary);
    document.documentElement.style.setProperty('--bg-theme', currentTheme.secondary);
  }, [surface, currentTheme]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  const handleRegisterAction = useCallback((
    player: Player, 
    result: ActionResult, 
    stroke: StrokeType, 
    direction: Direction
  ) => {
    const videoTime = videoRef.current?.currentTime || 0;
    const winner = determineWinnerFromAction(player, result);
    const newScore = calculateNewScore(score, winner);
    
    const newAction: TaggedAction = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      videoTime,
      player,
      result,
      stroke,
      direction,
      scoreSnapshot: `${newScore.setsA}-${newScore.setsB} (${newScore.gamesA}-${newScore.gamesB})`
    };

    setActions(prev => [newAction, ...prev]);
    setScore(newScore);
  }, [score]);

  const handleNewMatch = () => {
    // Se eliminó la confirmación para un reinicio inmediato según los nuevos requisitos
    setActions([]);
    setScore({
      pointsA: 0, pointsB: 0,
      gamesA: 0, gamesB: 0,
      setsA: 0, setsB: 0
    });
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleExport = () => {
    const exportData = actions.map(a => ({
      Timestamp: a.timestamp,
      VideoTime_sec: a.videoTime.toFixed(2),
      Player: a.player === 'A' ? playerNameA : playerNameB,
      Result: a.result,
      Stroke: a.stroke,
      Direction: a.direction,
      Score: a.scoreSnapshot
    }));
    exportToCSV(exportData, `tennis_analysis_${playerNameA}_vs_${playerNameB}_${Date.now()}`);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`min-h-screen pb-12 transition-colors duration-700 ${currentTheme.secondary}`}>
      {/* Header Global Dinámico */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex flex-col xl:flex-row justify-between items-center gap-6 shadow-sm transition-all duration-500">
        <div className="flex items-center gap-3 shrink-0">
          <div className={`w-10 h-10 ${currentTheme.brand} rounded-lg flex items-center justify-center text-white shadow-lg transition-colors duration-500`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">Tennis Tactics Pro</h1>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em] font-black">Professional Tactical Analysis</p>
          </div>
        </div>

        {/* Selección de Superficie (Core Requirement) */}
        <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-wider">Superficie del Encuentro</span>
          <div className="flex gap-2">
            {[
              { id: 'clay', label: 'TIERRA BATIDA', color: 'bg-orange-700' },
              { id: 'hard', label: 'PISTA DURA', color: 'bg-blue-700' },
              { id: 'grass', label: 'HIERBA', color: 'bg-green-700' }
            ].map(surf => (
              <button 
                key={surf.id}
                onClick={() => setSurface(surf.id as Surface)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all border ${
                  surface === surf.id 
                  ? `${surf.color} text-white shadow-md scale-105 border-transparent` 
                  : `bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300`
                }`}
              >
                {surf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nombres de Jugadoras */}
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-red-500 uppercase ml-1">LOCAL (A)</span>
            <input 
              type="text" 
              value={playerNameA} 
              onChange={(e) => setPlayerNameA(e.target.value)} 
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-red-400 outline-none w-36 transition-all shadow-sm"
            />
          </div>
          <div className="pt-4 font-black text-slate-300 text-[10px]">VS</div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-blue-500 uppercase ml-1">VISITANTE (B)</span>
            <input 
              type="text" 
              value={playerNameB} 
              onChange={(e) => setPlayerNameB(e.target.value)} 
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-blue-400 outline-none w-36 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Acciones Globales */}
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={handleNewMatch} className="flex items-center gap-2 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 px-4 py-2.5 rounded-lg text-xs font-black transition-all border border-slate-200 shadow-sm">
            NUEVO PARTIDO
          </button>
          <label className="cursor-pointer">
            <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
            <div className={`bg-white hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-black border border-slate-200 shadow-sm transition-colors`}>
              SUBIR VÍDEO
            </div>
          </label>
          <button 
            onClick={handleExport}
            className={`${currentTheme.brand} ${currentTheme.hover} text-white px-5 py-2.5 rounded-lg text-xs font-black transition-all shadow-lg flex items-center gap-2`}
          >
            EXPORTAR
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          {/* Reproductor de Vídeo */}
          <div className="bg-black rounded-3xl overflow-hidden aspect-video shadow-2xl relative group ring-8 ring-white/5">
            {videoUrl ? (
              <video ref={videoRef} src={videoUrl} controls className="w-full h-full object-contain" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-900/90">
                <p className="text-sm font-bold tracking-tight">Inserte el vídeo del partido para iniciar el análisis</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8">
            <PerformanceMatrix 
              actions={actions} 
              playerNameA={playerNameA} 
              playerNameB={playerNameB} 
              themeColor={currentTheme.text} 
            />
            {/* Componente de Gráficos Circulares (Core Requirement) */}
            <StrokeCharts 
              actions={actions} 
              playerNameA={playerNameA} 
              playerNameB={playerNameB} 
            />
          </div>

          {/* Tabla Cronológica */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className={`p-4 border-b border-slate-200 ${currentTheme.secondary} transition-colors duration-500 flex justify-between items-center`}>
              <h2 className="font-black text-slate-800 text-sm uppercase tracking-tight">Histórico de Acciones</h2>
              <span className={`text-[10px] ${currentTheme.brand} text-white font-black px-3 py-1 rounded-full shadow-sm`}>
                {actions.length} REGISTROS
              </span>
            </div>
            <div className="overflow-x-auto max-h-[450px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4 border-b">Tiempo</th>
                    <th className="px-6 py-4 border-b">Jugadora</th>
                    <th className="px-6 py-4 border-b">Resultado</th>
                    <th className="px-6 py-4 border-b">Golpe</th>
                    <th className="px-6 py-4 border-b">Dirección</th>
                    <th className="px-6 py-4 border-b">Marcador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {actions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic font-medium">Sin datos registrados</td>
                    </tr>
                  ) : actions.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className={`px-6 py-4 font-mono font-bold ${currentTheme.text}`}>{formatTime(a.videoTime)}</td>
                      <td className="px-6 py-4">
                        <span className={`font-black px-2 py-0.5 rounded ${a.player === 'A' ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50'}`}>
                          {a.player === 'A' ? playerNameA : playerNameB}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-bold">{a.result}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{a.stroke}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter">{a.direction}</span>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">{a.scoreSnapshot}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Barra Lateral: Marcador y Controles */}
        <div className="xl:col-span-4 space-y-8">
          <ScoreBoard 
            score={score} 
            playerNameA={playerNameA} 
            playerNameB={playerNameB} 
            themeColor={surface === 'clay' ? 'orange-500' : surface === 'hard' ? 'blue-500' : 'emerald-500'} 
          />
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
            <ControlPanel 
              onRegister={handleRegisterAction} 
              playerNameA={playerNameA} 
              playerNameB={playerNameB} 
              primaryColor={currentTheme.brand}
              primaryHover={currentTheme.hover}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
