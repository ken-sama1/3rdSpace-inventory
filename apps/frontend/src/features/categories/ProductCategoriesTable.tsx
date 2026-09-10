import Table from "@/components/ui/Table";
import type { ProductCategoryWithProductsDto } from "@repo/shared";
import { useState, type FC } from "react";
import CategoryContextMenu from "./CategoryContextMenu";
import CategoryModal from "./CategoryModal";

interface ProductCategoriesTableProps {
  categories: ProductCategoryWithProductsDto[];
}

const ProductCategoriesTable: FC<ProductCategoriesTableProps> = ({
  categories,
}) => {
  const [category, setCategory] =
    useState<null | ProductCategoryWithProductsDto>(null);
  const [showProductModal, setShowProductModal] = useState<boolean>(false);

  return (
    <div className="size-full">
      <Table
        data={categories.map((category) => {
          return {
            ...category,
          };
        })}
        options={{
          row: {
            style: {
              cursor: "pointer",
            },
            onClick: (v) => {
              setCategory(v);
              setShowProductModal(true);
            },
            element: ({ id, name }) => {
              return (
                <CategoryContextMenu
                  type="product"
                  name={name}
                  categoryId={id}
                />
              );
            },
          },
          columns: 9,
          column: {
            name: {
              as: "Category",
              index: 0,
              colspan: 3,
            },
            products: {
              index: 1,
              colspan: 3,
              as: "products",
              value: (items) => {
                return <span>{items.length}</span>;
              },
            },
          },
          exlude: ["id"],
        }}
      />

      {category && (
        <CategoryModal
          type="product"
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
          categoryId={category.id}
        />
      )}
    </div>
  );
};

export default ProductCategoriesTable;
