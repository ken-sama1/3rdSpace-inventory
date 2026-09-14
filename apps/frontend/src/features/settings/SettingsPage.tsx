import {
  Bell,
  Check,
  Database,
  Palette,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const navItems = [
    { id: "general", label: "General", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & Access", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "data", label: "Data Management", icon: Database },
  ];

  return (
    <div className="flex-1 p-6 bg-(--primary) text-slate-200 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
                  isActive
                    ? "border-(--accent) bg-slate-900/50"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                }`}
              >
                <Icon size={16} />
                <span className="text-(--text-info)">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="bg-[#0D111A] border border-slate-800 rounded-xl p-6 shadow-xl">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Store Information
                </h3>
                <p className="text-sm text-slate-400">
                  Manage your store details and identity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">
                    Store Name
                  </label>
                  <input
                    type="text"
                    defaultValue="3RD SPACE"
                    className="w-full bg-[#131824] border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@3rdspace.local"
                    className="w-full bg-[#131824] border rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab !== "general" && (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <p className="text-sm font-medium">Section details coming soon</p>
              <p className="text-xs text-slate-600">
                Configure your system preferences here once connected.
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 button-accent text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-md active:scale-95"
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              <span>{saved ? "Saved!" : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
