export const CATEGORY_TYPE_ENUM = ["item", "product"] as const;

export type CategoryTypeEnum = (typeof CATEGORY_TYPE_ENUM)[0 | 1];
