import React, { useState } from 'react';
import { Music, Clock, Calendar, Settings, X } from 'lucide-react';
import { getDominantCategory, getCharmColorByName } from '../utils/charmCategories';
import { deleteMusicTrack } from '../services/firebase';

interface MusicTrack {
  id: string;
  name: string;
  title: string;
  artist: string;
  traits: { charm_name: string; stage: number }[];
  duration: number;
  audioUrl: string;
  createdAt?: number;
  ordinal?: number;
}

interface MusicListProps {
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  onTrackSelect: (track: MusicTrack) => void;
}

export function MusicList({ tracks, currentTrack, onTrackSelect }: MusicListProps) {
  const [canDelete, setCanDelete] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: any) => {
    if (timestamp === undefined || timestamp === null) return '-';
    const value = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    const date = new Date(value);
    if (!isFinite(date.getTime())) return '-';
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleToggleAdmin = () => {
    if (canDelete) {
      setCanDelete(false);
      return;
    }
    const pwd = window.prompt('관리자 비밀번호를 입력하세요.');
    const expected = (import.meta as any)?.env?.VITE_ADMIN_PASSWORD || '0515';
    if (pwd && pwd === expected) {
      setCanDelete(true);
      alert('삭제 권한이 활성화되었습니다. 항목의 X 버튼으로 삭제할 수 있습니다.');
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!canDelete) return;
    const ok = window.confirm('이 음악을 삭제하시겠습니까?');
    if (!ok) return;
    try {
      await deleteMusicTrack(id);
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ paddingRight: '8px' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white flex items-center gap-2">
          <Music className="w-6 h-6" />
          매력 음악 리스트
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleAdmin}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${canDelete ? 'border-red-400 text-red-300' : 'border-white/20 text-white/70'} hover:border-cyan-400/60 hover:text-white transition`}
            title={canDelete ? '관리 권한 해제' : '설정(관리자 모드)'}
          >
            <Settings className="w-4 h-4" />
            {canDelete ? '관리 해제' : '설정'}
          </button>
          <span className="text-white/70">{tracks.length}곡</span>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto space-y-3"
        style={{
          maxHeight: 'calc(100vh - 200px)',
          paddingRight: '4px',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(96, 165, 250, 0.5) rgba(255, 255, 255, 0.1)'
        }}
      >
        {tracks.map((track) => {
          const isActive = currentTrack?.id === track.id;
          const dominantCategory = getDominantCategory(track.traits);

          return (
            <button
              key={track.id}
              onClick={() => onTrackSelect(track)}
              className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border-2 ${isActive
                ? 'bg-slate-700/60 border-cyan-400/70 shadow-lg'
                : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-400/30'
                }`}
            >
              <div className="flex items-start gap-4">
                {/* Mini LP Icon */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${isActive ? 'animate-pulse' : ''
                      }`}
                    style={{ background: `linear-gradient(to bottom right, rgb(${dominantCategory.colorValues.primary}), rgb(${dominantCategory.colorValues.secondary}))` }}
                  >
                    <Music className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white truncate">
                      {track.ordinal && track.ordinal > 0 ? `${track.ordinal}번째 매력 음악` : '매력 음악'}
                    </h3>
                    {isActive && (
                      <span
                        className="flex-shrink-0 px-2 py-0.5 text-white text-xs rounded-full shadow-lg"
                        style={{ background: `linear-gradient(to right, rgb(${dominantCategory.colorValues.primary}), rgb(${dominantCategory.colorValues.secondary}))` }}
                      >
                        재생중
                      </span>
                    )}
                  </div>

                  {/* Category Badge */}
                  <div
                    className="inline-block px-2 py-0.5 text-white text-xs rounded mb-2 shadow-md"
                    style={{ background: `linear-gradient(to right, rgb(${dominantCategory.colorValues.primary}), rgb(${dominantCategory.colorValues.secondary}))` }}
                  >
                    {dominantCategory.name}
                  </div>

                  {/* Traits: 각 항목 고유 카테고리 색상 적용 */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {track.traits.map((trait, index) => {
                      const c = getCharmColorByName(trait.charm_name);
                      return (
                        <span
                          key={index}
                          className="px-2 py-0.5 rounded text-xs border"
                          style={{
                            background: `rgba(${c.values.primary}, 0.2)`,
                            color: `rgb(${c.values.primary})`,
                            borderColor: `rgba(${c.values.primary}, 0.4)`
                          }}
                        >
                          {trait.charm_name} Lv.{trait.stage}
                        </span>
                      );
                    })}
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

                {/* Right Controls */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  {isActive && (
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full animate-pulse"
                          style={{
                            background: `rgb(${dominantCategory.colorValues.primary})`,
                            height: '20px',
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: '0.8s'
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {canDelete && (
                    <button
                      onClick={(e) => handleDelete(e, track.id)}
                      className="p-1.5 rounded hover:bg-red-500/20 border border-red-400/50 text-red-300 hover:text-red-200"
                      title="삭제"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
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
