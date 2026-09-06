import type { CategoryTypeEnum } from "@/features/categories/const";
import { useGetInventoryItemCategories } from "@/hooks/categories/useGetInventoryItemCategories";
import { useGetProductCategories } from "@/hooks/categories/useGetProductCategories";
import type { IdSchema } from "@repo/shared";
import { useEffect, useState, type FC } from "react";

export interface SelectCategorySelectedCategory {
  id: IdSchema;
  name: string;
}

interface SelectCategoryProps {
  type: CategoryTypeEnum;
  onChange?: (selectedCategory: SelectCategorySelectedCategory | null) => void;
  initialValue?: SelectCategorySelectedCategory | null;
}

const SelectCategory: FC<SelectCategoryProps> = ({
  onChange,
  type,
  initialValue = null,
}) => {
  const { data: categories } =
    type === "item"
      ? useGetInventoryItemCategories()
      : useGetProductCategories();
  const [selectedCategory, setSelectedCategory] =
    useState<SelectCategorySelectedCategory | null>(initialValue);

  useEffect(() => {
    if (onChange) onChange(selectedCategory);
  }, [categories, onChange]);

  return (
    <select
      value={selectedCategory?.id}
      name={`${type}-category`}
      className="h-7! rounded-md! text-xs!"
      onChange={(e) => {
        const category = categories?.find((d) => e.target.value === d.id);
        setSelectedCategory(category ?? null);
      }}
    >
      <option className="hidden"></option>
      {categories &&
        categories.map((category) => {
          return (
            <option key={`select-${type}-${category.id}`} value={category.id}>
              {category.name}
            </option>
          );
        })}
    </select>
  );
};

export default SelectCategory;
