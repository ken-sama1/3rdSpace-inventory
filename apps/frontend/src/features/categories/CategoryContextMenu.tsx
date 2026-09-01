import Collapsible from "@/components/ui/Collapsible";
import { EllipsisVertical } from "lucide-react";
import { useRef, useState } from "react";

const CategoryContextMenu = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        type="button"
        className="absolute nice-hover nice-transition p-1 rounded-md cursor-pointer top-1/2 -translate-y-1/2 right-5"
      >
        <EllipsisVertical className="size-5" color="var(--text-muted)" />
      </button>

      <div className="absolute z-2 top-full right-5 size-fit">
        <Collapsible
          refs={[buttonRef]}
          onClose={() => setIsOpen(false)}
          isOpen={isOpen}
        >
          <div className="w-30 grid">
            <button className="text-sm nice-hover nice-transition">
              Rename
            </button>
            <button className="text-sm nice-hover nice-transition">
              Delete
            </button>
          </div>
        </Collapsible>
      </div>
    </>
  );
};

export default CategoryContextMenu;
