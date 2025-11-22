# Firebase 설정 가이드

## 1. Firebase 프로젝트 생성

1. **Firebase 콘솔 접속**: https://console.firebase.google.com/
2. **새 프로젝트 추가** 클릭
3. 프로젝트 이름: `aster-music-player` (또는 원하는 이름)
4. Google Analytics 활성화 여부 선택 (선택사항)

## 2. Firebase 서비스 설정

### 2.1 Realtime Database 설정
1. 좌측 메뉴에서 **"빌드" → "Realtime Database"** 선택
2. **"데이터베이스 만들기"** 클릭
3. 보안 규칙: **"테스트 모드로 시작"** 선택 (나중에 수정 가능)
4. 위치: **asia-southeast1** (싱가포르) 권장

### 2.2 Storage 설정 (음성 파일용)
1. 좌측 메뉴에서 **"빌드" → "Storage"** 선택  
2. **"시작하기"** 클릭
3. 보안 규칙: **"테스트 모드로 시작"** 선택
4. 위치: **asia-southeast1** 선택

### 2.3 웹 앱 등록
1. 프로젝트 개요 페이지에서 **"웹 앱 추가"** (</> 아이콘) 클릭
2. 앱 닉네임: `aster-player-web`
3. **"Firebase Hosting 설정"** 체크 (배포용)
4. **"앱 등록"** 클릭

## 3. Firebase 설정 키 복사

앱 등록 후 나타나는 설정 정보를 `.env` 파일에 복사:

```javascript
// Firebase SDK snippet에서 이 정보들을 복사
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com", 
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## 4. 보안 규칙 설정

### 4.1 Realtime Database 규칙
```json
{
  "rules": {
    "music-tracks": {
      ".read": true,
      ".write": true
    }
  }
}
```

### 4.2 Storage 규칙
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /audio/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## 5. 환경변수 설정

`.env` 파일을 열어서 위에서 복사한 실제 값들로 교체:

```
REACT_APP_FIREBASE_API_KEY=실제_API_키
REACT_APP_FIREBASE_AUTH_DOMAIN=프로젝트ID.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://프로젝트ID-default-rtdb.firebaseio.com/
REACT_APP_FIREBASE_PROJECT_ID=프로젝트ID
REACT_APP_FIREBASE_STORAGE_BUCKET=프로젝트ID.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=실제_센더ID
REACT_APP_FIREBASE_APP_ID=실제_앱ID
```

## 6. 테스트 데이터 추가

Firebase 콘솔의 Realtime Database에서 직접 테스트 데이터 추가 가능:

```json
{
  "music-tracks": {
    "test1": {
      "name": "테스트유저",
      "title": "테스트유저의 매력 음악", 
      "artist": "Aster AI",
      "duration": 60,
      "audioUrl": "",
      "charmTraits": [
        {"charm_name": "다정함", "stage": 8},
        {"charm_name": "공감 능력", "stage": 7}
      ],
      "createdAt": 1732251600000,
      "source": "aster-alarm"
    }
  }
}
```

## 7. Alarm 사이트 연동 코드

Alarm 사이트에서 음악 생성 후 이 함수 호출:

```javascript
// Firebase SDK import
import { addMusicFromAlarm } from './firebase';

// 음악 생성 완료 후 호출
const uploadToPlayer = async (musicData) => {
  try {
    await addMusicFromAlarm({
      name: "사용자이름",
      audioUrl: "생성된음성파일URL", 
      charmTraits: [
        {charm_name: "다정함", stage: 8},
        {charm_name: "유머감각", stage: 6}
      ],
      duration: 60
    });
    
    console.log("플레이어에 음악 업로드 완료!");
  } catch (error) {
    console.error("업로드 실패:", error);
  }
};
```