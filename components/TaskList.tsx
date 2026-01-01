import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Flame } from 'lucide-react';
import { Task, UserStats } from '../types';
import * as Storage from '../services/storageService';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [stats, setStats] = useState<UserStats>({ streak: 0, lastCompletionDate: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedTasks = Storage.getTasks();
    const loadedStats = Storage.getStats();
    
    // Check if day changed to reset tasks
    const today = new Date().toISOString().split('T')[0];
    if (loadedTasks.length > 0 && loadedTasks[0].date !== today) {
        // Reset tasks for new day if needed, or keep them but mark uncompleted?
        // Requirement says "Reset daily". We will clear them.
        // But maybe user wants to see history? For now, we clear to follow "Reset daily" strictly or clear completions.
        // Let's assume we clear the list for a fresh start.
        setTasks([]);
        Storage.saveTasks([]);
    } else {
        setTasks(loadedTasks);
    }
    setStats(loadedStats);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const today = new Date().toISOString().split('T')[0];
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      isCompleted: false,
      date: today
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    Storage.saveTasks(updatedTasks);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map(t => 
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    setTasks(updatedTasks);
    Storage.saveTasks(updatedTasks);
    checkStreak(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    Storage.saveTasks(updatedTasks);
  };

  const checkStreak = (currentTasks: Task[]) => {
    const allCompleted = currentTasks.length > 0 && currentTasks.every(t => t.isCompleted);
    if (!allCompleted) return;

    const today = new Date().toISOString().split('T')[0];
    
    if (stats.lastCompletionDate !== today) {
        // Increment streak only if not already incremented today
        const newStats = {
            streak: stats.streak + 1,
            lastCompletionDate: today
        };
        setStats(newStats);
        Storage.saveStats(newStats);
        
        // Simple celebration effect
        triggerConfetti();
    }
  };

  const triggerConfetti = () => {
     // Placeholder for visual feedback
     console.log("Streak increased!");
  };

  return (
    <div className="bg-surface rounded-2xl p-6 border border-white/5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Daily Tasks</h3>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">
          <Flame size={16} className="text-orange-500" />
          <span className="text-sm font-semibold text-orange-400">{stats.streak} Day Streak</span>
        </div>
      </div>

      <form onSubmit={addTask} className="relative mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="w-full bg-black/20 text-white placeholder-gray-500 rounded-xl py-3 pl-4 pr-12 border border-white/5 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
        <button
          type="submit"
          disabled={!newTask.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-lg text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p className="text-sm">No tasks for today.</p>
            <p className="text-xs mt-1">Add one to get started!</p>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                task.isCompleted 
                  ? 'bg-primary/5 border-primary/10' 
                  : 'bg-white/5 border-white/5 hover:border-white/10'
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  task.isCompleted
                    ? 'bg-primary border-primary'
                    : 'border-gray-500 hover:border-primary'
                }`}
              >
                {task.isCompleted && <Check size={14} className="text-gray-900" strokeWidth={3} />}
              </button>
              
              <span className={`flex-1 text-sm font-medium transition-all duration-300 ${
                task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'
              }`}>
                {task.text}
              </span>

              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;