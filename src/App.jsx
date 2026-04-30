import { useState, useEffect } from "react";
import "./App.css";

// ============================================
//  CUSTOM VALIDATION FUNCTION
// ============================================
function validatePassword(value) {
  const hasMinLength = value.length >= 8;
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[!@#$%^&*()_+=\-[\]{};':"\\|,.<>?]/.test(value);
  return hasMinLength && hasNumber && hasSymbol;
}

function getPasswordStrength(value) {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (/\d/.test(value)) score++;
  if (/[!@#$%^&*()_+=\-[\]{};':"\\|,.<>?]/.test(value)) score++;
  if (value.length >= 12) score++;
  return score;
}

function validateUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

// ============================================
//  INITIAL STATE
// ============================================
const initialForm = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  age: "",
  ticketType: "",
  websiteUrl: "",
  teamRole: "",
  githubProfile: "",
  hackathonExperience: "",
  agreeToTerms: false,
};

const initialErrors = Object.fromEntries(
  Object.keys(initialForm).map((k) => [k, ""])
);

// ============================================
//  MAIN COMPONENT
// ============================================
export default function HackathonForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [touched, setTouched] = useState({});

  // ---- Auto-hide success notification after 3s ----
  useEffect(() => {
    if (!isSubmitted) return;
    const timer = setTimeout(() => setIsSubmitted(false), 3000);
    return () => clearTimeout(timer);
  }, [isSubmitted]);

  // ---- Validate single field ----
  function validateField(name, value) {
    switch (name) {
      case "fullName":
        return value.trim() ? "" : "Nama lengkap wajib diisi";
      case "username":
        if (!value.trim()) return "Username wajib diisi";
        if (value.length < 6) return "Username minimal 6 karakter";
        if (value.length > 20) return "Username maksimal 20 karakter";
        return "";
      case "email":
        if (!value.trim()) return "Email wajib diisi";
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Format email tidak valid";
      case "password":
        if (!value) return "Password wajib diisi";
        return validatePassword(value)
          ? ""
          : "Password harus 8+ karakter, mengandung angka & simbol";
      case "age": {
        if (value === "" || value === null) return "Umur wajib diisi";
        const age = Number(value);
        return age >= 18 && age <= 100
          ? ""
          : "Peserta harus berusia antara 18-100 tahun";
      }
      case "ticketType":
        return value ? "" : "Anda harus memilih tipe tiket";
      case "websiteUrl":
        if (!value) return "";
        return validateUrl(value) ? "" : "Format URL tidak valid";
      case "teamRole":
        return value ? "" : "Role tim wajib dipilih";
      case "githubProfile":
        if (!value.trim()) return "GitHub profile wajib diisi";
        return /^https:\/\/github\.com\/[a-zA-Z0-9-]+/.test(value)
          ? ""
          : "Format URL GitHub tidak valid (contoh: https://github.com/username)";
      case "hackathonExperience":
        return value ? "" : "Pengalaman hackathon wajib dipilih";
      case "agreeToTerms":
        return value ? "" : "Anda harus menyetujui syarat dan ketentuan";
      default:
        return "";
    }
  }

  // ---- Validate all fields ----
  function validateAll() {
    const newErrors = {};
    Object.keys(form).forEach((name) => {
      newErrors[name] = validateField(name, form[name]);
    });
    return newErrors;
  }

  // ---- Handle change ----
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue),
      }));
    }
  }

  function handleBlur(e) {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, val) }));
  }

  // ---- Handle radio ----
  function handleRadio(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }

  // ---- Submit ----
  function handleSubmit(e) {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(form).map((k) => [k, true])));
    const newErrors = validateAll();
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((v) => v !== "");
    if (hasError) return;

    console.log("=== HACKATHON REGISTRATION DATA ===");
    console.log(JSON.stringify(form, null, 2));

    setSubmittedName(form.fullName);
    setIsSubmitted(true);
    setForm(initialForm);
    setErrors(initialErrors);
    setTouched({});
  }

  const pwStrength = getPasswordStrength(form.password);
  const strengthLabels = ["", "weak", "medium", "medium", "strong"];
  const strengthLabel = strengthLabels[pwStrength] || "";

  const TEAM_ROLES = ["Frontend Dev", "Backend Dev", "UI/UX Designer", "DevOps", "Data Engineer", "Product Manager", "Full-Stack Dev"];
  const EXP_OPTIONS = ["Baru pertama kali", "1-2 kali", "3-5 kali", "Veteran (6+ kali)"];

  return (
    <div className="form-page">
      {/* ---- SUCCESS TOAST ---- */}
      {isSubmitted && (
        <div className="success-toast">
          <div className="toast-icon">⚡</div>
          <div className="toast-title">Registration Confirmed</div>
          <div className="toast-body">
            Registrasi Berhasil, {submittedName} - HackFest 2025!
          </div>
          <div className="toast-countdown">Auto-dismiss in 3s...</div>
        </div>
      )}

      <div className="form-wrapper">
        {/* ---- HEADER ---- */}
        <div className="form-header">
          <div className="form-badge">▶ HackFest 2026 Open</div>
          <h1 className="form-title">Registrasi Peserta<br />Hackathon</h1>
          <p className="form-subtitle">
            48 jam • <span>Inovasi Tanpa Batas</span> • Jakarta, Indonesia
          </p>
        </div>

        {/* ---- CARD ---- */}
        <div className="form-card">
          <form onSubmit={handleSubmit} noValidate>

            {/* SECTION 1: IDENTITAS */}
            <div className="form-section">
              <div className="section-label">Identitas Peserta</div>
              <div className="form-grid">

                {/* Full Name */}
                <div className="field-group full-width">
                  <label className="field-label">
                    <span className="required-dot" /> Nama Lengkap
                  </label>
                  <input
                    className={`field-input${errors.fullName ? " error" : ""}`}
                    type="text"
                    name="fullName"
                    placeholder="Masukkan nama lengkap kamu"
                    value={form.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.fullName && <span className="error-msg">⚠ {errors.fullName}</span>}
                </div>

                {/* Username */}
                <div className="field-group">
                  <label className="field-label">
                    <span className="required-dot" /> Username
                  </label>
                  <input
                    className={`field-input${errors.username ? " error" : ""}`}
                    type="text"
                    name="username"
                    placeholder="min. 6 karakter"
                    value={form.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.username && <span className="error-msg">⚠ {errors.username}</span>}
                </div>

                {/* Age */}
                <div className="field-group">
                  <label className="field-label">
                    <span className="required-dot" /> Umur
                  </label>
                  <input
                    className={`field-input${errors.age ? " error" : ""}`}
                    type="number"
                    name="age"
                    placeholder="18 - 100"
                    min={18}
                    max={100}
                    value={form.age}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.age && <span className="error-msg">⚠ {errors.age}</span>}
                </div>

                {/* Email */}
                <div className="field-group full-width">
                  <label className="field-label">
                    <span className="required-dot" /> Email
                  </label>
                  <input
                    className={`field-input${errors.email ? " error" : ""}`}
                    type="email"
                    name="email"
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && <span className="error-msg">⚠ {errors.email}</span>}
                </div>

                {/* Password */}
                <div className="field-group full-width">
                  <label className="field-label">
                    <span className="required-dot" /> Password
                  </label>
                  <input
                    className={`field-input${errors.password ? " error" : ""}`}
                    type="password"
                    name="password"
                    placeholder="8+ karakter, angka, dan simbol"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {form.password && (
                    <div className="password-strength">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`strength-bar${i <= pwStrength ? " " + strengthLabel : ""}`}
                        />
                      ))}
                    </div>
                  )}
                  {errors.password && <span className="error-msg">⚠ {errors.password}</span>}
                </div>

              </div>
            </div>

            {/* SECTION 2: EVENT */}
            <div className="form-section">
              <div className="section-label">Detail Pendaftaran Event</div>
              <div className="form-grid">

                {/* Ticket Type */}
                <div className="field-group full-width">
                  <label className="field-label">
                    <span className="required-dot" /> Tipe Tiket
                  </label>
                  <select
                    className={`field-select${errors.ticketType ? " error" : ""}`}
                    name="ticketType"
                    value={form.ticketType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">-- Pilih Tipe Tiket --</option>
                    <option value="early-bird">🎯 Early Bird — Rp 99.000</option>
                    <option value="regular">💡 Regular — Rp 149.000</option>
                    <option value="team-bundle">👥 Team Bundle (5 orang) — Rp 599.000</option>
                    <option value="student">🎓 Student Pass — Rp 49.000</option>
                    <option value="vip">⚡ VIP All-Access — Rp 299.000</option>
                  </select>
                  {errors.ticketType && <span className="error-msg">⚠ {errors.ticketType}</span>}
                </div>

                {/* Hackathon Experience */}
                <div className="field-group full-width">
                  <label className="field-label">
                    <span className="required-dot" /> Pengalaman Hackathon
                  </label>
                  <div className="radio-group">
                    {EXP_OPTIONS.map((opt) => (
                      <label
                        key={opt}
                        className={`radio-option${form.hackathonExperience === opt ? " selected" : ""}${errors.hackathonExperience && !form.hackathonExperience ? " error-radio" : ""}`}
                      >
                        <input
                          type="radio"
                          name="hackathonExperience"
                          value={opt}
                          checked={form.hackathonExperience === opt}
                          onChange={() => handleRadio("hackathonExperience", opt)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {errors.hackathonExperience && <span className="error-msg">⚠ {errors.hackathonExperience}</span>}
                </div>

                {/* Team Role (Custom Field) */}
                <div className="field-group full-width">
                  <label className="field-label">
                    <span className="required-dot" /> Role dalam Tim
                  </label>
                  <div className="radio-group">
                    {TEAM_ROLES.map((role) => (
                      <label
                        key={role}
                        className={`radio-option${form.teamRole === role ? " selected" : ""}${errors.teamRole && !form.teamRole ? " error-radio" : ""}`}
                      >
                        <input
                          type="radio"
                          name="teamRole"
                          value={role}
                          checked={form.teamRole === role}
                          onChange={() => handleRadio("teamRole", role)}
                        />
                        {role}
                      </label>
                    ))}
                  </div>
                  {errors.teamRole && <span className="error-msg">⚠ {errors.teamRole}</span>}
                </div>

              </div>
            </div>

            {/* SECTION 3: PROFIL */}
            <div className="form-section">
              <div className="section-label">Profil & Portofolio</div>
              <div className="form-grid">

                {/* GitHub */}
                <div className="field-group full-width">
                  <label className="field-label">
                    <span className="required-dot" /> GitHub Profile
                  </label>
                  <input
                    className={`field-input${errors.githubProfile ? " error" : ""}`}
                    type="text"
                    name="githubProfile"
                    placeholder="https://github.com/username"
                    value={form.githubProfile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.githubProfile && <span className="error-msg">⚠ {errors.githubProfile}</span>}
                </div>

                {/* Website (optional) */}
                <div className="field-group full-width">
                  <label className="field-label">
                    Website / Portofolio{" "}
                    <span className="optional-tag">opsional</span>
                  </label>
                  <input
                    className={`field-input${errors.websiteUrl ? " error" : ""}`}
                    type="text"
                    name="websiteUrl"
                    placeholder="https://portofoliomu.com"
                    value={form.websiteUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.websiteUrl && <span className="error-msg">⚠ {errors.websiteUrl}</span>}
                </div>

              </div>
            </div>

            {/* SECTION 4: TERMS */}
            <div className="form-section">
              <div className="section-label">Persetujuan</div>
              <label className={`checkbox-wrapper${errors.agreeToTerms ? " error" : ""}`}>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={form.agreeToTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className="checkbox-text">
                  Saya menyetujui{" "}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Syarat &amp; Ketentuan
                  </a>{" "}
                  serta{" "}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Kebijakan Privasi
                  </a>{" "}
                  HackFest 2026. Saya memahami bahwa data yang saya berikan akan
                  digunakan untuk keperluan registrasi event.
                </span>
              </label>
              {errors.agreeToTerms && (
                <span className="error-msg">⚠ {errors.agreeToTerms}</span>
              )}
            </div>

            {/* SUBMIT */}
            <button type="submit" className="submit-btn">
              <span>⚡ Daftarkan Saya Sekarang</span>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
