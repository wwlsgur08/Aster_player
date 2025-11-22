import React, { useState, useEffect } from 'react';
import { Music } from 'lucide-react';
import { MusicPlayer } from './components/MusicPlayer';
import { MusicList } from './components/MusicList';
import { motion } from 'motion/react';
import { subscribeMusicTracks, FirebaseMusicTrack } from './services/firebase';

export interface MusicTrack {
  id: string;
  name: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  traits: {
    charm_name: string;
    stage: number;
  }[];
  createdAt?: number;
  ordinal?: number;
}

// 별자리 연결선 SVG 컴포넌트
const ConstellationLines = () => (
  <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 800">
    <defs>
      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#67e8f9" />
      </linearGradient>
    </defs>
    
    {/* 별자리 연결선들 */}
    <motion.path
      d="M100,100 L200,150 L300,120 L400,180 L500,140"
      stroke="url(#starGradient)"
      strokeWidth="1"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ duration: 3, delay: 0.5 }}
    />
    <motion.path
      d="M600,200 L700,250 L800,220 L900,280"
      stroke="url(#starGradient)"
      strokeWidth="1"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ duration: 3, delay: 1 }}
    />
    <motion.path
      d="M150,400 L250,450 L350,420 L450,480 L550,440"
      stroke="url(#starGradient)"
      strokeWidth="1"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ duration: 3, delay: 1.5 }}
    />
    
    {/* 별들 */}
    {[
      { x: 100, y: 100 }, { x: 200, y: 150 }, { x: 300, y: 120 }, { x: 400, y: 180 }, { x: 500, y: 140 },
      { x: 600, y: 200 }, { x: 700, y: 250 }, { x: 800, y: 220 }, { x: 900, y: 280 },
      { x: 150, y: 400 }, { x: 250, y: 450 }, { x: 350, y: 420 }, { x: 450, y: 480 }, { x: 550, y: 440 }
    ].map((star, index) => (
      <motion.circle
        key={index}
        cx={star.x}
        cy={star.y}
        r="2"
        fill="url(#starGradient)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.2, 1, 1.5, 1],
          opacity: [0, 1, 0.7, 1, 0.8]
        }}
        transition={{ 
          duration: 2, 
          delay: 0.5 + index * 0.1,
          repeat: Infinity,
          repeatDelay: 3 + index * 0.2
        }}
      />
    ))}
  </svg>
);

export default function App() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // URL 파라미터에서 자동 추가 데이터 확인
    const checkAutoAdd = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const autoAddParam = urlParams.get('auto-add');
      
      if (autoAddParam) {
        try {
          const musicData = JSON.parse(decodeURIComponent(autoAddParam));
          console.log('🎵 Alarm에서 음악 데이터 수신:', musicData);
          
          // Firebase에 음악 추가
          const { addMusicFromAlarm } = await import('./services/firebase');
          await addMusicFromAlarm({
            name: musicData.name,
            audioUrl: musicData.audioUrl,
            charmTraits: musicData.charmTraits,
            duration: musicData.duration
          });
          
          console.log('✅ Firebase에 음악 추가 완료!');
          
          // URL 파라미터 제거
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('❌ 자동 음악 추가 실패:', error);
        }
      }
    };

    // Firebase 연결 시도, 실패 시 목업 데이터 사용
    const loadTracks = async () => {
      try {
        // Firebase에서 실시간으로 음악 데이터 구독
        const unsubscribe = subscribeMusicTracks((firebaseTracks: FirebaseMusicTrack[]) => {
          // Firebase 데이터를 MusicTrack 형식으로 변환
          // 1) 1번째=가장 먼저 등록된 항목이 되도록 오더 계산
          const ascByTime = [...firebaseTracks]
            .filter(t => (t as any).createdAt)
            .sort((a, b) => (a as any).createdAt - (b as any).createdAt);
          const ordinalMap = new Map<string, number>();
          ascByTime.forEach((t, i) => {
            if (t.id) ordinalMap.set(t.id, i + 1);
          });

          // 2) Firebase 데이터를 MusicTrack 형식으로 변환 + ordinal 부여
          const convertedTracks: MusicTrack[] = firebaseTracks.map(track => ({
            id: track.id || '',
            name: track.name,
            title: track.title,
            artist: track.artist,
            duration: track.duration,
            audioUrl: track.audioUrl,
            traits: track.charmTraits,
            createdAt: (track as any).createdAt ?? Date.now(),
            ordinal: ordinalMap.get(track.id || '') ?? 0
          }));

          setTracks(convertedTracks);
          
          // 첫 번째 트랙을 현재 트랙으로 설정 (가장 최신)
          if (convertedTracks.length > 0 && !currentTrack) {
            setCurrentTrack(convertedTracks[0]);
          }
          
          setIsLoading(false);
        });

        // 목업 데이터 타임아웃 제거: 실시간 데이터만 사용

        return () => unsubscribe();
      } catch (error) {
        console.error('Firebase 연결 실패, 목업 데이터 사용:', error);
        loadMockData();
      }
    };

    // 목업 데이터 로드 함수
    const loadMockData = () => {
      const mockTracks: MusicTrack[] = [
        {
          id: '1',
          name: '지민',
          title: '지민의 매력 음악',
          artist: 'Aster AI',
          traits: [
            { charm_name: '침착함', stage: 6 },
            { charm_name: '안정감', stage: 5 },
            { charm_name: '긍정적', stage: 4 }
          ],
          duration: 60,
          audioUrl: ''
        },
        {
          id: '2',
          name: '승현',
          title: '승현의 매력 음악',
          artist: 'Aster AI',
          traits: [
            { charm_name: '유머 감각', stage: 6 },
            { charm_name: '분위기 메이커', stage: 5 },
            { charm_name: '사교적 에너지', stage: 4 }
          ],
          duration: 45,
          audioUrl: ''
        },
        {
          id: '3',
          name: '수진',
          title: '수진의 매력 음악',
          artist: 'Aster AI',
          traits: [
            { charm_name: '호기심', stage: 8 },
            { charm_name: '창의성', stage: 7 },
            { charm_name: '통찰력', stage: 6 }
          ],
          duration: 90,
          audioUrl: ''
        }
      ];

      setTracks(mockTracks);
      if (mockTracks.length > 0) {
        setCurrentTrack(mockTracks[0]);
      }
      setIsLoading(false);
    };

    // 자동 추가 확인 후 Firebase 로드
    checkAutoAdd().then(() => {
      loadTracks();
    });
  }, []);

  const handleTrackSelect = (track: MusicTrack) => {
    setCurrentTrack(track);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* 배경 별자리 */}
      <ConstellationLines />
      
      {/* 배경 별들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p>음악 불러오는 중...</p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto min-h-0" style={{ height: 'calc(100vh - 80px)' }}>
            {/* LP Player */}
            <div className="flex items-center justify-center h-full">
              {currentTrack && <MusicPlayer track={currentTrack} />}
            </div>

            {/* Music List - 투명한 박스 안에서 스크롤 */}
            <div className="h-full min-h-0 overflow-y-auto music-list-scroll bg-white/5 border border-white/10 rounded-2xl p-4">
              <MusicList 
                tracks={tracks} 
                currentTrack={currentTrack}
                onTrackSelect={handleTrackSelect} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
