import AccountSettings from "@/features/settings/AccountSettings";
import GeneralSettings from "@/features/settings/GeneralSettings";
import NotificationsSettings from "@/features/settings/NotificationsSettings";
import { BellIcon, Settings2, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Settings = () => {
  const tabs = {
    general: {
      label: "General",
      element: <GeneralSettings />,
      icon: <Settings2 size={18} />,
    },
    account: {
      label: "Account",
      element: <AccountSettings />,
      icon: <UserIcon size={18} />,
    },
    notifications: {
      label: "Notifications",
      element: <NotificationsSettings />,
      icon: <BellIcon size={18} />,
    },
  } as const;

  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") as undefined | keyof typeof tabs;

  const [view, setView] = useState<keyof typeof tabs>("general");

  useEffect(() => {
    if (!tab) return;

    if (!Object.keys(tabs).includes(tab)) return;

    setView(tab);
  }, [searchParams]);

  useEffect(() => {
    setSearchParams(`tab=${view}`);
  }, [view]);

  return (
    <main className="w-full min-h-full h-auto flex flex-col bg-(--primary) pt-2 p-2">
      <div className="w-full h-fit flex border-b border-(--line) space-x-1">
        {Object.entries(tabs).map(([k, v]) => {
          return (
            <button
              key={`category-tab-${k}`}
              type="button"
              onClick={() => setView(k as typeof view)}
              className={`
                px-5 cursor-pointer py-2 text-sm font-medium
                rounded-t-lg transition-colors border-b-2
                flex justify-center items-center gap-2
                ${
                  view === k
                    ? "border-(--accent)! bg-(--bg-info)"
                    : "border-transparent nice-hover"
                }`}
            >
              {v.icon}
              {v.label}
            </button>
          );
        })}
      </div>

      <div className="w-full flex flex-col min-h-[73vh] mt-3">
        <h3 className="font-normal! text-xl!">{tabs[view].label}</h3>

        <div className="divider m-0! my-2!"></div>

        <div className="flex">{tabs[view].element}</div>
      </div>
    </main>
  );
};

export default Settings;
