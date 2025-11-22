import React from 'react';
import { Music } from 'lucide-react';

type MusicTrack = {
  id: string;
  name: string;
};

interface MusicListProps {
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  onTrackSelect: (track: MusicTrack) => void;
}

export function MusicList({ tracks, currentTrack, onTrackSelect }: MusicListProps) {
  return (
    <div className="flex flex-col" style={{ paddingRight: '8px' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white flex items-center gap-2">
          <Music className="w-6 h-6" />
          매력 음악 리스트 11
        </h2>
        <span className="text-white/70">{tracks.length}곡</span>
      </div>

      <div className="space-y-2">
        {tracks.map((t) => (
          <button
            key={t.id}
            onClick={() => onTrackSelect(t)}
            className={`w-full text-left p-4 rounded-xl border-2 ${
              currentTrack?.id === t.id
                ? 'bg-slate-700/60 border-cyan-400/70'
                : 'bg-white/5 hover:bg-white/10 border-white/10'
            }`}
          >
            <div className="text-white">{t.name || '매력 음악'}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
