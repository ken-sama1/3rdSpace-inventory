import Table from "@/components/ui/Table";
import { useStockConfig } from "@/hooks/useStockConfig";
import type { IdSchema, ProductWithInventoryItemsDto } from "@repo/shared";
import { useState, type FC } from "react";
import ProductDetailModal from "./ProductModal";
import ProductStatusBadge from "./ProductStatusBadge";

interface ProductsTableProps {
  products: ProductWithInventoryItemsDto[];
}

const ProductsTable: FC<ProductsTableProps> = ({ products }) => {
  const { getMaxServings } = useStockConfig();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productId, setProductId] = useState<IdSchema | null>(null);

  return (
    <section className="w-full">
      {products && products.length > 0 && (
        <Table
          data={products.map((product) => {
            const { maxServingsCount, missingItemsCount } = getMaxServings(
              product.recipeItems
            );
            return {
              ...product,
              status: {
                maxServingsCount,
                missingItemsCount,
              },
            };
          })}
          options={{
            row: {
              onClick: (v) => {
                setProductId(v.id);
                setShowModal(true);
              },
              style: {
                cursor: "pointer",
              },
            },
            column: {
              name: {
                index: 0,
                colspan: 3,
                as: "PRODUCT",
              },
              price: {
                index: 1,
                colspan: 3,
              },
              category: {
                colspan: 3,
                value: (v) => {
                  return v ? v.name : "Uncategorized";
                },
              },
              status: {
                colspan: 3,
                value: ({ maxServingsCount, missingItemsCount }) => {
                  return (
                    <ProductStatusBadge
                      maxServings={maxServingsCount}
                      missingItems={missingItemsCount}
                    />
                  );
                },
              },
            },
            columns: 12,
            exlude: [
              "id",
              "categoryId",
              "recipeItems",
              "imageUrl",
              "description",
            ],
          }}
        />
      )}

      {productId && (
        <ProductDetailModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          productId={productId}
        />
      )}
    </section>
  );
};

export default ProductsTable;
