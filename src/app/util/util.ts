/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function debounce(
  callback: (...args: any[]) => any,
  delay: number
) {
  let timeoutId: NodeJS.Timeout | undefined;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export function zip<A, B>(a: A[], b: B[]): [A, B][] {
  if (a.length !== b.length)
    throw new Error("length mismatch!");
  return a.map((k, i) => [k, b[i]]);
}
