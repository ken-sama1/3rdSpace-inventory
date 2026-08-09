import { ImageOffIcon, ShoppingBagIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { FC } from "react";

const statusMap: Record<string, { label: string; class: string }> = {
  "out-of-stock": {
    label: "Out of Stock",
    class: "status-danger",
  },
  "in-stock": {
    label: "In Stock",
    class: "status-success",
  },
  "low-stock": {
    label: "Low Stock",
    class: "status-warning",
  },
};

interface ProductCardProps {
  name?: string;
  category?: string;
  price?: number;
  status?: "in-stock" | "out-of-stock" | "low-stock";
  imageUrl?: string | null;
}

const ProductCard: FC<ProductCardProps> = ({
  name = "Product Name",
  category = "",
  status = "out-of-stock",
  imageUrl = null,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
        w-full max-w-xs
        "
      >
        <div
          className="
          group relative flex flex-col bg-(--primary) p-4  
          overflow-hidden rounded-2xl shadow-[2px_2px_8px_0]
          shadow-black/10 nice-transition hover:border-(--accent)/60
          hover:shadow-lg border-2 border-(--line)/60
          "
        >
          {/* Image Container */}
          <div
            className="
            relative aspect-square h-full min-h-50 p-2 
            overflow-hidden rounded-xl border
            border-(--line)/40 bg-(--disabled)/20"
          >
            {imageUrl ? (
              <img
                loading="lazy"
                src={imageUrl}
                alt={name}
                className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-(--text-disabled)">
                <ImageOffIcon strokeWidth={1.5} className="size-8" />
              </div>
            )}
            <span
              className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px]! font-semibold! tracking-wide backdrop-blur-md ${statusMap[status].class}`}
            >
              {statusMap[status].label ?? ""}
            </span>
          </div>

          {/* Details  */}
          <div className="mt-3 flex flex-col gap-1">
            <span className="text-[11px]! font-medium uppercase tracking-wider text-(--text-disabled)!">
              {category}
            </span>
            <h3 className="line-clamp-1 text-sm!">{name}</h3>
          </div>

          <div className="divider my-3!"></div>

          {/* Footer  */}
          <div className="flex items-center justify-end">
            {/* <div className="flex flex-col"> */}
            {/*   <span className="text-[10px]! text-(--text-disabled)! "> */}
            {/*     Price */}
            {/*   </span> */}
            {/**/}
            {/*   <span className="text-base! font-bold! text-(--heading)!"> */}
            {/*     {price} */}
            {/*   </span> */}
            {/* </div> */}

            <button
              type="button"
              className="button-accent flex h-8 items-center gap-1.5 rounded-lg! px-3! text-xs! font-medium!"
            >
              <ShoppingBagIcon className="size-3.5" />
              <span>Purchase</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductCard;
