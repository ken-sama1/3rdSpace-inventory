import AccountSettings from "@/features/settings/AccountSettings";
import GeneralSettings from "@/features/settings/GeneralSettings";
import { BellIcon, Settings2, UserIcon } from "lucide-react";
import { useState } from "react";

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
    notification: {
      label: "Notifications",
      element: (
        <section className="max-w-2xl rounded-md border border-(--line) p-4">
          <h4 className="text-base!">Notifications</h4>
          <p className="mt-1 text-xs! text-(--text-muted)!">
            Notification preferences will be connected to the notification
            center when alerts are added.
          </p>
          <div className="mt-5 flex items-center justify-between rounded-md border border-(--line) p-3">
            <div>
              <p className="text-sm!">Low stock alerts</p>
              <p className="text-xs! text-(--text-muted)!">
                Show low-stock indicators throughout the workspace.
              </p>
            </div>
            <span className="status-success rounded-md border text-xs!">
              Enabled
            </span>
          </div>
        </section>
      ),
      icon: <BellIcon size={18} />,
    },
  } as const;

  const [view, setView] = useState<keyof typeof tabs>("account");

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
