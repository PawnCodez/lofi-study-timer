import React from 'react';
import { Sparkles, Music, CheckCircle, Clock } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Welcome</h2>
          <p className="text-gray-400 text-center mb-8">Your personal sanctuary for focus.</p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Pomodoro Timer</h3>
                <p className="text-sm text-gray-400">Focus for 25 minutes, break for 5. Customize as you need.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Music className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Lo-Fi Ambience</h3>
                <p className="text-sm text-gray-400">Curated tracks to help you enter the flow state.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Daily Tasks</h3>
                <p className="text-sm text-gray-400">Track your progress and build your daily streak.</p>
              </div>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full mt-10 bg-gradient-to-r from-primary to-secondary text-gray-900 font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity transform active:scale-95"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;