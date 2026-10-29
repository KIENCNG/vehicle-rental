package com.vehiclerental.repository;

import com.vehiclerental.model.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface NguoiDungRepository extends JpaRepository<NguoiDung, Long> {

    Optional<NguoiDung> findByTenDangNhap(String tenDangNhap);

    boolean existsByTenDangNhap(String tenDangNhap);

    boolean existsBySoDienThoai(String soDienThoai);

    Optional<NguoiDung> findBySoDienThoai(String soDienThoai);
}
