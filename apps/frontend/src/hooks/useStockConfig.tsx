import type {
  InventoryItemUnit,
  RecipeItemWithInventoryItemDto,
} from "@repo/shared";

const stockStatusByUnitMap: Record<
  InventoryItemUnit,
  {
    // Minimum that is considered low stock
    low: number;
    // Minumum that is considered in stock
    in: number;
    // Minumum that is considered out pf stock
    out: number;
  }
> = {
  G: {
    in: 1000,
    low: 1,
    out: 0,
  },
  KG: {
    out: 0,
    in: 1,
    low: 0.1,
  },
  MG: {
    out: 0,
    low: 1000,
    in: 1001,
  },
  ML: {
    out: 0,
    low: 1,
    in: 100,
  },
  PCS: {
    out: 0,
    low: 10,
    in: 11,
  },
};

type StockStatus = "low" | "out" | "in";

type RecipeItemsBreakdown = {
  required: number;
  available: number;
  name: string;
  unit: InventoryItemUnit;
};

const useStockConfig = () => {
  const getStatus = (stock: number, unit: InventoryItemUnit): StockStatus => {
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

export default useStockConfig;
