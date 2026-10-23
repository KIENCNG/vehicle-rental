
package com.vehiclerental.handler;

import com.vehiclerental.dto.PhuongTienRequest;
import com.vehiclerental.model.OTo;
import com.vehiclerental.model.PhuongTien;
import com.vehiclerental.model.XeMay;
import com.vehiclerental.service.PhuongTienService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController
@RequestMapping("/api/phuong-tien")
public class PhuongTienHandler {

    private final PhuongTienService phuongTienService;

    public PhuongTienHandler(PhuongTienService phuongTienService) {
        this.phuongTienService = phuongTienService;
    }

    @GetMapping
    public List<PhuongTien> layTatCa() {
        return phuongTienService.layTatCa();
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> timTheoId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(phuongTienService.timTheoId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> capNhat(
            @PathVariable Long id,
            @RequestBody PhuongTienRequest request) {
        try {
            PhuongTien phuongTienMoi;

            if ("OTO".equalsIgnoreCase(request.getLoaiXe())) {
                if (request.getSoCho() == null
                        || request.getLoaiNhienLieu() == null) {
                    throw new IllegalArgumentException(
                            "Ô tô cần có số chỗ và loại nhiên liệu");
                }

                phuongTienMoi = new OTo(
                        request.getBienSo(),
                        request.getHangXe(),
                        request.getGiaThueNgay(),
                        request.getSoCho(),
                        request.getLoaiNhienLieu()
                );

            } else if ("XEMAY".equalsIgnoreCase(request.getLoaiXe())) {
                if (request.getDungTichXiLanh() == null
                        || request.getKieuXe() == null) {
                    throw new IllegalArgumentException(
                            "Xe máy cần có dung tích xi lanh và kiểu xe");
                }

                phuongTienMoi = new XeMay(
                        request.getBienSo(),
                        request.getHangXe(),
                        request.getGiaThueNgay(),
                        request.getDungTichXiLanh(),
                        request.getKieuXe()
                );

            } else {
                throw new IllegalArgumentException(
                        "Loại xe phải là OTO hoặc XEMAY");
            }

            return ResponseEntity.ok(
                    phuongTienService.capNhat(id, phuongTienMoi)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoa(@PathVariable Long id) {
        try {
            phuongTienService.xoa(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
    @PostMapping
    public ResponseEntity<?> them(@RequestBody PhuongTienRequest request) {
        try {
            PhuongTien phuongTien;

            if ("OTO".equalsIgnoreCase(request.getLoaiXe())) {
                if (request.getSoCho() == null
                        || request.getLoaiNhienLieu() == null) {
                    throw new IllegalArgumentException(
                            "Ô tô cần có số chỗ và loại nhiên liệu");
                }

                phuongTien = new OTo(
                        request.getBienSo(),
                        request.getHangXe(),
                        request.getGiaThueNgay(),
                        request.getSoCho(),
                        request.getLoaiNhienLieu()
                );

            } else if ("XEMAY".equalsIgnoreCase(request.getLoaiXe())) {
                if (request.getDungTichXiLanh() == null
                        || request.getKieuXe() == null) {
                    throw new IllegalArgumentException(
                            "Xe máy cần có dung tích xi lanh và kiểu xe");
                }

                phuongTien = new XeMay(
                        request.getBienSo(),
                        request.getHangXe(),
                        request.getGiaThueNgay(),
                        request.getDungTichXiLanh(),
                        request.getKieuXe()
                );

            } else {
                throw new IllegalArgumentException(
                        "Loại xe phải là OTO hoặc XEMAY");
            }

            PhuongTien daLuu = phuongTienService.them(phuongTien);

            return ResponseEntity.status(HttpStatus.CREATED).body(daLuu);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
