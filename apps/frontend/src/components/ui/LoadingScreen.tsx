import type { FC } from "react";

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

const LoadingScreen: FC<LoadingScreenProps> = ({
  message = "Loading...",
  className = "",
}) => (
  <div
    role="status"
    aria-label={message}
    className={`flex min-h-screen flex-col items-center justify-center gap-3 ${className}`}
  >
    <span
      aria-hidden="true"
      className="size-8 animate-spin rounded-full border-4 border-(--line) border-t-(--accent)"
    />
    <span className="text-sm text-(--text-muted)">{message}</span>
  </div>
);

export default LoadingScreen;
