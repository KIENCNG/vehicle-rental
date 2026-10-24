package com.vehiclerental.service;

import com.vehiclerental.dto.PhuongTienRequest;
import com.vehiclerental.model.OTo;
import com.vehiclerental.model.PhuongTien;
import com.vehiclerental.model.XeMay;
import com.vehiclerental.repository.HopDongThueRepository;
import com.vehiclerental.repository.PhuongTienRepository;
import com.vehiclerental.service.exception.KhongTimThayException;
import com.vehiclerental.service.exception.NghiepVuException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhuongTienService {

    private final PhuongTienRepository phuongTienRepository;
    private final HopDongThueRepository hopDongRepository;

    public PhuongTienService(
            PhuongTienRepository phuongTienRepository,
            HopDongThueRepository hopDongRepository) {
        this.phuongTienRepository = phuongTienRepository;
        this.hopDongRepository = hopDongRepository;
    }

    public List<PhuongTien> layTatCa() {
        return phuongTienRepository.findAll();
    }

    public PhuongTien timTheoId(Long id) {
        return phuongTienRepository.findById(id)
                .orElseThrow(() -> new KhongTimThayException(
                        "Không tìm thấy phương tiện có ID: " + id));
    }

    public PhuongTien them(PhuongTienRequest request) {
        PhuongTien phuongTien = taoTuRequest(request);

        if (phuongTienRepository.existsByBienSo(phuongTien.getBienSo())) {
            throw new NghiepVuException(
                    "Biển số " + phuongTien.getBienSo() + " đã tồn tại");
        }

        return phuongTienRepository.save(phuongTien);
    }

    public PhuongTien capNhat(Long id, PhuongTienRequest request) {
        PhuongTien phuongTienCu = timTheoId(id);
        PhuongTien phuongTienMoi = taoTuRequest(request);

        if (!phuongTienCu.getLoaiXe().equals(phuongTienMoi.getLoaiXe())) {
            throw new NghiepVuException(
                    "Không thể đổi loại phương tiện khi cập nhật");
        }

        if (phuongTienRepository.existsByBienSoAndIdNot(
                phuongTienMoi.getBienSo(), id)) {
            throw new NghiepVuException(
                    "Biển số " + phuongTienMoi.getBienSo() + " đã tồn tại");
        }

        phuongTienCu.setBienSo(phuongTienMoi.getBienSo());
        phuongTienCu.setHangXe(phuongTienMoi.getHangXe());
        phuongTienCu.setGiaThueNgay(phuongTienMoi.getGiaThueNgay());

        if (phuongTienCu instanceof OTo xeCu
                && phuongTienMoi instanceof OTo xeMoi) {
            xeCu.setSoCho(xeMoi.getSoCho());
            xeCu.setLoaiNhienLieu(xeMoi.getLoaiNhienLieu());
        } else if (phuongTienCu instanceof XeMay xeCu
                && phuongTienMoi instanceof XeMay xeMoi) {
            xeCu.setDungTichXiLanh(xeMoi.getDungTichXiLanh());
            xeCu.setKieuXe(xeMoi.getKieuXe());
        }

        return phuongTienRepository.save(phuongTienCu);
    }

    public void xoa(Long id) {
        PhuongTien phuongTien = timTheoId(id);

        if (hopDongRepository.existsByPhuongTienId(id)) {
            throw new NghiepVuException(
                    "Không thể xóa phương tiện đã có hợp đồng thuê");
        }

        phuongTienRepository.delete(phuongTien);
    }

    // Tạo đúng loại phương tiện từ dữ liệu người dùng gửi lên
    private PhuongTien taoTuRequest(PhuongTienRequest request) {
        if ("OTO".equalsIgnoreCase(request.getLoaiXe())) {
            if (request.getSoCho() == null
                    || request.getLoaiNhienLieu() == null) {
                throw new IllegalArgumentException(
                        "Ô tô cần có số chỗ và loại nhiên liệu");
            }

            return new OTo(
                    request.getBienSo(),
                    request.getHangXe(),
                    request.getGiaThueNgay(),
                    request.getSoCho(),
                    request.getLoaiNhienLieu());
        }

        if ("XEMAY".equalsIgnoreCase(request.getLoaiXe())) {
            if (request.getDungTichXiLanh() == null
                    || request.getKieuXe() == null) {
                throw new IllegalArgumentException(
                        "Xe máy cần có dung tích xi lanh và kiểu xe");
            }

            return new XeMay(
                    request.getBienSo(),
                    request.getHangXe(),
                    request.getGiaThueNgay(),
                    request.getDungTichXiLanh(),
                    request.getKieuXe());
        }

        throw new IllegalArgumentException("Loại xe phải là OTO hoặc XEMAY");
    }
}
