
package com.vehiclerental.handler;

import com.vehiclerental.model.ThanhToan;
import com.vehiclerental.service.ThanhToanService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/thanh-toan")
public class ThanhToanHandler {

    private final ThanhToanService thanhToanService;

    public ThanhToanHandler(ThanhToanService thanhToanService) {
        this.thanhToanService = thanhToanService;
    }

    // Admin xem tất cả thanh toán
    @GetMapping
    public ResponseEntity<List<ThanhToan>> layTatCa() {
        return ResponseEntity.ok(thanhToanService.layTatCa());
    }

    // Admin xem chi tiết thanh toán
    @GetMapping("/{id}")
    public ResponseEntity<?> timTheoId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(thanhToanService.timTheoId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin và khách xem thanh toán theo hợp đồng
    @GetMapping("/hop-dong/{hopDongId}")
    public ResponseEntity<?> timTheoHopDong(
            @PathVariable Long hopDongId,
            Authentication authentication) {
        try {
            boolean laAdmin = authentication.getAuthorities()
                    .stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            if (laAdmin) {
                return ResponseEntity.ok(
                        thanhToanService.timTheoHopDong(hopDongId)
                );
            }

            Long khachHangId = Long.valueOf(
                    authentication.getDetails().toString()
            );

            return ResponseEntity.ok(
                    thanhToanService.timTheoHopDong(
                            hopDongId, khachHangId
                    )
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Khách tạo thanh toán
    @PostMapping
    public ResponseEntity<?> taoThanhToan(
            @RequestParam Long hopDongId,
            @RequestParam double soTien,
            @RequestParam String phuongThuc,
            Authentication authentication) {
        try {
            Long khachHangId = Long.valueOf(
                    authentication.getDetails().toString()
            );

            ThanhToan thanhToan = thanhToanService.taoThanhToan(
                    hopDongId,
                    soTien,
                    phuongThuc,
                    khachHangId
            );

            return ResponseEntity.ok(thanhToan);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Khách gửi yêu cầu xác nhận thanh toán
    @PatchMapping("/{id}/gui-xac-nhan")
    public ResponseEntity<?> guiYeuCauXacNhan(
            @PathVariable Long id,
            @RequestParam String maGiaoDich,
            @RequestParam(required = false) String ghiChu,
            Authentication authentication) {
        try {
            Long khachHangId = Long.valueOf(
                    authentication.getDetails().toString()
            );

            ThanhToan thanhToan = thanhToanService.guiYeuCauXacNhan(
                    id,
                    maGiaoDich,
                    ghiChu,
                    khachHangId
            );

            return ResponseEntity.ok(thanhToan);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin xác nhận đã nhận tiền
    @PatchMapping("/{id}/xac-nhan")
    public ResponseEntity<?> xacNhanThanhToan(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    thanhToanService.xacNhanThanhToan(id)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin hủy yêu cầu thanh toán
    @PatchMapping("/{id}/huy")
    public ResponseEntity<?> huyYeuCauThanhToan(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    thanhToanService.huyYeuCauThanhToan(id)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
