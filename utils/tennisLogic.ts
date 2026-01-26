
import { Score, Player, ActionResult } from '../types';

export const POINT_LABELS = ['0', '15', '30', '40', 'Ad'];

export const calculateNewScore = (
  current: Score,
  winner: Player
): Score => {
  const next = { ...current };
  
  if (winner === 'A') {
    if (next.pointsA === 3 && next.pointsB < 3) { // 40-0, 40-15, 40-30
      next.pointsA = 0;
      next.pointsB = 0;
      next.gamesA += 1;
    } else if (next.pointsA === 3 && next.pointsB === 3) { // Deuce -> Ad A
      next.pointsA = 4;
    } else if (next.pointsA === 4) { // Ad A -> Game
      next.pointsA = 0;
      next.pointsB = 0;
      next.gamesA += 1;
    } else if (next.pointsA === 3 && next.pointsB === 4) { // Ad B -> Deuce
      next.pointsB = 3;
    } else {
      next.pointsA += 1;
    }
  } else {
    if (next.pointsB === 3 && next.pointsA < 3) {
      next.pointsA = 0;
      next.pointsB = 0;
      next.gamesB += 1;
    } else if (next.pointsB === 3 && next.pointsA === 3) {
      next.pointsB = 4;
    } else if (next.pointsB === 4) {
      next.pointsA = 0;
      next.pointsB = 0;
      next.gamesB += 1;
    } else if (next.pointsB === 3 && next.pointsA === 4) {
      next.pointsA = 3;
    } else {
      next.pointsB += 1;
    }
  }

  // Set Logic (6 games wins set)
  if (next.gamesA >= 6 && next.gamesA - next.gamesB >= 2) {
    next.gamesA = 0;
    next.gamesB = 0;
    next.setsA += 1;
  } else if (next.gamesB >= 6 && next.gamesB - next.gamesA >= 2) {
    next.gamesA = 0;
    next.gamesB = 0;
    next.setsB += 1;
  }

  return next;
};

export const determineWinnerFromAction = (player: Player, result: ActionResult): Player => {
  if (result === ActionResult.POSITIVE_IMBALANCE) return player;
  // If player makes unforced error or negative imbalance, opponent wins point
  return player === 'A' ? 'B' : 'A';
};

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => 
    Object.values(obj).map(val => `"${val}"`).join(',')
  ).join('\n');
  
  const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
