# Introduction

## Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                        Main Thread                          │
├─────────────────────────────────────────────────────────────┤
│  getDisplayMedia() → MediaStreamTrackProcessor              │
│         │                                                   │
│         ▼                                                   │
│  VideoFrame Stream                                          │
│         │                                                   │
│         │ postMessage(frame, [frame])  ← Zero-copy transfer │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────┐           │
│  │           Web Worker (Offscreen)             │           │
│  ├──────────────────────────────────────────────┤           │
│  │  1. OpenCV Template Matching                 │           │
│  │  2. Adaptive Search (Cached ROI)             │           │
│  │  3. Debug Canvas Rendering                   │           │
│  └──────────────────────────────────────────────┘           │
│         │                                                   │
│         │ postMessage(results + ImageBitmap)                │
│         ▼                                                   │
│  Update UI + Display Debug Canvas                           │
└─────────────────────────────────────────────────────────────┘
```

## Problem Context

게임 플레이 중 실시간으로 게임 화면을 분석하여 젬의 옵션 정보를 추출하는 브라우저 기반 도구를 개발하였다.

브라우저 환경이라는 제약 속에서 다음 요구사항을 동시에 충족해야 했다:

- **실시간성**: 30 FPS 수준의 프레임 처리 (한 프레임당 33ms 이하)
- **비침투성**: 게임 클라이언트 수정 없이 화면 공유만으로 작동
- **반응성**: 사용자 인터페이스가 프리징되지 않아야 함
- **정확성**: 다양한 해상도(FHD~4K)에서도 동작하는 인식 정확도

## Technical Challenges

1. **CPU-intensive 작업의 병목**: OpenCV 이미지 처리는 CPU 집약적이며,
   메인 스레드에서 실행 시 UI가 블로킹됨
2. **데이터 전송 비용**: 매 프레임(1920×1080×4 bytes ≈ 8MB)을 Worker로
   복사하면 전송만으로도 프레임 예산 초과
3. **해상도 다양성**: 사용자마다 다른 해상도(1080p~4K)에 대응해야 함


## Solution Overview

브라우저 환경에서 실시간 화면 캡처 + OpenCV 기반 이미지 인식을 수행하는 기능을 구현하였다.

메인 UI 스레드의 성능 저하를 방지하기 위해, 모든 영상 처리 및 인식 로직을 Web Worker로
분리하였으며, VideoFrame의 ownership transfer를 통해 데이터 복사 오버헤드를 제거하였다.

FHD 환경 아래에서 40FPS를 달성하였다.

## 1. Web Worker 기반 아키텍처 설계

### 설계 원칙: 책임의 명확한 분리

메인 스레드는 I/O와 상태 관리에만 집중하고, 모든 CPU 집약적 작업은 Worker로 위임했다.

#### Main Thread 역할
- **입력 처리**: `getDisplayMedia()`를 통한 화면 공유 요청
- **프레임 스트림 생성**: `MediaStreamTrackProcessor`로 VideoFrame 스트림 생성
- **상태 머신**: UI 상태 관리 (Idle → Loading → Recording → Closing)
- **결과 렌더링**: Worker로부터 받은 인식 결과 반영 및 디버그 이미지 표시

#### Web Worker 역할
- **초기화**: OpenCV.js 로딩 및 템플릿 이미지 전처리
- **프레임 처리**:
  - 이미지 전처리 (그레이스케일 변환, 스케일링)
  - Template matching 수행
- **디버그 시각화**: OffscreenCanvas를 사용한 디버그 정보 렌더링

#### 성능 효과
- **Before**: 메인 스레드에서 처리 시 프레임 처리 중 버벅이는 현상 발생
- **After**: Worker 분리 후 UI 반응성 유지, 프레임 처리는 백그라운드 진행


## 2. VideoFrame Zero-Copy 전송
```typescript
this.worker.postMessage(
  {
    type: 'frame',
    frame: value,
    drawDebug: this.drawDebug,
    detectionMargin: this.detectionMargin,
  },
  [value] // ownership transfer
);
```

VideoFrame을 transferable object로 Worker에 전달하여 불필요한 복사를 제거하여 성능을 높힘

## 3. 에셋 로딩 최적화

20여 개의 템플릿 이미지를 HTTP 요청을 통해 순차적으로 로드하였을 때 약 2-3초가 소요되었다. 빌드 타임에 `sprite-smith` 라이브러리를 사용하여 하나의 스프라이트로 생성 및 로드하도록 변경하여 1회의 HTTP 요청 내에 어셋이 모두 로드되도록 성능을 향상시켰다.

## 4. 화면 공유와 Worker 초기화 병렬화
```typescript
async startCapture() {
  ...
  // worker의 init을 기다리는 promise 만든 후 init 요청 보냄
  // (worker의 응답에 따라서 reject될 수도 있음!)
  const waitForInit = new Promise<void>((resolve, reject) => {
    this.awaitWorkerInitialization = { resolve, reject };
  });
  // *이 promise는 init이 완료됐다는 message에 resolve됨
  this.postMessage({ type: 'init' });
  // 초기화되는 동안 사용자에게 화면 공유 요청하고 둘을 모두 기다림
  await Promise.all([this.requestDisplayMedia(), waitForInit]);
  ...
}
```

사용자에게 화면 공유 권한을 묻는 도중에 Worker가 초기화되도록하여 체감 대기 시간을 제거하였다. 중간에 Worker가 초기화에 실패할 수도 있어서 해당 경우엔 promise를 reject하고 에러를 캡슐화하여 사용자에게 노출하였다.


## 4. DOM 없는 Worker 환경에서의 디버깅 시각화

화면 인식이 수행되지 않는 경우 사용자가 인식 중인 화면을 확인할 수 있도록 OffscreenCanvas를 Worker 내부에서 생성, 필요시 디버그 렌더링 후 ImageBitmap으로 변환하여 메인 스레드로 전송하여 캔버스에 출력하였다.

```ts
postToMain({
  type: 'debug',
  image: processor.debugCanvas.transferToImageBitmap(), // zero-copy
});
```


## 5. 탐색 전략

### 기술 선택: Template Matching vs OCR

기존 유사 프로젝트들은 OCR을 주로 사용했으나, 본 프로젝트의 특성상 Template Matching이 더 적합하다고 판단하였다:

| 기준 | OCR | Template Matching |
|------|-----|-------------------|
| 속도 (FHD) | ~150-200ms/frame | ~50-70ms/frame |
| 적용 조건 | 임의의 텍스트 | **고정된 UI 요소** ← 본 프로젝트 |

등장하는 젬의 옵션과 숫자가 한정적이기에 Template Matching이 유리하다.



### 최적화: 위치 캐싱 + 지역 탐색

**병목 지점**: FHD(1920×1080) 기준 UI의 위치를 결정하기 위한 앵커 찾기에 100ms 이상이 소요되었다.

**핵심 통찰**:
- anchor가 등장할 수 있는 위치는 화면의 좌상단 (1/4)에 한정됨
- 게임 플레이 중 사용자는 UI 위치를 변경하지 않음
- 첫 탐지 후에는 같은 위치에 UI가 있을 확률 >99%


### 성능 개선 결과

| 시나리오 | Before (전역 탐색) | After (캐싱) | 개선율 |
|---------|-------------------|-------------|--------|
| 첫 프레임 (캐시 없음) | 120ms | 120ms | - |
| 일반 프레임 (캐시 유효) | 120ms | **25ms** | **80% 감소** |
| UI 위치 변경 후 | 120ms | 120ms (재탐색) | - |
