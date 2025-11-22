// Alarm 사이트에 추가할 Firebase 연동 코드

// 1. Firebase 연동 함수 (app.js 상단에 추가)
async function uploadToPlayer(musicData) {
  try {
    console.log('🎵 플레이어에 음악 업로드 시작:', musicData.name);
    
    // Firebase 설정 (Player와 동일)
    const firebaseConfig = {
      apiKey: "AIzaSyCauC5NvMol_9fX0i2q7wI8zht1xKdS2v4",
      authDomain: "aster-music-player.firebaseapp.com", 
      databaseURL: "https://aster-music-player-default-rtdb.firebaseio.com/",
      projectId: "aster-music-player",
      storageBucket: "aster-music-player.firebasestorage.app",
      messagingSenderId: "764474066780",
      appId: "1:764474066780:web:45430a3130f383aa8aa399"
    };

    // Firebase 동적 로드 (CDN 사용)
    if (!window.firebase) {
      // Firebase SDK 동적 로드
      await new Promise((resolve, reject) => {
        const script1 = document.createElement('script');
        script1.src = 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js';
        script1.onload = () => {
          const script2 = document.createElement('script');
          script2.src = 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database-compat.js';
          script2.onload = resolve;
          script2.onerror = reject;
          document.head.appendChild(script2);
        };
        script1.onerror = reject;
        document.head.appendChild(script1);
      });
    }

    // Firebase 초기화
    if (!window.firebaseApp) {
      window.firebaseApp = firebase.initializeApp(firebaseConfig);
    }
    
    const database = firebase.database();

    // 플레이어 형식으로 데이터 변환
    const trackData = {
      name: musicData.name,
      title: `${musicData.name}의 매력 음악`,
      artist: 'Aster AI',
      duration: musicData.duration || 60,
      audioUrl: musicData.audioUrl,
      charmTraits: musicData.charmTraits,
      createdAt: Date.now(),
      source: 'aster-alarm'
    };

    // Firebase에 추가
    const musicsRef = database.ref('music-tracks');
    const result = await musicsRef.push(trackData);
    
    console.log('✅ 플레이어 업로드 완료! ID:', result.key);
    return result.key;
    
  } catch (error) {
    console.error('❌ 플레이어 업로드 실패:', error);
    throw error;
  }
}

// 2. 기존 음악 생성 성공 부분 수정 (generate 버튼 클릭 핸들러 내부)
/*
기존 코드:
  // 플레이어에 음악 로드
  musicPlayer.loadAudio(data.audio_base64, data.mime || 'audio/wav', trackTitle);
  status.textContent = `음악이 준비되었습니다! 🎵 재생해보세요 ✨`;

수정된 코드:
*/
// 플레이어에 음악 로드 (기존)
musicPlayer.loadAudio(data.audio_base64, data.mime || 'audio/wav', trackTitle);

// 🆕 새로 추가: Player 사이트에 음악 전송
try {
  await uploadToPlayer({
    name: userName,
    audioUrl: `data:${data.mime || 'audio/wav'};base64,${data.audio_base64}`,
    charmTraits: constellation.traits,
    duration: context.duration_seconds
  });
  
  console.log('✅ 플레이어에 음악이 추가되었습니다!');
  status.textContent = `음악이 준비되었습니다! 🎵 플레이어에도 자동 추가됨 ✨`;
} catch (playerError) {
  console.error('❌ 플레이어 업로드 실패:', playerError);
  status.textContent = `음악이 준비되었습니다! 🎵 재생해보세요 ✨`;
  // 플레이어 전송 실패해도 알람 기능은 정상 작동
}