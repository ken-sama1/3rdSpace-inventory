import Collapsible from "@/components/ui/Collapsible";
import { EllipsisVertical } from "lucide-react";
import { useRef, useState, type FC } from "react";
import type { UserRoleSchema } from "@repo/shared";

interface UserContextMenuProps {
  nextRole: UserRoleSchema | null;
  onChangeRole: (role: UserRoleSchema) => void;
}

const UserContextMenu: FC<UserContextMenuProps> = ({
  nextRole,
  onChangeRole,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showMenu, setShowMenu] = useState(false);

  if (!nextRole) return null;

  const actionLabel =
    nextRole === "MANAGER" ? "Promote to manager" : "Demote to staff";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setShowMenu((open) => !open);
        }}
        aria-label="User actions"
        aria-expanded={showMenu}
        className="absolute right-5 top-1/2 z-1 -translate-y-1/2 cursor-pointer rounded-md p-1 nice-hover nice-transition"
      >
        <EllipsisVertical className="size-5 text-(--text-muted)" />
      </button>

      <div className="absolute right-12 top-0 z-2 size-fit">
        <Collapsible
          refs={[buttonRef]}
          onClose={() => {
            setShowMenu(false);
          }}
          isOpen={showMenu}
        >
          <div className="relative grid w-40 p-1">
            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                onChangeRole(nextRole);
              }}
              className="cursor-pointer rounded px-2 py-1 text-left text-sm nice-hover nice-transition"
            >
              {actionLabel}
            </button>
          </div>
        </Collapsible>
      </div>
    </>
  );
};

export default UserContextMenu;
