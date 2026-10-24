package com.vehiclerental.repository;

import com.vehiclerental.model.HopDongThue;
import com.vehiclerental.model.TrangThaiHopDong;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface HopDongThueRepository
        extends JpaRepository<HopDongThue, Long> {

    List<HopDongThue> findByKhachHangId(Long khachHangId);

    List<HopDongThue> findByPhuongTienId(Long phuongTienId);

    boolean existsByPhuongTienId(Long phuongTienId);

    boolean existsByKhachHangId(Long khachHangId);

    boolean existsByPhuongTienIdAndTrangThaiAndNgayThueLessThanAndNgayTraGreaterThan(
            Long phuongTienId,
            TrangThaiHopDong trangThai,
            LocalDate ngayTraMoi,
            LocalDate ngayThueMoi);
}
