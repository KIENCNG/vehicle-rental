package com.vehiclerental.service;

import com.vehiclerental.model.HopDongThue;
import com.vehiclerental.model.KhachHang;
import com.vehiclerental.model.PhuongTien;
import com.vehiclerental.model.TrangThaiHopDong;
import com.vehiclerental.repository.HopDongThueRepository;
import com.vehiclerental.repository.KhachHangRepository;
import com.vehiclerental.repository.PhuongTienRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class HopDongThueService {

    private final HopDongThueRepository hopDongRepository;
    private final KhachHangRepository khachHangRepository;
    private final PhuongTienRepository phuongTienRepository;

    public HopDongThueService(
            HopDongThueRepository hopDongRepository,
            KhachHangRepository khachHangRepository,
            PhuongTienRepository phuongTienRepository) {
        this.hopDongRepository = hopDongRepository;
        this.khachHangRepository = khachHangRepository;
        this.phuongTienRepository = phuongTienRepository;
    }

    // Lấy tất cả hợp đồng
    public List<HopDongThue> layTatCa() {
        return hopDongRepository.findAll();
    }

    // Tìm hợp đồng theo ID
    public HopDongThue timTheoId(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID hợp đồng không hợp lệ");
        }

        return hopDongRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy hợp đồng có ID: " + id));
    }

    // Tìm hợp đồng theo khách hàng
    public List<HopDongThue> timTheoKhachHang(Long khachHangId) {
        if (khachHangId == null || khachHangId <= 0) {
            throw new IllegalArgumentException("ID khách hàng không hợp lệ");
        }

        return hopDongRepository.findByKhachHangId(khachHangId);
    }

    // Thêm hợp đồng mới
    public HopDongThue them(
            Long khachHangId,
            Long phuongTienId,
            LocalDate ngayThue,
            LocalDate ngayTra) {

        kiemTraId(khachHangId, phuongTienId);
        kiemTraNgay(ngayThue, ngayTra);

        KhachHang khachHang = khachHangRepository.findById(khachHangId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy khách hàng có ID: " + khachHangId));

        PhuongTien phuongTien = phuongTienRepository.findById(phuongTienId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy phương tiện có ID: " + phuongTienId));

        kiemTraTrungLich(phuongTienId, ngayThue, ngayTra);

        HopDongThue hopDong = new HopDongThue(
                khachHang, phuongTien, ngayThue, ngayTra);

        hopDong.setTrangThai(TrangThaiHopDong.DANG_THUE);
        hopDong.capNhatTongTien();

        return hopDongRepository.save(hopDong);
    }

    // Cập nhật thông tin hợp đồng
    public HopDongThue capNhat(
            Long id,
            Long khachHangId,
            Long phuongTienId,
            LocalDate ngayThue,
            LocalDate ngayTra) {

        HopDongThue hopDong = timTheoId(id);

        if (hopDong.getTrangThai() == TrangThaiHopDong.DA_HUY
                || hopDong.getTrangThai() == TrangThaiHopDong.DA_TRA) {
            throw new IllegalArgumentException(
                    "Không thể sửa hợp đồng đã hủy hoặc đã trả");
        }

        kiemTraId(khachHangId, phuongTienId);
        kiemTraNgay(ngayThue, ngayTra);

        KhachHang khachHang = khachHangRepository.findById(khachHangId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy khách hàng có ID: " + khachHangId));

        PhuongTien phuongTien = phuongTienRepository.findById(phuongTienId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy phương tiện có ID: " + phuongTienId));

        kiemTraTrungLich(phuongTienId, ngayThue, ngayTra, id);

        hopDong.setKhachHang(khachHang);
        hopDong.setPhuongTien(phuongTien);
        hopDong.setNgayThue(ngayThue);
        hopDong.setNgayTra(ngayTra);
        hopDong.capNhatTongTien();

        return hopDongRepository.save(hopDong);
    }

    // Cập nhật trạng thái hợp đồng
    public HopDongThue capNhatTrangThai(
            Long id,
            TrangThaiHopDong trangThaiMoi) {

        HopDongThue hopDong = timTheoId(id);

        if (trangThaiMoi == null) {
            throw new IllegalArgumentException(
                    "Trạng thái hợp đồng không được để trống");
        }

        TrangThaiHopDong trangThaiHienTai = hopDong.getTrangThai();

        // Nếu trạng thái không thay đổi thì giữ nguyên hợp đồng
        if (trangThaiHienTai == trangThaiMoi) {
            return hopDong;
        }

        // Hợp đồng đã trả hoặc đã hủy không được mở lại
        if (trangThaiHienTai != TrangThaiHopDong.DANG_THUE) {
            throw new IllegalArgumentException(
                    "Không thể thay đổi trạng thái hợp đồng đã trả hoặc đã hủy");
        }

        hopDong.setTrangThai(trangThaiMoi);

        return hopDongRepository.save(hopDong);
    }

    // Xóa hợp đồng
    public void xoa(Long id) {
        HopDongThue hopDong = timTheoId(id);
        hopDongRepository.delete(hopDong);
    }

    // Kiểm tra ID
    private void kiemTraId(Long khachHangId, Long phuongTienId) {
        if (khachHangId == null || khachHangId <= 0) {
            throw new IllegalArgumentException("ID khách hàng không hợp lệ");
        }

        if (phuongTienId == null || phuongTienId <= 0) {
            throw new IllegalArgumentException("ID phương tiện không hợp lệ");
        }
    }

    // Kiểm tra ngày thuê và ngày trả
    private void kiemTraNgay(
            LocalDate ngayThue,
            LocalDate ngayTra) {

        if (ngayThue == null || ngayTra == null) {
            throw new IllegalArgumentException(
                    "Ngày thuê và ngày trả không được để trống");
        }

        if (!ngayTra.isAfter(ngayThue)) {
            throw new IllegalArgumentException(
                    "Ngày trả phải sau ngày thuê");
        }
    }

    // Kiểm tra trùng lịch khi tạo hợp đồng
    private void kiemTraTrungLich(
            Long phuongTienId,
            LocalDate ngayThue,
            LocalDate ngayTra) {

        kiemTraTrungLich(phuongTienId, ngayThue, ngayTra, null);
    }

    // Kiểm tra trùng lịch khi tạo hoặc cập nhật hợp đồng
    private void kiemTraTrungLich(
            Long phuongTienId,
            LocalDate ngayThue,
            LocalDate ngayTra,
            Long boQuaHopDongId) {

        List<HopDongThue> hopDongs =
                hopDongRepository.findByPhuongTienId(phuongTienId);

        for (HopDongThue hopDong : hopDongs) {

            // Bỏ qua hợp đồng đang được cập nhật
            if (boQuaHopDongId != null
                    && boQuaHopDongId.equals(hopDong.getId())) {
                continue;
            }

            // Chỉ hợp đồng đang thuê mới chiếm lịch
            if (hopDong.getTrangThai() != TrangThaiHopDong.DANG_THUE) {
                continue;
            }

            // Hai khoảng thời gian bị trùng nếu giao nhau
            boolean biTrung =
                    ngayThue.isBefore(hopDong.getNgayTra())
                            && ngayTra.isAfter(hopDong.getNgayThue());

            if (biTrung) {
                throw new IllegalArgumentException(
                        "Phương tiện đã có hợp đồng trùng thời gian thuê");
            }
        }
    }
}
