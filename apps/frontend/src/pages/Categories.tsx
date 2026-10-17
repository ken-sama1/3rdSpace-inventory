import type { CategoryTypeEnum } from "@/features/categories/constants";
import CreateCategoryModal from "@/features/categories/CreateCategoryModal";
import CategoryTableSkeleton from "@/features/categories/CategoryTableSkeleton";
import InventoryItemCategoriesTable from "@/features/categories/InventoryItemCategoriesTable";
import ProductCategoriesTable from "@/features/categories/ProductCategoriesTable";
import { useGetInventoryItemCategories } from "@/hooks/categories/queries/useGetInventoryItemCategories";
import { useGetProductCategories } from "@/hooks/categories/queries/useGetProductCategories";
import { getApiErrorMessage } from "@/utils/api-error-message.util";
import { FolderPlus } from "lucide-react";
import { useState } from "react";

const categoryTabs = [
  { key: "item", label: "Item" },
  { key: "product", label: "Products" },
] as const;

const Categories = () => {
  const [view, setView] = useState<CategoryTypeEnum>("item");
  const [showCreateCategory, setShowCreateCategory] = useState<boolean>(false);

  const {
    data: itemCategories,
    isLoading: isItemCategoriesLoading,
    isError: isItemCategoriesError,
    error: itemCategoriesError,
  } = useGetInventoryItemCategories();
  const {
    data: productCategories,
    isLoading: isProductCategoriesLoading,
    isError: isProductCategoriesError,
    error: productCategoriesError,
  } = useGetProductCategories();

  return (
    <main className="w-full min-h-full h-auto flex flex-col bg-(--primary) p-2">
      {/* Idk the top section? */}
      <div className="mt-3 flex min-h-8 w-full flex-wrap items-center justify-between gap-2">
        {/* Search Bar & Filter */}
        <div className="relative flex min-w-0 flex-1 gap-2 sm:flex-none">
          <input
            type="search"
            className="h-8! min-w-0 flex-1 rounded-sm! py-0! text-xs! sm:w-50! sm:flex-none"
            placeholder="Search categories..."
          />

          {/* <button */}
          {/*   title="Filter" */}
          {/*   className="button-accent h-full! rounded-sm! flex justify-center items-center gap-1 text-white! stroke-white!" */}
          {/* > */}
          {/*   <SlidersHorizontal className="stroke-2 h-5 stroke-inherit!" /> */}
          {/* </button> */}
        </div>

        {/* Add new item */}
        <button
          onClick={() => {
            setShowCreateCategory(true);
          }}
          title="New Category"
          className="button-accent h-8! shrink-0 rounded-sm! flex justify-center items-center gap-1 text-white! stroke-white!"
        >
          <FolderPlus className="stroke-2 h-5 stroke-inherit!" />
        </button>
      </div>
      {/* End of idk the top section? */}

      {/* Literally just a line */}
      <div className="divider"></div>

      <section className="flex h-[65dvh] w-full flex-col gap-4 overflow-auto p-1 sm:gap-6">
        <div className="flex w-full shrink-0 border-b border-(--line) space-x-1">
          {categoryTabs.map(({ key, label }) => {
            return (
              <button
                key={`category-tab-${key}`}
                type="button"
                onClick={() => {
                  setView(key);
                }}
                className={`cursor-pointer rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium transition-colors sm:px-5 ${
                  view === key
                    ? "border-(--accent)! bg-(--bg-info)"
                    : "border-transparent nice-hover"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 w-full flex-1 overflow-auto">
          {view === "item" ? (
            isItemCategoriesLoading ? (
              <CategoryTableSkeleton />
            ) : isItemCategoriesError ? (
              <p className="py-8 text-center text-sm text-(--text-danger)!">
                {getApiErrorMessage(itemCategoriesError)}
              </p>
            ) : (
              itemCategories && (
                <InventoryItemCategoriesTable categories={itemCategories} />
              )
            )
          ) : isProductCategoriesLoading ? (
            <CategoryTableSkeleton />
          ) : isProductCategoriesError ? (
            <p className="py-8 text-center text-sm text-(--text-danger)!">
              {getApiErrorMessage(productCategoriesError)}
            </p>
          ) : (
            productCategories && (
              <ProductCategoriesTable categories={productCategories} />
            )
          )}
        </div>
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
