import AccountSettings from "@/features/settings/AccountSettings";
import GeneralSettings from "@/features/settings/GeneralSettings";
import NotificationsSettings from "@/features/settings/NotificationsSettings";
import { BellIcon, Settings2, UserIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";

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

type Tab = keyof typeof tabs;

const isTab = (value: string | null): value is Tab =>
  value !== null && Object.hasOwn(tabs, value);

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const param = searchParams.get("tab");
  const view: Tab = isTab(param) ? param : "general";

  const selectTab = (tab: Tab) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", tab);
      return next;
    });
  };

  return (
    <main className="w-full min-h-full h-auto flex flex-col bg-(--primary) pt-2 p-2">
      <div className="w-full h-fit flex border-b border-(--line) space-x-1">
        {Object.entries(tabs).map(([key, value]) => {
          const tab = key as Tab;

          return (
            <button
              key={`settings-tab-${tab}`}
              type="button"
              onClick={() => { selectTab(tab); }}
              className={`
                px-5 cursor-pointer py-2 text-sm font-medium
                rounded-t-lg transition-colors border-b-2
                flex justify-center items-center gap-2
                ${
                  view === tab
                    ? "border-(--accent)! bg-(--bg-info)"
                    : "border-transparent nice-hover"
                }`}
            >
              {value.icon}
              {value.label}
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
