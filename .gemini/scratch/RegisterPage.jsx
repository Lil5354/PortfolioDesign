function RegisterPage({ setPage }) {
  const [form, setForm] = useState({ lastName: "", firstName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPasswords, setShowPasswords] = useState({ password: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateField = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    let newErrors = {};
    if (!form.lastName) newErrors.lastName = "Vui lòng nhập họ";
    if (!form.firstName) newErrors.firstName = "Vui lòng nhập tên";
    
    if (!form.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ (ví dụ: sv@uef.edu.vn)";
    }
    
    if (!form.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (gồm 10-11 chữ số)";
    }

    if (!form.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (form.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }
    
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          fullName: `${form.lastName} ${form.firstName}`.trim(),
          password: form.password,
          phone: form.phone
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Đăng ký thất bại");
      setSuccess(true);
      setTimeout(() => setPage("auth"), 2000);
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <img src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80" alt="register-bg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(7,126,158,0.6) 0%, rgba(0,0,0,0.55) 100%)" }} />
        <div style={{ position: "absolute", top: 40, left: 40, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setPage("home")}>
          <img src="/logo-uef.png" alt="UEF" style={{ height: 32, filter: "brightness(0) invert(1)" }} />
          <span style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>Design Gallery</span>
        </div>
        <div style={{ position: "absolute", bottom: 48, left: 48, right: 48 }}>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: 22, fontWeight: 300, lineHeight: 1.55, letterSpacing: "-0.3px", margin: "0 0 14px" }}>{t("creativityQuote")}<br /><span style={{ fontSize: 16, opacity: 0.8 }}>{t("joinUefCreative")}</span></p>
        </div>
      </div>
      <div className="auth-form-panel" style={{ width: 480, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 56px", overflow: "auto" }}>
        <div style={{ width: "100%", maxWidth: 340, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}><img src="/logo-uef.png" alt="UEF" style={{ height: 30 }} /><span style={{ fontWeight: 700, fontSize: 16, color: BLACK }}>Design Gallery</span></div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: BLACK, margin: "0 0 6px", letterSpacing: "-0.6px" }}>{t("createNewAccount")}</h1>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>{t("registerDescription")}</p>

          {success ? (
            <div style={{ padding: 20, background: "#F0FFF0", borderRadius: 8, textAlign: "center" }}>
              <p style={{ color: "#2F855A", fontWeight: 600, fontSize: 14 }}>{t("registerSuccess")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("lastName")}</label>
                    <input type="text" value={form.lastName} onChange={updateField("lastName")} placeholder={t("lastNamePlaceholder")} style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${errors.lastName ? "#E53E3E" : GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                    {errors.lastName && <p style={{ color: "#E53E3E", fontSize: 11, marginTop: 4 }}>{errors.lastName}</p>}
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("firstName")}</label>
                    <input type="text" value={form.firstName} onChange={updateField("firstName")} placeholder={t("firstNamePlaceholder")} style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${errors.firstName ? "#E53E3E" : GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                    {errors.firstName && <p style={{ color: "#E53E3E", fontSize: 11, marginTop: 4 }}>{errors.firstName}</p>}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("email")}</label>
                  <input type="text" value={form.email} onChange={updateField("email")} placeholder="example@gmail.com" style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${errors.email ? "#E53E3E" : GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                  {errors.email && <p style={{ color: "#E53E3E", fontSize: 11, marginTop: 4 }}>{errors.email}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>Số điện thoại</label>
                  <input type="text" value={form.phone} onChange={updateField("phone")} placeholder="09xxxxxxxxx" style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${errors.phone ? "#E53E3E" : GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                  {errors.phone && <p style={{ color: "#E53E3E", fontSize: 11, marginTop: 4 }}>{errors.phone}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("password")}</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPasswords.password ? "text" : "password"} value={form.password} onChange={updateField("password")} placeholder={t("passwordPlaceholder")} style={{ width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${errors.password ? "#E53E3E" : GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                    <button type="button" onClick={() => setShowPasswords({ ...showPasswords, password: !showPasswords.password })} tabIndex={-1} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED }}>{showPasswords.password ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                  {errors.password && <p style={{ color: "#E53E3E", fontSize: 11, marginTop: 4 }}>{errors.password}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("confirmPassword")}</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPasswords.confirm ? "text" : "password"} value={form.confirmPassword} onChange={updateField("confirmPassword")} placeholder="••••••••" style={{ width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${errors.confirmPassword ? "#E53E3E" : GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                    <button type="button" onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} tabIndex={-1} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED }}>{showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                  {errors.confirmPassword && <p style={{ color: "#E53E3E", fontSize: 11, marginTop: 4 }}>{errors.confirmPassword}</p>}
                </div>
              </div>

              {errors.form && <p style={{ color: "#E53E3E", fontSize: 12, marginTop: 12, textAlign: "center" }}>{errors.form}</p>}

              <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, marginTop: 16, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? t("processing") : t("register")}
              </button>
            </form>
          )}

          <p style={{ fontSize: 12, color: MUTED, textAlign: "center", marginTop: 20 }}>{t("alreadyHaveAccount")} <span onClick={() => setPage("auth")} style={{ color: CERULEAN, cursor: "pointer", fontWeight: 600 }}>{t("login")}</span></p>
        </div>
      </div>
    </div>
  );
}
