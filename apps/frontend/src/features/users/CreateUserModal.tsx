import Modal from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/auth/useAuth";
import type { RegisterInput } from "@repo/shared";
import { getApiErrorMessage } from "@/utils/api-error-message.util";
import { useRef, type FC, type SyntheticEvent } from "react";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateUserModal: FC<CreateUserModalProps> = ({ isOpen, onClose }) => {
  const { register, isRegistering } = useAuth();
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const createUser = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const username = formData.get("username");
      const password = formData.get("password");

      if (typeof username !== "string" || typeof password !== "string") {
        throw new Error("Username and password are required");
      }

      const credentials: RegisterInput = { username, password };
      await register(credentials);
      formRef.current?.reset();
      onClose();
      showToast({
        message: "User created successfully",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      showToast({
        message: getApiErrorMessage(error),
        variant: "danger",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create User">
      <div className="w-full">
        <form
          ref={formRef}
          onSubmit={(event) => void createUser(event)}
          className="w-full flex flex-col gap-4"
        >
          <label className="grid gap-2">
            <span className="text-sm! font-semibold! text-(--text-muted)!">
              Username
            </span>
            <input
              autoComplete="username"
              className="h-9! w-full rounded-md!"
              minLength={3}
              name="username"
              required
              type="text"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm! font-semibold! text-(--text-muted)!">
              Password
            </span>
            <input
              autoComplete="new-password"
              className="h-9! w-full rounded-md!"
              minLength={6}
              name="password"
              required
              type="password"
            />
          </label>

          <p className="text-xs! text-(--text-muted)!">
            New accounts are created with the Staff role.
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isRegistering}
              className="button-outlined py-1!"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRegistering}
              className="button-accent py-1!"
            >
              {isRegistering ? "Creating..." : "Create user"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateUserModal;
