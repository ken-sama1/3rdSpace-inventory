import Table from "@/components/ui/Table";
import { useAuth } from "@/hooks/auth/useAuth";
import type { UserDto, UserRoleSchema } from "@repo/shared";
import { useState, type FC } from "react";
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
  const [selectedUserId, setSelectedUserId] = useState<UserDto["id"] | null>(
    null
  );
  const isAdmin = currentUser?.role === "ADMIN";

  const selectedUser =
    users.find((item) => item.id === selectedUserId) ?? null;
  const selectedNextRole =
    isAdmin && selectedUser ? getNextRole(selectedUser.role) : null;

  return (
    <div className="size-full">
      <Table
        data={users}
        options={{
          row: {
            style: { cursor: "pointer" },
            onClick: (row) => {
              setSelectedUserId(row.id);
            },
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
        onClose={() => {
          setSelectedUserId(null);
        }}
      />
    </div>
  );
};

export default UsersTable;
