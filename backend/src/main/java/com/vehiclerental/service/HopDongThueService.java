
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

    public List<HopDongThue> layTatCa() {
        return hopDongRepository.findAll();
    }

    public HopDongThue timTheoId(Long id) {
        return hopDongRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy hợp đồng có ID: " + id));
    }

    public List<HopDongThue> timTheoKhachHang(Long khachHangId) {
        return hopDongRepository.findByKhachHangId(khachHangId);
    }

    public HopDongThue them(
            Long khachHangId,
            Long phuongTienId,
            LocalDate ngayThue,
            LocalDate ngayTra) {

        KhachHang khachHang = khachHangRepository.findById(khachHangId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy khách hàng có ID: " + khachHangId));

        PhuongTien phuongTien = phuongTienRepository.findById(phuongTienId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy phương tiện có ID: " + phuongTienId));

        kiemTraNgay(ngayThue, ngayTra);
        kiemTraTrungLich(phuongTienId, ngayThue, ngayTra);

        HopDongThue hopDong = new HopDongThue(
                khachHang, phuongTien, ngayThue, ngayTra);

        hopDong.setTrangThai(TrangThaiHopDong.DANG_THUE);
        hopDong.capNhatTongTien();

        return hopDongRepository.save(hopDong);
    }

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

        KhachHang khachHang = khachHangRepository.findById(khachHangId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy khách hàng có ID: " + khachHangId));

        PhuongTien phuongTien = phuongTienRepository.findById(phuongTienId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy phương tiện có ID: " + phuongTienId));

        kiemTraNgay(ngayThue, ngayTra);
        kiemTraTrungLich(phuongTienId, ngayThue, ngayTra, id);

        hopDong.setKhachHang(khachHang);
        hopDong.setPhuongTien(phuongTien);
        hopDong.setNgayThue(ngayThue);
        hopDong.setNgayTra(ngayTra);
        hopDong.capNhatTongTien();

        return hopDongRepository.save(hopDong);
    }

    public HopDongThue capNhatTrangThai(
            Long id, TrangThaiHopDong trangThaiMoi) {

        HopDongThue hopDong = timTheoId(id);

        if (trangThaiMoi == null) {
            throw new IllegalArgumentException(
                    "Trạng thái hợp đồng không được để trống");
        }

        hopDong.setTrangThai(trangThaiMoi);
        return hopDongRepository.save(hopDong);
    }

    public void xoa(Long id) {
        HopDongThue hopDong = timTheoId(id);
        hopDongRepository.delete(hopDong);
    }

    private void kiemTraNgay(LocalDate ngayThue, LocalDate ngayTra) {
        if (ngayThue == null || ngayTra == null) {
            throw new IllegalArgumentException(
                    "Ngày thuê và ngày trả không được để trống");
        }

        if (!ngayTra.isAfter(ngayThue)) {
            throw new IllegalArgumentException(
                    "Ngày trả phải sau ngày thuê");
        }
    }

    private void kiemTraTrungLich(
            Long phuongTienId,
            LocalDate ngayThue,
            LocalDate ngayTra) {
        kiemTraTrungLich(phuongTienId, ngayThue, ngayTra, null);
    }

    private void kiemTraTrungLich(
            Long phuongTienId,
            LocalDate ngayThue,
            LocalDate ngayTra,
            Long boQuaHopDongId) {

        List<HopDongThue> hopDongs =
                hopDongRepository.findByPhuongTienId(phuongTienId);

        for (HopDongThue hopDong : hopDongs) {
            if (boQuaHopDongId != null
                    && hopDong.getId().equals(boQuaHopDongId)) {
                continue;
            }

            if (hopDong.getTrangThai() != TrangThaiHopDong.DANG_THUE) {
                continue;
            }

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
