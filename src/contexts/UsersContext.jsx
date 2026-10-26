import { createContext, useContext, useEffect, useState } from "react";
import { initialUsers, DEFAULT_STATUS } from "../data/initialUsers";
import { hashPassword } from "../utils/hashPassword";

const UsersContext = createContext({ users: [], setUsers: () => {} });

const LEGACY_STATUS = "Soul about to die";

// Older saved data kept plain-text passwords and a placeholder status.
function needsMigration(users) {
  return users.some(
    (u) =>
      u.userPassword !== undefined ||
      !u.userStatus ||
      u.userStatus === LEGACY_STATUS,
  );
}

async function migrateUsers(users) {
  return Promise.all(
    users.map(async ({ userPassword, ...u }) => ({
      ...u,
      passwordHash:
        u.passwordHash ??
        (userPassword !== undefined ? await hashPassword(userPassword) : ""),
      userStatus:
        !u.userStatus || u.userStatus === LEGACY_STATUS
          ? DEFAULT_STATUS
          : u.userStatus,
    })),
  );
}

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users"));
      return Array.isArray(storedUsers) && storedUsers.length
        ? storedUsers
        : initialUsers;
    } catch (e) {
      console.warn("Failed to read users from localStorage", e);
      return initialUsers;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("users", JSON.stringify(users));
    } catch (e) {
      console.warn("Failed to save users to localStorage", e);
    }
  }, [users]);

  useEffect(() => {
    if (!Array.isArray(users) || !needsMigration(users)) return;
    let cancelled = false;
    migrateUsers(users).then((migrated) => {
      if (!cancelled) setUsers(migrated);
    });
    return () => {
      cancelled = true;
    };
  }, [users]);

  return (
    <UsersContext.Provider value={{ users, setUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
