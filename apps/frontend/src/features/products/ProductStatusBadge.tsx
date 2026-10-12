import { type FC } from "react";

interface ProductStatusBadgeProps {
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
      {maxServings <= 0 && `Missing Items (${String(missingItems)})`}
      {maxServings >= 1 && `Max Servings (${String(maxServings)})`}
    </div>
  );
};

export default ProductStatusBadge;
