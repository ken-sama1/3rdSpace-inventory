import type { FC } from "react";
import { Check, PackageX } from "lucide-react";

export interface ProductAvailabilityItem {
  id: string;
  name: string;
  available: boolean;
  missingCount?: number;
}

interface ProductAvailabilityProps {
  products: ProductAvailabilityItem[];
}

const ProductAvailability: FC<ProductAvailabilityProps> = ({ products }) => {
  return (
    <section className="border border-(--line) rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Product Availability</h3>

        <span className="text-xs text-(--text-muted)">
          {products.length} products
        </span>
      </div>

      <div className="flex flex-col">
        {products.map((product) => (
          <div
            key={product.id}
            className="
              flex items-center justify-between
              py-2
              border-b border-(--line)
            "
          >
            <span className="text-sm!">{product.name}</span>

            {product.available ? (
              <span className="flex items-center gap-1 text-xs text-(--text-success)!">
                <Check className="size-4" />
                Available
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs! text-(--text-danger)!">
                <PackageX className="size-4" />
                Missing Items ({product.missingCount ?? 0})
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductAvailability;
