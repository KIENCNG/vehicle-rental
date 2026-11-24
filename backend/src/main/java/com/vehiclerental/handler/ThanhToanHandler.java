package com.vehiclerental.handler;

import com.vehiclerental.dto.ThanhToanResponse;
import com.vehiclerental.service.ThanhToanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/thanh-toan")
public class ThanhToanHandler {
    private final ThanhToanService service;
    public ThanhToanHandler(ThanhToanService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<?> layTatCa() { return ResponseEntity.ok(service.layTatCa()); }

    @GetMapping("/hop-dong/{hopDongId}")
    public ResponseEntity<?> theoHopDong(@PathVariable Long hopDongId) {
        try { return ResponseEntity.ok(service.timTheoHopDong(hopDongId)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @PostMapping("/tao/{hopDongId}")
    public ResponseEntity<?> taoDatCoc(@PathVariable Long hopDongId) {
        try { return ResponseEntity.ok(service.taoDatCoc(hopDongId)); }
        catch (IllegalArgumentException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @PatchMapping("/{id}/da-chuyen-khoan")
    public ResponseEntity<?> baoDaChuyen(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try { return ResponseEntity.ok(service.baoDaChuyenKhoan(id, body.get("maGiaoDich"))); }
        catch (IllegalArgumentException | IllegalStateException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @PatchMapping("/{id}/xac-nhan")
    public ResponseEntity<?> xacNhan(@PathVariable Long id) {
        try { return ResponseEntity.ok(service.adminXacNhan(id)); }
        catch (IllegalArgumentException | IllegalStateException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @PatchMapping("/{id}/tu-choi")
    public ResponseEntity<?> tuChoi(@PathVariable Long id) {
        try { return ResponseEntity.ok(service.adminTuChoi(id)); }
        catch (IllegalArgumentException | IllegalStateException e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }
}
