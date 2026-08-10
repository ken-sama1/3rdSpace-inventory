import Categories from "@/pages/Categories";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Products from "@/products/Products";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import StockIn from "@/pages/StockIn";
import StockOut from "@/pages/StockOut";
import {
  BarChart3Icon,
  FolderTreeIcon,
  LayersIcon,
  LayoutDashboardIcon,
  PackageIcon,
  PackageMinusIcon,
  PackagePlusIcon,
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
    label: "Stock In",
    icon: PackagePlusIcon,
    element: <StockIn />,
    path: "/stockin",
  },
  {
    label: "Stock Out",
    icon: PackageMinusIcon,
    element: <StockOut />,
    path: "/stockout",
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
