import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, VolumeX } from 'lucide-react';
import { getDominantCategory, getCDImage } from '../utils/charmCategories';

interface MusicTrack {
  id: string;
  name: string;
  traits: { charm_name: string; stage: number }[];
  duration: number;
  audioUrl: string;
  createdAt: number;
}

interface MusicPlayerProps {
  track: MusicTrack;
}

export function MusicPlayer({ track }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 트랙의 지배적인 카테고리 색상 및 CD 이미지 가져오기
  const dominantCategory = getDominantCategory(track.traits);
  const cdImage = getCDImage(track.traits);

  useEffect(() => {
    // 트랙이 변경되면 재생 중지
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [track.id]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || track.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-700/50 shadow-2xl">
      {/* Turntable Container */}
      <div className="relative mb-8">
        <div className="aspect-square max-w-md mx-auto relative">
          {/* Turntable Image */}
          <img 
            src="/images/turntable.svg" 
            alt="Turntable" 
            className="w-full h-full object-contain"
          />

          {/* CD Image - 턴테이블 웰에 딱 맞게 위치 */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: 'translateX(-16px)'
            }}
          >
            <div 
              className={`relative ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ 
                width: '65%',
                height: '65%',
                animationDuration: '3s',
                animationTimingFunction: 'linear'
              }}
            >
              {/* CD 뒷면 그림자 효과 */}
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-40"
                style={{
                  background: `radial-gradient(circle, ${dominantCategory.color.from.replace('from-', '')} 0%, transparent 70%)`,
                  transform: 'scale(0.95)'
                }}
              />
              
              {/* CD 본체 */}
              <img 
                src={cdImage} 
                alt="CD Album" 
                className="relative w-full h-full object-cover rounded-full"
                style={{
                  filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(0,0,0,0.3))'
                }}
              />
              
              {/* CD 반짝임 효과 */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  opacity: isPlaying ? 0.6 : 0.3,
                  transition: 'opacity 0.5s ease'
                }}
              />
            </div>
          </div>

          {/* 애니메이션 톤암 오버레이 */}
          <div 
            className="absolute pointer-events-none"
            style={{
              top: '20%',
              right: '20%',
              width: '30%',
              height: '30%',
              transformOrigin: 'top right',
              transform: isPlaying ? 'rotate(-5deg)' : 'rotate(-45deg)',
              transition: 'transform 1s ease-in-out'
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <linearGradient id="tonearmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#5a5a5a', stopOpacity: 1}} />
                  <stop offset="30%" style={{stopColor: '#3a3a3a', stopOpacity: 1}} />
                  <stop offset="70%" style={{stopColor: '#2a2a2a', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#1a1a1a', stopOpacity: 1}} />
                </linearGradient>
                
                <linearGradient id="tonearmTop" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#4a4a4a', stopOpacity: 1}} />
                  <stop offset="50%" style={{stopColor: '#3a3a3a', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#2a2a2a', stopOpacity: 1}} />
                </linearGradient>

                <radialGradient id="baseGrad" cx="50%" cy="50%">
                  <stop offset="0%" style={{stopColor: '#4a4a4a', stopOpacity: 1}} />
                  <stop offset="50%" style={{stopColor: '#2a2a2a', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#1a1a1a', stopOpacity: 1}} />
                </radialGradient>

                <filter id="tonearmShadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                  <feOffset dx="1" dy="2" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* 톤암 베이스 */}
              <circle cx="180" cy="20" r="18" fill="#1a1a1a" opacity="0.3"/>
              <circle cx="180" cy="20" r="16" fill="url(#baseGrad)"/>
              <circle cx="180" cy="20" r="13" fill="#2a2a2a"/>
              <circle cx="180" cy="20" r="11" fill="#3a3a3a"/>
              
              {/* 톤암 본체 - 3D 효과 */}
              <g filter="url(#tonearmShadow)">
                {/* 톤암 바닥 그림자 */}
                <line 
                  x1="180" 
                  y1="20" 
                  x2="50" 
                  y2="120" 
                  stroke="#000000" 
                  strokeWidth="12" 
                  strokeLinecap="round"
                  opacity="0.3"
                />
                
                {/* 톤암 메인 */}
                <line 
                  x1="180" 
                  y1="20" 
                  x2="50" 
                  y2="120" 
                  stroke="url(#tonearmGrad)" 
                  strokeWidth="10" 
                  strokeLinecap="round"
                />
                
                {/* 톤암 하이라이트 */}
                <line 
                  x1="180" 
                  y1="20" 
                  x2="50" 
                  y2="120" 
                  stroke="url(#tonearmTop)" 
                  strokeWidth="6" 
                  strokeLinecap="round"
                  opacity="0.7"
                />
                
                {/* 톤암 상단 하이라이트 */}
                <line 
                  x1="180" 
                  y1="20" 
                  x2="115" 
                  y2="70" 
                  stroke="#5a5a5a" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </g>
              
              {/* 톤암 조인트들 */}
              <circle cx="180" cy="20" r="6" fill="#2a2a2a"/>
              <circle cx="180" cy="20" r="4" fill="#4a4a4a"/>
              
              <circle cx="115" cy="70" r="5" fill="#2a2a2a"/>
              <circle cx="115" cy="70" r="3" fill="#3a3a3a"/>
              
              {/* 헤드쉘 (카트리지 부분) */}
              <g transform="translate(50, 120)">
                {/* 헤드쉘 바디 */}
                <rect x="-12" y="-6" width="24" height="12" rx="3" fill="#1a1a1a"/>
                <rect x="-11" y="-5" width="22" height="10" rx="2" fill="url(#tonearmGrad)"/>
                <rect x="-10" y="-4" width="20" height="8" rx="2" fill="#2a2a2a"/>
                
                {/* 카트리지 디테일 */}
                <rect x="-8" y="-3" width="16" height="6" rx="1" fill="#3a3a3a"/>
                <rect x="-6" y="-2" width="4" height="4" rx="0.5" fill="#252525"/>
                
                {/* 바늘 */}
                <line x1="0" y1="6" x2="0" y2="14" stroke="#888888" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="0" cy="14" r="1.5" fill="#666666"/>
                
                {/* 재생 중 바늘 빛 효과 */}
                {isPlaying && (
                  <>
                    <circle cx="0" cy="14" r="3" fill={dominantCategory.color.from.replace('from-', '')} opacity="0.3">
                      <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="0" cy="14" r="2" fill={dominantCategory.color.from.replace('from-', '')}>
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
                    </circle>
                  </>
                )}
              </g>
            </svg>
          </div>

          {/* 재생 중일 때 톤암 포인트 */}
          {isPlaying && (
            <div 
              className="absolute"
              style={{
                top: '38%',
                right: '32%',
                width: '4px',
                height: '4px'
              }}
            >
              <div 
                className="w-full h-full rounded-full animate-pulse"
                style={{
                  background: `${dominantCategory.color.from.replace('from-', '')}`,
                  boxShadow: `0 0 10px ${dominantCategory.color.from.replace('from-', '')}`
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Track Info */}
      <div className="text-center mb-6">
        <h2 className="text-white text-2xl mb-2">{track.name}의 매력 음악</h2>
        <div className={`inline-block px-4 py-1.5 bg-gradient-to-r ${dominantCategory.color.from} ${dominantCategory.color.to} rounded-full text-white text-sm mb-3 shadow-lg`}>
          {dominantCategory.name}
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {track.traits.map((trait, index) => (
            <span 
              key={index}
              className={`px-3 py-1 ${dominantCategory.color.from.replace('from-', 'bg-')}/20 ${dominantCategory.color.text} rounded-full text-sm border ${dominantCategory.color.border}/50`}
            >
              {trait.charm_name} Lv.{trait.stage}
            </span>
          ))}
        </div>
        <p className={`${dominantCategory.color.text} text-sm`}>
          {formatTime(duration)} • {new Date(track.createdAt).toLocaleDateString('ko-KR')}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className={`w-full h-2 ${dominantCategory.color.from.replace('from-', 'bg-')}/30 rounded-lg appearance-none cursor-pointer slider`}
        />
        <div className={`flex justify-between ${dominantCategory.color.text} text-sm mt-2`}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={togglePlay}
          className={`w-16 h-16 rounded-full bg-gradient-to-br ${dominantCategory.color.from} ${dominantCategory.color.to} hover:brightness-110 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" />
          )}
        </button>

        <button
          className={`w-12 h-12 rounded-full ${dominantCategory.color.from.replace('from-', 'bg-')}/30 hover:${dominantCategory.color.from.replace('from-', 'bg-')}/50 flex items-center justify-center transition-all duration-200 hover:scale-105 border ${dominantCategory.color.border}/50`}
        >
          <Download className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <button onClick={toggleMute} className={`${dominantCategory.color.text} hover:text-white transition-colors`}>
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className={`flex-1 h-2 ${dominantCategory.color.from.replace('from-', 'bg-')}/30 rounded-lg appearance-none cursor-pointer slider`}
        />
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(168, 85, 247, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(168, 85, 247, 0.5);
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
