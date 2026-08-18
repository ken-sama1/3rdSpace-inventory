import Table from "@/components/ui/Table";
import useGetProducts from "@/hooks/products/useGetProducts";
import useStockConfig from "@/hooks/useStockConfig";
import { useState } from "react";
import ProductDetailModal from "./ProductDetailModal";
import ProductStatusBadge from "./ProductStatusBadge";

const ProductsTable = () => {
  const { data } = useGetProducts();
  const { getMaxServings } = useStockConfig();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [productId, setProductId] = useState<string | null>(null);

  return (
    <section className="w-full ">
      {data && data.length > 0 && (
        <Table
          data={data}
          options={{
            row: {
              onClick: (v) => {
                setProductId(v.id);
                setShowModal(true);
              },
              style: {
                cursor: "pointer",
              },
              element: (rowData) => {
                const { maxServingsCount, missingItemsCount } = getMaxServings(
                  rowData.recipeItems
                );

                return (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <ProductStatusBadge
                      maxServings={maxServingsCount}
                      missingItems={missingItemsCount}
                    />
                  </div>
                );
              },
            },
            column: {
              name: {
                index: 0,
                colspan: 3,
              },
              price: {
                index: 1,
                colspan: 1,
              },
              description: {
                index: 2,
                colspan: 3,
              },
              category: {
                colspan: 2,
                value: (v) => {
                  return v ? v : "Uncategorized";
                },
              },
            },
            columns: 7,
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
