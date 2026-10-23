
package com.vehiclerental.service;

import com.vehiclerental.model.KhachHang;
import com.vehiclerental.repository.KhachHangRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KhachHangService {

    private final KhachHangRepository khachHangRepository;

    public KhachHangService(KhachHangRepository khachHangRepository) {
        this.khachHangRepository = khachHangRepository;
    }

    public List<KhachHang> layTatCa() {
        return khachHangRepository.findAll();
    }

    public KhachHang them(KhachHang khachHang) {
        return khachHangRepository.save(khachHang);
    }

    public KhachHang timTheoId(Long id) {
        return khachHangRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy khách hàng có ID: " + id));
    }

    public KhachHang capNhat(Long id, KhachHang khachHangMoi) {
        KhachHang khachHangCu = timTheoId(id);

        khachHangCu.setHoTen(khachHangMoi.getHoTen());
        khachHangCu.setSoDienThoai(khachHangMoi.getSoDienThoai());
        khachHangCu.setDiaChi(khachHangMoi.getDiaChi());

        return khachHangRepository.save(khachHangCu);
    }

    public void xoa(Long id) {
        KhachHang khachHang = timTheoId(id);
        khachHangRepository.delete(khachHang);
    }
}
