import { useCallback, useEffect, useState } from "react";

import { clearToken, getToken } from "../services/api";

// Reads the existing stored session (localStorage "user" / "token").
// This hook is a read-only view over the current auth state — it does not
// introduce a second auth system, token store, or login flow.
const readStoredUser = () => {
  try {
    const stored = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    // Support both the plain user object and older stored
    // API response formats.
    return stored?.data?.user || stored?.user || stored;
  } catch {
    return null;
  }
};

export function useAuth() {
  const [user, setUser] = useState(readStoredUser);
  const [token, setTokenState] = useState(getToken);

  useEffect(() => {
    const refresh = () => {
      setUser(readStoredUser());
      setTokenState(getToken());
    };

    // "user-updated" is dispatched by the existing login/logout flows;
    // "storage" covers changes made from another browser tab.
    window.addEventListener("user-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("user-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const role = String(user?.role || "").toLowerCase();
  const isAuthenticated = Boolean(token);
  const isCustomer = isAuthenticated && role === "customer";

  // Uses the same logout mechanism as the existing dashboard headers.
  const logout = useCallback(() => {
    clearToken();
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("user-updated"));
  }, []);

  return {
    user,
    token,
    role,
    isAuthenticated,
    isCustomer,
    logout,
  };
}

export default useAuth;