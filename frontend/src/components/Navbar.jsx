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
    <header className="customer-navbar premium-navbar">
      <div className="navbar-container premium-navbar-container">
        {/* Brand */}
        <button
          type="button"
          className="navbar-brand premium-brand"
          onClick={() => {
            setViewMode("client");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <div className="premium-logo">V</div>
          <div className="premium-brand-text">
            <div className="navbar-title">VeloRent</div>
            <div className="navbar-subtitle">PREMIUM MOBILITY</div>
          </div>
        </button>

        {/* Navigation */}
        <nav className="navbar-links premium-nav-links">
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
            Phương tiện
          </button>

          <button
            type="button"
            className="nav-link"
            onClick={() => onScrollTo("process-section")}
          >
            Quy trình
          </button>

          <button
            type="button"
            className="nav-link"
            onClick={() => onScrollTo("benefits-section")}
          >
            Lợi ích
          </button>

          {currentUser && (
            <button
              type="button"
              className="nav-link highlight"
              onClick={onOpenMyBookings}
            >
              Đơn thuê của tôi
            </button>
          )}
        </nav>

        {/* Actions */}
        <div className="navbar-actions premium-navbar-actions">
          {currentUser?.vaiTro === "ADMIN" && (
            <button
              type="button"
              className="btn-admin-switch premium-admin-switch"
              onClick={() =>
                setViewMode(viewMode === "admin" ? "client" : "admin")
              }
            >
              {viewMode === "admin" ? "Về trang khách" : "Bảng quản trị"}
            </button>
          )}

          {currentUser ? (
            <div className="user-profile-menu premium-user-menu">
              <div className="user-avatar premium-user-avatar">
                {currentUser.hoTen
                  ? currentUser.hoTen.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div className="user-details">
                <div className="user-name">
                  {currentUser.hoTen || currentUser.tenDangNhap}
                </div>
                <div className="user-role-badge">
                  {currentUser.vaiTro === "ADMIN"
                    ? "Quản trị viên"
                    : "Khách hàng"}
                </div>
              </div>

              <button
                type="button"
                className="btn-logout premium-logout"
                onClick={onLogout}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="auth-buttons premium-auth-buttons">
              <button
                type="button"
                className="btn-login premium-login"
                onClick={() => onOpenAuth("login")}
              >
                Đăng nhập
              </button>

              <button
                type="button"
                className="btn-register premium-register"
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
