package com.vehiclerental.service;

import com.vehiclerental.dto.AuthResponse;
import com.vehiclerental.dto.DangKyRequest;
import com.vehiclerental.dto.DangNhapRequest;
import com.vehiclerental.model.KhachHang;
import com.vehiclerental.model.NguoiDung;
import com.vehiclerental.model.VaiTro;
import com.vehiclerental.repository.KhachHangRepository;
import com.vehiclerental.repository.NguoiDungRepository;
import com.vehiclerental.service.exception.KhongTimThayException;
import com.vehiclerental.service.exception.NghiepVuException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.UUID;

@Service
@Transactional
public class NguoiDungService {

    private final NguoiDungRepository nguoiDungRepository;
    private final KhachHangRepository khachHangRepository;

    public NguoiDungService(NguoiDungRepository nguoiDungRepository, KhachHangRepository khachHangRepository) {
        this.nguoiDungRepository = nguoiDungRepository;
        this.khachHangRepository = khachHangRepository;
    }

    public AuthResponse dangNhap(DangNhapRequest request) {
        if (request.getTenDangNhap() == null || request.getTenDangNhap().isBlank()) {
            throw new IllegalArgumentException("Tên đăng nhập không được để trống");
        }
        if (request.getMatKhau() == null || request.getMatKhau().isBlank()) {
            throw new IllegalArgumentException("Mật khẩu không được để trống");
        }

        NguoiDung nguoiDung = nguoiDungRepository.findByTenDangNhap(request.getTenDangNhap().trim())
                .or(() -> nguoiDungRepository.findBySoDienThoai(request.getTenDangNhap().trim()))
                .orElseThrow(() -> new NghiepVuException("Tên đăng nhập hoặc mật khẩu không chính xác"));

        String hashed = hashMatKhau(request.getMatKhau());
        if (!hashed.equals(nguoiDung.getMatKhau())) {
            throw new NghiepVuException("Tên đăng nhập hoặc mật khẩu không chính xác");
        }

        String token = taoToken(nguoiDung);
        return chuyenSangResponse(nguoiDung, token);
    }

    public AuthResponse dangKy(DangKyRequest request) {
        if (request.getTenDangNhap() == null || request.getTenDangNhap().trim().length() < 3) {
            throw new IllegalArgumentException("Tên đăng nhập phải có ít nhất 3 ký tự");
        }
        if (request.getMatKhau() == null || request.getMatKhau().trim().length() < 6) {
            throw new IllegalArgumentException("Mật khẩu phải có ít nhất 6 ký tự");
        }
        if (request.getHoTen() == null || request.getHoTen().isBlank()) {
            throw new IllegalArgumentException("Họ và tên không được để trống");
        }
        if (request.getSoDienThoai() == null || request.getSoDienThoai().isBlank()) {
            throw new IllegalArgumentException("Số điện thoại không được để trống");
        }

        String tenDangNhap = request.getTenDangNhap().trim();
        String soDienThoai = request.getSoDienThoai().trim();

        if (nguoiDungRepository.existsByTenDangNhap(tenDangNhap)) {
            throw new NghiepVuException("Tên đăng nhập '" + tenDangNhap + "' đã tồn tại");
        }

        if (nguoiDungRepository.existsBySoDienThoai(soDienThoai)) {
            throw new NghiepVuException("Số điện thoại '" + soDienThoai + "' đã được sử dụng");
        }

        // Tự động liên kết hoặc tạo bản ghi Khách hàng tương ứng
        Long khachHangId = null;
        var existingKhachHang = khachHangRepository.findBySoDienThoai(soDienThoai);
        if (existingKhachHang.isPresent()) {
            khachHangId = existingKhachHang.get().getId();
        } else {
            String diaChi = request.getDiaChi() != null && !request.getDiaChi().isBlank()
                    ? request.getDiaChi().trim()
                    : "Chưa cập nhật";
            KhachHang khachHang = new KhachHang(request.getHoTen().trim(), soDienThoai, diaChi);
            KhachHang savedKh = khachHangRepository.save(khachHang);
            khachHangId = savedKh.getId();
        }

        NguoiDung nguoiDung = new NguoiDung(
                tenDangNhap,
                hashMatKhau(request.getMatKhau()),
                request.getHoTen().trim(),
                soDienThoai,
                request.getEmail() != null ? request.getEmail().trim() : null,
                request.getDiaChi() != null ? request.getDiaChi().trim() : null,
                VaiTro.CUSTOMER,
                khachHangId
        );

        NguoiDung savedUser = nguoiDungRepository.save(nguoiDung);
        String token = taoToken(savedUser);
        return chuyenSangResponse(savedUser, token);
    }

    public AuthResponse layThongTin(Long id) {
        NguoiDung nguoiDung = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new KhongTimThayException("Không tìm thấy người dùng có ID: " + id));
        return chuyenSangResponse(nguoiDung, null);
    }

    public String hashMatKhau(String matKhau) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(matKhau.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Lỗi mã hóa mật khẩu", e);
        }
    }

    private String taoToken(NguoiDung nguoiDung) {
        String raw = nguoiDung.getId() + ":" + nguoiDung.getTenDangNhap() + ":" + nguoiDung.getVaiTro() + ":" + UUID.randomUUID();
        return Base64.getEncoder().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }

    private AuthResponse chuyenSangResponse(NguoiDung nguoiDung, String token) {
        return new AuthResponse(
                nguoiDung.getId(),
                nguoiDung.getTenDangNhap(),
                nguoiDung.getHoTen(),
                nguoiDung.getSoDienThoai(),
                nguoiDung.getEmail(),
                nguoiDung.getDiaChi(),
                nguoiDung.getVaiTro(),
                nguoiDung.getKhachHangId(),
                token
        );
    }
}
