import { navRoutes } from "@/routes/nav-routes";
import { Link, NavLink } from "react-router-dom";
import LOGO from "@/assets/logo.png";
import { useAuth } from "@/hooks/auth/useAuth";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideBar = ({ isOpen, onClose }: SideBarProps) => {
  const { user } = useAuth();
  const visibleRoutes = navRoutes.filter(
    (route) => !route.roles || (user && route.roles.includes(user.role))
  );

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
        />
      )}
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 z-30 h-dvh w-72 max-w-[85vw] border-r border-(--line) bg-(--primary) shadow-black/10 shadow-[2px_0_8px_0] transition-transform duration-200 lg:left-0 lg:z-10 lg:w-2xs lg:translate-x-0 ${
          isOpen ? "left-0 translate-x-0" : "left-0 -translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="mb-2 flex h-12 w-full items-center justify-start ps-5">
          <Link to="/" className="h-8 w-fit" onClick={onClose}>
            <img
              src={LOGO}
              loading="lazy"
              className="size-full object-cover"
              alt="3rd Space"
            />
          </Link>
        </div>

        {/* Wrapper */}
        <div className="h-[calc(100%-3.5rem)] overflow-auto p-2">
          <ul className="flex flex-col gap-0.5">
            {visibleRoutes.map((route) => (
              /* Navigation Items */
              <li
                key={route.label}
                className="group rounded-sm text-sm nice-hover"
              >
                <NavLink
                  to={route.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `${isActive ? "font-bold bg-(--line) stroke-(--heading) stroke-3 text-(--heading)!" : "rounded-sm stroke-(--text)"} flex items-center justify-start gap-1 px-1.5 py-1`
                  }
                >
                  <route.icon
                    height={20}
                    className="stroke-inherit group-hover:stroke-(--accent)"
                  />
                  <span className="text-inherit! group-hover:text-(--accent)!">
                    {route.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default SideBar;
