type PartialSomeInternal<T, U extends keyof T> = Partial<Pick<T, U>> &
  Required<Omit<T, U>>;

/**
 *
 * Make propety of `T` in `U` optional
 * */
export type PartialSome<T, U extends keyof T> = PartialSomeInternal<T, U>;
