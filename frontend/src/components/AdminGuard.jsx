import React from "react";

export default function AdminGuard({
  currentUser,
  onBackToClient,
  onOpenAuth,
}) {
  return (
    <div className="admin-guard-container">
      <div className="guard-card">
        <div className="guard-icon">🔒</div>
        <h2 className="guard-title">Khu Vực Giới Hạn Quản Trị Viên</h2>
        <p className="guard-message">
          Trang quản trị (Admin Panel), quản lý xe, khách hàng và duyệt hợp đồng chỉ dành riêng cho tài khoản có vai trò <strong>Quản trị viên (ADMIN)</strong>.
        </p>

        {currentUser ? (
          <div className="guard-user-info">
            Tài khoản hiện tại của bạn: <strong>{currentUser.hoTen || currentUser.tenDangNhap}</strong> (Vai trò: <em>{currentUser.vaiTro}</em>) không có quyền truy cập trang này.
          </div>
        ) : (
          <div className="guard-user-info">
            Bạn chưa đăng nhập vào hệ thống.
          </div>
        )}

        <div className="guard-actions">
          <button
            type="button"
            className="btn-guard-secondary"
            onClick={onBackToClient}
          >
            ← Về Giao diện Khách hàng
          </button>

          <button
            type="button"
            className="btn-guard-primary"
            onClick={() => onOpenAuth("login")}
          >
            🔑 Đăng nhập quyền Admin
          </button>
        </div>
      </div>
    </div>
  );
}
