import type { FC } from "react";

export interface AlertBannerProps {
  message: string;
  variant?: "warning" | "danger" | "info";
}

const AlertBanner: FC<AlertBannerProps> = ({ message, variant = "info" }) => {
  return (
    <div className="w-full max-w-xs flex flex-col items-center justify-center text-center p-2">
      <div className={`w-full py-2 px-3 rounded-md border status-${variant}`}>
        <p className="text-xs opacity-90 mt-0.5">{message}</p>
      </div>
    </div>
  );
};

export default AlertBanner;
