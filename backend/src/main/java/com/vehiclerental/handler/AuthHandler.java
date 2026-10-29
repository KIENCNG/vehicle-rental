package com.vehiclerental.handler;

import com.vehiclerental.dto.AuthResponse;
import com.vehiclerental.dto.DangKyRequest;
import com.vehiclerental.dto.DangNhapRequest;
import com.vehiclerental.service.NguoiDungService;
import com.vehiclerental.service.exception.KhongTimThayException;
import com.vehiclerental.service.exception.NghiepVuException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthHandler {

    private final NguoiDungService nguoiDungService;

    public AuthHandler(NguoiDungService nguoiDungService) {
        this.nguoiDungService = nguoiDungService;
    }

    @PostMapping("/dang-nhap")
    public ResponseEntity<?> dangNhap(@RequestBody DangNhapRequest request) {
        try {
            AuthResponse response = nguoiDungService.dangNhap(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | NghiepVuException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi khi đăng nhập: " + e.getMessage());
        }
    }

    @PostMapping("/dang-ky")
    public ResponseEntity<?> dangKy(@RequestBody DangKyRequest request) {
        try {
            AuthResponse response = nguoiDungService.dangKy(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException | NghiepVuException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi khi đăng ký: " + e.getMessage());
        }
    }

    @GetMapping("/thong-tin/{id}")
    public ResponseEntity<?> layThongTin(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(nguoiDungService.layThongTin(id));
        } catch (KhongTimThayException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
