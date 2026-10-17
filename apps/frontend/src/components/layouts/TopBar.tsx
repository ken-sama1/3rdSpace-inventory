import { Bell, Menu, User, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";

interface TopBarProps {
  isNavigationOpen: boolean;
  onMenuClick: () => void;
}

const TopBar = ({ isNavigationOpen, onMenuClick }: TopBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="fixed right-0 top-0 z-40 h-12 w-full border-b border-(--line) shadow-[0_2px_8px_0] shadow-black/10 lg:w-[calc(100%-288px)]">
      <div className="relative flex size-full items-center justify-start bg-(--primary)">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={isNavigationOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isNavigationOpen}
          className="ml-2 flex size-9 items-center justify-center rounded-sm hover:bg-(--line) lg:hidden"
        >
          {isNavigationOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
        <div className="ml-2 flex h-full w-fit items-center justify-center lg:ml-2">
          <h3 className="text-base! font-semibold! capitalize sm:text-lg!">
            {location.pathname.substring(1)}
          </h3>
        </div>
        <div className="absolute right-2 flex h-10 items-center justify-center gap-2 sm:right-5 sm:gap-5">
          <span className="hidden text-sm! sm:inline">
            {user?.username ?? "User"} · {user?.role ?? "—"}
          </span>
          <div className="hidden h-8/10 w-0.5 bg-(--line) sm:block"></div>

          <button
            onClick={() => void navigate("/settings?tab=notifications")}
            title="notification"
            className="
            nice-hover 
            h-8 stroke-1 stroke-(--text) hover:stroke-(--accent)
            flex justify-center items-center cursor-pointer px-2 py-1.5 rounded-sm"
          >
            <Bell className="size-full stroke-inherit" />
          </button>

          <div className="hidden h-8/10 w-0.5 bg-(--line) sm:block"></div>

          <button
            onClick={() => void navigate("/settings?tab=account")}
            title="account"
            className="
            nice-hover
            h-8 stroke-1 stroke-(--text) hover:stroke-(--accent)
            flex justify-center items-center cursor-pointer px-2 py-1.5 rounded-sm"
          >
            <User className="size-full stroke-inherit" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
