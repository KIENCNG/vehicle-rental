export const money = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);

export function tinhGiaThue(loaiXe, giaThueNgay, soNgay) {
  if (!soNgay || soNgay <= 0) return 0;
  const isOto = loaiXe === "OTO" || loaiXe === "Ô tô";
  const isXeMay = loaiXe === "XEMAY" || loaiXe === "Xe máy";

  if (isOto) {
    // Ô tô: phụ phí bảo hiểm 10%
    return Math.round(giaThueNgay * soNgay * 1.1);
  }
  if (isXeMay) {
    // Xe máy: thuê từ 7 ngày trở lên giảm 10%
    let tong = giaThueNgay * soNgay;
    if (soNgay >= 7) {
      tong = tong * 0.9;
    }
    return Math.round(tong);
  }
  return Math.round(giaThueNgay * soNgay);
}

export const VEHICLE_IMAGES = {
  "Toyota Vios": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
  "Honda City": "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop&q=80",
  "Mazda CX-5": "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80",
  "VinFast VF8": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
  "Kia Carnival": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop&q=80",
  "Honda Air Blade": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80",
  "Yamaha Exciter": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80",
  "Honda SH 150i": "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&auto=format&fit=crop&q=80",
  "Honda Wave Alpha": "https://images.unsplash.com/photo-1558980664-3a031cf67ea8?w=800&auto=format&fit=crop&q=80",
};

export function getVehicleImage(vehicle) {
  if (!vehicle) return "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80";
  const name = vehicle.hangXe || "";
  for (const [key, url] of Object.entries(VEHICLE_IMAGES)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return url;
    }
  }
  const isOto = vehicle.loaiXe === "OTO" || vehicle.loaiXe === "Ô tô";
  return isOto
    ? "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80"
    : "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80";
}
