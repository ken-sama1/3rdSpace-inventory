import type {
  InventoryItemCategoryWithItemsDto,
  ProductCategoryWithProductsDto,
} from "@repo/shared";

export const isProductCategory = (
  payload: unknown
): payload is ProductCategoryWithProductsDto => {
  return (
    payload !== null && typeof payload === "object" && "products" in payload
  );
};

export const isInventoryItemCategory = (
  payload: unknown
): payload is InventoryItemCategoryWithItemsDto => {
  return (
    payload !== null &&
    typeof payload === "object" &&
    "inventoryItems" in payload
  );
};
