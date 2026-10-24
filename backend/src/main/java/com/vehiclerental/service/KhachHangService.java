package com.vehiclerental.service;

import com.vehiclerental.model.KhachHang;
import com.vehiclerental.repository.HopDongThueRepository;
import com.vehiclerental.repository.KhachHangRepository;
import com.vehiclerental.service.exception.KhongTimThayException;
import com.vehiclerental.service.exception.NghiepVuException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KhachHangService {

    private final KhachHangRepository khachHangRepository;
    private final HopDongThueRepository hopDongRepository;

    public KhachHangService(
            KhachHangRepository khachHangRepository,
            HopDongThueRepository hopDongRepository) {
        this.khachHangRepository = khachHangRepository;
        this.hopDongRepository = hopDongRepository;
    }

    public List<KhachHang> layTatCa() {
        return khachHangRepository.findAll();
    }

    public KhachHang timTheoId(Long id) {
        return khachHangRepository.findById(id)
                .orElseThrow(() -> new KhongTimThayException(
                        "Không tìm thấy khách hàng có ID: " + id));
    }

    public KhachHang them(KhachHang khachHang) {
        if (khachHangRepository.existsBySoDienThoai(
                khachHang.getSoDienThoai())) {
            throw new NghiepVuException(
                    "Số điện thoại " + khachHang.getSoDienThoai()
                            + " đã được dùng cho khách hàng khác");
        }

        return khachHangRepository.save(khachHang);
    }

    public KhachHang capNhat(Long id, KhachHang khachHangMoi) {
        KhachHang khachHangCu = timTheoId(id);

        if (khachHangRepository.existsBySoDienThoaiAndIdNot(
                khachHangMoi.getSoDienThoai(), id)) {
            throw new NghiepVuException(
                    "Số điện thoại " + khachHangMoi.getSoDienThoai()
                            + " đã được dùng cho khách hàng khác");
        }

        khachHangCu.setHoTen(khachHangMoi.getHoTen());
        khachHangCu.setSoDienThoai(khachHangMoi.getSoDienThoai());
        khachHangCu.setDiaChi(khachHangMoi.getDiaChi());

        return khachHangRepository.save(khachHangCu);
    }

    public void xoa(Long id) {
        KhachHang khachHang = timTheoId(id);

        if (hopDongRepository.existsByKhachHangId(id)) {
            throw new NghiepVuException(
                    "Không thể xóa khách hàng đã có hợp đồng thuê");
        }

        khachHangRepository.delete(khachHang);
    }
}
