import { Bell, User } from "lucide-react";
import { useLocation } from "react-router-dom";

const TopBar = () => {
  const location = useLocation();

  console.log(location);
  return (
    <header
      className="
      shadow-[0_2px_8px_0] shadow-black/10
      border-(--line) border-b h-12 w-[calc(100%-288px)] fixed right-0 top-0 z-10"
    >
      <div className="size-full relative flex justify-start items-center bg-(--primary)">
        <div className="h-full w-fit ms-2 flex justify-center items-center">
          <h3 className="font-semibold! text-lg! capitalize">
            {location.pathname.substring(1)}
          </h3>
        </div>
        {/* Right Side  */}
        <div className="h-10 absolute right-5 flex items-center justify-center gap-5">
          <span className="text-sm!">Admin</span>
          {/* Literally just the vertical line */}
          <div className="h-8/10 w-0.5 bg-(--line)"></div>

          {/* Obviously its the notification button */}
          <button
            title="notification"
            className="
            nice-hover 
            h-8 stroke-1 stroke-(--text) hover:stroke-(--accent)
            flex justify-center items-center cursor-pointer px-2 py-1.5 rounded-sm"
          >
            <Bell className="size-full stroke-inherit" />
          </button>

          {/* The vertical divider again */}
          <div className="h-8/10 w-0.5 bg-(--line)"></div>

          {/* The user profile button */}
          <button
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
