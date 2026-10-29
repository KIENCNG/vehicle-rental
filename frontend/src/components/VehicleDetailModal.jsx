import React, { useState } from "react";
import { money, tinhGiaThue, getVehicleImage } from "../utils/constants";

export default function VehicleDetailModal({
  vehicle,
  onClose,
  onBook,
}) {
  if (!vehicle) return null;

  const isOto = vehicle.loaiXe === "OTO" || vehicle.loaiXe === "Ô tô";
  const isAvailable = vehicle.trangThai === "Sẵn sàng";
  const imageUrl = getVehicleImage(vehicle);

  // Bộ tính giá nhanh
  const [estimateDays, setEstimateDays] = useState(3);
  const calculatedTotal = tinhGiaThue(vehicle.loaiXe, vehicle.gia, estimateDays);
  const baseCost = vehicle.gia * estimateDays;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container vehicle-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="detail-layout">
          {/* Cột trái: Ảnh & Badge */}
          <div className="detail-media">
            <div className="detail-image-box">
              <img
                src={imageUrl}
                alt={vehicle.hangXe}
                className="detail-image"
              />
              <div
                className={`status-pill ${
                  isAvailable ? "status-ready" : "status-rented"
                }`}
              >
                {isAvailable ? "● Sẵn sàng phục vụ" : "● Hiện đang có khách thuê"}
              </div>
            </div>

            {/* Bảng giá tóm tắt */}
            <div className="detail-price-highlight">
              <div className="price-tag">
                <span className="price-amount">{money(vehicle.gia)}</span>
                <span className="price-period"> / ngày</span>
              </div>
              <div className="price-subnote">
                {isOto
                  ? "🛡️ Đã bao gồm 10% phí bảo hiểm vật chất xe"
                  : "🎁 Thuê từ 7 ngày trở lên: Giảm ngay 10%"}
              </div>
            </div>
          </div>

          {/* Cột phải: Thông số chi tiết & Tính tiền */}
          <div className="detail-info">
            <div className="detail-header">
              <span className="plate-badge-lg">{vehicle.bienSo}</span>
              <span className="type-badge">
                {isOto ? "🚗 Ô tô du lịch" : "🛵 Xe máy"}
              </span>
              <h2 className="detail-title">{vehicle.hangXe}</h2>
            </div>

            {/* Thông số kỹ thuật */}
            <div className="specs-section">
              <h4 className="specs-title">Thông số kỹ thuật & trang bị</h4>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Hãng xe / Dòng xe</span>
                  <span className="spec-val">{vehicle.hangXe}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Biển kiểm soát</span>
                  <span className="spec-val">{vehicle.bienSo}</span>
                </div>

                {isOto ? (
                  <>
                    <div className="spec-item">
                      <span className="spec-label">Số chỗ ngồi</span>
                      <span className="spec-val">{vehicle.soCho || 5} chỗ</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Loại nhiên liệu</span>
                      <span className="spec-val">{vehicle.loaiNhienLieu || "Xăng"}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Hộp số</span>
                      <span className="spec-val">Số tự động (AT)</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Tiện nghi</span>
                      <span className="spec-val">Camera 360, Apple CarPlay, Bluetooth</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="spec-item">
                      <span className="spec-label">Dung tích xi lanh</span>
                      <span className="spec-val">{vehicle.dungTichXiLanh || 125} cc</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Kiểu dáng xe</span>
                      <span className="spec-val">{vehicle.kieuXe || "Tay ga"}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Động cơ</span>
                      <span className="spec-val">Phun xăng điện tử (Tiết kiệm xăng)</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Trang bị kèm</span>
                      <span className="spec-val">02 Mũ bảo hiểm + 02 Áo mưa</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Interactive Calculator */}
            <div className="rental-calculator">
              <h4 className="calc-title">💡 Tính thử chi phí thuê xe</h4>
              <div className="calc-controls">
                <label className="calc-label">
                  Số ngày thuê dự kiến: <strong>{estimateDays} ngày</strong>
                </label>
                <div className="slider-wrap">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={estimateDays}
                    onChange={(e) => setEstimateDays(parseInt(e.target.value, 10))}
                    className="calc-slider"
                  />
                  <div className="slider-ticks">
                    <span>1 ngày</span>
                    <span>7 ngày</span>
                    <span>15 ngày</span>
                    <span>30 ngày</span>
                  </div>
                </div>
              </div>

              <div className="calc-summary">
                <div className="summary-row">
                  <span>Giá thuê gốc ({estimateDays} ngày × {money(vehicle.gia)}):</span>
                  <span>{money(baseCost)}</span>
                </div>

                {isOto && (
                  <div className="summary-row policy-fee">
                    <span>+ Phụ phí bảo hiểm xe (10%):</span>
                    <span>+{money(baseCost * 0.1)}</span>
                  </div>
                )}

                {!isOto && estimateDays >= 7 && (
                  <div className="summary-row policy-discount">
                    <span>- Ưu đãi thuê từ 7 ngày (giảm 10%):</span>
                    <span>-{money(baseCost * 0.1)}</span>
                  </div>
                )}

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Tổng tiền thanh toán dự tính:</span>
                  <span className="total-amount">{money(calculatedTotal)}</span>
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
              >
                Đóng
              </button>
              <button
                type="button"
                className={`btn-primary ${!isAvailable ? "disabled" : ""}`}
                disabled={!isAvailable}
                onClick={() => {
                  onClose();
                  onBook(vehicle);
                }}
              >
                {isAvailable ? "Đặt xe này ngay" : "Xe hiện không sẵn sàng"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
