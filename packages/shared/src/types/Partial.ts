type PartialSomeInternal<T, U extends keyof T> = Partial<Pick<T, U>> &
  Required<Omit<T, U>>;

/**
 *
 * Make propety of `T` in `U` optional
 * */
export type PartialSome<T, U extends keyof T> = PartialSomeInternal<T, U>;

type PartialAllInternal<T> = {
  [K in keyof T]?: T[K] extends Record<string, any>
    ? PartialAllInternal<T[K]>
    : T[K];
};

export type PartialAll<T> = PartialAllInternal<T>;
