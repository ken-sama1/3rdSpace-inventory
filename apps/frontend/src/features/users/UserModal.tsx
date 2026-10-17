import AlertBanner from "@/components/ui/AlertBanner";
import Dialog from "@/components/ui/Dialog";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { useDeleteUser } from "@/hooks/users/mutations/useDeleteUser";
import { useUpdateUser } from "@/hooks/users/mutations/useUpdateUser";
import type { UserDto, UserRoleSchema } from "@repo/shared";
import { useState, type FC } from "react";

interface UserModalProps {
  user: UserDto | null;
  isOpen: boolean;
  nextRole: UserRoleSchema | null;
  onClose: () => void;
}

const createdAtFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

const UserModal: FC<UserModalProps> = ({ user, isOpen, nextRole, onClose }) => {
  const { user: currentUser } = useAuth();
  const { update, isPending } = useUpdateUser();
  const { delete: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { showToast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const canDelete =
    currentUser?.role === "ADMIN" &&
    currentUser.id !== user?.id &&
    user?.role !== "ADMIN";

  if (!user) return null;

  const actionLabel =
    nextRole === "MANAGER" ? "Promote to manager" : "Demote to staff";

  const changeRole = async () => {
    if (!nextRole) return;

    try {
      await update({
        id: user.id,
        data: { role: nextRole },
      });
      showToast({
        message: `User role changed to ${nextRole}`,
        variant: "success",
      });
    } catch {
      showToast({
        message: "Unable to change user role",
        variant: "danger",
      });
    }
  };

  return (
    <>
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

          {(nextRole || canDelete) && (
            <div className="mt-4 flex items-end justify-between gap-3">
              {canDelete && (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDelete(true);
                  }}
                  className="button-danger py-1!"
                >
                  Delete user
                </button>
              )}
              {nextRole && (
                <div className="ml-auto">
                  <p className="text-xs! text-(--text-muted)!">
                    Change this user's access level.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => void changeRole()}
                      className={
                        nextRole === "MANAGER"
                          ? "button-accent py-1!"
                          : "button-outlined py-1!"
                      }
                    >
                      {isPending ? "Updating..." : actionLabel}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      <Dialog
        isOpen={confirmDelete}
        onClose={() => {
          setConfirmDelete(false);
        }}
        onConfirm={() => {
          if (isDeleting) return;

          void (async () => {
            try {
              await deleteUser({ id: user.id });
              setConfirmDelete(false);
              onClose();
              showToast({
                message: "User deleted successfully",
                variant: "success",
              });
            } catch (error) {
              console.error(error);
              setConfirmDelete(false);
              showToast({
                message: "Unable to delete user",
                variant: "danger",
              });
            }
          })();
        }}
        title={`Delete ${user.username}?`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        variant="danger"
      >
        <AlertBanner
          variant="info"
          message="Deleting this account cannot be undone."
        />
      </Dialog>
    </>
  );
};

export default UserModal;
