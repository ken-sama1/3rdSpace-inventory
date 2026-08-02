import { Link, NavLink } from "react-router-dom";
import LOGO from "@/assets/logo.png";
import { Bell, User } from "lucide-react";

const Topbar = () => {
  return (
    <nav className="border-(--line)! inset-x-0 border-b h-15 w-full fixed top-0">
      <div className="size-full relative flex justify-start items-center bg-(--primary)">
        {/* Logo Section */}
        <div className="h-10 absolute left-5 flex items-center justify-center">
          <Link to="/">
            <img src={LOGO} loading="lazy" />
          </Link>
        </div>

        {/* Right Side  */}
        <div className="h-10 absolute right-5 flex items-center justify-center gap-5">
          <span className="text-base text-white!">Admin</span>
          {/* Literally just the vertical line */}
          <div className="h-8/10 w-0.5 bg-(--line)"></div>

          {/* Obviously its the notification button */}
          <button
            title="notification"
            className="flex justify-center items-center cursor-pointer aspect-square h-6/10"
          >
            <Bell color="white" className="size-full" />
          </button>

          {/* The vertical divider again */}
          <div className="h-8/10 w-0.5 bg-(--line)"></div>

          {/* The user profile button */}
          <button
            title="account"
            className="flex justify-center items-center cursor-pointer aspect-square h-6/10"
          >
            <User color="white" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
