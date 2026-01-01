import { AudioTrack } from './types';

export const LOFI_TRACKS: AudioTrack[] = [
  {
    id: '1',
    title: 'Midnight Rain',
    // Using reliable copyright-free placeholder audio
    src: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3'
  },
  {
    id: '2',
    title: 'Cozy Coffee Shop',
    src: 'https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3'
  },
  {
    id: '3',
    title: 'Deep Focus',
    src: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3'
  }
];

export const QUOTE_API_URL = 'https://api.quotable.io/random?tags=motivational|inspirational';

export const FALLBACK_QUOTES = [
  { content: "The best way to get something done is to begin.", author: "Unknown" },
  { content: "Small steps lead to big changes.", author: "Unknown" },
  { content: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { content: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" }
];