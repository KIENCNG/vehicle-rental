
package com.vehiclerental.service;

import com.vehiclerental.model.PhuongTien;
import com.vehiclerental.repository.PhuongTienRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhuongTienService {

    private final PhuongTienRepository phuongTienRepository;

    public PhuongTienService(PhuongTienRepository phuongTienRepository) {
        this.phuongTienRepository = phuongTienRepository;
    }

    public List<PhuongTien> layTatCa() {
        return phuongTienRepository.findAll();

    }

    public PhuongTien them(PhuongTien phuongTien) {
        return phuongTienRepository.save(phuongTien);
    }
    public PhuongTien timTheoId(Long id) {
        return phuongTienRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Không tìm thấy phương tiện có ID: " + id));
    }
    public PhuongTien capNhat(Long id, PhuongTien phuongTienMoi) {
        PhuongTien phuongTienCu = timTheoId(id);

        phuongTienCu.setBienSo(phuongTienMoi.getBienSo());
        phuongTienCu.setHangXe(phuongTienMoi.getHangXe());
        phuongTienCu.setGiaThueNgay(phuongTienMoi.getGiaThueNgay());

        if (phuongTienCu instanceof com.vehiclerental.model.OTo
                && phuongTienMoi instanceof com.vehiclerental.model.OTo) {
            com.vehiclerental.model.OTo xeCu =
                    (com.vehiclerental.model.OTo) phuongTienCu;
            com.vehiclerental.model.OTo xeMoi =
                    (com.vehiclerental.model.OTo) phuongTienMoi;

            xeCu.setSoCho(xeMoi.getSoCho());
            xeCu.setLoaiNhienLieu(xeMoi.getLoaiNhienLieu());

        } else if (phuongTienCu instanceof com.vehiclerental.model.XeMay
                && phuongTienMoi instanceof com.vehiclerental.model.XeMay) {
            com.vehiclerental.model.XeMay xeCu =
                    (com.vehiclerental.model.XeMay) phuongTienCu;
            com.vehiclerental.model.XeMay xeMoi =
                    (com.vehiclerental.model.XeMay) phuongTienMoi;

            xeCu.setDungTichXiLanh(xeMoi.getDungTichXiLanh());
            xeCu.setKieuXe(xeMoi.getKieuXe());

        } else {
            throw new IllegalArgumentException(
                    "Không thể đổi loại phương tiện khi cập nhật");
        }

        return phuongTienRepository.save(phuongTienCu);
    }
    public void xoa(Long id) {
        PhuongTien phuongTien = timTheoId(id);
        phuongTienRepository.delete(phuongTien);
    }

}
