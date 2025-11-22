// 매력 카테고리 정의
export interface CharmCategory {
  name: string;
  color: {
    from: string;
    to: string;
    border: string;
    text: string;
  };
  colorValues: {
    primary: string;
    secondary: string;
    dark: string;
    darker: string;
  };
  charms: string[];
}

export const CHARM_CATEGORIES: Record<string, CharmCategory> = {
  empathy: {
    name: '이해심 및 공감 능력',
    color: {
      from: 'from-pink-500',
      to: 'to-pink-700',
      border: 'border-pink-400',
      text: 'text-pink-300'
    },
    colorValues: {
      primary: '236, 72, 153', // pink-500
      secondary: '190, 24, 93', // pink-700
      dark: '131, 24, 67', // pink-900
      darker: '80, 7, 36' // pink-950
    },
    charms: ['다정함', '공감 능력', '이해심', '배려심', '경청 능력', '위로 능력', '섬세함']
  },
  responsibility: {
    name: '성실성 및 책임감',
    color: {
      from: 'from-cyan-500',
      to: 'to-cyan-700',
      border: 'border-cyan-400',
      text: 'text-cyan-300'
    },
    colorValues: {
      primary: '6, 182, 212', // cyan-500
      secondary: '14, 116, 144', // cyan-700
      dark: '22, 78, 99', // cyan-900
      darker: '8, 51, 68' // cyan-950
    },
    charms: ['성실함', '책임감', '인내심', '계획성', '세심함', '신중함', '절제력']
  },
  curiosity: {
    name: '지적 호기심 및 개방성',
    color: {
      from: 'from-yellow-500',
      to: 'to-yellow-700',
      border: 'border-yellow-400',
      text: 'text-yellow-300'
    },
    colorValues: {
      primary: '234, 179, 8', // yellow-500
      secondary: '161, 98, 7', // yellow-700
      dark: '113, 63, 18', // yellow-900
      darker: '66, 32, 6' // yellow-950
    },
    charms: ['호기심', '창의성', '열린 마음', '모험심', '비판적 사고력', '통찰력', '넓은 시야', '집중력']
  },
  stability: {
    name: '정서적 안정 및 자기 인식',
    color: {
      from: 'from-green-500',
      to: 'to-green-700',
      border: 'border-green-400',
      text: 'text-green-300'
    },
    colorValues: {
      primary: '34, 197, 94', // green-500
      secondary: '21, 128, 61', // green-700
      dark: '20, 83, 45', // green-900
      darker: '5, 46, 22' // green-950
    },
    charms: ['침착함', '안정감', '자기 성찰', '긍정적', '현실 감각', '자기 객관화', '자존감', '겸손']
  },
  morality: {
    name: '도덕성 및 양심',
    color: {
      from: 'from-blue-500',
      to: 'to-blue-700',
      border: 'border-blue-400',
      text: 'text-blue-300'
    },
    colorValues: {
      primary: '59, 130, 246', // blue-500
      secondary: '29, 78, 216', // blue-700
      dark: '30, 58, 138', // blue-900
      darker: '23, 37, 84' // blue-950
    },
    charms: ['정직함', '양심', '일관성', '원칙 준수', '진정성', '약자보호']
  },
  humor: {
    name: '유머감각및 사교성',
    color: {
      from: 'from-orange-500',
      to: 'to-orange-700',
      border: 'border-orange-400',
      text: 'text-orange-300'
    },
    colorValues: {
      primary: '249, 115, 22', // orange-500
      secondary: '194, 65, 12', // orange-700
      dark: '124, 45, 18', // orange-900
      darker: '67, 20, 7' // orange-950
    },
    charms: ['유머 감각', '분위기 메이커', '다양한 친분', '타인을 편하게 해주는 능력', '연락 등 관계를 이어가는 능력', '사교적 에너지']
  },
  passion: {
    name: '목표 지향성 및 야망',
    color: {
      from: 'from-red-500',
      to: 'to-red-700',
      border: 'border-red-400',
      text: 'text-red-300'
    },
    colorValues: {
      primary: '239, 68, 68', // red-500
      secondary: '185, 28, 28', // red-700
      dark: '127, 29, 29', // red-900
      darker: '69, 10, 10' // red-950
    },
    charms: ['목표 의식', '열정', '자기 계발 의지', '리더십', '야망', '경쟁심', '전략적 사고']
  }
};

// 매력 이름으로 카테고리 찾기
// 표기 변형을 흡수하기 위한 정규화 및 별칭 처리
const normalize = (s: string) => (s || '')
  .toLowerCase()
  .replace(/\s+/g, '') // 공백 제거
  .replace(/[^가-힣a-z0-9]/gi, ''); // 특수문자 제거

const ALIASES: Record<string, string> = {
  // 공백/표기 변형 보정
  '원칙준수': '원칙 준수',
  '약자보호': '약자보호', // 그대로이지만 정규화 대비
  '현실감각': '현실 감각',
  '유머감각': '유머 감각',
  '이해심및공감능력': '이해심', // 대표 키워드 한 개로 매핑
  '연락등관계를이어가는능력': '연락 등 관계를 이어가는 능력',
};

export function getCategoryByCharm(charmName: string): string | null {
  if (!charmName) return null;

  // 별칭 매핑 적용
  const alias = ALIASES[normalize(charmName)];
  const target = alias || charmName;
  const normTarget = normalize(target);

  for (const [key, category] of Object.entries(CHARM_CATEGORIES)) {
    for (const charm of category.charms) {
      const normCharm = normalize(charm);
      if (normTarget.includes(normCharm) || normCharm.includes(normTarget)) {
        return key;
      }
    }
  }
  return null;
}

// 트랙의 가장 많은 카테고리 찾기
export function getDominantCategory(traits: { charm_name: string; stage: number }[]): CharmCategory {
  // 카테고리 가중치 = 해당 카테고리에 속한 trait의 stage 합계
  const categoryWeights: Record<string, number> = {};

  traits.forEach(trait => {
    const categoryKey = getCategoryByCharm(trait.charm_name);
    if (categoryKey) {
      categoryWeights[categoryKey] = (categoryWeights[categoryKey] || 0) + (Number(trait.stage) || 0);
    }
  });

  // 가장 높은 가중치 카테고리 선택
  let maxWeight = -1;
  let dominantKey = 'passion'; // 기본값

  for (const [key, weight] of Object.entries(categoryWeights)) {
    if (weight > maxWeight) {
      maxWeight = weight;
      dominantKey = key;
    }
  }

  return CHARM_CATEGORIES[dominantKey];
}

// 카테고리별 CD 이미지 매핑
export const CD_IMAGES: Record<string, string> = {
  empathy: '/images/cd-pink.png',
  responsibility: '/images/cd-cyan.png',
  curiosity: '/images/cd-yellow.png',
  stability: '/images/cd-green.png',
  morality: '/images/cd-blue.png',
  humor: '/images/cd-orange.png',
  passion: '/images/cd-red.png'
};

// 카테고리에 해당하는 CD 이미지 가져오기
export function getCDImage(traits: { charm_name: string; stage: number }[]): string {
  // CD 이미지도 가중치(레벨 합) 기준으로 선택
  const categoryWeights: Record<string, number> = {};

  traits.forEach(trait => {
    const categoryKey = getCategoryByCharm(trait.charm_name);
    if (categoryKey) {
      categoryWeights[categoryKey] = (categoryWeights[categoryKey] || 0) + (Number(trait.stage) || 0);
    }
  });

  let maxWeight = -1;
  let dominantKey = 'passion';
  for (const [key, weight] of Object.entries(categoryWeights)) {
    if (weight > maxWeight) {
      maxWeight = weight;
      dominantKey = key;
    }
  }

  return CD_IMAGES[dominantKey];
}

// 개별 매력(트레이트)명으로 색상 세트 반환
export function getCharmColorByName(charmName: string) {
  const key = getCategoryByCharm(charmName);
  return key ? CHARM_CATEGORIES[key].color : CHARM_CATEGORIES['passion'].color;
}
