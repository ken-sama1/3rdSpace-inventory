import type { FC } from "react";

export interface AlertBannerProps {
  message: string;
  variant?: "warning" | "danger" | "info";
}

const AlertBanner: FC<AlertBannerProps> = ({ message, variant = "info" }) => {
  return (
    <div className="min-w-sm w-full flex flex-col items-center justify-center text-center p-2">
      <div className={`w-full py-2 border px-3 rounded-md status-${variant}`}>
        <p className="text-sm opacity-90">{message}</p>
      </div>
    </div>
  );
};

export default AlertBanner;
