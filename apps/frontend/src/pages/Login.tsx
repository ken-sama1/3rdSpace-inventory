import { useAuth } from "@/hooks/auth/useAuth";
import { Eye, EyeOff, LockKeyhole, UserRound, CircleAlert } from "lucide-react";
import { isAxiosError } from "axios";
import { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-(--primary) px-4 py-10">
      <section className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          {/* <img */}
          {/*   src={LOGO} */}
          {/*   alt="3rd Space Inventory" */}
          {/*   className="mb-6 h-12 w-auto object-contain" */}
          {/* /> */}
          <h1 className="text-2xl! font-bold!">Welcome back</h1>
          <p className="mt-2 text-sm! text-(--text-muted)!">
            Sign in to continue to your inventory workspace.
          </p>
        </div>

        <div className="rounded-xl border border-(--line) bg-(--primary) p-6 shadow-[0_8px_32px_0] shadow-black/20 sm:p-8">
          <form
            action={async (formdata) => {
              setLoginError(null);

              try {
                const username = (formdata.get("username") ?? "") as string;
                const password = (formdata.get("password") ?? "") as string;

                await login({
                  username,
                  password,
                });
              } catch (error) {
                const message = isAxiosError<{ message?: string }>(error)
                  ? error.response?.data.message
                  : undefined;
                setLoginError(
                  message ??
                    "Unable to sign in. Check your username and password."
                );
              }
            }}
            className="flex flex-col gap-5"
          >
            <label className="flex flex-col gap-2 ">
              <span className="text-sm! font-semibold! text-(--heading)!">
                Username
              </span>
              <span className="relative flex items-center">
                <UserRound className="pointer-events-none absolute left-3 size-4 text-(--text-muted)" />
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  placeholder="Enter your username"
                  className="h-8! w-full! rounded-md! pl-10! pr-3!"
                />
              </span>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm! font-semibold! text-(--heading)!">
                Password
              </span>
              <span className="relative flex items-center">
                <LockKeyhole className="pointer-events-none absolute left-3 size-4 text-(--text-muted)" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-8! w-full! rounded-md! pl-10! pr-11!"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword((visible) => !visible);
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 flex items-center text-(--text-muted) transition-colors hover:text-(--accent)"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </span>
            </label>

            {loginError && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-md border border-(--line-danger) bg-(--bg-danger) px-3 py-2"
              >
                <CircleAlert className="size-4 shrink-0 text-(--text-danger)" />
                <span className="text-sm! text-(--text-danger)!">
                  {loginError}
                </span>
              </div>
            )}

            {/* <div className="flex items-center justify-between gap-3"> */}
            {/*   <label className="flex cursor-pointer items-center gap-2 text-xs!"> */}
            {/*     <input */}
            {/*       type="checkbox" */}
            {/*       name="remember" */}
            {/*       className="size-4! accent-(--accent)" */}
            {/*     /> */}
            {/*     Remember me */}
            {/*   </label> */}
            {/*   <button */}
            {/*     type="button" */}
            {/*     className="text-xs! text-(--text-info)! transition-colors hover:text-(--accent)!" */}
            {/*   > */}
            {/*     Forgot password? */}
            {/*   </button> */}
            {/* </div> */}

            <button type="submit" className="button-accent mt-1 h-8! w-full">
              Sign in
            </button>
          </form>
        </div>

        {/* <p className="mt-6 text-center text-xs! text-(--text-muted)!"> */}
        {/*   Inventory management for 3rd Space */}
        {/* </p> */}
      </section>
    </main>
  );
};

export default Login;
