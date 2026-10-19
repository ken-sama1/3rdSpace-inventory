import AlertBanner from "@/components/ui/AlertBanner";
import Dialog from "@/components/ui/Dialog";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { useDeleteUser } from "@/hooks/users/mutations/useDeleteUser";
import { useResetPassword } from "@/hooks/users/mutations/useResetPassword";
import { useUpdateUser } from "@/hooks/users/mutations/useUpdateUser";
import { getApiErrorMessage } from "@/utils/api-error-message.util";
import type { UserDto, UserRoleSchema } from "@repo/shared";
import { useRef, useState, type FC, type SyntheticEvent } from "react";

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
  const { resetPassword, isPending: isResettingPassword } = useResetPassword();
  const { showToast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const resetPasswordFormRef = useRef<HTMLFormElement>(null);
  const isAdmin = currentUser?.role === "ADMIN";
  const canDelete =
    isAdmin &&
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
    } catch (error) {
      showToast({
        message: getApiErrorMessage(error),
        variant: "danger",
      });
    }
  };

  const changeUserPassword = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      showToast({
        message: "Complete both password fields",
        variant: "warning",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast({
        message: "Passwords do not match",
        variant: "warning",
      });
      return;
    }

    try {
      await resetPassword({ id: user.id, data: { newPassword } });
      resetPasswordFormRef.current?.reset();
      showToast({
        message: `Password reset for ${user.username}`,
        variant: "success",
      });
    } catch (error) {
      showToast({
        message: getApiErrorMessage(error),
        variant: "danger",
      });
    }
  };

  return (
    <>
      <Modal title={user.username} isOpen={isOpen} onClose={onClose}>
        <div className="w-full">
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

          {isAdmin && (
            <form
              ref={resetPasswordFormRef}
              onSubmit={(event) => void changeUserPassword(event)}
              className="mt-4 grid gap-4 rounded-md border border-(--line) p-4 sm:grid-cols-2"
            >
              <div className="sm:col-span-2">
                <h4 className="text-base!">Reset password</h4>
                <p className="mt-1 text-xs! text-(--text-muted)!">
                  Choose a new password for this user's account.
                </p>
              </div>
              <label className="grid gap-2">
                <span className="text-sm! font-semibold! text-(--text-muted)!">
                  New password
                </span>
                <input
                  autoComplete="new-password"
                  className="h-9! w-full rounded-md!"
                  minLength={6}
                  name="newPassword"
                  required
                  type="password"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm! font-semibold! text-(--text-muted)!">
                  Confirm new password
                </span>
                <input
                  autoComplete="new-password"
                  className="h-9! w-full rounded-md!"
                  minLength={6}
                  name="confirmPassword"
                  required
                  type="password"
                />
              </label>
              <div className="flex justify-end sm:col-span-2">
                <button
                  className="button-accent py-1!"
                  disabled={isResettingPassword}
                  type="submit"
                >
                  {isResettingPassword ? "Resetting..." : "Reset password"}
                </button>
              </div>
            </form>
          )}

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
                message: getApiErrorMessage(error),
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
