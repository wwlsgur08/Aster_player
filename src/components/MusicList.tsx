import React from 'react';
import { Music, Clock, Calendar } from 'lucide-react';
import { getDominantCategory } from '../utils/charmCategories';

interface MusicTrack {
  id: string;
  name: string;
  traits: { charm_name: string; stage: number }[];
  duration: number;
  audioUrl: string;
  createdAt: number;
}

interface MusicListProps {
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  onTrackSelect: (track: MusicTrack) => void;
}

export function MusicList({ tracks, currentTrack, onTrackSelect }: MusicListProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white flex items-center gap-2">
          <Music className="w-6 h-6" />
          매력 음악 리스트
        </h2>
        <span className="text-white/70">{tracks.length}곡</span>
      </div>

      <div className="space-y-3">
        {tracks.map((track) => {
          const isActive = currentTrack?.id === track.id;
          const dominantCategory = getDominantCategory(track.traits);
          
          return (
            <button
              key={track.id}
              onClick={() => onTrackSelect(track)}
              className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border-2 ${
                isActive
                  ? 'bg-slate-700/60 border-cyan-400/70 shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-400/30'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Mini LP Icon */}
                <div className="flex-shrink-0">
                  <div 
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${dominantCategory.color.from} ${dominantCategory.color.to} flex items-center justify-center shadow-lg ${
                      isActive ? 'animate-pulse' : ''
                    }`}
                  >
                    <Music className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white truncate">
                      {track.name}의 매력 음악
                    </h3>
                    {isActive && (
                      <span className={`flex-shrink-0 px-2 py-0.5 bg-gradient-to-r ${dominantCategory.color.from} ${dominantCategory.color.to} text-white text-xs rounded-full shadow-lg`}>
                        재생중
                      </span>
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className={`inline-block px-2 py-0.5 bg-gradient-to-r ${dominantCategory.color.from} ${dominantCategory.color.to} text-white text-xs rounded mb-2 shadow-md`}>
                    {dominantCategory.name}
                  </div>

                  {/* Traits */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {track.traits.map((trait, index) => (
                      <span
                        key={index}
                        className={`px-2 py-0.5 ${dominantCategory.color.from.replace('from-', 'bg-')}/20 ${dominantCategory.color.text} rounded text-xs border ${dominantCategory.color.border}/40`}
                      >
                        {trait.charm_name} Lv.{trait.stage}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDuration(track.duration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(track.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Play Indicator */}
                {isActive && (
                  <div className="flex-shrink-0 flex items-center">
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 ${dominantCategory.color.from.replace('from-', 'bg-')} rounded-full animate-pulse`}
                          style={{
                            height: '20px',
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: '0.8s'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {tracks.length === 0 && (
        <div className="text-center py-12 text-white/50">
          <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>아직 생성된 음악이 없습니다.</p>
          <p className="text-sm mt-2">Aster Alarm에서 음악을 생성해보세요!</p>
        </div>
      )}
    </div>
  );
}