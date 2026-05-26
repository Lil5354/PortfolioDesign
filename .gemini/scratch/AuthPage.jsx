function AuthPage({ setPage, onLoginSuccess }) {
  const { loginWithEmail, refreshSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authRole, setAuthRole] = useState("student");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [logging, setLogging] = useState(false);

  const handleEmailLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setLoginError(t("enterEmailAndPassword"));
      return;
    }
    setLoginError("");
    setLogging(true);
    try {
      await loginWithEmail(email, password);
      await refreshSession();
      setPage("home");
    } catch (err) {
      setLoginError(err?.message || t("loginFailed"));
    } finally {
      setLogging(false);
    }
  };

  const handleGoogleLogin = () => {
    fetch("/api/auth/csrf").then(r => r.json()).then(data => {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/api/auth/signin/google";
      const cbInput = document.createElement("input");
      cbInput.name = "callbackUrl";
      cbInput.value = window.location.origin + "/";
      form.appendChild(cbInput);
      const csrfInput = document.createElement("input");
      csrfInput.name = "csrfToken";
      csrfInput.value = data.csrfToken;
      form.appendChild(csrfInput);
      document.body.appendChild(form);
      form.submit();
    });
  };

  const demoAccounts = {
    student: { email: "sv@uef.edu.vn", password: "test123" },
    lecturer: { email: "tainv@uef.edu.vn", password: "test123" },
    admin: { email: "admin@uef.edu.vn", password: "test123" },
  };

  const autoFillLogin = (role) => {
    const account = demoAccounts[role];
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
      setLoginError("");
    }
  };

  return (
    <div className="auth-page" style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div className="auth-image-panel" style={{ flex: 1, position: "relative" }}>
        <img src="https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/08/hoc-phi-uef-.jpg" alt="auth-bg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
        <div style={{ position: "absolute", top: 40, left: 40, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setPage("home")}>
          <img src="/logo-uef.png" alt="UEF" style={{ height: 32, filter: "brightness(0) invert(1)" }} />
          <span style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>Design Gallery</span>
        </div>
      </div>
      <div className="auth-form-panel" style={{ width: 480, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: BLACK, marginBottom: 8 }}>{t("login")}</h2>
        <p style={{ color: MUTED, fontSize: 14, marginBottom: 24 }}>{t("welcomeBack")}</p>

        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {[{ key: "student", label: t("student") }, { key: "lecturer", label: t("lecturer") }, { key: "admin", label: t("admin") }].map((r) => (
            <button disabled={logging} key={r.key} onClick={() => { setAuthRole(r.key); autoFillLogin(r.key); }} style={{ flex: 1, padding: "7px 0", borderRadius: 6, border: `1px solid ${authRole === r.key ? CERULEAN : GRAY_LIGHT}`, background: authRole === r.key ? `${CERULEAN}12` : "transparent", color: authRole === r.key ? CERULEAN : MUTED, fontSize: 12, fontWeight: 500, cursor: logging ? "not-allowed" : "pointer", opacity: logging ? 0.6 : 1 }}>{r.label}</button>
          ))}
        </div>

        <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 6 }}>{t("email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
              disabled={logging}
              placeholder="sv@uef.edu.vn"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${loginError ? "#E53E3E" : GRAY_LIGHT}`, background: GRAY_BG, fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK, opacity: logging ? 0.6 : 1 }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 6 }}>{t("password")}</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                disabled={logging}
                placeholder="••••••••"
                style={{ width: "100%", padding: "12px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${loginError ? "#E53E3E" : GRAY_LIGHT}`, background: GRAY_BG, fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK, opacity: logging ? 0.6 : 1 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: logging ? "not-allowed" : "pointer", padding: 6, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {loginError && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 8, padding: "10px 14px", marginTop: 2 }}>
              <ShieldAlert size={16} color="#E53E3E" style={{ flexShrink: 0 }} />
              <p style={{ color: "#C53030", fontSize: 12, margin: 0, lineHeight: 1.4 }}>{loginError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={logging || !email || !password}
            style={{ width: "100%", padding: "14px", borderRadius: 8, border: "none", background: logging ? GRAY_LIGHT : CERULEAN, color: logging ? MUTED : "#fff", fontSize: 15, fontWeight: 600, marginTop: 2, cursor: logging ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {logging ? (
              <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span> {t("loggingIn")}</>
            ) : t("login")}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: GRAY_LIGHT }} />
          <span style={{ fontSize: 12, color: MUTED }}>{t("or")}</span>
          <div style={{ flex: 1, height: 1, background: GRAY_LIGHT }} />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={logging}
          style={{ width: "100%", padding: "14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", fontSize: 15, fontWeight: 600, cursor: logging ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: logging ? 0.5 : 1 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t("loginWithGoogle")}
        </button>

          <p style={{ color: "#666", fontSize: 11, marginTop: 16, textAlign: "center", lineHeight: 1.5 }}>
          {t("loginWithEmailToUse")}<br />
          {t("studentLabel")}: <strong>sv@uef.edu.vn</strong> / {t("passwordLabel")}: <strong>test123</strong>
        </p>
      </div>
    </div>
  )
}
