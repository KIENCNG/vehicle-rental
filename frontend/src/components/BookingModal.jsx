import React, { useState, useEffect, useMemo } from "react";
import { money, tinhGiaThue, getVehicleImage } from "../utils/constants";
import { apiFetch } from "../utils/api";

export default function BookingModal({
  vehicle,
  currentUser,
  onClose,
  onOpenAuth,
  onBookingSuccess,
}) {
  if (!vehicle) return null;

  const isOto = vehicle.loaiXe === "OTO" || vehicle.loaiXe === "Ô tô";
  const imageUrl = getVehicleImage(vehicle);

  // Khởi tạo ngày thuê (hôm nay) và ngày trả (3 ngày sau)
  const todayStr = new Date().toISOString().split("T")[0];
  const next3Days = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [ngayThue, setNgayThue] = useState(todayStr);
  const [ngayTra, setNgayTra] = useState(next3Days);

  // Thông tin khách hàng
  const [hoTen, setHoTen] = useState(currentUser?.hoTen || "");
  const [soDienThoai, setSoDienThoai] = useState(
    currentUser?.soDienThoai || "",
  );
  const [diaChi, setDiaChi] = useState(currentUser?.diaChi || "Hải Phòng");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successContract, setSuccessContract] = useState(null);

  // Cập nhật khi currentUser thay đổi
  useEffect(() => {
    if (currentUser) {
      if (currentUser.hoTen) setHoTen(currentUser.hoTen);
      if (currentUser.soDienThoai) setSoDienThoai(currentUser.soDienThoai);
      if (currentUser.diaChi) setDiaChi(currentUser.diaChi);
    }
  }, [currentUser]);

  // Tính số ngày thuê
  const diffDays = useMemo(() => {
    if (!ngayThue || !ngayTra) return 0;
    const start = new Date(ngayThue);
    const end = new Date(ngayTra);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.round(diffTime / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  }, [ngayThue, ngayTra]);

  const estimatedTotal = useMemo(() => {
    return tinhGiaThue(vehicle.loaiXe, vehicle.gia, diffDays);
  }, [vehicle.loaiXe, vehicle.gia, diffDays]);

  const basePrice = vehicle.gia * diffDays;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!currentUser || !currentUser.token) {
      setErrorMessage("Vui lòng đăng nhập lại để tiếp tục");
      return;
    }

    if (diffDays <= 0) {
      setErrorMessage("Ngày trả xe phải sau ngày nhận xe ít nhất 1 ngày");
      return;
    }

    if (!hoTen.trim() || !soDienThoai.trim() || !diaChi.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin liên hệ");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingRes = await apiFetch("/api/hop-dong/yeu-cau", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phuongTienId: vehicle.id,
          ngayThue,
          ngayTra,
        }),
      });

      if (!bookingRes.ok) {
        const errText = await bookingRes.text();
        throw new Error(errText || "Không thể tạo yêu cầu thuê xe");
      }

      const createdContract = await bookingRes.json();

      setSuccessContract(createdContract);

      if (onBookingSuccess) {
        onBookingSuccess(createdContract);
      }
    } catch (err) {
      setErrorMessage(err.message || "Đã xảy ra lỗi khi đặt xe");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container booking-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        {successContract ? (
          /* Màn hình thông báo thành công */
          <div className="booking-success-box">
            <div className="success-icon-wrap">🎉</div>
            <h2 className="success-title">Đặt Xe Thành Công!</h2>
            <p className="success-subtitle">
              Yêu cầu thuê xe của bạn đã được ghi nhận trên hệ thống. Nhân viên
              tư vấn của AutoRent sẽ liên hệ với bạn trong vòng 15 phút để xác
              nhận lịch giao xe.
            </p>

            <div className="contract-summary-card">
              <div className="summary-card-header">
                <span className="contract-code">
                  Mã đơn thuê: HD-{String(successContract.id).padStart(4, "0")}
                </span>
                <span className="badge-pending">⏳ Chờ duyệt</span>
              </div>

              <div className="summary-card-body">
                <div className="card-row">
                  <span>Phương tiện:</span>
                  <strong>
                    {vehicle.hangXe} ({vehicle.bienSo})
                  </strong>
                </div>
                <div className="card-row">
                  <span>Khách hàng:</span>
                  <strong>
                    {hoTen} - {soDienThoai}
                  </strong>
                </div>
                <div className="card-row">
                  <span>Thời gian thuê:</span>
                  <span>
                    {ngayThue} đến {ngayTra} ({diffDays} ngày)
                  </span>
                </div>
                <div className="card-row card-row-total">
                  <span>Tổng tiền thanh toán:</span>
                  <strong className="total-highlight">
                    {money(successContract.tongTien || estimatedTotal)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="success-actions">
              <button type="button" className="btn-primary" onClick={onClose}>
                Hoàn tất & Về trang chủ
              </button>
            </div>
          </div>
        ) : (
          /* Form đặt xe */
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="booking-header">
              <h2 className="booking-title">Đăng Ký Thuê Xe Trực Tuyến</h2>
              <p className="booking-subtitle">
                Vui lòng kiểm tra kỹ thông tin và thời gian thuê để chúng tôi
                chuẩn bị xe tốt nhất cho bạn.
              </p>
            </div>

            {/* Thông tin xe tóm tắt */}
            <div className="booking-vehicle-preview">
              <img
                src={imageUrl}
                alt={vehicle.hangXe}
                className="preview-thumb"
              />
              <div className="preview-meta">
                <div className="preview-plate">{vehicle.bienSo}</div>
                <div className="preview-name">{vehicle.hangXe}</div>
                <div className="preview-price">
                  Đơn giá: <strong>{money(vehicle.gia)}</strong> / ngày
                </div>
              </div>
              <div className="preview-policy">
                {isOto ? "🛡️ Phí bảo hiểm 10%" : "🎁 Thuê ≥ 7 ngày giảm 10%"}
              </div>
            </div>

            {/* Cảnh báo lỗi nếu có */}
            {errorMessage && (
              <div className="form-error-alert">⚠️ {errorMessage}</div>
            )}

            <div className="booking-sections-grid">
              {/* Cột 1: Thời gian thuê */}
              <div className="form-column">
                <h4 className="column-title">1. Thời gian thuê xe</h4>

                <div className="form-group">
                  <label>Ngày nhận xe</label>
                  <input
                    type="date"
                    min={todayStr}
                    value={ngayThue}
                    onChange={(e) => setNgayThue(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ngày trả xe</label>
                  <input
                    type="date"
                    min={ngayThue || todayStr}
                    value={ngayTra}
                    onChange={(e) => setNgayTra(e.target.value)}
                    required
                  />
                </div>

                <div className="date-calc-box">
                  <div className="date-calc-row">
                    <span>Số ngày thuê:</span>
                    <strong>{diffDays} ngày</strong>
                  </div>
                  <div className="date-calc-row">
                    <span>Giá thuê gốc:</span>
                    <span>{money(basePrice)}</span>
                  </div>

                  {isOto && (
                    <div className="date-calc-row fee-text">
                      <span>+ Bảo hiểm vật chất (10%):</span>
                      <span>+{money(basePrice * 0.1)}</span>
                    </div>
                  )}

                  {!isOto && diffDays >= 7 && (
                    <div className="date-calc-row discount-text">
                      <span>- Ưu đãi giảm giá 10%:</span>
                      <span>-{money(basePrice * 0.1)}</span>
                    </div>
                  )}

                  <div className="date-calc-row total-calc-row">
                    <span>Tổng tiền tạm tính:</span>
                    <strong className="text-primary-lg">
                      {money(estimatedTotal)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Cột 2: Thông tin khách hàng */}
              <div className="form-column">
                <div className="column-title-wrap">
                  <h4 className="column-title">2. Thông tin người thuê</h4>
                  {!currentUser && (
                    <button
                      type="button"
                      className="btn-quick-login-link"
                      onClick={() => onOpenAuth("login")}
                    >
                      Đã có tài khoản? Đăng nhập
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Họ và tên người thuê *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn An"
                    value={hoTen}
                    onChange={(e) => setHoTen(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại liên hệ *</label>
                  <input
                    type="tel"
                    placeholder="Ví dụ: 0987654321"
                    value={soDienThoai}
                    onChange={(e) => setSoDienThoai(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Địa chỉ nhận xe / giao xe *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Số 123 Lê Hồng Phong, Hải Phòng hoặc Sân bay Cát Bi"
                    value={diaChi}
                    onChange={(e) => setDiaChi(e.target.value)}
                    required
                  />
                </div>

                <div className="booking-notes">
                  <p>
                    💡 <strong>Lưu ý:</strong> Khi nhận xe, quý khách vui lòng
                    xuất trình CMND/CCCD và Giấy phép lái xe hợp lệ. Tiền cọc sẽ
                    được hoàn trả 100% khi trả xe nguyên vẹn.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer hành động */}
            <div className="booking-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting || diffDays <= 0}
              >
                {isSubmitting
                  ? "Đang gửi yêu cầu..."
                  : `Xác nhận đặt xe • ${money(estimatedTotal)}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
