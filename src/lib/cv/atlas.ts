import { getCv } from './cvRuntime';
import type { CvMat } from './types';

export interface AtlasEntry {
  x: number; // atlas에서 x좌표
  width: number; // 너비
  height: number; // 높이
  template: CvMat; // 원본
}

export interface MatchingAtlas<K extends string> {
  atlas: CvMat;
  entries: Record<K, AtlasEntry>;
}

export function generateMatchingAtlas<const M extends Record<string, CvMat>>(mats: M) {
  // 주어진 입력이 Record<string, CvMat>인데 이걸 M이라고 제너릭화함
  // 응답 entries은 Record인데, key값은 입력의 키라고 타입에게 확신을 줌
  const cv = getCv();

  const entries = {} as Record<keyof M, AtlasEntry>;

  // 높이를 가장 큰 것으로 맞춤
  const maxHeight = Math.max(...Object.values(mats).map((mat) => mat.rows));

  let xOffset = 0;
  const paddedMats: CvMat[] = [];
  const matVector = new cv.MatVector();

  for (const key of Object.keys(mats) as (keyof M)[]) {
    let mat = mats[key];
    let padded: CvMat;

    // height가 다르면 padding 추가
    if (mat.rows < maxHeight) {
      const bottom = maxHeight - mat.rows;
      padded = new cv.Mat();
      cv.copyMakeBorder(
        mat,
        padded,
        0,
        bottom,
        0,
        0,
        cv.BORDER_CONSTANT,
        new cv.Scalar(0, 0, 0, 0)
      );
    } else {
      padded = mat;
    }

    paddedMats.push(padded);
    matVector.push_back(padded);

    entries[key] = {
      x: xOffset,
      width: mat.cols,
      height: mat.rows,
      template: mat,
    };

    xOffset += padded.cols;
  }

  // atlas 생성
  const atlas = new cv.Mat();
  cv.hconcat(matVector, atlas);

  // padding 때문에 새로 만든 Mat 정리
  for (const m of paddedMats) {
    if (!Object.values(mats).includes(m)) {
      m.delete();
    }
  }
  matVector.delete();

  return { atlas, entries };
}
