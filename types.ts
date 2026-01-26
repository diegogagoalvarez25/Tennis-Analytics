
export type Player = 'A' | 'B';

export enum ActionResult {
  UNFORCED_ERROR = 'Error no forzado',
  POSITIVE_IMBALANCE = 'Desequilibrio positivo',
  NEGATIVE_IMBALANCE = 'Desequilibrio negativo'
}

export enum StrokeType {
  SERVE = 'Servicio',
  FOREHAND = 'Derecha',
  BACKHAND = 'Reves',
  INSIDE_OUT_FOREHAND = 'Derecha invertida',
  INSIDE_OUT_BACKHAND = 'Reves invertido',
  VOLLEY_FOREHAND = 'Volea derecha',
  VOLLEY_BACKHAND = 'Volea reves',
  SMASH = 'Remate'
}

export enum Direction {
  CROSS = 'Cruzado',
  CENTER = 'Centro',
  PARALLEL = 'Paralelo'
}

export interface Score {
  pointsA: number;
  pointsB: number;
  gamesA: number;
  gamesB: number;
  setsA: number;
  setsB: number;
}

export interface TaggedAction {
  id: string;
  timestamp: string;
  videoTime: number;
  player: Player;
  result: ActionResult;
  stroke: StrokeType;
  direction: Direction;
  scoreSnapshot: string;
}
