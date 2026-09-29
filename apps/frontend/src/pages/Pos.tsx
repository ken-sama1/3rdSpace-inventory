import { useGetProductCategories } from "@/hooks/categories/useGetProductCategories";
import { useGetProducts } from "@/hooks/products/useGetProducts";
import { useStockConfig } from "@/hooks/useStockConfig";
import { useDeductStockForProduct } from "@/features/products/hooks/useDeductStockForProduct";
import { useToast } from "@/context/ToastContext";
import type { ProductWithInventoryItemsDto } from "@repo/shared";
import {
  Check,
  ChevronDown,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { isAxiosError } from "axios";

interface CartItem {
  product: ProductWithInventoryItemsDto;
  quantity: number;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "PHP",
});

const Pos = () => {
  const { data: products = [], isLoading } = useGetProducts();
  const { data: categories = [] } = useGetProductCategories();
  const { getMaxServings } = useStockConfig();
  const { deduct } = useDeductStockForProduct();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const availableProducts = useMemo(
    () =>
      products.map((product) => ({
        product,
        maxServings: getMaxServings(product.recipeItems).maxServingsCount,
      })),
    [getMaxServings, products]
  );

  const filteredProducts = availableProducts.filter(({ product }) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryId === "all" || product.categoryId === categoryId;

    return matchesSearch && matchesCategory;
  });

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: ProductWithInventoryItemsDto, max: number) => {
    if (max <= 0) {
      showToast({ variant: "warning", message: "This product is unavailable" });
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (!existing) return [...current, { product, quantity: 1 }];
      if (existing.quantity >= max) return current;

      return current.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((current) =>
        current.filter((item) => item.product.id !== productId)
      );
      return;
    }

    const max = availableProducts.find(
      ({ product }) => product.id === productId
    )?.maxServings;
    if (max !== undefined && quantity > max) return;

    setCart((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const checkout = async () => {
    if (!cart.length || isCheckingOut) return;

    setIsCheckingOut(true);
    try {
      for (const item of cart) {
        await deduct({
          id: item.product.id,
          data: {
            quantity: item.quantity,
            recipeItems: item.product.recipeItems.map(
              ({ inventoryItemId, quantity }) => ({
                inventoryItemId,
                quantity,
              })
            ),
          },
        });
      }

      setCart([]);
      showToast({
        variant: "success",
        message: `Sale completed for ${currency.format(total)}`,
      });
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data.message
        : undefined;
      showToast({
        variant: "danger",
        message: message ?? "Unable to complete the sale",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="min-h-full bg-(--primary) p-3">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl!">Point of Sale</h2>
          <p className="text-xs! text-(--text-muted)!">
            Select products and complete a sale
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-(--line) px-3 py-2">
          <ShoppingCart className="size-4 text-(--accent)" />
          <span className="text-sm!">{itemCount} items</span>
        </div>
      </div>

      <div className="grid min-h-[calc(100dvh-170px)] grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0 rounded-md border border-(--line) p-3">
          <div className="mb-3 flex flex-wrap gap-2">
            <label className="relative min-w-56 flex-1">
              <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-(--text-muted)" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                className="h-9! w-full rounded-md! pl-8!"
              />
            </label>
            <label className="relative">
              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="h-9! min-w-44 appearance-none rounded-md! pr-8!"
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2" />
            </label>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-sm text-(--text-muted)">
              Loading products...
            </div>
          ) : filteredProducts.length ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {filteredProducts.map(({ product, maxServings }) => {
                const inCart =
                  cart.find((item) => item.product.id === product.id)
                    ?.quantity ?? 0;
                const available = maxServings > 0;

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-xl border border-(--line) bg-(--primary) p-3 shadow-[2px_2px_8px_0] shadow-black/10"
                  >
                    <div className="flex gap-3">
                      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-(--line) bg-(--muted)/20">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="size-full object-contain"
                          />
                        ) : (
                          <ShoppingCart className="size-6 text-(--text-muted)" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-sm!">{product.name}</h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px]! ${available ? "status-success" : "status-danger"}`}
                          >
                            {available ? `${maxServings} available` : "Unavailable"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs! text-(--text-muted)!">
                          {product.category?.name ?? "Uncategorized"}
                        </p>
                        <p className="mt-2 font-semibold text-(--heading)!">
                          {currency.format(product.price)}
                        </p>
                      </div>
                    </div>
                    <button
                      disabled={!available || inCart >= maxServings}
                      onClick={() => addToCart(product, maxServings)}
                      className={`mt-3 flex h-8! w-full items-center justify-center gap-1 rounded-md! text-xs! ${available ? "button-accent" : "button-muted"}`}
                    >
                      <Plus className="size-3.5" />
                      {inCart ? `Add another (${inCart} in cart)` : "Add to cart"}
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-(--text-muted)">
              No products match your search.
            </div>
          )}
        </section>

        <aside className="flex flex-col rounded-md border border-(--line) p-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base!">Current sale</h3>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs! text-(--text-danger)! hover:text-(--accent)!"
              >
                Clear
              </button>
            )}
          </div>
          <div className="divider my-3!" />

          <div className="min-h-0 flex-1 overflow-auto">
            {cart.length ? (
              <div className="flex flex-col gap-3">
                {cart.map((item) => {
                  const max =
                    availableProducts.find(
                      ({ product }) => product.id === item.product.id
                    )?.maxServings ?? item.quantity;

                  return (
                    <div
                      key={item.product.id}
                      className="rounded-md border border-(--line) p-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm!">{item.product.name}</p>
                          <p className="text-xs! text-(--text-muted)!">
                            {currency.format(item.product.price)} each
                          </p>
                        </div>
                        <button
                          title="Remove item"
                          onClick={() => updateQuantity(item.product.id, 0)}
                          className="text-(--text-muted) hover:text-(--text-danger)"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className="flex size-7 items-center justify-center rounded-md border border-(--line)"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm!">
                            {item.quantity}
                          </span>
                          <button
                            disabled={item.quantity >= max}
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            className="flex size-7 items-center justify-center rounded-md border border-(--line) disabled:opacity-40"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="font-semibold text-(--heading)!">
                          {currency.format(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full min-h-48 flex-col items-center justify-center gap-2 text-center">
                <ShoppingCart className="size-8 text-(--text-muted)" />
                <p className="text-sm!">Your cart is empty</p>
                <span className="text-xs! text-(--text-muted)!">
                  Add a product to start a sale.
                </span>
              </div>
            )}
          </div>

          <div className="divider my-3!" />
          <div className="flex items-center justify-between">
            <span className="text-sm! text-(--text-muted)!">Total</span>
            <span className="text-2xl! font-bold! text-(--heading)!">
              {currency.format(total)}
            </span>
          </div>
          <button
            disabled={!cart.length || isCheckingOut}
            onClick={checkout}
            className={`mt-3 flex h-10! w-full items-center justify-center gap-2 rounded-md! ${cart.length ? "button-accent" : "button-muted"}`}
          >
            {isCheckingOut ? (
              "Processing..."
            ) : (
              <>
                <Check className="size-4" />
                Complete sale
              </>
            )}
          </button>
        </aside>
      </div>
    </main>
  );
};

export default Pos;
