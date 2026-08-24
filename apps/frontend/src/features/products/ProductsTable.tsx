import Table from "@/components/ui/Table";
import useStockConfig from "@/hooks/useStockConfig";
import type { ProductWithInventoryItemsDto } from "@repo/shared";
import { useState, type FC } from "react";
import ProductDetailModal from "./ProductModal";
import ProductStatusBadge from "./ProductStatusBadge";

interface ProductsTableProps {
  products: ProductWithInventoryItemsDto[];
}

const ProductsTable: FC<ProductsTableProps> = ({ products }) => {
  const { getMaxServings } = useStockConfig();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productId, setProductId] = useState<string | null>(null);

  return (
    <section className="w-full ">
      {products && products.length > 0 && (
        <Table
          data={products}
          options={{
            row: {
              onClick: (v) => {
                setProductId(v.id);
                setShowModal(true);
              },
              style: {
                cursor: "pointer",
              },
              element: (rowproducts) => {
                const { maxServingsCount, missingItemsCount } = getMaxServings(
                  rowproducts.recipeItems
                );

                return (
                  <>
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                      <ProductStatusBadge
                        maxServings={maxServingsCount}
                        missingItems={missingItemsCount}
                      />
                    </div>
                  </>
                );
              },
            },
            column: {
              name: {
                index: 0,
                colspan: 3,
              },
              price: {
                index: 2,
                colspan: 1,
              },
              category: {
                colspan: 4,
                value: (v) => {
                  return v ? v : "Uncategorized";
                },
              },
            },
            columns: 10,
            exlude: ["id", "recipeItems", "imageUrl", "description"],
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
