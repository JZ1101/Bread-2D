export enum GamePhase {
  START = 'START',
  CUT = 'CUT',
  TOAST = 'TOAST',
  BUTTER = 'BUTTER',
  RESULT = 'RESULT',
}

export interface GameStats {
  sliceQuality: number; // 0-100
  toastLevel: number; // 0-100 (50 is perfect)
  butterCoverage: number; // 0-100
}

export interface ChefFeedback {
  score: number;
  comment: string;
}