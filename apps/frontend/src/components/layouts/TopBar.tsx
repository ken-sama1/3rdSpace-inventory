import LOGO from "@/assets/logo.png";
import { Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <header className="border-(--line)! inset-x-0 border-b h-12 w-full fixed top-0 z-10">
      <div className="size-full relative flex justify-start items-center bg-(--primary)">
        {/* Logo Section */}
        <div className="h-8 absolute left-5 flex items-center justify-center">
          <Link to="/" className="size-full">
            <img src={LOGO} loading="lazy" className="size-full object-cover" />
          </Link>
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
