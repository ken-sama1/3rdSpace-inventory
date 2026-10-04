import { useAuth } from "@/hooks/auth/useAuth";
import { useUpdateMe } from "./hooks/useUpdateMe";
import { useToast } from "@/context/ToastContext";
import { LogOut, Save, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

const AccountSettings = () => {
  const { user, logout, isLoggingOut } = useAuth();
  const { mutateAsync: updateMe, isPending } = useUpdateMe();
  const { showToast } = useToast();
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(user?.username ?? "");
  }, [user?.username]);

  const save = async () => {
    const nextUsername = username.trim();
    if (nextUsername.length < 3) {
      showToast({
        variant: "warning",
        message: "Username must be at least 3 characters",
      });
      return;
    }

    try {
      await updateMe({ username: nextUsername });
      showToast({
        variant: "success",
        message: "Account updated successfully",
      });
    } catch {
      showToast({
        variant: "danger",
        message: "Unable to update your account",
      });
    }
  };

  return (
    <section className="grid w-full max-w-3xl gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
      <div className="rounded-md w-full border border-(--line) p-4">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-(--bg-info)">
            <UserRound className="size-5 text-(--text-info)" />
          </div>
          <div>
            <h4 className="text-base!">Profile details</h4>
            <p className="text-xs! text-(--text-muted)!">
              Update the name used across the workspace.
            </p>
          </div>
        </div>

        <label className="grid gap-2">
          <span className="text-sm! font-semibold! text-(--text-muted)!">
            Username
          </span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter username"
            className="h-9! w-full rounded-md!"
          />
        </label>

        <div className="mt-5 flex justify-end">
          <button
            disabled={isPending || !user}
            onClick={save}
            className="button-accent flex items-center gap-2"
          >
            <Save className="size-4" />
            {isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      <div className="rounded-md w-fit border border-(--line) p-4">
        <h4 className="text-base!">Session</h4>
        <p className="mt-1 text-xs! text-(--text-muted)!">
          Sign out of this device.
        </p>
        <button
          disabled={isLoggingOut}
          onClick={() => void logout()}
          className="button-danger mt-5 flex w-full items-center justify-center gap-2"
        >
          <LogOut className="size-4" />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </section>
  );
};

export default AccountSettings;
