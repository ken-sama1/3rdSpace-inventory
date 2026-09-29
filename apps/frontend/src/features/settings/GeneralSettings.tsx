import type { InventoryItemUnitSchema } from "@repo/shared";
import { Check, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const defaults: Record<InventoryItemUnitSchema, { low: number; in: number }> = {
  G: { low: 1, in: 500 },
  KG: { low: 0.1, in: 0.5 },
  MG: { low: 1, in: 500 },
  ML: { low: 1, in: 500 },
  PCS: { low: 1, in: 10 },
};

const units: InventoryItemUnitSchema[] = ["G", "KG", "MG", "ML", "PCS"];

const GeneralSettings = () => {
  const [theme, setTheme] = useState<"dark" | "light">(
    localStorage.getItem("theme") === "light" ? "light" : "dark"
  );
  const [thresholds, setThresholds] = useState(defaults);

  useEffect(() => {
    const saved = Object.fromEntries(
      units.flatMap((unit) => {
        const value = localStorage.getItem(unit);
        return value
          ? [[unit, JSON.parse(value) as { low: number; in: number }]]
          : [];
      })
    ) as Partial<typeof defaults>;
    setThresholds({ ...defaults, ...saved });
  }, []);

  const setThemePreference = (nextTheme: "dark" | "light") => {
    setTheme(nextTheme);
    if (nextTheme === "light") {
      document.documentElement.dataset.theme = "light";
      localStorage.setItem("theme", "light");
    } else {
      delete document.documentElement.dataset.theme;
      localStorage.setItem("theme", "dark");
    }
  };

  const saveThreshold = (unit: InventoryItemUnitSchema) => {
    const value = thresholds[unit];
    localStorage.setItem(unit, JSON.stringify({ ...value, out: 0 }));
  };

  return (
    <section className="grid w-full max-w-4xl gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="rounded-md border border-(--line) p-4">
        <div className="mb-4">
          <h4 className="text-base!">Inventory stock status</h4>
          <p className="text-xs! text-(--text-muted)!">
            Set when an item should appear low or sufficiently stocked.
          </p>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-lg">
            <div className="grid grid-cols-12 border-b-2 border-(--line) pb-2 text-[10px]! font-bold! uppercase tracking-wider text-(--text-muted)!">
              <span className="col-span-3">Unit</span>
              <span className="col-span-4">Low stock below</span>
              <span className="col-span-4">In stock from</span>
              <span className="col-span-1" />
            </div>
            {units.map((unit) => (
              <div
                key={unit}
                className="grid grid-cols-12 items-center gap-2 border-b border-(--line) py-3 last:border-0"
              >
                <span className="col-span-3 text-sm! font-semibold!">
                  {unit}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={thresholds[unit].low}
                  onChange={(event) =>
                    setThresholds((current) => ({
                      ...current,
                      [unit]: {
                        ...current[unit],
                        low: Number(event.target.value),
                      },
                    }))
                  }
                  className="col-span-4 h-8! w-full rounded-md!"
                />
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={thresholds[unit].in}
                  onChange={(event) =>
                    setThresholds((current) => ({
                      ...current,
                      [unit]: {
                        ...current[unit],
                        in: Number(event.target.value),
                      },
                    }))
                  }
                  className="col-span-4 h-8! w-full rounded-md!"
                />
                <button
                  title={`Save ${unit} threshold`}
                  onClick={() => saveThreshold(unit)}
                  className="col-span-1 flex justify-center text-(--text-success)"
                >
                  <Check className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-md border border-(--line) p-4">
        <h4 className="text-base!">Appearance</h4>
        <p className="mt-1 text-xs! text-(--text-muted)!">
          Choose how the workspace looks on this device.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => setThemePreference("dark")}
            className={`flex flex-col items-center gap-2 rounded-md border p-3 text-xs! ${theme === "dark" ? "status-info" : "border-(--line)"}`}
          >
            <Moon className="size-5" />
            Dark
          </button>
          <button
            onClick={() => setThemePreference("light")}
            className={`flex flex-col items-center gap-2 rounded-md border p-3 text-xs! ${theme === "light" ? "status-info" : "border-(--line)"}`}
          >
            <Sun className="size-5" />
            Light
          </button>
        </div>
      </div>
    </section>
  );
};

export default GeneralSettings;
