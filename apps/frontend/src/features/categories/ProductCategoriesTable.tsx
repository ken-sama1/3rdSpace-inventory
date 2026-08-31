import Table from "@/components/ui/Table";
import type { ProductCategoryWithProductsDto } from "@repo/shared";
import type { FC } from "react";

interface ProductCategoriesTableProps {
  categories: ProductCategoryWithProductsDto[];
}

const ProductCategoriesTable: FC<ProductCategoriesTableProps> = ({
  categories,
}) => {
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
    </div>
  );
};

export default ProductCategoriesTable;
