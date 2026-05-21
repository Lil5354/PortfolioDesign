import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { 
        credentials: "include",
        cache: "no-store"
      });
      
      if (!res.ok) {
        console.error("❌ Session API error:", res.status, res.statusText);
        setUser(null);
        setLoading(false);
        return;
      }
      
      const session = await res.json();
      
      let userObj = null;
      
      if (session?.user) {
        userObj = session.user;
      } else if (session?.data?.user) {
        userObj = session.data.user;
      } else if (session?.id && session?.email) {
        userObj = session;
      }
      
      if (userObj) {
        const userData = {
          id: userObj.id || userObj._id || userObj.userId || userObj.sub,
          name: userObj.name || userObj.fullName || userObj.displayName || userObj.given_name || "",
          email: userObj.email || "",
          image: userObj.image || userObj.avatarUrl || userObj.picture || userObj.avatar || "",
          role: userObj.role || "student",
        };
        
        if (userData.id && userData.email) {
          setUser(userData);
        } else {
          console.warn("⚠️ User data incomplete:", userData);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Auth error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    refreshSession(); 
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code') || urlParams.has('state') || window.location.hash) {
      setTimeout(() => refreshSession(), 500);
      setTimeout(() => refreshSession(), 1500);
      setTimeout(() => refreshSession(), 3000);
    }
    
    const handleFocus = () => {
      refreshSession();
    };
    
    const interval = setInterval(() => {
      refreshSession();
    }, 30000);
    
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [refreshSession]);

  const login = useCallback((provider = "google") => {
    if (provider === "google") {
      fetch("/api/auth/csrf").then((r) => r.json()).then((data) => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/api/auth/signin/google";
        const inputs = { callbackUrl: window.location.origin + "/", csrfToken: data.csrfToken };
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
    const fields = { email, password, csrfToken: csrfData.csrfToken, callbackUrl: window.location.origin + "/" };
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
