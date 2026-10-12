import Modal from "@/components/ui/Modal";
import type { UserDto, UserRoleSchema } from "@repo/shared";
import type { FC } from "react";

interface UserModalProps {
  user: UserDto | null;
  isOpen: boolean;
  nextRole: UserRoleSchema | null;
  onChangeRole: (role: UserRoleSchema) => void;
  onClose: () => void;
}

const createdAtFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

const UserModal: FC<UserModalProps> = ({
  user,
  isOpen,
  nextRole,
  onChangeRole,
  onClose,
}) => {
  if (!user) return null;

  const actionLabel =
    nextRole === "MANAGER" ? "Promote to manager" : "Demote to staff";

  return (
    <Modal title={user.username} isOpen={isOpen} onClose={onClose}>
      <div className="w-lg max-w-full">
        <dl className="grid grid-cols-2 gap-4 rounded-md border border-(--line) p-4">
          <div>
            <dt className="text-xs! font-semibold! uppercase tracking-wide text-(--text-muted)!">
              Username
            </dt>
            <dd className="mt-1 truncate text-sm!">{user.username}</dd>
          </div>
          <div>
            <dt className="text-xs! font-semibold! uppercase tracking-wide text-(--text-muted)!">
              Role
            </dt>
            <dd className="mt-1 text-sm!">{user.role}</dd>
          </div>
          <div className="col-span-2 border-t border-(--line) pt-3">
            <dt className="text-xs! font-semibold! uppercase tracking-wide text-(--text-muted)!">
              Account created
            </dt>
            <dd className="mt-1 text-sm!">
              {createdAtFormatter.format(new Date(user.createdAt))}
            </dd>
          </div>
        </dl>

        {nextRole && (
          <div className="mt-4">
            <p className="text-xs! text-(--text-muted)!">
              Role changes are local to this view until the promote/demote
              endpoint is connected.
            </p>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onChangeRole(nextRole);
                }}
                className={
                  nextRole === "MANAGER"
                    ? "button-accent py-1!"
                    : "button-outlined py-1!"
                }
              >
                {actionLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UserModal;
