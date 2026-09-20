import type { CategoryTypeEnum } from "@/features/categories/constants";
import CreateCategoryModal from "@/features/categories/CreateCategoryModal";
import InventoryItemCategoriesTable from "@/features/categories/InventoryItemCategoriesTable";
import ProductCategoriesTable from "@/features/categories/ProductCategoriesTable";
import { useGetInventoryItemCategories } from "@/hooks/categories/useGetInventoryItemCategories";
import { useGetProductCategories } from "@/hooks/categories/useGetProductCategories";
import { FolderPlus, ListFilter } from "lucide-react";
import { useState } from "react";

const Categories = () => {
  const [view, setView] = useState<CategoryTypeEnum>("item");
  const [showCreateCategory, setShowCreateCategory] = useState<boolean>(false);

  const { data: itemCategories } = useGetInventoryItemCategories();
  const { data: productCategories } = useGetProductCategories();

  const tabs = {
    item: {
      label: "Item",
      element: itemCategories && (
        <InventoryItemCategoriesTable categories={itemCategories} />
      ),
    },
    product: {
      label: "Products",
      element: productCategories && (
        <ProductCategoriesTable categories={productCategories} />
      ),
    },
  } as const;

  return (
    <main className="w-full min-h-full h-auto flex flex-col bg-(--primary) p-2">
      {/* Idk the top section? */}
      <div className="mt-3 h-7! w-full flex justify-between align-center gap-2">
        {/* Search Bar & Filter */}
        <div className="flex gap-2 relative">
          <input
            type="search"
            className="text-xs! rounded-sm! w-50! h-full! py-0!"
            placeholder="Search categories..."
          />

          <button
            title="Filter"
            className="button-accent h-full! rounded-sm! flex justify-center items-center gap-1 text-white! stroke-white!"
          >
            <ListFilter className="stroke-2 h-5 stroke-inherit!" />
          </button>
        </div>

        {/* Add new item */}
        <button
          onClick={() => {
            setShowCreateCategory(true);
          }}
          title="New Category"
          className="button-accent h-full! rounded-sm! flex justify-center items-center gap-1 text-white! stroke-white!"
        >
          <FolderPlus className="stroke-2 h-5 stroke-inherit!" />
        </button>
      </div>
      {/* End of idk the top section? */}

      {/* Literally just a line */}
      <div className="divider"></div>

      <section className="w-full h-[65dvh] flex flex-col gap-6">
        <div className="w-full flex border-b border-(--line) space-x-1">
          {Object.entries(tabs).map(([k, v]) => {
            return (
              <button
                key={`category-tab-${k}`}
                type="button"
                onClick={() => setView(k as typeof view)}
                className={`px-5 cursor-pointer py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
                  view === k
                    ? "border-(--accent)! bg-(--bg-info)"
                    : "border-transparent nice-hover"
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>

        <div className="size-full">{tabs[view].element}</div>
      </section>

      <CreateCategoryModal
        isOpen={showCreateCategory}
        onClose={() => {
          setShowCreateCategory(false);
        }}
      />
    </main>
  );
};

export default Categories;
