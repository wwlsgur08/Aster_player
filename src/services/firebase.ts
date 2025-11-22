// Firebase 설정 및 초기화
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, off, DataSnapshot, remove } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Firebase 프로젝트 설정
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCauC5NvMol_9fX0i2q7wI8zht1xKdS2v4",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "aster-music-player.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://aster-music-player-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "aster-music-player",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "aster-music-player.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "764474066780",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:764474066780:web:45430a3130f383aa8aa399"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 초기화
export const database = getDatabase(app);
export const storage = getStorage(app);

// 음악 데이터 타입 정의
export interface FirebaseMusicTrack {
  id?: string;
  name: string; // 생성된 사람 이름
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  charmTraits: {
    charm_name: string;
    stage: number;
  }[];
  createdAt: number;
  source: 'aster-alarm' | 'aster-player'; // 음악 소스 구분
}

// 음악 데이터를 Firebase에 추가
export const addMusicTrack = async (track: Omit<FirebaseMusicTrack, 'id' | 'createdAt'>) => {
  try {
    const musicsRef = ref(database, 'music-tracks');
    const newTrack: FirebaseMusicTrack = {
      ...track,
      createdAt: Date.now()
    };
    
    const result = await push(musicsRef, newTrack);
    console.log('음악이 성공적으로 추가되었습니다:', result.key);
    return result.key;
  } catch (error) {
    console.error('음악 추가 중 오류 발생:', error);
    throw error;
  }
};

// 음악 데이터 실시간 구독
export const subscribeMusicTracks = (callback: (tracks: FirebaseMusicTrack[]) => void) => {
  const musicsRef = ref(database, 'music-tracks');
  
  const unsubscribe = onValue(musicsRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    if (data) {
      const tracks: FirebaseMusicTrack[] = Object.entries(data).map(([id, track]) => ({
        id,
        ...(track as Omit<FirebaseMusicTrack, 'id'>)
      }));
      
      // 최신 순으로 정렬
      tracks.sort((a, b) => b.createdAt - a.createdAt);
      callback(tracks);
    } else {
      callback([]);
    }
  });

  // onValue가 반환한 언구수 함수를 그대로 반환 (누수/중복 방지)
  return unsubscribe;
};

// 음악 데이터 삭제
export const deleteMusicTrack = async (id: string) => {
  try {
    const trackRef = ref(database, `music-tracks/${id}`);
    await remove(trackRef);
    console.log('음악 삭제 완료:', id);
  } catch (error) {
    console.error('음악 삭제 중 오류 발생:', error);
    throw error;
  }
};

// API 엔드포인트: alarm 사이트에서 호출할 함수
export const addMusicFromAlarm = async (musicData: {
  name: string;
  audioUrl: string;
  charmTraits: { charm_name: string; stage: number; }[];
  duration?: number;
}) => {
  try {
    const track: Omit<FirebaseMusicTrack, 'id' | 'createdAt'> = {
      name: musicData.name,
      title: `${musicData.name}의 매력 음악`,
      artist: 'Aster AI',
      duration: musicData.duration || 60,
      audioUrl: musicData.audioUrl,
      charmTraits: musicData.charmTraits,
      source: 'aster-alarm'
    };

    return await addMusicTrack(track);
  } catch (error) {
    console.error('Alarm 사이트에서 음악 추가 실패:', error);
    throw error;
  }
};
