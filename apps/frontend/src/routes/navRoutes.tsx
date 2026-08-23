import Categories from "@/pages/Categories";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Products from "@/pages/Products";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
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
  },
  {
    label: "Categories",
    icon: FolderTreeIcon,
    element: <Categories />,
    path: "/categories",
  },
  {
    label: "Inventory",
    icon: LayersIcon,
    element: <Inventory />,
    path: "/inventory",
  },
  {
    label: "Reports",
    icon: BarChart3Icon,
    element: <Reports />,
    path: "/reports",
  },
  {
    label: "Settings",
    icon: SettingsIcon,
    element: <Settings />,
    path: "/settings",
  },
];
