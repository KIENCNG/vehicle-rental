package com.vehiclerental.repository;

import com.vehiclerental.model.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface KhachHangRepository
        extends JpaRepository<KhachHang, Long> {

    boolean existsBySoDienThoai(String soDienThoai);

    boolean existsBySoDienThoaiAndIdNot(String soDienThoai, Long id);

    Optional<KhachHang> findBySoDienThoai(String soDienThoai);
}
