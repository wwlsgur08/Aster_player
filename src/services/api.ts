// Alarm 사이트에서 사용할 API 함수들
import { addMusicFromAlarm, FirebaseMusicTrack } from './firebase';

// Alarm 사이트에서 호출할 메인 함수
export const uploadMusicToPlayer = async (musicData: {
  name: string;
  audioUrl: string;
  charmTraits: { charm_name: string; stage: number; }[];
  duration?: number;
}) => {
  try {
    console.log('플레이어로 음악 업로드 시작:', musicData);
    
    const trackId = await addMusicFromAlarm(musicData);
    
    console.log('플레이어 업로드 완료! Track ID:', trackId);
    
    return {
      success: true,
      trackId,
      message: '음악이 성공적으로 플레이어에 추가되었습니다.'
    };
  } catch (error) {
    console.error('플레이어 업로드 실패:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      message: '음악 업로드에 실패했습니다.'
    };
  }
};

// 매력 특성 분석해서 가장 높은 비중의 카테고리 찾기
export const analyzeDominantCharm = (traits: { charm_name: string; stage: number; }[]) => {
  const categoryMapping: Record<string, string[]> = {
    'empathy': ['다정함', '공감 능력', '이해심', '배려심', '경청 능력', '위로 능력', '섬세함'],
    'responsibility': ['성실함', '책임감', '인내심', '계획성', '세심함', '신중함', '절제력'],
    'curiosity': ['호기심', '창의성', '열린 마음', '모험심', '비판적 사고력', '통찰력', '넓은 시야', '집중력'],
    'stability': ['침착함', '안정감', '자기 성찰', '긍정적', '현실 감각', '자기 객관화', '자존감', '겸손'],
    'morality': ['정직함', '양심', '일관성', '원칙 준수', '진정성', '약자보호'],
    'humor': ['유머 감각', '분위기 메이커', '다양한 친분', '타인을 편하게 해주는 능력', '연락 등 관계를 이어가는 능력', '사교적 에너지'],
    'passion': ['목표 의식', '열정', '자기 계발 의지', '리더십', '야망', '경쟁심', '전략적 사고']
  };

  const categoryCounts: Record<string, number> = {};
  
  traits.forEach(trait => {
    for (const [category, charms] of Object.entries(categoryMapping)) {
      if (charms.some(charm => trait.charm_name.includes(charm) || charm.includes(trait.charm_name))) {
        categoryCounts[category] = (categoryCounts[category] || 0) + trait.stage;
        break;
      }
    }
  });

  const dominantCategory = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)[0];

  return dominantCategory ? dominantCategory[0] : 'passion';
};

// 개발/테스트용 함수들
export const testUpload = async () => {
  const testData = {
    name: "테스트 사용자",
    audioUrl: "https://example.com/test-audio.mp3",
    charmTraits: [
      { charm_name: "다정함", stage: 8 },
      { charm_name: "유머 감각", stage: 6 },
      { charm_name: "창의성", stage: 7 }
    ],
    duration: 45
  };

  return await uploadMusicToPlayer(testData);
};

// Alarm 사이트 연동을 위한 글로벌 함수 (window 객체에 추가)
if (typeof window !== 'undefined') {
  (window as any).AsterPlayerAPI = {
    uploadMusic: uploadMusicToPlayer,
    analyzeDominantCharm,
    testUpload
  };
}