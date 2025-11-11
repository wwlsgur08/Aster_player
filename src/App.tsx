import React, { useState, useEffect } from 'react';
import { Music } from 'lucide-react';
import { MusicPlayer } from './components/MusicPlayer';
import { MusicList } from './components/MusicList';
import { motion } from 'motion/react';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  traits: {
    charm_name: string;
    stage: number;
  }[];
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
    // Firebase에서 음악 데이터 가져오기
    // 실제 구현에서는 Firebase Realtime Database에서 데이터를 가져옵니다
    const fetchTracks = async () => {
      // Mock 데이터 (Firebase 연동 시 실제 데이터로 대체)
      const mockTracks: MusicTrack[] = [
        {
          id: '1',
          title: '지민',
          artist: 'BTS',
          traits: [
            { charm_name: '침착함', stage: 6 },
            { charm_name: '안정감', stage: 5 },
            { charm_name: '긍정적', stage: 4 }
          ],
          duration: 60,
          audioUrl: '',
          createdAt: Date.now() - 3600000
        },
        {
          id: '2',
          title: '승현',
          artist: 'BTS',
          traits: [
            { charm_name: '유머 감각', stage: 6 },
            { charm_name: '분위기 메이커', stage: 5 },
            { charm_name: '사교적 에너지', stage: 4 }
          ],
          duration: 45,
          audioUrl: '',
          createdAt: Date.now() - 7200000
        },
        {
          id: '3',
          title: '수진',
          artist: 'BTS',
          traits: [
            { charm_name: '호기심', stage: 8 },
            { charm_name: '창의성', stage: 7 },
            { charm_name: '통찰력', stage: 6 }
          ],
          duration: 90,
          audioUrl: '',
          createdAt: Date.now() - 10800000
        },
        {
          id: '4',
          title: '민수',
          artist: 'BTS',
          traits: [
            { charm_name: '정직함', stage: 7 },
            { charm_name: '양심', stage: 6 },
            { charm_name: '진정성', stage: 5 }
          ],
          duration: 75,
          audioUrl: '',
          createdAt: Date.now() - 14400000
        },
        {
          id: '5',
          title: '혜린',
          artist: 'BTS',
          traits: [
            { charm_name: '다정함', stage: 8 },
            { charm_name: '공감 능력', stage: 7 },
            { charm_name: '배려심', stage: 6 }
          ],
          duration: 55,
          audioUrl: '',
          createdAt: Date.now() - 18000000
        },
        {
          id: '6',
          title: '태양',
          artist: 'BTS',
          traits: [
            { charm_name: '목표 의식', stage: 9 },
            { charm_name: '열정', stage: 8 },
            { charm_name: '리더십', stage: 7 }
          ],
          duration: 80,
          audioUrl: '',
          createdAt: Date.now() - 21600000
        },
        {
          id: '7',
          title: '은서',
          artist: 'BTS',
          traits: [
            { charm_name: '성실함', stage: 7 },
            { charm_name: '책임감', stage: 6 },
            { charm_name: '계획성', stage: 5 }
          ],
          duration: 65,
          audioUrl: '',
          createdAt: Date.now() - 25200000
        }
      ];

      setTimeout(() => {
        setTracks(mockTracks);
        if (mockTracks.length > 0) {
          setCurrentTrack(mockTracks[0]);
        }
        setIsLoading(false);
      }, 500);
    };

    fetchTracks();
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
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/images/logo.png" 
              alt="Aster Alarm Logo" 
              className="h-16 object-contain"
            />
          </div>
          <p className="text-slate-300">
            디지털 LP판 매력 음악 플레이어
          </p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p>음악 불러오는 중...</p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* LP Player */}
            <div className="lg:sticky lg:top-8 h-fit">
              {currentTrack && <MusicPlayer track={currentTrack} />}
            </div>

            {/* Music List */}
            <div>
              <MusicList 
                tracks={tracks} 
                currentTrack={currentTrack}
                onTrackSelect={handleTrackSelect} 
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 text-slate-400">
          <p>© Aster Alarm - 나만의 매력 벨소리</p>
        </footer>
      </div>
    </div>
  );
}