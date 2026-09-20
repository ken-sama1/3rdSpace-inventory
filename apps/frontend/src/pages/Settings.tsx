import { BellIcon, UserIcon } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const tabs = {
    // general: {
    //   label: "General",
    //   element: <GeneralSettings />,
    //   icon: <SettingsIcon size={18} />,
    // },
    account: {
      label: "Account",
      element: null,
      icon: <UserIcon size={18} />,
    },
    notification: {
      label: "Notifications",
      element: null,
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

      <div className="w-full flex flex-col h-[73vh] mt-3">
        <h3 className="font-normal! text-xl!">{tabs[view].label}</h3>

        <div className="divider m-0! my-2!"></div>

        <div className="flex">{tabs[view].element}</div>
      </div>
    </main>
  );
};

export default Settings;
