import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.name || "",
          email: session.user.email || "",
          image: session.user.image || "",
          role: session.user.role || "student",
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshSession(); }, [refreshSession]);

  const login = useCallback((provider = "google") => {
    if (provider === "google") {
      fetch("/api/auth/csrf").then((r) => r.json()).then((data) => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/api/auth/signin/google";
        const inputs = { callbackUrl: "http://localhost:5173/", csrfToken: data.csrfToken };
        for (const [k, v] of Object.entries(inputs)) {
          const i = document.createElement("input");
          i.name = k; i.value = v; form.appendChild(i);
        }
        document.body.appendChild(form);
        form.submit();
      });
    }
  }, []);

  const loginWithEmail = useCallback(async (email, password) => {
    const csrfRes = await fetch("/api/auth/csrf");
    const csrfData = await csrfRes.json();
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/auth/callback/credentials";
    const fields = { email, password, csrfToken: csrfData.csrfToken, callbackUrl: "http://localhost:5173/" };
    for (const [k, v] of Object.entries(fields)) {
      const i = document.createElement("input");
      i.name = k; i.value = v; form.appendChild(i);
    }
    document.body.appendChild(form);
    form.submit();
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    setUser(null);
    window.location.href = "/";
  }, []);

  const register = useCallback(async ({ email, fullName, password }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, fullName, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Đăng ký thất bại");
    return data;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithEmail, logout, register, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
