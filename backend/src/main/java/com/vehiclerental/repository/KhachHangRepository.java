package com.vehiclerental.repository;

import com.vehiclerental.model.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KhachHangRepository
        extends JpaRepository<KhachHang, Long> {
}