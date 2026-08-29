import { FolderPlus, ListFilter } from "lucide-react";
import { useState } from "react";

const Categories = () => {
  const [view, setView] = useState<"item" | "product">("item");

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
              setView("item");
            }}
            disabled={view === "item"}
            style={{
              ...(view === "item" && {
                backgroundColor: "var(--accent)",
              }),
            }}
            className="button-outlined w-1/5"
          >
            Item
          </button>
          <button
            onClick={() => {
              setView("product");
            }}
            disabled={view === "product"}
            style={{
              ...(view === "product" && {
                backgroundColor: "var(--accent)",
              }),
            }}
            className="button-outlined w-1/5"
          >
            Product
          </button>
        </div>

        <div className="w-full border h-full"></div>
      </section>
    </main>
  );
};

export default Categories;
