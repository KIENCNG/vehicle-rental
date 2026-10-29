import React, { useState } from "react";

export default function AuthModal({
  initialTab = "login",
  onClose,
  onSuccess,
}) {
  const [tab, setTab] = useState(initialTab); // 'login' or 'register'

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regAddress, setRegAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Nút điền nhanh tài khoản mẫu
  const fillQuickAccount = (user, pass) => {
    setLoginUsername(user);
    setLoginPassword(pass);
    setErrorMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/dang-nhap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenDangNhap: loginUsername.trim(),
          matKhau: loginPassword,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Tên đăng nhập hoặc mật khẩu không chính xác");
      }

      const userData = await res.json();
      localStorage.setItem("vr_user", JSON.stringify(userData));
      onSuccess(userData);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (regPassword.length < 6) {
      setErrorMessage("Mật khẩu phải có độ dài từ 6 ký tự trở lên");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/dang-ky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenDangNhap: regUsername.trim(),
          matKhau: regPassword,
          hoTen: regFullName.trim(),
          soDienThoai: regPhone.trim(),
          email: regEmail.trim() || null,
          diaChi: regAddress.trim() || null,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Không thể đăng ký tài khoản");
      }

      const userData = await res.json();
      localStorage.setItem("vr_user", JSON.stringify(userData));
      onSuccess(userData);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Tab Header */}
        <div className="auth-tab-header">
          <button
            type="button"
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => {
              setTab("login");
              setErrorMessage("");
            }}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            className={`auth-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => {
              setTab("register");
              setErrorMessage("");
            }}
          >
            Tạo Tài Khoản Mới
          </button>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="auth-error-box">
            ⚠️ {errorMessage}
          </div>
        )}

        {tab === "login" ? (
          /* FORM ĐĂNG NHẬP */
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Tên đăng nhập hoặc Số điện thoại</label>
              <input
                type="text"
                placeholder="Nhập tên đăng nhập hoặc SĐT..."
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu..."
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng Nhập"}
            </button>

            {/* Quick Login Test Accounts */}
            <div className="quick-login-section">
              <div className="quick-login-title">
                <span>HOẶC ĐĂNG NHẬP NHANH VỚI TÀI KHOẢN MẪU:</span>
              </div>
              <div className="quick-buttons-row">
                <button
                  type="button"
                  className="btn-quick-acc btn-quick-admin"
                  onClick={() => fillQuickAccount("admin", "admin123")}
                >
                  👑 Quản trị viên (admin)
                </button>
                <button
                  type="button"
                  className="btn-quick-acc btn-quick-cust"
                  onClick={() => fillQuickAccount("customer", "customer123")}
                >
                  👤 Khách hàng (customer)
                </button>
              </div>
            </div>

            <div className="auth-switch-text">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setTab("register");
                  setErrorMessage("");
                }}
              >
                Đăng ký ngay
              </button>
            </div>
          </form>
        ) : (
          /* FORM ĐĂNG KÝ */
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-form-grid">
              <div className="form-group">
                <label>Tên đăng nhập *</label>
                <input
                  type="text"
                  placeholder="Từ 3 ký tự (vd: an_nguyen)"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu *</label>
                <input
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Họ và tên *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  placeholder="Ví dụ: 0987654321"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email liên hệ</label>
                <input
                  type="email"
                  placeholder="Ví dụ: an.nguyen@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lê Hồng Phong, Hải Phòng"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Đang tạo tài khoản..." : "Hoàn Tất Đăng Ký"}
            </button>

            <div className="auth-switch-text">
              Đã có tài khoản?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setTab("login");
                  setErrorMessage("");
                }}
              >
                Đăng nhập tại đây
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
