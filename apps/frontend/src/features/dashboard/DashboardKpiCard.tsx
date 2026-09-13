import type { FC, ReactNode } from "react";

interface DashboardKpiCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  className?: string;
}

const DashboardKpiCard: FC<DashboardKpiCardProps> = ({
  title,
  value,
  icon,
  description,
  className = "",
}) => {
  return (
    <div
      className={`
        border border-(--line)
        rounded-md
        p-4
        flex flex-col justify-between
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {icon && icon}
        <span className="text-sm!">{title}</span>
      </div>

      <div>
        <div className="text-2xl! font-bold! text-(--heading)!">{value}</div>

        {description && (
          <span className="text-xs! text-(--text-muted)!">{description}</span>
        )}
      </div>
    </div>
  );
};

export default DashboardKpiCard;
