import { navRoutes } from "@/routes/nav-routes";
import { Link, NavLink } from "react-router-dom";
import LOGO from "@/assets/logo.png";

const SideBar = () => {
  return (
    // SideBar Container
    <nav
      className="
      h-dvh
      shadow-black/10 shadow-[2px_0_8px_0] 
      w-2xs relative top-0 z-10 border-r border-(--line)"
    >
      {/* Logo Section */}
      <div className="h-12 mb-2 ps-5 w-full flex items-center justify-start">
        <Link to="/" className="h-8 w-fit">
          <img src={LOGO} loading="lazy" className="size-full object-cover" />
        </Link>
      </div>

      {/* Wrapper */}
      <div className="size-full bg-(--primary) p-2 overflow-auto">
        {/* Navigation Section Start*/}
        <ul className="flex flex-col gap-0.5">
          {navRoutes.map((route) => {
            return (
              /* Navigation Items */
              <li
                key={route.label}
                className="
                nice-hover
                group text-sm rounded-sm overflow-hidden"
              >
                {/* Navigation Link */}
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    `${isActive ? "font-bold bg-(--line) stroke-(--heading) stroke-3 text-(--heading)!" : "stroke-(--text)"} flex items-center justify-start gap-1 px-1.5 py-1`
                  }
                >
                  {/* Icon  */}
                  <route.icon
                    height={20}
                    className="stroke-inherit group-hover:stroke-(--accent)"
                  />
                  {/* Label */}
                  <span className="text-inherit! group-hover:text-(--accent)!">
                    {route.label}
                  </span>
                  {/* Label End */}
                </NavLink>
                {/* Navigation Link End */}
              </li>
              // Nav Item End
            );
          })}
        </ul>
        {/* Navigation Section End */}
      </div>
      {/* Wrapper End */}
    </nav>
    // Container End
  );
};

export default SideBar;
