import type { FC } from "react";

export interface StockStatusProps {
  variant?: "out" | "low" | "in";
}

const StockStatus: FC<StockStatusProps> = ({ variant = "low" }) => {
  const variantMap: Record<NonNullable<StockStatusProps["variant"]>, string> = {
    low: "status-warning",
    in: "status-success",
    out: "status-danger",
  };
  return (
    <div
      className={`${variantMap[variant]} pe-2.5 py-0.5 border rounded-lg text-sm!`}
    >
      <span className="text-inherit!">
        {variant === "out" && "Out of Stock"}
        {variant === "low" && "Low Stock"}
        {variant === "in" && "In Stock"}
      </span>
    </div>
  );
};

export default StockStatus;
