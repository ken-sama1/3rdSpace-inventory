import { sortOrder, type SortOrderSchema } from "@repo/shared";
import { useEffect, useState, type FC } from "react";

interface SelectSortOrderProps {
  onChange?: (order: SortOrderSchema) => void;
  initialOrder?: SortOrderSchema;
}

const SelectSortOrder: FC<SelectSortOrderProps> = ({
  onChange,
  initialOrder = "asc",
}) => {
  const [order, setOrder] = useState<SortOrderSchema>(initialOrder);

  useEffect(() => {
    if (!onChange) return;

    onChange(order);
  }, [onChange, order]);

  return (
    <>
      <select
        value={order}
        onChange={(e) => {
          setOrder(e.target.value as typeof order);
        }}
        className="text-center! py-1!"
      >
        {sortOrder.map((field) => {
          return (
            <option key={field} value={field}>
              {field}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default SelectSortOrder;
