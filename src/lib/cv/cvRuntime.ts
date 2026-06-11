// window.cv로 초기화할 수 없음
// 반드시 worker 내에서만 사용
import cvModule from '@techstark/opencv-js';
import type { CV } from '@techstark/opencv-js';

let cvInstance: CV | null = null; //singleton

export async function initOpenCv(): Promise<void> {
  if (cvInstance) return;

  let cv: CV;
  if (cvModule instanceof Promise) {
    cv = await cvModule;
  } else {
    await new Promise<void>((resolve) => {
      cvModule.onRuntimeInitialized = resolve;
    });
    cv = cvModule;
  }

  cvInstance = cv;
}

export function getCv(): CV {
  if (!cvInstance) {
    throw new Error('OpenCV not initialized. Call initOpenCv() first.');
  }
  return cvInstance;
}
