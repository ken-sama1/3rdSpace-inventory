import CreateProductModal from "@/features/products/CreateProductModal";
import ProductsTable from "@/features/products/ProductsTable";
import { ListFilter, PlusCircle } from "lucide-react";
import { useState } from "react";

const Products = () => {
  const [showCreateProductModal, setShowProductModal] =
    useState<boolean>(false);

  return (
    <main className="w-full min-h-full h-auto flex flex-col bg-(--primary) pt-2 p-2">
      {/* Idk the top section? */}
      <div className="mt-3 h-7! w-full flex justify-between align-center gap-2">
        {/* Search Bar & Filter */}
        <div className="flex gap-2">
          <input
            type="search"
            className="text-xs! rounded-sm! w-50! h-full! py-0!"
            placeholder="Search products..."
          />

          <button
            title="Filter"
            className="button-accent h-full! rounded-sm! flex justify-center items-center gap-1 text-white! stroke-white!"
          >
            <ListFilter className="stroke-2 h-5 stroke-inherit!" />
            <span className="flex justify-center items-center text-xs! text-inherit!">
              Filter
            </span>
          </button>
        </div>

        {/* Add new item */}
        <button
          onClick={() => setShowProductModal(true)}
          title="Add Item"
          className="button-accent h-full! rounded-sm! flex justify-center items-center gap-1 text-white! stroke-white!"
        >
          <PlusCircle className="stroke-2 h-5 stroke-inherit!" />
          <span className="flex justify-center items-center text-xs! text-inherit!">
            Add
          </span>
        </button>
      </div>
      {/* End of idk the top section? */}

      {/* Literally just a line */}
      <div className="divider"></div>

      <section className="w-full h-[65dvh] flex gap-6 overflow-auto">
        <ProductsTable />
      </section>

      <CreateProductModal
        isOpen={showCreateProductModal}
        onClose={() => setShowProductModal(false)}
      />
    </main>
  );
};

export default Products;
