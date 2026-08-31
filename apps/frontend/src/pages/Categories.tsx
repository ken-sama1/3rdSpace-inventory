import CreateCategoryModal from "@/features/categories/CreateCategoryModal";
import InventoryItemCategoriesTable from "@/features/categories/InventoryItemCategoriesTable";
import ProductCategoriesTable from "@/features/categories/ProductCategoriesTable";
import useGetInventoryItemCategories from "@/hooks/categories/useGetInventoryItemCategories";
import useGetProductCategories from "@/hooks/categories/useGetProductCategories";
import { FolderPlus, ListFilter } from "lucide-react";
import { useState } from "react";

const Categories = () => {
  const [view, setView] = useState<"items" | "products">("items");
  const [showCreateCategory, setShowCreateCategory] = useState<boolean>(false);

  const { data: itemsCategories } = useGetInventoryItemCategories();
  const { data: productCategories } = useGetProductCategories();

  return (
    <main className="w-full min-h-full h-auto flex flex-col bg-(--primary) pt-2 p-2">
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
        <div className="w-full flex gap-2 justify-start items-center">
          <button
            onClick={() => {
              setView("items");
            }}
            disabled={view === "items"}
            style={{
              ...(view === "items" && {
                backgroundColor: "var(--accent)",
              }),
            }}
            className="button-outlined w-1/5"
          >
            Items
          </button>
          <button
            onClick={() => {
              setView("products");
            }}
            disabled={view === "products"}
            style={{
              ...(view === "products" && {
                backgroundColor: "var(--accent)",
              }),
            }}
            className="button-outlined w-1/5"
          >
            Products
          </button>
        </div>

        <div className="size-full">
          {view === "products" && productCategories && (
            <ProductCategoriesTable />
          )}
          {view === "items" && itemsCategories && (
            <InventoryItemCategoriesTable categories={itemsCategories} />
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
