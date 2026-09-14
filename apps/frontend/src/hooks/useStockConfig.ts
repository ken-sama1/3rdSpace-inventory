import type {
  IdSchema,
  InventoryItemUnitSchema,
  RecipeItemWithInventoryItemDto,
} from "@repo/shared";

const stockStatusByUnitMap: Record<
  InventoryItemUnitSchema,
  {
    // Minimum quantity considered low stock
    low: number;

    // Minimum quantity considered sufficiently stocked
    in: number;

    // Quantity considered out of stock
    out: number;
  }
> = {
  G: {
    out: 0,
    low: 100,
    in: 500,
  },

  KG: {
    out: 0,
    low: 0.1,
    in: 0.5,
  },

  MG: {
    out: 0,
    low: 100,
    in: 500,
  },

  ML: {
    out: 0,
    low: 100,
    in: 500,
  },

  PCS: {
    out: 0,
    low: 5,
    in: 10,
  },
};

type StockStatus = "low" | "out" | "in";

type RecipeItemsBreakdown = {
  required: number;
  available: number;
  name: string;
  unit: InventoryItemUnitSchema;
  inventoryItemId: IdSchema;
};

export const useStockConfig = () => {
  const getStatus = (
    stock: number,
    unit: InventoryItemUnitSchema
  ): StockStatus => {
    const status = stockStatusByUnitMap[unit];

    if (stock >= status.in) {
      return "in";
    } else if (stock >= status.low) {
      return "low";
    }
    return "out";
  };

  const getMaxServings = (recipeItems: RecipeItemWithInventoryItemDto[]) => {
    let missingItemsCount: number = 0;
    let maxServingsCount: number = Infinity;
    const recipeItemsBreakdown: RecipeItemsBreakdown[] = [];

    for (const recipeItem of recipeItems) {
      const required = recipeItem.quantity;
      const available = recipeItem.inventoryItem.quantity;

      recipeItemsBreakdown.push({
        required,
        available,
        name: recipeItem.inventoryItem.name,
        unit: recipeItem.inventoryItem.unit,
        inventoryItemId: recipeItem.inventoryItemId,
      });

      if (required > available) {
        missingItemsCount++;
      }

      const possibleServings = Math.floor(available / required);

      if (possibleServings < maxServingsCount) {
        maxServingsCount = possibleServings;
      }
    }

    return {
      missingItemsCount,
      maxServingsCount,
      recipeItemsBreakdown,
    };
  };

  return {
    getStatus,
    getMaxServings,
  };
};
