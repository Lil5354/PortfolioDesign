import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/users/me", { 
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store"
      });
      
      if (!res.ok) {
        console.error("❌ Session API error:", res.status, res.statusText);
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
        return;
      }
      
      const userData = await res.json();
      
      if (userData && userData.id) {
        setUser(userData);
      } else {
        setUser(null);
        localStorage.removeItem("token");
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
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      localStorage.setItem("token", tokenParam);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (tokenParam || urlParams.has('code') || urlParams.has('state') || window.location.hash) {
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
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || "Đăng nhập thất bại");
    }
    if (data.token) localStorage.setItem("token", data.token);
    await refreshSession();
    return data;
  }, [refreshSession]);

  const logout = useCallback(async () => {
    localStorage.removeItem("token");
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
    if (!res.ok) throw new Error(data.error || data.message || "Đăng ký thất bại");
    return data;
  }, []);

  const forgotPassword = useCallback(async (email) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gửi mã thất bại");
    return data;
  }, []);

  const verifyResetCode = useCallback(async (email, code) => {
    const res = await fetch("/api/auth/verify-reset-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Mã không hợp lệ");
    return data;
  }, []);

  const resetPassword = useCallback(async (email, code, password) => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), code, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Đặt lại mật khẩu thất bại");
    return data;
  }, []);

  const sendEmailVerification = useCallback(async (email) => {
    const res = await fetch("/api/auth/send-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gửi mã thất bại");
    return data;
  }, []);

  const verifyEmail = useCallback(async (email, code) => {
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Xác thực email thất bại");
    return data;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithEmail, logout, register, refreshSession, forgotPassword, verifyResetCode, resetPassword, sendEmailVerification, verifyEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
