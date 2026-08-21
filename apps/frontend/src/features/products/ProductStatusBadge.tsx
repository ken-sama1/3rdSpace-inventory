import { type FC } from "react";

export interface ProductStatusBadgeProps {
  maxServings: number;
  missingItems?: number;
}

const ProductStatusBadge: FC<ProductStatusBadgeProps> = ({
  maxServings,
  missingItems = 0,
}) => {
  const variant =
    maxServings <= 0
      ? "status-danger"
      : maxServings <= 5
        ? "status-warning"
        : "status-success";

  return (
    <div className={`${variant} border rounded-md text-sm!`}>
      {maxServings <= 0 && `Missing Items (${missingItems})`}
      {maxServings >= 1 && `Max Servings (${maxServings})`}
    </div>
  );
};

export default ProductStatusBadge;
