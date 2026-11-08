import React, { useState, useMemo } from "react";
import { money, getVehicleImage } from "../utils/constants";

export default function CustomerHome({
  vehicles,
  onSelectVehicleForDetail,
  onSelectVehicleForBooking,
  onOpenAuth,
  currentUser,
}) {
  const [filterType, setFilterType] = useState("ALL"); // ALL, OTO, XEMAY
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("DEFAULT"); // DEFAULT, PRICE_ASC, PRICE_DESC, NAME_ASC
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Lọc và sắp xếp xe
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Lọc theo loại
        if (filterType === "OTO") {
          if (v.loaiXe !== "OTO" && v.loaiXe !== "Ô tô") return false;
        }
        if (filterType === "XEMAY") {
          if (v.loaiXe !== "XEMAY" && v.loaiXe !== "Xe máy") return false;
        }
        // Lọc theo từ khóa
        if (searchKeyword.trim()) {
          const kw = searchKeyword.toLowerCase().trim();
          const matchName = (v.hangXe || "").toLowerCase().includes(kw);
          const matchPlate = (v.bienSo || "").toLowerCase().includes(kw);
          if (!matchName && !matchPlate) return false;
        }
        // Lọc xe sẵn sàng
        if (onlyAvailable) {
          if (v.trangThai !== "Sẵn sàng") return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "PRICE_ASC") return a.gia - b.gia;
        if (sortBy === "PRICE_DESC") return b.gia - a.gia;
        if (sortBy === "NAME_ASC")
          return (a.hangXe || "").localeCompare(b.hangXe || "");
        return 0;
      });
  }, [vehicles, filterType, searchKeyword, sortBy, onlyAvailable]);

  const carCount = vehicles.filter(
    (v) => v.loaiXe === "OTO" || v.loaiXe === "Ô tô",
  ).length;
  const bikeCount = vehicles.filter(
    (v) => v.loaiXe === "XEMAY" || v.loaiXe === "Xe máy",
  ).length;

  return (
    <div className="customer-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            ✨ Dịch vụ thuê xe tự lái số 1 Hải Phòng
          </div>
          <h1 className="hero-title">
            Trải nghiệm hành trình hoàn hảo với xe đời mới cùng{" "}
            <span className="text-gradient">VeloRent</span>
          </h1>
          <p className="hero-desc">
            Cung cấp đa dạng các dòng xe ô tô 4-7 chỗ và xe máy chất lượng cao.
            Đặt lịch online chỉ trong 3 phút, giao xe tận nơi miễn phí, bảo hiểm
            an tâm 100%.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn-hero-primary"
              onClick={() => {
                const el = document.getElementById("catalog-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              🚘 Xem danh sách xe
            </button>
            <a href="tel:19006868" className="btn-hero-secondary">
              📞 Hotline: 1900 6868
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Phương tiện đời mới</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Bảo hiểm vật chất</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">3 Phút</div>
              <div className="stat-label">Thủ tục đơn giản</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Hỗ trợ & cứu hộ</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG SECTION */}
      <section id="catalog-section" className="catalog-section">
        <div className="section-header">
          <div className="section-subtitle">DANH MỤC PHƯƠNG TIỆN</div>
          <h2 className="section-title">Chọn Chiếc Xe Cho Chuyến Đi Của Bạn</h2>
          <p className="section-desc">
            Toàn bộ phương tiện được kiểm định định kỳ, vệ sinh sạch sẽ và đổ
            đầy xăng trước khi giao đến tay khách hàng.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab ${filterType === "ALL" ? "active" : ""}`}
              onClick={() => setFilterType("ALL")}
            >
              Tất cả ({vehicles.length})
            </button>
            <button
              type="button"
              className={`filter-tab ${filterType === "OTO" ? "active" : ""}`}
              onClick={() => setFilterType("OTO")}
            >
              🚗 Ô tô ({carCount})
            </button>
            <button
              type="button"
              className={`filter-tab ${filterType === "XEMAY" ? "active" : ""}`}
              onClick={() => setFilterType("XEMAY")}
            >
              🛵 Xe máy ({bikeCount})
            </button>
          </div>

          <div className="filter-controls">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm theo hãng xe, tên xe, biển số..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              {searchKeyword && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchKeyword("")}
                >
                  ✕
                </button>
              )}
            </div>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="DEFAULT">Sắp xếp: Mặc định</option>
              <option value="PRICE_ASC">Giá: Thấp đến Cao</option>
              <option value="PRICE_DESC">Giá: Cao đến Thấp</option>
              <option value="NAME_ASC">Tên xe: A - Z</option>
            </select>

            <label className="available-toggle">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
              />
              <span>Chỉ hiện xe sẵn sàng</span>
            </label>
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="empty-catalog">
            <div className="empty-icon">🚗</div>
            <h3>Không tìm thấy phương tiện phù hợp</h3>
            <p>
              Vui lòng thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm của bạn.
            </p>
            <button
              type="button"
              className="btn-reset-filter"
              onClick={() => {
                setFilterType("ALL");
                setSearchKeyword("");
                setOnlyAvailable(false);
              }}
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="vehicle-grid">
            {filteredVehicles.map((vehicle) => {
              const isOto =
                vehicle.loaiXe === "OTO" || vehicle.loaiXe === "Ô tô";
              const isAvailable = vehicle.trangThai === "Sẵn sàng";
              const imageUrl = getVehicleImage(vehicle);

              return (
                <div key={vehicle.id} className="vehicle-card">
                  <div className="card-image-wrap">
                    <img
                      src={imageUrl}
                      alt={vehicle.hangXe}
                      className="card-image"
                      loading="lazy"
                    />
                    <div
                      className={`status-pill ${
                        isAvailable ? "status-ready" : "status-rented"
                      }`}
                    >
                      {isAvailable ? "● Sẵn sàng" : "● Đang cho thuê"}
                    </div>
                    <div className="type-pill">
                      {isOto ? "🚗 Ô tô" : "🛵 Xe máy"}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="card-plate-wrap">
                      <span className="plate-badge">{vehicle.bienSo}</span>
                    </div>

                    <h3 className="card-title">{vehicle.hangXe}</h3>

                    {/* Specifications preview */}
                    <div className="card-specs">
                      {isOto ? (
                        <>
                          <span className="spec-tag">
                            💺 {vehicle.soCho || 5} chỗ
                          </span>
                          <span className="spec-tag">
                            ⛽ {vehicle.loaiNhienLieu || "Xăng"}
                          </span>
                          <span className="spec-tag policy-tag">
                            🛡️ Đã gồm 10% bảo hiểm
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="spec-tag">
                            ⚡ {vehicle.dungTichXiLanh || 125}cc
                          </span>
                          <span className="spec-tag">
                            🛵 {vehicle.kieuXe || "Tay ga"}
                          </span>
                          <span className="spec-tag policy-tag discount-tag">
                            🎁 Giảm 10% khi thuê ≥ 7 ngày
                          </span>
                        </>
                      )}
                    </div>

                    <div className="card-footer">
                      <div className="price-box">
                        <div className="price-label">Giá thuê theo ngày</div>
                        <div className="price-value">
                          {money(vehicle.gia)}
                          <span className="price-unit"> /ngày</span>
                        </div>
                      </div>

                      <div className="card-actions">
                        <button
                          type="button"
                          className="btn-card-detail"
                          onClick={() => onSelectVehicleForDetail(vehicle)}
                        >
                          Chi tiết
                        </button>
                        <button
                          type="button"
                          className={`btn-card-book ${!isAvailable ? "disabled" : ""}`}
                          disabled={!isAvailable}
                          onClick={() => onSelectVehicleForBooking(vehicle)}
                        >
                          {isAvailable ? "Thuê ngay" : "Tạm hết"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* PROCESS SECTION */}
      <section id="process-section" className="process-section">
        <div className="section-header">
          <div className="section-subtitle">DỄ DÀNG & NHANH CHÓNG</div>
          <h2 className="section-title">Quy Trình Thuê Xe 4 Bước Đơn Giản</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon">🔍</div>
            <h3 className="step-title">Chọn Xe Ưng Ý</h3>
            <p className="step-desc">
              Khám phá danh sách hơn 50+ dòng xe ô tô và xe máy đời mới với giá
              thuê minh bạch.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon">📝</div>
            <h3 className="step-title">Đặt Xe Trực Tuyến</h3>
            <p className="step-desc">
              Chọn thời gian thuê, điền thông tin liên hệ và gửi yêu cầu thuê xe
              trong vòng 1 phút.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon">🤝</div>
            <h3 className="step-title">Xác Nhận & Nhận Xe</h3>
            <p className="step-desc">
              Nhân viên VeloRent sẽ liên hệ xác nhận và giao xe tận nơi hoặc tại
              văn phòng kèm hợp đồng rõ ràng.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>
            <div className="step-icon">🎉</div>
            <h3 className="step-title">Khởi Hành & Trả Xe</h3>
            <p className="step-desc">
              Vi vu an tâm trên mọi nẻo đường và hoàn tất thủ tục trả xe nhanh
              chóng, nhận lại cọc ngay lập tức.
            </p>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="benefits-section" className="benefits-section">
        <div className="section-header">
          <div className="section-subtitle">TẠI SAO CHỌN VeloRent?</div>
          <h2 className="section-title">Cam Kết Dịch Vụ Hàng Đầu</h2>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🛡️</div>
            <h3>Bảo Hiểm Toàn Diện</h3>
            <p>
              Mọi chuyến đi đều được bảo vệ với gói bảo hiểm vật chất xe và bảo
              hiểm người ngồi trên xe an tâm tuyệt đối.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🚀</div>
            <h3>Giao Xe Tận Nơi</h3>
            <p>
              Hỗ trợ giao xe miễn phí tại sân bay Cát Bi, nhà ga, bến xe và các
              khách sạn nội thành Hải Phòng.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💎</div>
            <h3>Giá Cả Niêm Yết Rõ Ràng</h3>
            <p>
              Không phát sinh bất kỳ khoản phụ phí ẩn nào. Khách hàng luôn biết
              trước chính xác tổng chi phí cần thanh toán.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🔧</div>
            <h3>Bảo Trì Kỹ Lưỡng</h3>
            <p>
              Xe được bảo dưỡng chính hãng định kỳ, thay dầu, kiểm tra lốp và hệ
              thống phanh trước mỗi lần xuất bến.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="customer-footer">
        <div className="footer-container">
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <span className="footer-logo">🚘</span>
              <span className="footer-brand-name">VeloRent Hải Phòng</span>
            </div>
            <p className="footer-text">
              Hệ thống cho thuê ô tô và xe máy tự lái uy tín, chuyên nghiệp hàng
              đầu tại Hải Phòng và các tỉnh lân cận.
            </p>
            <div className="footer-contact-item">
              📍 123 Lê Hồng Phong, Ngô Quyền, TP. Hải Phòng
            </div>
            <div className="footer-contact-item">
              📞 Hotline: 1900 6868 - 0987.654.321
            </div>
            <div className="footer-contact-item">✉️ support@veloRent.vn</div>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Dịch Vụ</h4>
            <ul className="footer-links">
              <li>Thuê ô tô tự lái 4-5 chỗ</li>
              <li>Thuê ô tô gia đình 7 chỗ</li>
              <li>Thuê xe máy tay ga & côn tay</li>
              <li>Thuê xe du lịch dài hạn theo tháng</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Chính Sách</h4>
            <ul className="footer-links">
              <li>Chính sách bảo hiểm xe</li>
              <li>Thủ tục giấy tờ thuê xe</li>
              <li>Quy định hủy và đổi lịch</li>
              <li>Điều khoản thanh toán</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Hỗ Trợ Nhanh</h4>
            <p className="footer-text">
              Bạn cần tư vấn chọn dòng xe phù hợp? Đừng ngần ngại liên hệ đội
              ngũ chăm sóc khách hàng 24/7.
            </p>
            <a href="tel:19006868" className="btn-footer-call">
              📞 Gọi Ngay 1900 6868
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 VeloRent Vietnam. Bản quyền thuộc về Hệ thống Cho Thuê Phương
            Tiện Giao Thông.
          </p>
        </div>
      </footer>
    </div>
  );
}
