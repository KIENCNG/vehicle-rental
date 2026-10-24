package com.vehiclerental.handler;

import com.vehiclerental.dto.PhuongTienRequest;
import com.vehiclerental.model.PhuongTien;
import com.vehiclerental.service.PhuongTienService;
import com.vehiclerental.service.exception.KhongTimThayException;
import com.vehiclerental.service.exception.NghiepVuException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        } catch (KhongTimThayException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> them(@RequestBody PhuongTienRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(phuongTienService.them(request));
        } catch (IllegalArgumentException | NghiepVuException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> capNhat(
            @PathVariable Long id,
            @RequestBody PhuongTienRequest request) {
        try {
            return ResponseEntity.ok(phuongTienService.capNhat(id, request));
        } catch (KhongTimThayException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (IllegalArgumentException | NghiepVuException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> xoa(@PathVariable Long id) {
        try {
            phuongTienService.xoa(id);
            return ResponseEntity.noContent().build();
        } catch (KhongTimThayException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (NghiepVuException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
