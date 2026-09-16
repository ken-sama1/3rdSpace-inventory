export type WithResfreshToken<T> = T & {
  refreshToken: string;
};
