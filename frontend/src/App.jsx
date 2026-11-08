import { useEffect, useState, useMemo } from "react";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import CustomerHome from "./components/CustomerHome";
import VehicleDetailModal from "./components/VehicleDetailModal";
import BookingModal from "./components/BookingModal";
import CustomerBookingsModal from "./components/CustomerBookingsModal";
import AuthModal from "./components/AuthModal";
import AdminGuard from "./components/AdminGuard";

import { money } from "./utils/constants";
import { apiFetch } from "./utils/api";

const initialVehicles = [
  {
    id: 1,
    bienSo: "15A-12345",
    hangXe: "Toyota Vios 1.5G",
    loaiXe: "Ô tô",
    gia: 800000,
    trangThai: "Đang thuê",
    soCho: 5,
    loaiNhienLieu: "Xăng",
  },
  {
    id: 2,
    bienSo: "15B-67890",
    hangXe: "Honda City RS",
    loaiXe: "Ô tô",
    gia: 900000,
    trangThai: "Sẵn sàng",
    soCho: 5,
    loaiNhienLieu: "Xăng",
  },
  {
    id: 3,
    bienSo: "15A-99999",
    hangXe: "Mazda CX-5 Premium",
    loaiXe: "Ô tô",
    gia: 1200000,
    trangThai: "Sẵn sàng",
    soCho: 5,
    loaiNhienLieu: "Xăng",
  },
  {
    id: 6,
    bienSo: "29A-11223",
    hangXe: "Honda Air Blade 125",
    loaiXe: "Xe máy",
    gia: 150000,
    trangThai: "Sẵn sàng",
    dungTichXiLanh: 125,
    kieuXe: "Tay ga",
  },
  {
    id: 7,
    bienSo: "30F-45678",
    hangXe: "Yamaha Exciter 155 VVA",
    loaiXe: "Xe máy",
    gia: 180000,
    trangThai: "Đang thuê",
    dungTichXiLanh: 155,
    kieuXe: "Côn tay",
  },
];

const initialCustomers = [
  {
    id: 1,
    hoTen: "Nguyễn Văn An",
    sdt: "0987654321",
    diaChi: "Lê Hồng Phong, Hải Phòng",
  },
  {
    id: 2,
    hoTen: "Trần Minh Đức",
    sdt: "0912345678",
    diaChi: "Cầu Giấy, Hà Nội",
  },
];

const initialContracts = [
  {
    id: 1,
    khachHang: "Nguyễn Văn An",
    phuongTien: "Toyota Vios 1.5G - 15A-12345",
    ngayThue: "2026-10-25",
    ngayTra: "2026-10-28",
    tongTien: 2640000,
    trangThai: "Đang thuê",
  },
];

const adminMenu = [
  { id: "dashboard", icon: "▦", label: "Tổng quan" },
  { id: "vehicles", icon: "🚘", label: "Phương tiện" },
  { id: "customers", icon: "♙", label: "Khách hàng" },
  { id: "contracts", icon: "▤", label: "Hợp đồng" },
];

function App() {
  // 1. Phân quyền và người dùng hiện tại
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("vr_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Chế độ xem: 'client' (giao diện khách hàng) hoặc 'admin' (bảng điều khiển quản trị)
  const [viewMode, setViewMode] = useState("client");

  // Quản lý Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState("login");
  const [selectedVehicleDetail, setSelectedVehicleDetail] = useState(null);
  const [selectedVehicleBooking, setSelectedVehicleBooking] = useState(null);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);

  // Dữ liệu ứng dụng
  const [adminPage, setAdminPage] = useState("dashboard");
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [customers, setCustomers] = useState(initialCustomers);
  const [contracts, setContracts] = useState(initialContracts);
  const [keyword, setKeyword] = useState("");

  // Form states cho Admin
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [vehicleType, setVehicleType] = useState("OTO");
  const [savingVehicle, setSavingVehicle] = useState(false);
  const [vehicleError, setVehicleError] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [customerError, setCustomerError] = useState("");
  const [showContractForm, setShowContractForm] = useState(false);
  const [savingContract, setSavingContract] = useState(false);
  const [contractError, setContractError] = useState("");

  // Hàm tải danh sách phương tiện từ backend
  // Tải danh sách phương tiện (API công khai)
  const loadVehicles = () => {
    fetch("http://localhost:8080/api/phuong-tien")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách phương tiện");
        return res.json();
      })
      .then((data) => {
        const apiVehicles = data.map((v) => ({
          id: v.id,
          bienSo: v.bienSo,
          hangXe: v.hangXe,
          loaiXe:
            v.loaiXe === "OTO"
              ? "Ô tô"
              : v.loaiXe === "XEMAY"
                ? "Xe máy"
                : v.loaiXe,
          gia: v.giaThueNgay,
          trangThai: v.trangThai || "Sẵn sàng",
          soCho: v.soCho,
          loaiNhienLieu: v.loaiNhienLieu,
          dungTichXiLanh: v.dungTichXiLanh,
          kieuXe: v.kieuXe,
        }));
        setVehicles(apiVehicles);
      })
      .catch((err) => console.error("Lỗi tải phương tiện:", err));
  };

  // Tải danh sách khách hàng (chỉ Admin)
  const loadCustomers = () => {
    apiFetch("/api/khach-hang")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách khách hàng");
        return res.json();
      })
      .then((data) => {
        setCustomers(
          data.map((c) => ({
            ...c,
            sdt: c.soDienThoai,
          })),
        );
      })
      .catch((err) => console.error("Lỗi tải khách hàng:", err));
  };

  // Tải danh sách hợp đồng (chỉ Admin)
  const loadContracts = () => {
    apiFetch("/api/hop-dong")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách hợp đồng");
        return res.json();
      })
      .then((data) => {
        setContracts(
          data.map((c) => ({
            id: c.id,
            khachHang: c.khachHang?.hoTen || "Chưa có khách hàng",
            phuongTien: c.phuongTien
              ? `${c.phuongTien.hangXe} - ${c.phuongTien.bienSo}`
              : "Chưa có phương tiện",
            phuongTienId: c.phuongTien?.id,
            khachHangId: c.khachHang?.id,
            ngayThue: c.ngayThue,
            ngayTra: c.ngayTra,
            tongTien: c.tongTien,
            trangThai:
              c.trangThai === "CHO_XAC_NHAN"
                ? "Chờ xác nhận"
                : c.trangThai === "DANG_THUE"
                  ? "Đang thuê"
                  : c.trangThai === "DA_TRA"
                    ? "Đã trả"
                    : c.trangThai === "DA_HUY"
                      ? "Đã hủy"
                      : c.trangThai,
          })),
        );
      })
      .catch((err) => console.error("Lỗi tải hợp đồng:", err));
  };

  useEffect(() => {
    loadVehicles();

    if (currentUser?.vaiTro === "ADMIN") {
      loadCustomers();
      loadContracts();
    }
  }, [currentUser]);

  // Cập nhật trạng thái xe dựa theo các hợp đồng đang thuê
  const vehiclesWithUpdatedStatus = useMemo(() => {
    const rentedVehicleIds = new Set(
      contracts
        .filter(
          (c) => c.trangThai === "Đang thuê" || c.trangThai === "DANG_THUE",
        )
        .map((c) => c.phuongTienId),
    );

    return vehicles.map((v) => ({
      ...v,
      trangThai: rentedVehicleIds.has(v.id) ? "Đang thuê" : "Sẵn sàng",
    }));
  }, [vehicles, contracts]);

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("vr_user");
    setCurrentUser(null);
    setViewMode("client");
  };

  // Mở modal xác thực
  const handleOpenAuth = (tab = "login") => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  // Cuộn tới section
  const handleScrollTo = (sectionId) => {
    if (viewMode !== "client") {
      setViewMode("client");
      setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Khi đặt xe thành công
  const handleBookingSuccess = () => {
    loadContracts();
    loadVehicles();
    loadCustomers();
  };

  // Các thao tác quản trị hợp đồng
  const handleReturnVehicle = async (id) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xác nhận trả xe cho hợp đồng HD-${String(id).padStart(4, "0")}?`,
    );
    if (!confirmed) return;

    try {
      const response = await apiFetch(`/api/hop-dong/${id}/trang-thai`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trangThai: "DA_TRA" }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Không thể cập nhật trạng thái hợp đồng");
      }
      loadContracts();
      alert("Đã cập nhật hợp đồng thành Đã trả!");
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const handleCancelContract = async (id) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn hủy hợp đồng HD-${String(id).padStart(4, "0")}?`,
    );
    if (!confirmed) return;

    try {
      const response = await apiFetch(`/api/hop-dong/${id}/trang-thai`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trangThai: "DA_HUY" }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Không thể hủy hợp đồng");
      }
      loadContracts();
      alert("Đã hủy hợp đồng thành công!");
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const handleApproveRequest = async (id) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn duyệt yêu cầu thuê xe HD-${String(id).padStart(4, "0")}?`,
    );
    if (!confirmed) return;

    try {
      const response = await apiFetch(`/api/hop-dong/${id}/trang-thai`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trangThai: "DANG_THUE" }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Không thể duyệt yêu cầu thuê xe");
      }
      loadContracts();
      loadVehicles();
      alert("Đã duyệt yêu cầu thuê xe!");
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const handleRejectRequest = async (id) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn từ chối yêu cầu thuê xe HD-${String(id).padStart(4, "0")}?`,
    );
    if (!confirmed) return;

    try {
      const response = await apiFetch(`/api/hop-dong/${id}/trang-thai`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trangThai: "DA_HUY" }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Không thể từ chối yêu cầu");
      }
      loadContracts();
      alert("Đã từ chối yêu cầu thuê xe!");
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  // Thống kê cho Admin
  const activeContracts = contracts.filter(
    (c) => c.trangThai === "Đang thuê",
  ).length;
  const totalRevenue = contracts
    .filter((c) => c.trangThai === "Đã trả")
    .reduce((sum, c) => sum + c.tongTien, 0);

  const filteredVehicles = vehiclesWithUpdatedStatus.filter((v) =>
    `${v.bienSo} ${v.hangXe}`.toLowerCase().includes(keyword.toLowerCase()),
  );
  const filteredCustomers = customers.filter((c) =>
    `${c.hoTen} ${c.sdt}`.toLowerCase().includes(keyword.toLowerCase()),
  );
  const filteredContracts = contracts.filter((c) =>
    `${c.khachHang} ${c.phuongTien}`
      .toLowerCase()
      .includes(keyword.toLowerCase()),
  );

  const pageTitle =
    adminMenu.find((item) => item.id === adminPage)?.label ?? "Tổng quan";

  // ==========================================
  // RENDER GIAO DIỆN KHÁCH HÀNG
  // ==========================================
  if (viewMode === "client") {
    return (
      <div className="app-root">
        {/* Header điều hướng */}
        <Navbar
          currentUser={currentUser}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onOpenMyBookings={() => {
            if (!currentUser) {
              handleOpenAuth("login");
            } else {
              setMyBookingsOpen(true);
            }
          }}
          onScrollTo={handleScrollTo}
        />

        {/* Nội dung Trang chủ Khách hàng */}
        <CustomerHome
          vehicles={vehiclesWithUpdatedStatus}
          currentUser={currentUser}
          onSelectVehicleForDetail={(vehicle) =>
            setSelectedVehicleDetail(vehicle)
          }
          onSelectVehicleForBooking={(vehicle) => {
            setSelectedVehicleBooking(vehicle);
          }}
          onOpenAuth={handleOpenAuth}
        />

        {/* Modal Xem chi tiết xe */}
        {selectedVehicleDetail && (
          <VehicleDetailModal
            vehicle={selectedVehicleDetail}
            onClose={() => setSelectedVehicleDetail(null)}
            onBook={(vehicle) => {
              setSelectedVehicleDetail(null);
              setSelectedVehicleBooking(vehicle);
            }}
          />
        )}

        {/* Modal Đặt xe trực tuyến */}
        {selectedVehicleBooking && (
          <BookingModal
            vehicle={selectedVehicleBooking}
            currentUser={currentUser}
            onClose={() => setSelectedVehicleBooking(null)}
            onOpenAuth={handleOpenAuth}
            onBookingSuccess={handleBookingSuccess}
          />
        )}

        {/* Modal Đơn thuê của tôi */}
        {myBookingsOpen && (
          <CustomerBookingsModal
            currentUser={currentUser}
            allContracts={contracts}
            onClose={() => setMyBookingsOpen(false)}
          />
        )}

        {/* Modal Đăng nhập / Đăng ký */}
        {authModalOpen && (
          <AuthModal
            initialTab={authInitialTab}
            onClose={() => setAuthModalOpen(false)}
            onSuccess={(user) => {
              setCurrentUser(user);
              loadContracts();
            }}
          />
        )}
      </div>
    );
  }

  // ==========================================
  // BẢO VỆ CHỨC NĂNG QUẢN TRỊ (ADMIN GUARD)
  // ==========================================
  if (currentUser?.vaiTro !== "ADMIN") {
    return (
      <div className="app-root">
        <Navbar
          currentUser={currentUser}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onOpenMyBookings={() => setMyBookingsOpen(true)}
          onScrollTo={handleScrollTo}
        />
        <AdminGuard
          currentUser={currentUser}
          onBackToClient={() => setViewMode("client")}
          onOpenAuth={handleOpenAuth}
        />
        {authModalOpen && (
          <AuthModal
            initialTab={authInitialTab}
            onClose={() => setAuthModalOpen(false)}
            onSuccess={(user) => {
              setCurrentUser(user);
              loadContracts();
            }}
          />
        )}
      </div>
    );
  }

  // ==========================================
  // RENDER BẢNG ĐIỀU KHIỂN QUẢN TRỊ (ADMIN VIEW)
  // ==========================================
  return (
    <div className="app-shell">
      {/* Sidebar Admin */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">V</div>
          <div>
            <h2>VeloRent</h2>
            <span>VEHICLE MANAGEMENT</span>
          </div>
        </div>

        {/* Nút quay về Giao diện Khách hàng */}
        <button
          type="button"
          className="btn-return-client-pill"
          onClick={() => setViewMode("client")}
        >
          🌐 Về Giao diện Khách hàng
        </button>

        <div className="menu-label">MENU CHÍNH</div>
        <nav>
          {adminMenu.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${adminPage === item.id ? "active" : ""}`}
              onClick={() => {
                setAdminPage(item.id);
                setKeyword("");
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {adminPage === item.id && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">?</div>
            <strong>Cần hỗ trợ?</strong>
            <p>Quản lý hoạt động thuê xe dễ dàng hơn.</p>
          </div>
          <div className="profile">
            <div className="avatar">AD</div>
            <div className="profile-info">
              <strong>{currentUser.hoTen || "Quản trị viên"}</strong>
              <span>Administrator</span>
            </div>
            <button
              type="button"
              className="btn-logout"
              title="Đăng xuất"
              onClick={handleLogout}
              style={{ padding: "4px 8px", fontSize: "11px" }}
            >
              Thoát
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area Admin */}
      <main className="main-area">
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              VeloRent / <span>{pageTitle}</span>
            </div>
            <h1>{pageTitle}</h1>
          </div>
          <div className="topbar-right">
            <button
              type="button"
              className="btn-admin-switch"
              style={{ marginRight: "12px" }}
              onClick={() => setViewMode("client")}
            >
              🌐 Xem Trang Khách
            </button>
            <div className="today">◷ &nbsp; 29 tháng 10, 2026</div>
            <button className="notification" title="Thông báo">
              ♧<i />
            </button>
            <div className="top-avatar">AD</div>
          </div>
        </header>

        <div className="content">
          {adminPage === "dashboard" && (
            <>
              <section className="welcome">
                <div>
                  <span className="eyebrow">BẢNG ĐIỀU KHIỂN</span>
                  <h2>Xin chào, {currentUser.hoTen || "Quản trị viên"} 👋</h2>
                  <p>Đây là tình hình hoạt động của hệ thống hôm nay.</p>
                </div>
                <div className="welcome-art">🚘</div>
              </section>

              <section className="stats-grid">
                <StatCard
                  title="Tổng phương tiện"
                  value={vehiclesWithUpdatedStatus.length}
                  icon="🚘"
                  note="Phương tiện trong hệ thống"
                  color="blue"
                />
                <StatCard
                  title="Khách hàng"
                  value={customers.length}
                  icon="♙"
                  note="Khách hàng đã đăng ký"
                  color="purple"
                />
                <StatCard
                  title="Hợp đồng đang thuê"
                  value={activeContracts}
                  icon="▤"
                  note="Hợp đồng chưa kết thúc"
                  color="orange"
                />
                <StatCard
                  title="Doanh thu đã thu"
                  value={money(totalRevenue)}
                  icon="₫"
                  note="Từ hợp đồng đã trả"
                  color="green"
                />
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Hợp đồng gần đây</h3>
                    <p>Theo dõi các giao dịch thuê xe mới nhất</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setAdminPage("contracts")}
                  >
                    Xem tất cả →
                  </button>
                </div>
                <ContractTable
                  contracts={[...contracts]
                    .sort((a, b) => new Date(b.ngayThue) - new Date(a.ngayThue))
                    .slice(0, 4)}
                  onReturnVehicle={handleReturnVehicle}
                  onCancelContract={handleCancelContract}
                  onApproveRequest={handleApproveRequest}
                  onRejectRequest={handleRejectRequest}
                />
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Phương tiện trong hệ thống</h3>
                    <p>Tình trạng phương tiện hiện tại</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setAdminPage("vehicles")}
                  >
                    Quản lý xe →
                  </button>
                </div>
                <VehicleTable
                  vehicles={vehiclesWithUpdatedStatus.slice(0, 4)}
                />
              </section>
            </>
          )}

          {adminPage === "vehicles" && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Danh sách phương tiện</h3>
                  <p>Quản lý thông tin và giá thuê phương tiện</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => {
                    setVehicleError("");
                    setShowVehicleForm(true);
                  }}
                >
                  ＋ Thêm phương tiện
                </button>
              </div>

              {showVehicleForm && (
                <div className="vehicle-form">
                  <h3>Thêm phương tiện mới</h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setVehicleError("");
                      setSavingVehicle(true);

                      const form = e.currentTarget;
                      const formData = new FormData(form);
                      const loaiXe = formData.get("loaiXe");

                      const vehicle = {
                        loaiXe,
                        bienSo: formData.get("bienSo").trim(),
                        hangXe: formData.get("hangXe").trim(),
                        giaThueNgay: Number(formData.get("giaThueNgay")),
                        ...(loaiXe === "OTO"
                          ? {
                              soCho: Number(formData.get("soCho")),
                              loaiNhienLieu: formData.get("loaiNhienLieu"),
                            }
                          : {
                              dungTichXiLanh: Number(
                                formData.get("dungTichXiLanh"),
                              ),
                              kieuXe: formData.get("kieuXe"),
                            }),
                      };

                      try {
                        const response = await apiFetch("/api/phuong-tien", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(vehicle),
                        });

                        const result = await response.json();
                        if (!response.ok) {
                          throw new Error(
                            typeof result === "string"
                              ? result
                              : "Không thể thêm phương tiện.",
                          );
                        }

                        loadVehicles();
                        form.reset();
                        setVehicleType("OTO");
                        setShowVehicleForm(false);
                      } catch (error) {
                        setVehicleError(error.message);
                      } finally {
                        setSavingVehicle(false);
                      }
                    }}
                  >
                    <label>
                      Loại xe
                      <select
                        name="loaiXe"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                      >
                        <option value="OTO">Ô tô</option>
                        <option value="XEMAY">Xe máy</option>
                      </select>
                    </label>

                    <label>
                      Biển số
                      <input
                        name="bienSo"
                        placeholder="Ví dụ: 15A-12345"
                        required
                      />
                    </label>

                    <label>
                      Hãng xe
                      <input
                        name="hangXe"
                        placeholder="Ví dụ: Toyota Vios"
                        required
                      />
                    </label>

                    <label>
                      Giá thuê / ngày
                      <input
                        name="giaThueNgay"
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="Ví dụ: 800000"
                        required
                      />
                    </label>

                    {vehicleType === "OTO" ? (
                      <>
                        <label>
                          Số chỗ
                          <input
                            name="soCho"
                            type="number"
                            min="2"
                            max="16"
                            placeholder="Ví dụ: 4"
                            required
                          />
                        </label>
                        <label>
                          Loại nhiên liệu
                          <select name="loaiNhienLieu" defaultValue="Xăng">
                            <option value="Xăng">Xăng</option>
                            <option value="Dầu">Dầu</option>
                            <option value="Điện">Điện</option>
                          </select>
                        </label>
                      </>
                    ) : (
                      <>
                        <label>
                          Dung tích xi lanh (cc)
                          <input
                            name="dungTichXiLanh"
                            type="number"
                            min="50"
                            max="2000"
                            placeholder="Ví dụ: 125"
                            required
                          />
                        </label>
                        <label>
                          Kiểu xe
                          <select name="kieuXe" defaultValue="Tay ga">
                            <option value="Tay ga">Tay ga</option>
                            <option value="Xe số">Xe số</option>
                            <option value="Côn tay">Côn tay</option>
                          </select>
                        </label>
                      </>
                    )}

                    {vehicleError && (
                      <p className="error-text">{vehicleError}</p>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowVehicleForm(false)}
                    >
                      Hủy
                    </button>
                    <button type="submit" disabled={savingVehicle}>
                      {savingVehicle ? "Đang lưu..." : "Lưu"}
                    </button>
                  </form>
                </div>
              )}

              <div className="panel-actions">
                <input
                  type="text"
                  placeholder="Tìm biển số, hãng xe..."
                  className="search-input"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <VehicleTable vehicles={filteredVehicles} />
            </section>
          )}

          {adminPage === "customers" && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Danh sách khách hàng</h3>
                  <p>Quản lý thông tin và liên lạc của khách hàng</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => {
                    setCustomerError("");
                    setShowCustomerForm(true);
                  }}
                >
                  ＋ Thêm khách hàng
                </button>
              </div>

              {showCustomerForm && (
                <div className="vehicle-form">
                  <h3>Thêm khách hàng mới</h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setCustomerError("");
                      setSavingCustomer(true);

                      const form = e.currentTarget;
                      const formData = new FormData(form);
                      const customer = {
                        hoTen: formData.get("hoTen").trim(),
                        soDienThoai: formData.get("soDienThoai").trim(),
                        diaChi: formData.get("diaChi").trim(),
                      };

                      try {
                        const response = await apiFetch(
                          `/api/hop-dong/${id}/trang-thai`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(customer),
                          },
                        );
                        const result = await response.json();
                        if (!response.ok) {
                          throw new Error(
                            typeof result === "string"
                              ? result
                              : "Không thể thêm khách hàng.",
                          );
                        }

                        loadCustomers();
                        form.reset();
                        setShowCustomerForm(false);
                      } catch (error) {
                        setCustomerError(error.message);
                      } finally {
                        setSavingCustomer(false);
                      }
                    }}
                  >
                    <label>
                      Họ tên
                      <input
                        name="hoTen"
                        placeholder="Ví dụ: Nguyễn Văn An"
                        required
                      />
                    </label>
                    <label>
                      Số điện thoại
                      <input
                        name="soDienThoai"
                        placeholder="Ví dụ: 0987654321"
                        required
                      />
                    </label>
                    <label>
                      Địa chỉ
                      <input
                        name="diaChi"
                        placeholder="Ví dụ: Hải Phòng"
                        required
                      />
                    </label>

                    {customerError && (
                      <p className="error-text">{customerError}</p>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowCustomerForm(false)}
                    >
                      Hủy
                    </button>
                    <button type="submit" disabled={savingCustomer}>
                      {savingCustomer ? "Đang lưu..." : "Lưu"}
                    </button>
                  </form>
                </div>
              )}

              <div className="panel-actions">
                <input
                  type="text"
                  placeholder="Tìm họ tên, số điện thoại..."
                  className="search-input"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>KHÁCH HÀNG</th>
                      <th>SỐ ĐIỆN THOẠI</th>
                      <th>ĐỊA CHỈ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div className="customer-cell">
                            <div className="customer-avatar">
                              {c.hoTen.charAt(0)}
                            </div>
                            <strong>{c.hoTen}</strong>
                          </div>
                        </td>
                        <td>{c.sdt}</td>
                        <td>{c.diaChi}</td>
                      </tr>
                    ))}
                    {filteredCustomers.length === 0 && <EmptyRow columns={3} />}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {adminPage === "contracts" && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Danh sách hợp đồng</h3>
                  <p>Theo dõi quá trình thuê và lịch sử giao dịch</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => {
                    setContractError("");
                    setShowContractForm(true);
                  }}
                >
                  ＋ Tạo hợp đồng
                </button>
              </div>

              {showContractForm && (
                <div className="vehicle-form">
                  <h3>Tạo hợp đồng mới</h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setContractError("");
                      setSavingContract(true);

                      const form = e.currentTarget;
                      const formData = new FormData(form);
                      const payload = {
                        khachHangId: Number(formData.get("khachHangId")),
                        phuongTienId: Number(formData.get("phuongTienId")),
                        ngayThue: formData.get("ngayThue"),
                        ngayTra: formData.get("ngayTra"),
                      };

                      try {
                        const response = await apiFetch(
                          `/api/hop-dong/${id}/trang-thai`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                          },
                        );
                        const result = await response.json();
                        if (!response.ok) {
                          throw new Error(
                            typeof result === "string"
                              ? result
                              : "Không thể tạo hợp đồng.",
                          );
                        }

                        loadContracts();
                        loadVehicles();
                        form.reset();
                        setShowContractForm(false);
                      } catch (error) {
                        setContractError(error.message);
                      } finally {
                        setSavingContract(false);
                      }
                    }}
                  >
                    <label>
                      Khách hàng
                      <select name="khachHangId" required>
                        <option value="">-- Chọn khách hàng --</option>
                        {customers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.hoTen} - {c.sdt}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Phương tiện
                      <select name="phuongTienId" required>
                        <option value="">-- Chọn phương tiện --</option>
                        {vehiclesWithUpdatedStatus.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.hangXe} ({v.bienSo}) - {v.trangThai}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Ngày thuê
                      <input name="ngayThue" type="date" required />
                    </label>

                    <label>
                      Ngày trả
                      <input name="ngayTra" type="date" required />
                    </label>

                    {contractError && (
                      <p className="error-text">{contractError}</p>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowContractForm(false)}
                    >
                      Hủy
                    </button>
                    <button type="submit" disabled={savingContract}>
                      {savingContract ? "Đang lưu..." : "Lưu"}
                    </button>
                  </form>
                </div>
              )}

              <div className="panel-actions">
                <input
                  type="text"
                  placeholder="Tìm khách hàng, phương tiện..."
                  className="search-input"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <ContractTable
                contracts={filteredContracts}
                onReturnVehicle={handleReturnVehicle}
                onCancelContract={handleCancelContract}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, note, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <strong className="stat-value">{value}</strong>
        <span className="stat-note">{note}</span>
      </div>
    </div>
  );
}

function VehicleTable({ vehicles }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>PHƯƠNG TIỆN</th>
            <th>BIỂN SỐ</th>
            <th>LOẠI XE</th>
            <th>GIÁ THUÊ / NGÀY</th>
            <th>TRẠNG THÁI</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td>
                <div className="vehicle-cell">
                  <div className="vehicle-icon">
                    {v.loaiXe === "Ô tô" ? "🚘" : "🏍️"}
                  </div>
                  <strong>{v.hangXe}</strong>
                </div>
              </td>
              <td>
                <span className="plate">{v.bienSo}</span>
              </td>
              <td>{v.loaiXe}</td>
              <td className="money-cell">{money(v.gia)}</td>
              <td>
                <StatusBadge status={v.trangThai} />
              </td>
            </tr>
          ))}
          {vehicles.length === 0 && <EmptyRow columns={5} />}
        </tbody>
      </table>
    </div>
  );
}

function ContractTable({
  contracts,
  onReturnVehicle,
  onCancelContract,
  onApproveRequest,
  onRejectRequest,
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>MÃ HỢP ĐỒNG</th>
            <th>KHÁCH HÀNG</th>
            <th>PHƯƠNG TIỆN</th>
            <th>THỜI GIAN THUÊ</th>
            <th>TỔNG TIỀN</th>
            <th>TRẠNG THÁI</th>
            <th>THAO TÁC</th>
          </tr>
        </thead>

        <tbody>
          {contracts.map((c) => (
            <tr key={c.id}>
              <td>
                <span className="contract-id">
                  HD-{String(c.id).padStart(4, "0")}
                </span>
              </td>
              <td>{c.khachHang}</td>
              <td>{c.phuongTien}</td>
              <td>
                <div className="date-range">
                  {c.ngayThue}
                  <span>đến {c.ngayTra}</span>
                </div>
              </td>
              <td className="money-cell">{money(c.tongTien)}</td>
              <td>
                <StatusBadge status={c.trangThai} />
              </td>
              <td>
                {c.trangThai === "Chờ xác nhận" && (
                  <>
                    <button
                      className="secondary-button"
                      onClick={() => onApproveRequest(c.id)}
                    >
                      Duyệt yêu cầu
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => onRejectRequest(c.id)}
                      style={{ marginLeft: "8px" }}
                    >
                      Từ chối
                    </button>
                  </>
                )}

                {c.trangThai === "Đang thuê" && (
                  <>
                    <button
                      className="secondary-button"
                      onClick={() => onReturnVehicle(c.id)}
                    >
                      Trả xe
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => onCancelContract(c.id)}
                      style={{ marginLeft: "8px" }}
                    >
                      Hủy hợp đồng
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {contracts.length === 0 && <EmptyRow columns={7} />}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const className =
    status === "Đang thuê"
      ? "renting"
      : status === "Đã trả" || status === "Sẵn sàng"
        ? "completed"
        : "cancelled";

  return (
    <span className={`status-badge ${className}`}>
      <span />
      {status}
    </span>
  );
}

function EmptyRow({ columns }) {
  return (
    <tr>
      <td colSpan={columns} className="empty-row">
        Không tìm thấy dữ liệu phù hợp.
      </td>
    </tr>
  );
}

export default App;
