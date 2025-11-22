// iframe 통신을 통한 Alarm 사이트 연동
import { addMusicFromAlarm } from './firebase';

// Player 사이트에서 Alarm 사이트로부터 메시지 받기
window.addEventListener('message', async (event) => {
  // 보안: 출처 확인
  if (event.origin !== 'https://aster-alarm.vercel.app') {
    return;
  }

  const { type, data } = event.data;

  if (type === 'MUSIC_GENERATED') {
    try {
      console.log('🎵 Alarm에서 음악 생성됨:', data);

      // Firebase에 음악 추가
      const trackId = await addMusicFromAlarm({
        name: data.userName || '익명',
        audioUrl: data.audioUrl,
        charmTraits: data.charmTraits || [],
        duration: data.duration || 60
      });

      console.log('✅ 플레이어에 음악 추가 완료:', trackId);

      // Alarm 사이트에 성공 알림
      event.source?.postMessage({
        type: 'MUSIC_UPLOAD_SUCCESS',
        trackId
      }, event.origin);

    } catch (error) {
      console.error('❌ 플레이어 음악 추가 실패:', error);

      // Alarm 사이트에 실패 알림
      event.source?.postMessage({
        type: 'MUSIC_UPLOAD_ERROR',
        error: error.message
      }, event.origin);
    }
  }
});

// Alarm 사이트에서 추가할 코드 (음악 생성 완료 후)
/*
// 음악 생성 완료 후 Player에 메시지 전송
try {
  // Player 사이트 iframe 찾기 (또는 새 창에서 열기)
  const playerWindow = window.open('https://aster-player-gyj1.vercel.app/', '_blank');
  
  // 메시지 전송
  playerWindow.postMessage({
    type: 'MUSIC_GENERATED',
    data: {
      userName: userName,
      audioUrl: `data:${data.mime || 'audio/wav'};base64,${data.audio_base64}`,
      charmTraits: constellation.traits,
      duration: context.duration_seconds
    }
  }, 'https://aster-player-gyj1.vercel.app');

  // 성공/실패 메시지 받기
  window.addEventListener('message', (event) => {
    if (event.origin === 'https://aster-player-gyj1.vercel.app') {
      if (event.data.type === 'MUSIC_UPLOAD_SUCCESS') {
        status.textContent = `음악이 준비되었습니다! 🎵 플레이어에도 자동 추가됨 ✨`;
      } else if (event.data.type === 'MUSIC_UPLOAD_ERROR') {
        console.error('플레이어 업로드 실패:', event.data.error);
      }
    }
  });
} catch (error) {
  console.error('Player 통신 실패:', error);
}
*/