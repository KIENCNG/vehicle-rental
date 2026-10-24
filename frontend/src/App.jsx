import { useEffect, useState } from "react";
import "./App.css";

const initialVehicles = [
  {
    id: 1,
    bienSo: "15A-12345",
    hangXe: "Toyota Vios",
    loaiXe: "Ô tô",
    gia: 800000,
    trangThai: "Đang thuê",
  },
  {
    id: 2,
    bienSo: "15B-67890",
    hangXe: "Honda City",
    loaiXe: "Ô tô",
    gia: 900000,
    trangThai: "Sẵn sàng",
  },
  {
    id: 3,
    bienSo: "29A-11223",
    hangXe: "Honda Air Blade",
    loaiXe: "Xe máy",
    gia: 150000,
    trangThai: "Sẵn sàng",
  },
  {
    id: 4,
    bienSo: "30F-45678",
    hangXe: "Yamaha Exciter",
    loaiXe: "Xe máy",
    gia: 180000,
    trangThai: "Đang thuê",
  },
];

const initialCustomers = [
  { id: 1, hoTen: "Nguyễn Văn An", sdt: "0987654321", diaChi: "Hải Phòng" },
  { id: 2, hoTen: "Trần Minh Đức", sdt: "0912345678", diaChi: "Hà Nội" },
];

const initialContracts = [
  {
    id: 1,
    khachHang: "Nguyễn Văn An",
    phuongTien: "Toyota Vios",
    ngayThue: "25/10/2026",
    ngayTra: "28/10/2026",
    tongTien: 2640000,
    trangThai: "Đang thuê",
  },
  {
    id: 2,
    khachHang: "Trần Minh Đức",
    phuongTien: "Honda City",
    ngayThue: "20/10/2026",
    ngayTra: "22/10/2026",
    tongTien: 1980000,
    trangThai: "Đã trả",
  },
];

const money = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const menu = [
  { id: "dashboard", icon: "▦", label: "Tổng quan" },
  { id: "vehicles", icon: "🚘", label: "Phương tiện" },
  { id: "customers", icon: "♙", label: "Khách hàng" },
  { id: "contracts", icon: "▤", label: "Hợp đồng" },
];

function App() {
  const [page, setPage] = useState("dashboard");
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [customers, setCustomers] = useState(initialCustomers);
  const [contracts, setContracts] = useState(initialContracts);
  const [keyword, setKeyword] = useState("");
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

  useEffect(() => {
    fetch("http://localhost:8080/api/phuong-tien")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải danh sách phương tiện");
        }
        return response.json();
      })
      .then((data) => {
        const apiVehicles = data.map((vehicle) => ({
          id: vehicle.id,
          bienSo: vehicle.bienSo,
          hangXe: vehicle.hangXe,
          loaiXe:
            vehicle.loaiXe === "OTO"
              ? "Ô tô"
              : vehicle.loaiXe === "XEMAY"
                ? "Xe máy"
                : vehicle.loaiXe,
          gia: vehicle.giaThueNgay,
          trangThai: vehicle.trangThai || "Sẵn sàng",
        }));

        setVehicles(apiVehicles);
      })
      .catch((error) => {
        console.error("Lỗi tải phương tiện:", error);
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:8080/api/khach-hang")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải danh sách khách hàng");
        }
        return response.json();
      })
      .then((data) => {
        setCustomers(
          data.map((customer) => ({
            ...customer,
            sdt: customer.soDienThoai,
          })),
        );
      })
      .catch((error) => {
        console.error("Lỗi tải danh sách khách hàng:", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/hop-dong")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải danh sách hợp đồng.");
        }
        return response.json();
      })
      .then((data) => {
        setContracts(
          data.map((contract) => ({
            id: contract.id,
            khachHang: contract.khachHang?.hoTen || "Chưa có khách hàng",
            phuongTien: contract.phuongTien
              ? `${contract.phuongTien.hangXe} - ${contract.phuongTien.bienSo}`
              : "Chưa có phương tiện",
            ngayThue: contract.ngayThue,
            ngayTra: contract.ngayTra,
            tongTien: contract.tongTien,

            trangThai:
              contract.trangThai === "CHO_XAC_NHAN"
                ? "Chờ xác nhận"
                : contract.trangThai === "DANG_THUE"
                  ? "Đang thuê"
                  : contract.trangThai === "DA_TRA"
                    ? "Đã trả"
                    : contract.trangThai === "DA_HUY"
                      ? "Đã hủy"
                      : contract.trangThai,
          })),
        );
      })
      .catch((error) => {
        console.error("Lỗi tải danh sách hợp đồng:", error);
      });
  }, []);

  const handleReturnVehicle = async (id) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xác nhận trả xe cho hợp đồng HD-${String(id).padStart(4, "0")}?`,
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/hop-dong/${id}/trang-thai`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trangThai: "DA_TRA",
          }),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Không thể cập nhật trạng thái hợp đồng");
      }

      const updatedContract = await response.json();

      setContracts((current) =>
        current.map((contract) =>
          contract.id === id
            ? {
                ...contract,
                trangThai: "Đã trả",
                tongTien: updatedContract.tongTien ?? contract.tongTien,
              }
            : contract,
        ),
      );

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
      const response = await fetch(
        `http://localhost:8080/api/hop-dong/${id}/trang-thai`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trangThai: "DA_HUY",
          }),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Không thể hủy hợp đồng");
      }

      await response.json();

      setContracts((current) =>
        current.map((contract) =>
          contract.id === id ? { ...contract, trangThai: "Đã hủy" } : contract,
        ),
      );

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
      const response = await fetch(
        `http://localhost:8080/api/hop-dong/${id}/trang-thai`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trangThai: "DANG_THUE",
          }),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Không thể duyệt yêu cầu thuê xe");
      }

      await response.json();

      setContracts((current) =>
        current.map((contract) =>
          contract.id === id
            ? { ...contract, trangThai: "Đang thuê" }
            : contract,
        ),
      );

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
      const response = await fetch(
        `http://localhost:8080/api/hop-dong/${id}/trang-thai`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trangThai: "DA_HUY",
          }),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Không thể từ chối yêu cầu");
      }

      await response.json();

      setContracts((current) =>
        current.map((contract) =>
          contract.id === id ? { ...contract, trangThai: "Đã hủy" } : contract,
        ),
      );

      alert("Đã từ chối yêu cầu thuê xe!");
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const activeContracts = contracts.filter(
    (c) => c.trangThai === "Đang thuê",
  ).length;
  const totalRevenue = contracts
    .filter((c) => c.trangThai === "Đã trả")
    .reduce((sum, c) => sum + c.tongTien, 0);

  const filteredVehicles = vehicles.filter((v) =>
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

  const pageTitle = menu.find((item) => item.id === page)?.label ?? "Tổng quan";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">V</div>
          <div>
            <h2>VeloRent</h2>
            <span>VEHICLE MANAGEMENT</span>
          </div>
        </div>

        <div className="menu-label">MENU CHÍNH</div>
        <nav>
          {menu.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => {
                setPage(item.id);
                setKeyword("");
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {page === item.id && <span className="nav-indicator" />}
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
              <strong>Quản trị viên</strong>
              <span>Administrator</span>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              VeloRent / <span>{pageTitle}</span>
            </div>
            <h1>{pageTitle}</h1>
          </div>
          <div className="topbar-right">
            <div className="today">◷ &nbsp; 24 tháng 10, 2026</div>
            <button className="notification" title="Thông báo">
              ♧<i />
            </button>
            <div className="top-avatar">AD</div>
          </div>
        </header>

        <div className="content">
          {page === "dashboard" && (
            <>
              <section className="welcome">
                <div>
                  <span className="eyebrow">BẢNG ĐIỀU KHIỂN</span>
                  <h2>Xin chào, Quản trị viên 👋</h2>
                  <p>Đây là tình hình hoạt động của hệ thống hôm nay.</p>
                </div>
                <div className="welcome-art">🚘</div>
              </section>

              <section className="stats-grid">
                <StatCard
                  title="Tổng phương tiện"
                  value={vehicles.length}
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
                    onClick={() => setPage("contracts")}
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
                    onClick={() => setPage("vehicles")}
                  >
                    Quản lý xe →
                  </button>
                </div>
                <VehicleTable vehicles={vehicles.slice(0, 4)} />
              </section>
            </>
          )}

          {page === "vehicles" && (
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
                        const response = await fetch(
                          "http://localhost:8080/api/phuong-tien",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(vehicle),
                          },
                        );

                        const result = await response.json();

                        if (!response.ok) {
                          throw new Error(
                            typeof result === "string"
                              ? result
                              : "Không thể thêm phương tiện.",
                          );
                        }

                        setVehicles((current) => [
                          ...current,
                          {
                            id: result.id,
                            bienSo: result.bienSo,
                            hangXe: result.hangXe,
                            loaiXe: result.loaiXe === "OTO" ? "Ô tô" : "Xe máy",
                            gia: result.giaThueNgay,
                            trangThai: result.trangThai || "Sẵn sàng",
                          },
                        ]);

                        setShowVehicleForm(false);
                        form.reset();
                        alert("Thêm phương tiện thành công!");
                      } catch (error) {
                        setVehicleError(
                          error.message || "Có lỗi khi thêm phương tiện.",
                        );
                      } finally {
                        setSavingVehicle(false);
                      }
                    }}
                  >
                    <label>Loại xe</label>
                    <select
                      name="loaiXe"
                      required
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                    >
                      <option value="OTO">Ô tô</option>
                      <option value="XEMAY">Xe máy</option>
                    </select>

                    <label>Biển số</label>
                    <input
                      name="bienSo"
                      required
                      placeholder="Ví dụ: 30F-123.45"
                    />

                    <label>Hãng xe / Tên xe</label>
                    <input
                      name="hangXe"
                      required
                      placeholder="Ví dụ: Toyota Vios"
                    />

                    <label>Giá thuê mỗi ngày (VNĐ)</label>
                    <input
                      name="giaThueNgay"
                      type="number"
                      min="1"
                      required
                      placeholder="800000"
                    />

                    {vehicleType === "OTO" && (
                      <>
                        <label>Số chỗ</label>
                        <input
                          name="soCho"
                          type="number"
                          min="1"
                          required
                          defaultValue="5"
                        />

                        <label>Nhiên liệu</label>
                        <select
                          name="loaiNhienLieu"
                          required
                          defaultValue="Xang"
                        >
                          <option value="Xang">Xăng</option>
                          <option value="Dau">Dầu</option>
                          <option value="Dien">Điện</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </>
                    )}

                    {vehicleType === "XEMAY" && (
                      <>
                        <label>Dung tích xi lanh (cc)</label>
                        <input
                          name="dungTichXiLanh"
                          type="number"
                          min="1"
                          required
                          defaultValue="150"
                        />

                        <label>Kiểu xe</label>
                        <input
                          name="kieuXe"
                          required
                          placeholder="Ví dụ: Tay ga"
                        />
                      </>
                    )}
                    <input name="kieuXe" placeholder="Ví dụ: Tay ga" />

                    {vehicleError && (
                      <p style={{ color: "red" }}>{vehicleError}</p>
                    )}

                    <button type="submit" disabled={savingVehicle}>
                      {savingVehicle ? "Đang lưu..." : "Lưu phương tiện"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowVehicleForm(false);
                        setVehicleError("");
                      }}
                    >
                      Hủy
                    </button>
                  </form>
                </div>
              )}

              <SearchBox
                value={keyword}
                onChange={setKeyword}
                placeholder="Tìm biển số hoặc hãng xe..."
              />
              <VehicleTable vehicles={filteredVehicles} />
            </section>
          )}

          {page === "customers" && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Danh sách khách hàng</h3>
                  <p>Thông tin khách hàng đã đăng ký</p>
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
                        const response = await fetch(
                          "http://localhost:8080/api/khach-hang",
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

                        setCustomers((current) => [
                          ...current,
                          {
                            ...result,
                            sdt: result.soDienThoai,
                          },
                        ]);

                        setShowCustomerForm(false);
                        form.reset();
                        alert("Thêm khách hàng thành công!");
                      } catch (error) {
                        setCustomerError(
                          error.message || "Có lỗi khi thêm khách hàng.",
                        );
                      } finally {
                        setSavingCustomer(false);
                      }
                    }}
                  >
                    <label>Họ và tên</label>
                    <input
                      name="hoTen"
                      required
                      placeholder="Ví dụ: Nguyen Van B"
                    />

                    <label>Số điện thoại</label>
                    <input
                      name="soDienThoai"
                      type="tel"
                      required
                      placeholder="Ví dụ: 0912345678"
                    />

                    <label>Địa chỉ</label>
                    <input
                      name="diaChi"
                      required
                      placeholder="Ví dụ: Hai Phong"
                    />

                    {customerError && (
                      <p style={{ color: "red" }}>{customerError}</p>
                    )}

                    <button type="submit" disabled={savingCustomer}>
                      {savingCustomer ? "Đang lưu..." : "Lưu khách hàng"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomerForm(false);
                        setCustomerError("");
                      }}
                    >
                      Hủy
                    </button>
                  </form>
                </div>
              )}

              <SearchBox
                value={keyword}
                onChange={setKeyword}
                placeholder="Tìm tên hoặc số điện thoại..."
              />
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>KHÁCH HÀNG</th>
                      <th>SỐ ĐIỆN THOẠI</th>
                      <th>ĐỊA CHỈ</th>
                      <th>ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div className="customer-cell">
                            <div className="customer-avatar">
                              {c.hoTen.split(" ").slice(-1)[0][0]}
                            </div>
                            <strong>{c.hoTen}</strong>
                          </div>
                        </td>
                        <td>{c.sdt}</td>
                        <td>{c.diaChi}</td>
                        <td>#{c.id}</td>
                      </tr>
                    ))}
                    {filteredCustomers.length === 0 && <EmptyRow columns={4} />}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {page === "contracts" && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Quản lý hợp đồng</h3>
                  <p>Theo dõi thời hạn thuê và tổng tiền hợp đồng</p>
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
                  <h3>Tạo hợp đồng thuê</h3>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setContractError("");
                      setSavingContract(true);

                      const form = e.currentTarget;
                      const formData = new FormData(form);

                      const requestData = {
                        khachHangId: Number(formData.get("khachHangId")),
                        phuongTienId: Number(formData.get("phuongTienId")),
                        ngayThue: formData.get("ngayThue"),
                        ngayTra: formData.get("ngayTra"),
                      };

                      try {
                        const response = await fetch(
                          "http://localhost:8080/api/hop-dong",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(requestData),
                          },
                        );

                        const responseText = await response.text();

                        let result;

                        try {
                          result = responseText
                            ? JSON.parse(responseText)
                            : null;
                        } catch {
                          result = responseText;
                        }

                        if (!response.ok) {
                          throw new Error(
                            typeof result === "string"
                              ? result
                              : result?.message || "Không thể tạo hợp đồng.",
                          );
                        }

                        const customer = customers.find(
                          (c) => c.id === result.khachHang?.id,
                        );
                        const vehicle = vehicles.find(
                          (v) => v.id === result.phuongTien?.id,
                        );

                        setContracts((current) => [
                          ...current,
                          {
                            id: result.id,
                            khachHang:
                              result.khachHang?.hoTen ||
                              customer?.hoTen ||
                              "Khách hàng",
                            phuongTien: result.phuongTien
                              ? `${result.phuongTien.hangXe} - ${result.phuongTien.bienSo}`
                              : vehicle
                                ? `${vehicle.hangXe} - ${vehicle.bienSo}`
                                : "Phương tiện",
                            ngayThue: result.ngayThue,
                            ngayTra: result.ngayTra,
                            tongTien: result.tongTien,
                            trangThai:
                              result.trangThai === "DANG_THUE"
                                ? "Đang thuê"
                                : result.trangThai === "DA_TRA"
                                  ? "Đã trả"
                                  : result.trangThai === "DA_HUY"
                                    ? "Đã hủy"
                                    : result.trangThai,
                          },
                        ]);

                        setShowContractForm(false);
                        form.reset();
                        alert("Tạo hợp đồng thành công!");
                      } catch (error) {
                        setContractError(
                          error.message || "Có lỗi khi tạo hợp đồng.",
                        );
                      } finally {
                        setSavingContract(false);
                      }
                    }}
                  >
                    <label>Khách hàng</label>
                    <select name="khachHangId" required defaultValue="">
                      <option value="" disabled>
                        -- Chọn khách hàng --
                      </option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.hoTen} - {customer.sdt}
                        </option>
                      ))}
                    </select>

                    <label>Phương tiện</label>
                    <select name="phuongTienId" required defaultValue="">
                      <option value="" disabled>
                        -- Chọn phương tiện --
                      </option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.hangXe} - {vehicle.bienSo}
                        </option>
                      ))}
                    </select>

                    <label>Ngày thuê</label>
                    <input name="ngayThue" type="date" required />

                    <label>Ngày trả</label>
                    <input name="ngayTra" type="date" required />

                    {contractError && (
                      <p style={{ color: "red" }}>{contractError}</p>
                    )}

                    <button type="submit" disabled={savingContract}>
                      {savingContract ? "Đang lưu..." : "Lưu hợp đồng"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowContractForm(false);
                        setContractError("");
                      }}
                    >
                      Hủy
                    </button>
                  </form>
                </div>
              )}

              <SearchBox
                value={keyword}
                onChange={setKeyword}
                placeholder="Tìm khách hàng hoặc phương tiện..."
              />
              <ContractTable
                contracts={filteredContracts}
                onReturnVehicle={handleReturnVehicle}
                onCancelContract={handleCancelContract}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
              />
            </section>
          )}

          <footer>
            © 2026 VeloRent · Hệ thống quản lý cho thuê phương tiện
          </footer>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, note, color }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <div className={`stat-icon ${color}`}>{icon}</div>
      </div>
      <strong className="stat-value">{value}</strong>
      <div className="stat-note">
        <span className="note-dot" />
        {note}
      </div>
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="search-box">
      <span>⌕</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
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
