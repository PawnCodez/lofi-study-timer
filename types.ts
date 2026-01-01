export interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
  date: string; // ISO Date string YYYY-MM-DD
}

export interface Quote {
  content: string;
  author: string;
}

export enum TimerMode {
  FOCUS = 'FOCUS',
  BREAK = 'BREAK'
}

export interface TimerSettings {
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
}

export interface AudioTrack {
  id: string;
  title: string;
  src: string;
}

export interface UserStats {
  streak: number;
  lastCompletionDate: string | null;
}