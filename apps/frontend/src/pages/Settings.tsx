import { BellIcon, SettingsIcon, UserIcon } from "lucide-react";
import type { ReactNode } from "react";

interface Tab {
  icon: ReactNode;
  element: ReactNode;
  label: string;
}

const Settings = () => {
  const tabs: Tab[] = [
    {
      label: "General",
      element: null,
      icon: <SettingsIcon />,
    },
    {
      label: "Account",
      element: null,
      icon: <UserIcon />,
    },
    {
      label: "Notifications",
      element: null,
      icon: <BellIcon />,
    },
  ];

  tabs;

  return (
    <main className="w-full min-h-full h-auto flex flex-col bg-(--primary) pt-2 p-2">
      {/* <SettingsIcon /> */}
      {/* <UserIcon /> */}
      {/* <BellIcon /> */}
    </main>
  );
};

export default Settings;
