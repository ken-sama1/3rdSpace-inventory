import SelectCategory from "@/components/shared/SelectCategory";
import SelectRecipeItemsModal, {
  type SelectRecipeItemsSelectedItem,
} from "@/components/shared/SelectRecipeItemsModal";
import type { ProductWithInventoryItemsDto } from "@repo/shared";
import { useState, type FC, type RefObject, type SubmitEvent } from "react";

interface ProductFormProps {
  onSubmit?: (
    formData: FormData,
    requiredItems: SelectRecipeItemsSelectedItem[]
  ) => void;
  formRef: RefObject<HTMLFormElement | null>;
  product?: ProductWithInventoryItemsDto;
}

const ProductForm: FC<ProductFormProps> = ({ onSubmit, formRef, product }) => {
  const [showSelectRecipeModal, setShowSelectRecipeModal] =
    useState<boolean>(false);
  const [requiredItems, setRequiredItems] = useState<
    SelectRecipeItemsSelectedItem[]
  >(
    product?.recipeItems.map(({ unit, quantity, inventoryItem }) => {
      return {
        id: inventoryItem.id,
        quantity,
        unit,
        name: inventoryItem.name,
      };
    }) ?? []
  );

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) {
      throw new Error("Form reference not found");
    }

    const formData = new FormData(formRef.current);
    if (onSubmit) onSubmit(formData, requiredItems);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="relative size-full flex flex-col gap-5"
      >
        <div className="h-auto grid grid-cols-4 gap-y-2 gap-x-5">
          {/* Name */}
          <div className="grid col-span-2 gap-y-2">
            <label
              htmlFor="product-name"
              className="text-sm! text-(--text-muted)! font-semibold!"
            >
              Name:
            </label>

            <input
              defaultValue={product?.name}
              required
              id="product-name"
              type="text"
              name="product-name"
              className="rounded-md! h-7! text-xs!"
            />
          </div>

          {/* Price */}
          <div className="grid col-span-2 gap-y-2">
            <label
              htmlFor="product-price"
              className="text-sm! text-(--text-muted)! font-semibold!"
            >
              Price:
            </label>

            <input
              defaultValue={product?.price}
              id="product-price"
              type="text"
              name="product-price"
              className="rounded-md! h-7! text-xs!"
            />
          </div>

          {/* Category */}
          <div className="grid col-span-2 gap-y-2">
            <label
              htmlFor="product-category"
              className="text-sm! text-(--text-muted)! font-semibold!"
            >
              Category:
            </label>

            <SelectCategory initialValue={product?.category} type="product" />
          </div>

          {/* Image */}
          <div className="grid col-span-2 gap-y-2">
            <label
              htmlFor="product-image"
              className="text-sm! text-(--text-muted)! font-semibold!"
            >
              Image:
            </label>

            <input
              defaultValue={product?.imageUrl ?? ""}
              id="product-image"
              type="file"
              name="product-image"
              className="rounded-md! h-7! text-xs!"
            />
          </div>

          {/* Recipe Items */}
          <div className="flex flex-col items-start col-span-2 gap-y-2">
            <label
              htmlFor="product-recipe"
              className="text-sm! text-(--text-muted)! font-semibold! w-full"
            >
              Recipe Items:
            </label>

            <button
              onClick={() => {
                setShowSelectRecipeModal(true);
              }}
              type="button"
              className="button-accent rounded-md! h-7! w-full text-xs!"
            >
              {requiredItems.length > 0
                ? `${requiredItems.length} item${
                    requiredItems.length > 1 ? "s" : ""
                  } selected`
                : "Recipe Items"}
            </button>
          </div>

          {/* Description */}
          <div className="grid col-span-2 gap-y-2">
            <label
              htmlFor="product-description"
              className="text-sm! text-(--text-muted)! font-semibold!"
            >
              Description:
            </label>

            <textarea
              rows={4}
              defaultValue={product?.description ?? ""}
              id="product-description"
              name="product-description"
              className="rounded-md! text-auto! text-xs!"
            />
          </div>
        </div>
      </form>

      <SelectRecipeItemsModal
        initialSelectedItems={product?.recipeItems.map(
          ({ quantity, inventoryItem, unit, inventoryItemId }) => {
            return {
              id: inventoryItemId,
              name: inventoryItem.name,
              unit,
              quantity,
            };
          }
        )}
        isOpen={showSelectRecipeModal}
        onClose={() => {
          setShowSelectRecipeModal(false);
        }}
        onSave={(selectedItems) => {
          setShowSelectRecipeModal(false);
          setRequiredItems(selectedItems);
        }}
      />
    </>
  );
};

export default ProductForm;
