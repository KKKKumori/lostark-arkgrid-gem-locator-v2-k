# 아크 그리드 전투력 최적화

## Introduction

이 프로젝트는 로스트아크 아크 그리드 시스템에서 사용자가 가진 젬을 코어에 장착했을 때 전투력을 최대화하는 최적의 조합을 탐색하는 계산 사이트입니다.

## Key Features
- 장착 가능한 젬 조합을 직접 비교할 필요 없이 최적의 아크 그리드 배치를 자동으로 계산
- 화면 인식을 통한 젬 자동 입력으로 반복 작업 최소화
- 여러 캐릭터를 프로필로 관리 가능

## Tech Stack

- **Solver**: Custom backtracking with upper bound pruning (TypeScript)
- **Frontend**: Svelte (component-based UI, local state persistence)
- **Image Processing**: OpenCV (template matching, Web Worker)
- **Deployment**: GitHub Pages (fully client-side)

## Technical Details
- [Solving](docs/algorithm.md)
- [Screen Recognition](docs/opencv.md)

## How to run
### Installation
npm을 사용하여 환경을 구성합니다.
```
npm install
```

## Generate OpenCV Sprite
OpenCV 템플릿은 `opencv-templates/` 아래에 존재합니다.
```
npm run generate:sprite
```
해당 명령어를 통해 이들을 하나의 스프라이트로 합칠 수 있습니다. 각 어셋들의 좌표는 `lib/opencv-template-coords/` 아래와 같이 생성됩니다.
```ts
// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY ITSELF
export const koKrCoords = {
  ...
  'anchor.png': { x: 0, y: 0, w: 148, h: 36 },
  'lv1.png': { x: 166, y: 138, w: 7, h: 13 },
  'lv2.png': { x: 166, y: 123, w: 9, h: 13 },
  ...
}
```
