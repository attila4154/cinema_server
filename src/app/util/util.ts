/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = (
  callback: (...args: any[]) => any,
  wait: number
) => {
  let timeoutId: number | undefined;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return (...args: any[]) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};

export function throttle(
  callback: (...args: any[]) => any,
  delay: number
) {
  let timer: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timer === null) {
      callback(...args);
      timer = setTimeout(() => (timer = null), delay);
    }
  };
}
