export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay = 2000
) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
