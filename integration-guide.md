# Alarm → Player 연동 가이드

## 현재 상황 분석

**Alarm 사이트 (`app.js`)에서 음악 생성 완료 부분:**
```javascript
// 음악 생성 성공 후 (app.js 776줄 근처)
// 플레이어에 음악 로드
musicPlayer.loadAudio(data.audio_base64, data.mime || 'audio/wav', trackTitle);
status.textContent = `음악이 준비되었습니다! 🎵 재생해보세요 ✨`;
```

## 필요한 수정사항

### 1. Alarm 사이트 수정 (app.js)

**기존 코드를 수정해서 플레이어에도 전송:**

```javascript
// 기존 음악 생성 성공 부분에 추가할 코드
const data = await genRes.json();
if (!data.audio_base64) throw new Error('오디오가 없습니다.');

// 사용자 이름 기반 제목 생성
const userName = document.getElementById('user-name')?.value?.trim() || '나의';
const trackTitle = `${userName} 매력 벨소리`;

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
  status.textContent = `음악이 준비되었습니다! 🎵 플레이어에도 추가되었어요 ✨`;
} catch (playerError) {
  console.error('❌ 플레이어 업로드 실패:', playerError);
  // 플레이어 전송 실패해도 알람 기능은 정상 작동
}
```

### 2. Player 연동 함수 추가

**Alarm 사이트에 Firebase 연동 스크립트 추가:**

```javascript
// Firebase 연동 함수를 app.js 상단에 추가
async function uploadToPlayer(musicData) {
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

  // Firebase 동적 로드
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
  const { getDatabase, ref, push } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

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
  const musicsRef = ref(database, 'music-tracks');
  const result = await push(musicsRef, trackData);
  
  return result.key;
}
```

## 구현 순서

1. **Realtime Database 활성화 확인** (이미 완료)
2. **Alarm 사이트 코드 수정** - Firebase 연동 추가
3. **테스트** - Alarm에서 음악 생성 → Player 리스트 확인

## 장점

- ✅ **실시간 동기화**: 새 음악 생성 즉시 플레이어에 나타남
- ✅ **매력 카테고리 색상**: 자동으로 올바른 색상 적용  
- ✅ **사용자별 구분**: `name` 필드로 누가 만든 음악인지 표시
- ✅ **오프라인 지원**: Firebase가 자동 캐싱

이제 Alarm 사이트 코드를 수정해서 연동해보시겠어요?