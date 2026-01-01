import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX, Disc } from 'lucide-react';
import { LOFI_TRACKS } from '../constants';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const track = LOFI_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Autoplay prevented:", e);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % LOFI_TRACKS.length);
    setIsPlaying(true); // Auto play next
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="bg-surface rounded-2xl p-4 border border-white/5 shadow-lg">
      <audio
        ref={audioRef}
        src={track.src}
        onEnded={handleEnded}
        loop={false}
      />
      
      <div className="flex items-center gap-4">
        {/* Album Art / Animation Placeholder */}
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 overflow-hidden`}>
            <Disc className={`w-6 h-6 text-white ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 font-medium mb-0.5 uppercase tracking-wider">Now Playing</p>
          <h4 className="text-white font-semibold truncate text-sm">{track.title}</h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
          
          <button
            onClick={nextTrack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward size={18} />
          </button>
        </div>
      </div>

      {/* Volume Bar */}
      <div className="mt-3 flex items-center gap-2 px-1">
        <button onClick={() => setIsMuted(!isMuted)} className="text-gray-500 hover:text-gray-300">
          {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;