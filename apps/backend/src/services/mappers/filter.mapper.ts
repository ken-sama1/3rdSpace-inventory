import { type Prisma } from "@repo/database";
import type { IsoDateFilterSchema, NumberFilterSchema } from "@repo/shared";

type ToNumberFilterResult =
  | {
      equals: number;
    }
  | {
      gte?: number;
      lte?: number;
    };

export const toNumberFilter = (
  num: NumberFilterSchema
): ToNumberFilterResult => {
  if (typeof num === "number") {
    return {
      equals: num,
    } satisfies Prisma.IntFilter;
  }

  return {
    ...(num?.gte && num.gte !== null && { gte: num.gte }),
    ...(num?.lte && num.lte !== null && { lte: num.lte }),
  } satisfies Prisma.IntFilter;
};

export const toStringFilter = (str: string) => {
  return {
    contains: str,
  } satisfies Prisma.StringFilter;
};

export const toInFilter = <T extends (string | number)[]>(
  value: T
): { in: T } => {
  return {
    in: value,
  };
};

export const toDateFilter = (date: IsoDateFilterSchema) => {
  if (typeof date === "string") {
    return {
      equals: date,
    } as Prisma.DateTimeFilter;
  }

  return {
    ...(date.start && { gte: date.start }),
    ...(date.end && { lte: date.end }),
  } as Prisma.DateTimeFilter;
};
