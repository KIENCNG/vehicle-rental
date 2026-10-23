
package com.vehiclerental.handler;

import com.vehiclerental.dto.HopDongThueRequest;
import com.vehiclerental.model.HopDongThue;
import com.vehiclerental.model.TrangThaiHopDong;
import com.vehiclerental.service.HopDongThueService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hop-dong")
public class HopDongThueHandler {

    private final HopDongThueService hopDongService;

    public HopDongThueHandler(HopDongThueService hopDongService) {
        this.hopDongService = hopDongService;
    }

    @GetMapping
    public ResponseEntity<List<HopDongThue>> layTatCa() {
        return ResponseEntity.ok(hopDongService.layTatCa());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> timTheoId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(hopDongService.timTheoId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/khach-hang/{khachHangId}")
    public ResponseEntity<?> timTheoKhachHang(
            @PathVariable Long khachHangId) {
        return ResponseEntity.ok(
                hopDongService.timTheoKhachHang(khachHangId));
    }

    @PostMapping
    public ResponseEntity<?> them(
            @RequestBody HopDongThueRequest request) {
        try {
            HopDongThue hopDong = hopDongService.them(
                    request.getKhachHangId(),
                    request.getPhuongTienId(),
                    request.getNgayThue(),
                    request.getNgayTra());

            return ResponseEntity.status(HttpStatus.CREATED).body(hopDong);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ArithmeticException e) {
            return ResponseEntity.badRequest()
                    .body("Số ngày thuê không hợp lệ");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> capNhat(
            @PathVariable Long id,
            @RequestBody HopDongThueRequest request) {
        try {
            HopDongThue hopDong = hopDongService.capNhat(
                    id,
                    request.getKhachHangId(),
                    request.getPhuongTienId(),
                    request.getNgayThue(),
                    request.getNgayTra());

            return ResponseEntity.ok(hopDong);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().startsWith("Không tìm thấy hợp đồng")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(e.getMessage());
            }

            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (ArithmeticException e) {
            return ResponseEntity.badRequest()
                    .body("Số ngày thuê không hợp lệ");
        }
    }

    @PatchMapping("/{id}/trang-thai")
    public ResponseEntity<?> capNhatTrangThai(
            @PathVariable Long id,
            @RequestBody HopDongThueRequest request) {
        try {
            if (request.getTrangThai() == null) {
                return ResponseEntity.badRequest()
                        .body("Trạng thái không được để trống");
            }

            return ResponseEntity.ok(
                    hopDongService.capNhatTrangThai(
                            id, request.getTrangThai()));
        } catch (IllegalArgumentException e) {
            if (e.getMessage().startsWith("Không tìm thấy hợp đồng")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(e.getMessage());
            }

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoa(@PathVariable Long id) {
        try {
            hopDongService.xoa(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}
