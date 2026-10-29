package com.vehiclerental.config;

import com.vehiclerental.model.*;
import com.vehiclerental.repository.HopDongThueRepository;
import com.vehiclerental.repository.KhachHangRepository;
import com.vehiclerental.repository.NguoiDungRepository;
import com.vehiclerental.repository.PhuongTienRepository;
import com.vehiclerental.service.NguoiDungService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final NguoiDungRepository nguoiDungRepository;
    private final PhuongTienRepository phuongTienRepository;
    private final KhachHangRepository khachHangRepository;
    private final HopDongThueRepository hopDongThueRepository;
    private final NguoiDungService nguoiDungService;

    public DataInitializer(
            NguoiDungRepository nguoiDungRepository,
            PhuongTienRepository phuongTienRepository,
            KhachHangRepository khachHangRepository,
            HopDongThueRepository hopDongThueRepository,
            NguoiDungService nguoiDungService) {
        this.nguoiDungRepository = nguoiDungRepository;
        this.phuongTienRepository = phuongTienRepository;
        this.khachHangRepository = khachHangRepository;
        this.hopDongThueRepository = hopDongThueRepository;
        this.nguoiDungService = nguoiDungService;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Khách hàng nếu chưa có
        KhachHang kh1 = null;
        KhachHang kh2 = null;
        KhachHang kh3 = null;
        if (khachHangRepository.count() == 0) {
            kh1 = khachHangRepository.save(new KhachHang("Nguyễn Văn An", "0987654321", "Lê Hồng Phong, Hải Phòng"));
            kh2 = khachHangRepository.save(new KhachHang("Trần Minh Đức", "0912345678", "Cầu Giấy, Hà Nội"));
            kh3 = khachHangRepository.save(new KhachHang("Lê Thị Mai", "0933445566", "Ngô Quyền, Hải Phòng"));
        } else {
            var allKh = khachHangRepository.findAll();
            if (!allKh.isEmpty()) kh1 = allKh.get(0);
        }

        // 2. Seed Người dùng (Tài khoản) nếu chưa có
        if (nguoiDungRepository.count() == 0) {
            // Tài khoản Admin
            NguoiDung admin = new NguoiDung(
                    "admin",
                    nguoiDungService.hashMatKhau("admin123"),
                    "Quản Trị Viên",
                    "0900000001",
                    "admin@autorent.vn",
                    "Trụ sở Hải Phòng",
                    VaiTro.ADMIN,
                    null
            );
            nguoiDungRepository.save(admin);

            // Tài khoản Customer
            NguoiDung customer = new NguoiDung(
                    "customer",
                    nguoiDungService.hashMatKhau("customer123"),
                    "Nguyễn Văn An",
                    "0987654321",
                    "an.nguyen@gmail.com",
                    "Lê Hồng Phong, Hải Phòng",
                    VaiTro.CUSTOMER,
                    kh1 != null ? kh1.getId() : null
            );
            nguoiDungRepository.save(customer);
        }

        // 3. Seed Phương tiện nếu chưa có
        PhuongTien pt1 = null;
        PhuongTien pt2 = null;
        PhuongTien pt3 = null;
        if (phuongTienRepository.count() == 0) {
            pt1 = phuongTienRepository.save(new OTo("15A-12345", "Toyota Vios 1.5G", 800000, 5, "Xăng"));
            pt2 = phuongTienRepository.save(new OTo("15B-67890", "Honda City RS", 900000, 5, "Xăng"));
            phuongTienRepository.save(new OTo("15A-99999", "Mazda CX-5 Premium", 1200000, 5, "Xăng"));
            phuongTienRepository.save(new OTo("15E-55555", "VinFast VF8 Plus", 1400000, 5, "Điện"));
            phuongTienRepository.save(new OTo("15B-88888", "Kia Carnival Signature", 1800000, 7, "Dầu"));

            pt3 = phuongTienRepository.save(new XeMay("29A-11223", "Honda Air Blade 125", 150000, 125, "Tay ga"));
            phuongTienRepository.save(new XeMay("30F-45678", "Yamaha Exciter 155 VVA", 180000, 155, "Côn tay"));
            phuongTienRepository.save(new XeMay("15B-33333", "Honda SH 150i ABS", 300000, 150, "Tay ga"));
            phuongTienRepository.save(new XeMay("15F-22222", "Honda Wave Alpha", 100000, 110, "Xe số"));
        } else {
            var allPt = phuongTienRepository.findAll();
            if (!allPt.isEmpty()) pt1 = allPt.get(0);
            if (allPt.size() > 1) pt2 = allPt.get(1);
        }

        // 4. Seed Hợp đồng mẫu nếu chưa có
        if (hopDongThueRepository.count() == 0 && kh1 != null && pt1 != null && pt2 != null) {
            LocalDate now = LocalDate.now();
            HopDongThue hd1 = new HopDongThue(kh1, pt1, now.minusDays(2), now.plusDays(2));
            hd1.setTrangThai(TrangThaiHopDong.DANG_THUE);
            hd1.capNhatTongTien();
            hopDongThueRepository.save(hd1);

            if (kh2 != null) {
                HopDongThue hd2 = new HopDongThue(kh2, pt2, now.minusDays(8), now.minusDays(5));
                hd2.setTrangThai(TrangThaiHopDong.DA_TRA);
                hd2.capNhatTongTien();
                hopDongThueRepository.save(hd2);
            }

            if (kh3 != null && pt3 != null) {
                HopDongThue hd3 = new HopDongThue(kh3, pt3, now.plusDays(1), now.plusDays(4));
                hd3.setTrangThai(TrangThaiHopDong.CHO_XAC_NHAN);
                hd3.capNhatTongTien();
                hopDongThueRepository.save(hd3);
            }
        }
    }
}
