// iframe 통신을 통한 Alarm 사이트 연동
import { addMusicFromAlarm } from './firebase';

// 허용된 알람 사이트 오리진 목록 (배포/개발 대응)
const ALLOWED_ALARM_ORIGINS = new Set<string>([
  'https://aster-alarm.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
]);

// Player 준비 완료 신호 보내기 (opener 또는 parent로)
const notifyPlayerReady = () => {
  try {
    const message = { type: 'PLAYER_READY' } as const;
    // 새 창으로 열린 경우
    if (window.opener && !window.opener.closed) {
      // 배포 오리진으로 우선 통지
      window.opener.postMessage(message, 'https://aster-alarm.vercel.app');
      // 개발용 로컬 호스트에도 베스트 에포트 통지
      window.opener.postMessage(message, 'http://localhost:5173');
      window.opener.postMessage(message, 'http://localhost:3000');
    }
    // iframe 으로 임베드된 경우
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, 'https://aster-alarm.vercel.app');
      window.parent.postMessage(message, 'http://localhost:5173');
      window.parent.postMessage(message, 'http://localhost:3000');
    }
  } catch (e) {
    console.warn('PLAYER_READY 통지 실패:', e);
  }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  notifyPlayerReady();
} else {
  window.addEventListener('DOMContentLoaded', notifyPlayerReady);
}

// Player 사이트에서 Alarm 사이트로부터 메시지 받기
window.addEventListener('message', async (event) => {
  // 보안: 출처 확인
  if (!ALLOWED_ALARM_ORIGINS.has(event.origin)) {
    return;
  }

  const { type, data } = (event.data || {}) as { type?: string; data?: any };

  if (type === 'PING') {
    // 헬스 체크/동기화용 응답
    event.source?.postMessage({ type: 'PONG' }, event.origin);
    return;
  }

  if (type === 'MUSIC_GENERATED' && data) {
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
        error: (error as Error)?.message || 'unknown'
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
