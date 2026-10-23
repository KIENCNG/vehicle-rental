
package com.vehiclerental.handler;

import com.vehiclerental.dto.KhachHangRequest;
import com.vehiclerental.model.KhachHang;
import com.vehiclerental.service.KhachHangService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/khach-hang")
public class KhachHangHandler {

    private final KhachHangService khachHangService;

    public KhachHangHandler(KhachHangService khachHangService) {
        this.khachHangService = khachHangService;
    }

    @GetMapping
    public ResponseEntity<List<KhachHang>> layTatCa() {
        return ResponseEntity.ok(khachHangService.layTatCa());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> timTheoId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(khachHangService.timTheoId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> them(@RequestBody KhachHangRequest request) {
        try {
            KhachHang khachHang = new KhachHang(
                    request.getHoTen(),
                    request.getSoDienThoai(),
                    request.getDiaChi()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(khachHangService.them(khachHang));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> capNhat(
            @PathVariable Long id,
            @RequestBody KhachHangRequest request) {
        try {
            KhachHang khachHangMoi = new KhachHang(
                    request.getHoTen(),
                    request.getSoDienThoai(),
                    request.getDiaChi()
            );

            return ResponseEntity.ok(
                    khachHangService.capNhat(id, khachHangMoi)
            );
        } catch (IllegalArgumentException e) {
            if (e.getMessage().startsWith("Không tìm thấy khách hàng")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(e.getMessage());
            }

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoa(@PathVariable Long id) {
        try {
            khachHangService.xoa(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}
