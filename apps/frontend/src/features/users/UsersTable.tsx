import Table from "@/components/ui/Table";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/auth/useAuth";
import type { IdSchema, UserDto, UserRoleSchema } from "@repo/shared";
import { useMemo, useState, type FC } from "react";
import UserContextMenu from "./UserContextMenu";
import UserModal from "./UserModal";

interface UsersTableProps {
  users: UserDto[];
}

const createdAtFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

const getNextRole = (role: UserRoleSchema): UserRoleSchema | null => {
  if (role === "STAFF") return "MANAGER";
  if (role === "MANAGER") return "STAFF";
  return null;
};

const UsersTable: FC<UsersTableProps> = ({ users }) => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [roleOverrides, setRoleOverrides] = useState<
    Record<string, UserRoleSchema>
  >({});
  const [selectedUserId, setSelectedUserId] = useState<IdSchema | null>(null);
  const isAdmin = currentUser?.role === "ADMIN";

  const displayUsers = useMemo(
    () =>
      users.map((item) => ({
        ...item,
        role: roleOverrides[item.id] ?? item.role,
      })),
    [users, roleOverrides]
  );
  const selectedUser =
    displayUsers.find((item) => item.id === selectedUserId) ?? null;
  const selectedNextRole =
    isAdmin && selectedUser ? getNextRole(selectedUser.role) : null;

  const changeRole = (userId: IdSchema, role: UserRoleSchema) => {
    setRoleOverrides((overrides) => ({ ...overrides, [userId]: role }));
    showToast({
      message: `Role changed to ${role} in this view only. Connect the promote/demote endpoint to persist it.`,
      variant: "info",
    });
  };

  return (
    <div className="size-full">
      <Table
        data={displayUsers}
        options={{
          row: {
            style: { cursor: "pointer" },
            onClick: (row) => {
              setSelectedUserId(row.id);
            },
            element: (row) => (
              <UserContextMenu
                nextRole={isAdmin ? getNextRole(row.role) : null}
                onChangeRole={(role) => {
                  changeRole(row.id, role);
                }}
              />
            ),
          },
          columns: 12,
          column: {
            username: {
              as: "Username",
              index: 0,
              colspan: 4,
            },
            role: {
              as: "Role",
              index: 1,
              colspan: 2,
              value: (role) => (
                <span className="rounded-full border border-(--line) px-2 py-0.5 text-xs font-medium">
                  {role}
                </span>
              ),
            },
            createdAt: {
              as: "Created",
              index: 2,
              colspan: 3,
              value: (createdAt) =>
                createdAtFormatter.format(new Date(createdAt)),
            },
          },
          exlude: ["id"],
        }}
      />

      <UserModal
        user={selectedUser}
        isOpen={selectedUser !== null}
        nextRole={selectedNextRole}
        onChangeRole={(role) => {
          if (selectedUser) changeRole(selectedUser.id, role);
        }}
        onClose={() => {
          setSelectedUserId(null);
        }}
      />
    </div>
  );
};

export default UsersTable;
