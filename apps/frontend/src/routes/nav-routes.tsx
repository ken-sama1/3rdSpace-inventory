import Categories from "@/pages/Categories";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Products from "@/pages/Products";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import type { UserRoleSchema } from "@repo/shared";
import {
  BarChart3Icon,
  FolderTreeIcon,
  LayersIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SettingsIcon,
  type LucideProps,
} from "lucide-react";
import type { JSXElementConstructor, ReactElement } from "react";

export type NavRoute = {
  label: string;
  icon: JSXElementConstructor<LucideProps>;
  path: string;
  children?: NavRoute[];
  element: ReactElement;
  index?: boolean;
  roles?: UserRoleSchema[];
};

export const navRoutes: NavRoute[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    element: <Dashboard />,
    path: "/dashboard",
    index: true,
  },
  {
    label: "Products",
    icon: PackageIcon,
    element: <Products />,
    path: "/products",
    // roles: ["ADMIN", "MANAGER"],
  },
  // {
  //   label: "POS",
  //   icon: ShoppingCartIcon,
  //   element: <Pos />,
  //   path: "/pos",
  // roles: ["ADMIN", "MANAGER", "STAFF"],
  // },
  {
    label: "Categories",
    icon: FolderTreeIcon,
    element: <Categories />,
    path: "/categories",
    // roles: ["ADMIN", "MANAGER"],
  },
  {
    label: "Inventory",
    icon: LayersIcon,
    element: <Inventory />,
    path: "/inventory",
    // roles: ["ADMIN", "MANAGER"],
  },
  {
    label: "Reports",
    icon: BarChart3Icon,
    element: <Reports />,
    path: "/reports",
    // roles: ["ADMIN", "MANAGER"],
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    element: <Settings />,
    path: "/settings",
  },
];
