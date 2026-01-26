
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

  // Surface Theme Mapping with refined high-performance colors
  const themes = {
    clay: {
      primary: '#c2410c', // orange-700 (Clay Red/Orange)
      secondary: '#fff7ed', // orange-50
      brand: 'bg-orange-700',
      text: 'text-orange-700',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-800'
    },
    hard: {
      primary: '#1d4ed8', // blue-700 (Classic Hard Court Blue)
      secondary: '#f0f9ff', // blue-50
      brand: 'bg-blue-700',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-800'
    },
    grass: {
      primary: '#15803d', // green-700 (Grass Court Green)
      secondary: '#f0fdf4', // green-50
      brand: 'bg-green-700',
      text: 'text-green-700',
      border: 'border-green-200',
      hover: 'hover:bg-green-800'
    }
  };

  const currentTheme = themes[surface];

  // Global theme injection via CSS variables
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
    if (window.confirm('¿Deseas iniciar un nuevo partido? Se borrarán todas las acciones y el marcador actual.')) {
      setActions([]);
      setScore({
        pointsA: 0, pointsB: 0,
        gamesA: 0, gamesB: 0,
        setsA: 0, setsB: 0
      });
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
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
      {/* Global Header */}
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
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em] font-black">Professional Analysis Suite</p>
          </div>
        </div>

        {/* Surface Selection UI */}
        <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-inner">
          <span className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-wider">Superficie de Juego</span>
          <div className="flex gap-2">
            {[
              { id: 'clay', label: 'TIERRA BATIDA', active: 'bg-orange-700 border-orange-700', hover: 'hover:border-orange-400' },
              { id: 'hard', label: 'PISTA DURA', active: 'bg-blue-700 border-blue-700', hover: 'hover:border-blue-400' },
              { id: 'grass', label: 'HIERBA', active: 'bg-green-700 border-green-700', hover: 'hover:border-green-400' }
            ].map(surf => (
              <button 
                key={surf.id}
                onClick={() => setSurface(surf.id as Surface)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                  surface === surf.id 
                  ? `${surf.active} text-white shadow-md scale-105 z-10` 
                  : `bg-white text-slate-500 border-slate-200 ${surf.hover} hover:bg-slate-50`
                }`}
              >
                {surf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Player Identity Editing */}
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto bg-slate-50 p-2 rounded-xl border border-slate-200">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-red-500 uppercase ml-1 tracking-tight">Local (A)</span>
            <input 
              type="text" 
              value={playerNameA} 
              onChange={(e) => setPlayerNameA(e.target.value)} 
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-red-400 outline-none w-40 transition-all shadow-sm"
            />
          </div>
          <div className="pt-4 flex items-center">
            <span className="text-slate-300 font-black text-[10px]">VS</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-blue-500 uppercase ml-1 tracking-tight">Visitante (B)</span>
            <input 
              type="text" 
              value={playerNameB} 
              onChange={(e) => setPlayerNameB(e.target.value)} 
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-blue-400 outline-none w-40 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={handleNewMatch}
            className="group flex items-center gap-2 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 px-4 py-2.5 rounded-lg text-xs font-black transition-all border border-slate-200 shadow-sm"
          >
            <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            NUEVO PARTIDO
          </button>
          
          <label className="cursor-pointer">
            <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
            <div className="bg-white hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-black transition-all border border-slate-200 shadow-sm">
              SUBIR VÍDEO
            </div>
          </label>

          <button 
            onClick={handleExport}
            className={`${currentTheme.brand} ${currentTheme.hover} text-white px-5 py-2.5 rounded-lg text-xs font-black transition-all shadow-lg active:scale-95 flex items-center gap-2`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            EXPORTAR
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Area: Video & Analysis */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-black rounded-3xl overflow-hidden aspect-video shadow-2xl relative group ring-8 ring-white/5 transition-all">
            {videoUrl ? (
              <video ref={videoRef} src={videoUrl} controls className="w-full h-full object-contain" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-900/90 backdrop-blur-sm">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4 shadow-xl">
                  <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-bold tracking-tight">Sube un vídeo para comenzar el análisis</p>
                <p className="text-xs text-slate-500 mt-2">Formatos compatibles: MP4, MOV, WebM</p>
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
            <StrokeCharts 
              actions={actions} 
              playerNameA={playerNameA} 
              playerNameB={playerNameB} 
            />
          </div>

          {/* Chronological Record */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className={`p-4 border-b border-slate-200 ${currentTheme.secondary} transition-colors duration-500 flex justify-between items-center`}>
              <h2 className="font-black text-slate-800 text-sm uppercase tracking-tight">Registro de Acciones</h2>
              <span className={`text-[10px] ${currentTheme.brand} text-white font-black px-3 py-1 rounded-full shadow-sm`}>
                {actions.length} REGISTROS
              </span>
            </div>
            <div className="overflow-x-auto max-h-[450px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4 border-b">Tiempo Video</th>
                    <th className="px-6 py-4 border-b">Jugador</th>
                    <th className="px-6 py-4 border-b">Resultado</th>
                    <th className="px-6 py-4 border-b">Tipo Golpe</th>
                    <th className="px-6 py-4 border-b">Dirección</th>
                    <th className="px-6 py-4 border-b">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {actions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic font-medium">No se han registrado acciones aún</td>
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

        {/* Right Area: Controls & Score */}
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
