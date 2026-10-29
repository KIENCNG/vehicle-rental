import React from "react";

export default function Navbar({
  currentUser,
  viewMode,
  setViewMode,
  onOpenAuth,
  onLogout,
  onOpenMyBookings,
  onScrollTo,
}) {
  return (
    <header className="customer-navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand" onClick={() => setViewMode("client")}>
          <div className="navbar-logo">🚘</div>
          <div>
            <div className="navbar-title">AutoRent</div>
            <div className="navbar-subtitle">Thuê xe tự lái uy tín</div>
          </div>
        </div>

        {/* Links */}
        <nav className="navbar-links">
          <button
            type="button"
            className={`nav-link ${viewMode === "client" ? "active" : ""}`}
            onClick={() => {
              setViewMode("client");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Trang chủ
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => onScrollTo("catalog-section")}
          >
            Danh sách xe
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => onScrollTo("process-section")}
          >
            Quy trình thuê
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => onScrollTo("benefits-section")}
          >
            Lợi ích
          </button>

          {/* Customer only: My Bookings */}
          {currentUser && (
            <button
              type="button"
              className="nav-link highlight"
              onClick={onOpenMyBookings}
            >
              📋 Đơn thuê của tôi
            </button>
          )}
        </nav>

        {/* Right action area */}
        <div className="navbar-actions">
          {/* Admin Switcher */}
          {currentUser?.vaiTro === "ADMIN" && (
            <button
              type="button"
              className={`btn-admin-switch ${viewMode === "admin" ? "in-admin" : ""}`}
              onClick={() => setViewMode(viewMode === "admin" ? "client" : "admin")}
            >
              {viewMode === "admin" ? "🌐 Về trang khách" : "⚙️ Bảng Quản Trị"}
            </button>
          )}

          {/* User info or Login/Register buttons */}
          {currentUser ? (
            <div className="user-profile-menu">
              <div className="user-avatar">
                {currentUser.hoTen ? currentUser.hoTen.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="user-details">
                <div className="user-name">{currentUser.hoTen || currentUser.tenDangNhap}</div>
                <div className="user-role-badge">
                  {currentUser.vaiTro === "ADMIN" ? "Quản trị viên" : "Khách hàng"}
                </div>
              </div>
              <button
                type="button"
                className="btn-logout"
                title="Đăng xuất"
                onClick={onLogout}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button
                type="button"
                className="btn-login"
                onClick={() => onOpenAuth("login")}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className="btn-register"
                onClick={() => onOpenAuth("register")}
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
