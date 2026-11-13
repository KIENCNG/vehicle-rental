
package com.vehiclerental.service;

import com.vehiclerental.model.HopDongThue;
import com.vehiclerental.model.ThanhToan;
import com.vehiclerental.model.TrangThaiThanhToan;
import com.vehiclerental.repository.HopDongThueRepository;
import com.vehiclerental.repository.ThanhToanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ThanhToanService {

    private final ThanhToanRepository thanhToanRepository;
    private final HopDongThueRepository hopDongThueRepository;

    public ThanhToanService(
            ThanhToanRepository thanhToanRepository,
            HopDongThueRepository hopDongThueRepository) {

        this.thanhToanRepository = thanhToanRepository;
        this.hopDongThueRepository = hopDongThueRepository;
    }

    // ==============================
    // KIỂM TRA QUYỀN SỞ HỮU
    // ==============================

    private HopDongThue kiemTraHopDong(
            Long hopDongId,
            Long khachHangId) {

        HopDongThue hopDong = hopDongThueRepository.findById(hopDongId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy hợp đồng ID: " + hopDongId));

        // Nếu có customerId thì kiểm tra quyền sở hữu
        if (khachHangId != null
                && !hopDong.getKhachHang().getId().equals(khachHangId)) {

            throw new IllegalArgumentException(
                    "Bạn không có quyền thao tác hợp đồng này");
        }

        return hopDong;
    }

    private ThanhToan kiemTraThanhToan(
            Long thanhToanId,
            Long khachHangId) {

        ThanhToan thanhToan = thanhToanRepository.findById(thanhToanId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy thanh toán ID: " + thanhToanId));

        if (khachHangId != null
                && !thanhToan.getHopDongThue()
                .getKhachHang().getId().equals(khachHangId)) {

            throw new IllegalArgumentException(
                    "Bạn không có quyền thao tác thanh toán này");
        }

        return thanhToan;
    }

    // ==============================
    // LẤY DANH SÁCH THANH TOÁN
    // ==============================

    public List<ThanhToan> layTatCa() {
        return thanhToanRepository.findAll();
    }

    public ThanhToan timTheoId(Long id) {
        return thanhToanRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy thanh toán ID: " + id));
    }

    // Admin tìm thanh toán theo hợp đồng
    public List<ThanhToan> timTheoHopDong(Long hopDongId) {

        if (!hopDongThueRepository.existsById(hopDongId)) {
            throw new IllegalArgumentException(
                    "Không tìm thấy hợp đồng ID: " + hopDongId);
        }

        return thanhToanRepository.findByHopDongThueId(hopDongId);
    }

    // Khách hàng chỉ xem thanh toán của hợp đồng mình
    public List<ThanhToan> timTheoHopDong(
            Long hopDongId,
            Long khachHangId) {

        kiemTraHopDong(hopDongId, khachHangId);

        return thanhToanRepository.findByHopDongThueId(hopDongId);
    }

    // ==============================
    // TẠO THANH TOÁN
    // ==============================

    // Dành cho Admin
    public ThanhToan taoThanhToan(
            Long hopDongId,
            double soTien,
            String phuongThuc) {

        return taoThanhToanInternal(
                hopDongId, soTien, phuongThuc, null);
    }

    // Dành cho khách hàng
    public ThanhToan taoThanhToan(
            Long hopDongId,
            double soTien,
            String phuongThuc,
            Long khachHangId) {

        return taoThanhToanInternal(
                hopDongId, soTien, phuongThuc, khachHangId);
    }

    private ThanhToan taoThanhToanInternal(
            Long hopDongId,
            double soTien,
            String phuongThuc,
            Long khachHangId) {

        if (phuongThuc == null || phuongThuc.isBlank()) {
            throw new IllegalArgumentException(
                    "Phương thức thanh toán không được để trống");
        }

        // Kiểm tra hợp đồng và quyền sở hữu
        HopDongThue hopDong = kiemTraHopDong(
                hopDongId, khachHangId);

        // Tự lấy tổng tiền chính xác từ hợp đồng
        double soTienChinhXac = hopDong.getTongTien();

        if (soTienChinhXac <= 0) {
            throw new IllegalArgumentException(
                    "Tổng tiền hợp đồng không hợp lệ");
        }

        // Kiểm tra giao dịch đã tồn tại
        List<ThanhToan> danhSachThanhToan =
                thanhToanRepository.findByHopDongThueId(hopDongId);

        for (ThanhToan existing : danhSachThanhToan) {

            TrangThaiThanhToan trangThai = existing.getTrangThai();

            if (trangThai == TrangThaiThanhToan.CHUA_THANH_TOAN
                    || trangThai == TrangThaiThanhToan.CHO_XAC_NHAN
                    || trangThai == TrangThaiThanhToan.DA_THANH_TOAN) {

                throw new IllegalArgumentException(
                        "Hợp đồng đã có giao dịch thanh toán. "
                                + "Không thể tạo thêm thanh toán mới");
            }
        }

        // Tạo giao dịch bằng số tiền lấy từ hợp đồng
        ThanhToan thanhToan = new ThanhToan(
                hopDong,
                soTienChinhXac,
                phuongThuc);

        return thanhToanRepository.save(thanhToan);
    }

    // ==============================
    // GỬI YÊU CẦU XÁC NHẬN
    // ==============================

    // Dành cho khách hàng
    public ThanhToan guiYeuCauXacNhan(
            Long thanhToanId,
            String maGiaoDich,
            String ghiChu,
            Long khachHangId) {

        ThanhToan thanhToan = kiemTraThanhToan(
                thanhToanId, khachHangId);

        if (thanhToan.getTrangThai()
                != TrangThaiThanhToan.CHUA_THANH_TOAN) {

            throw new IllegalArgumentException(
                    "Thanh toán không ở trạng thái chưa thanh toán");
        }

        if (maGiaoDich == null || maGiaoDich.isBlank()) {
            throw new IllegalArgumentException(
                    "Mã giao dịch không được để trống");
        }

        thanhToan.setMaGiaoDich(maGiaoDich);
        thanhToan.setGhiChu(ghiChu);
        thanhToan.setTrangThai(
                TrangThaiThanhToan.CHO_XAC_NHAN);

        return thanhToanRepository.save(thanhToan);
    }

    // ==============================
    // ADMIN XÁC NHẬN THANH TOÁN
    // ==============================

    public ThanhToan xacNhanThanhToan(Long thanhToanId) {

        ThanhToan thanhToan = timTheoId(thanhToanId);

        if (thanhToan.getTrangThai()
                != TrangThaiThanhToan.CHO_XAC_NHAN) {

            throw new IllegalArgumentException(
                    "Thanh toán chưa được gửi để xác nhận");
        }

        thanhToan.setTrangThai(
                TrangThaiThanhToan.DA_THANH_TOAN);

        return thanhToanRepository.save(thanhToan);
    }

    // ==============================
    // ADMIN HỦY YÊU CẦU
    // ==============================

    public ThanhToan huyYeuCauThanhToan(Long thanhToanId) {

        ThanhToan thanhToan = timTheoId(thanhToanId);

        if (thanhToan.getTrangThai()
                != TrangThaiThanhToan.CHO_XAC_NHAN) {

            throw new IllegalArgumentException(
                    "Chỉ được hủy yêu cầu đang chờ xác nhận");
        }

        thanhToan.setTrangThai(
                TrangThaiThanhToan.CHUA_THANH_TOAN);

        return thanhToanRepository.save(thanhToan);
    }
}
