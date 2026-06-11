let loading: Promise<void> | null = null;

export function loadOpenCV(): Promise<void> {
  // window.cv가 있고 반드시 쓸 수 있음을 확신한다.
  // cv를 직접 반환하려고 했으나 별로임
  /*
  결론:

  빌드 방식에 따라 cv 객체가 Promise일 수도, 일반 Object일 수도 있습니다
  사용하시는 @techstark/opencv-js 패키지는 **cv 자체가 Promise(thenable 객체)**입니다
  그래서 resolve(cv)를 호출하면, Promise가 "또 다른 Promise"로 인식하고 cv.then()을 호출하려고 시도합니다
  cv.then()이 제대로 구현되어 있지 않으면 → 영원히 pending 상태로 멈춤
  */
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('browser only'));
  }

  if (window.cv) return Promise.resolve();
  if (loading) return loading;

  loading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/npm/@techstark/opencv-js@4.12.0-release.1/dist/opencv.min.js';
    script.async = true;

    script.onload = () => {
      if (!window.cv) {
        loading = null;
        reject(new Error('Failed to load OpenCV: cv not exist on window'));
        return;
      }
      window.cv.onRuntimeInitialized = () => {
        resolve();
      };
    };

    script.onerror = () => {
      loading = null; // 실패 시 리셋
      document.body.removeChild(script); // 실패한 스크립트 제거
      reject(new Error('Failed to load OpenCV'));
    };

    document.body.appendChild(script);
  });

  return loading;
}
