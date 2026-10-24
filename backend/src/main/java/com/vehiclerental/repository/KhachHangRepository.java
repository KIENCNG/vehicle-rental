package com.vehiclerental.repository;

import com.vehiclerental.model.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KhachHangRepository
        extends JpaRepository<KhachHang, Long> {

    boolean existsBySoDienThoai(String soDienThoai);

    boolean existsBySoDienThoaiAndIdNot(String soDienThoai, Long id);
}
