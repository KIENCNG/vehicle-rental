import React, { useState, useEffect } from "react";
import { money } from "../utils/constants";
import { apiFetch } from "../utils/api";

export default function CustomerBookingsModal({
  currentUser,
  onClose,
  allContracts,
}) {
  const [userContracts, setUserContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUserContracts() {
      if (!currentUser) {
        setUserContracts([]);
        setLoading(false);
        return;
      }

      if (!currentUser.token) {
        setUserContracts([]);
        setLoading(false);
        return;
      }

      try {
        const res = await apiFetch(
          `/api/hop-dong/khach-hang/${currentUser.khachHangId || 0}`,
        );

        if (!res.ok) {
          throw new Error("Không thể tải đơn thuê");
        }

        const data = await res.json();

        if (isMounted) {
          setUserContracts(data);
        }
      } catch (err) {
        console.error("Lỗi tải đơn thuê:", err);

        if (isMounted) {
          setUserContracts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    setLoading(true);
    loadUserContracts();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container bookings-history-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="modal-history-header">
          <div className="history-icon">📋</div>
          <div>
            <h2 className="history-title">Lịch Sử Đơn Thuê Của Bạn</h2>
            <p className="history-subtitle">
              Danh sách các hợp đồng thuê xe của tài khoản{" "}
              <strong>{currentUser?.hoTen || currentUser?.tenDangNhap}</strong>{" "}
              ({currentUser?.soDienThoai})
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải danh sách đơn thuê...</p>
          </div>
        ) : userContracts.length === 0 ? (
          <div className="empty-history">
            <div className="empty-history-icon">🚗</div>
            <h3>Bạn chưa có đơn thuê xe nào</h3>
            <p>
              Hãy khám phá danh mục phương tiện của AutoRent và chọn một chiếc
              xe phù hợp cho chuyến hành trình sắp tới!
            </p>
            <button type="button" className="btn-primary" onClick={onClose}>
              Xem danh sách xe ngay
            </button>
          </div>
        ) : (
          <div className="history-list">
            {userContracts.map((contract) => {
              const statusRaw = contract.trangThai;
              const statusInfo = getStatusBadge(statusRaw);
              const vehicleInfo = contract.phuongTien
                ? `${contract.phuongTien.hangXe || ""} (${contract.phuongTien.bienSo || ""})`
                : contract.phuongTien || "Phương tiện đã chọn";

              return (
                <div key={contract.id} className="history-card">
                  <div className="history-card-header">
                    <span className="contract-id-pill">
                      Mã HĐ: HD-{String(contract.id).padStart(4, "0")}
                    </span>
                    <span className={`status-tag ${statusInfo.className}`}>
                      {statusInfo.text}
                    </span>
                  </div>

                  <div className="history-card-grid">
                    <div className="h-item">
                      <span className="h-label">Phương tiện thuê:</span>
                      <strong className="h-val">{vehicleInfo}</strong>
                    </div>

                    <div className="h-item">
                      <span className="h-label">Thời gian nhận xe:</span>
                      <span className="h-val">{contract.ngayThue}</span>
                    </div>

                    <div className="h-item">
                      <span className="h-label">Thời gian trả xe:</span>
                      <span className="h-val">{contract.ngayTra}</span>
                    </div>

                    <div className="h-item total-item">
                      <span className="h-label">Tổng tiền hợp đồng:</span>
                      <strong className="h-val-total">
                        {money(contract.tongTien)}
                      </strong>
                    </div>
                  </div>

                  {statusRaw === "CHO_XAC_NHAN" && (
                    <div className="status-note-box">
                      ℹ️ Đơn thuê đang chờ nhân viên kiểm duyệt tình trạng xe và
                      gọi điện xác nhận cho quý khách.
                    </div>
                  )}
                  {statusRaw === "DANG_THUE" && (
                    <div className="status-note-box active-note">
                      🚗 Hợp đồng đang hiệu lực. Chúc quý khách có những chuyến
                      đi thượng lộ bình an!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="modal-history-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function getStatusBadge(status) {
  switch (status) {
    case "CHO_XAC_NHAN":
    case "Chờ xác nhận":
      return { text: "⏳ Chờ xác nhận", className: "status-badge-pending" };
    case "DANG_THUE":
    case "Đang thuê":
      return { text: "🚘 Đang thuê", className: "status-badge-active" };
    case "DA_TRA":
    case "Đã trả":
      return { text: "✅ Đã trả xe", className: "status-badge-returned" };
    case "DA_HUY":
    case "Đã hủy":
      return { text: "❌ Đã hủy", className: "status-badge-cancelled" };
    default:
      return { text: status, className: "status-badge-default" };
  }
}
