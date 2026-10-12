import Collapsible from "@/components/ui/Collapsible";
import UsersTable from "@/features/users/UsersTable";
import { useGetUsers } from "@/hooks/users/useGetUsers";
import type { UserRoleSchema } from "@repo/shared";
import { SlidersHorizontal } from "lucide-react";
import { useRef, useState } from "react";

const Accounts = () => {
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [openCollapsible, setOpenCollapsible] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRoleSchema | "ALL">("ALL");
  const { data: users = [], isLoading, isError, refetch } = useGetUsers({});

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <main className="flex min-h-full w-full flex-col bg-(--primary) p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex h-9 items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            className="h-7! w-52! rounded-sm! py-0! text-xs!"
            placeholder="Search users..."
            aria-label="Search users"
          />

          <button
            ref={filterButtonRef}
            type="button"
            onClick={() => {
              setOpenCollapsible((open) => !open);
            }}
            title="Filter users"
            aria-label="Filter users"
            aria-expanded={openCollapsible}
            className="button-accent flex h-7! items-center justify-center rounded-sm! text-white! stroke-white!"
          >
            <SlidersHorizontal className="h-5 stroke-2 stroke-inherit!" />
          </button>

          <div className="absolute left-0 top-full z-10 mt-2 w-56">
            <Collapsible
              isOpen={openCollapsible}
              onClose={() => {
                setOpenCollapsible(false);
              }}
              refs={[filterButtonRef]}
            >
              <label className="grid gap-2 p-3 text-sm">
                <span className="font-semibold">Filter by role</span>
                <select
                  value={roleFilter}
                  onChange={(event) => {
                    setRoleFilter(event.target.value as UserRoleSchema | "ALL");
                  }}
                  className="h-9! w-full rounded-md!"
                >
                  <option value="ALL">All roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="STAFF">Staff</option>
                </select>
              </label>
            </Collapsible>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <section className="min-h-[40vh] w-full overflow-auto">
        {isLoading ? (
          <div className="flex min-h-40 items-center justify-center text-sm text-(--text-muted)">
            Loading accounts...
          </div>
        ) : isError ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-sm text-(--text-danger)!">
            <p>Unable to load accounts.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="button-outlined py-1!"
            >
              Try again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex min-h-40 items-center justify-center text-sm text-(--text-muted)">
            {users.length === 0
              ? "No accounts found."
              : "No accounts match your search or role filter."}
          </div>
        ) : (
          <UsersTable users={filteredUsers} />
        )}
      </section>
    </main>
  );
};

export default Accounts;
