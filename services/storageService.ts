import { Task, UserStats, TimerSettings } from '../types';

const TASKS_KEY = 'lofi_tasks';
const STATS_KEY = 'lofi_stats';
const SETTINGS_KEY = 'lofi_settings';
const ONBOARDING_KEY = 'lofi_onboarding_completed';

export const getTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const getStats = (): UserStats => {
  try {
    const data = localStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : { streak: 0, lastCompletionDate: null };
  } catch {
    return { streak: 0, lastCompletionDate: null };
  }
};

export const saveStats = (stats: UserStats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const getTimerSettings = (): TimerSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { focusDuration: 25, breakDuration: 5 };
  } catch {
    return { focusDuration: 25, breakDuration: 5 };
  }
};

export const saveTimerSettings = (settings: TimerSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const isOnboardingCompleted = (): boolean => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

export const completeOnboarding = () => {
  localStorage.setItem(ONBOARDING_KEY, 'true');
};