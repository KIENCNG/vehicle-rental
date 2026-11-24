package com.vehiclerental.repository;

import com.vehiclerental.model.ThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ThanhToanRepository extends JpaRepository<ThanhToan, Long> {
    Optional<ThanhToan> findByHopDongThueId(Long hopDongId);
    List<ThanhToan> findAllByOrderByNgayTaoDesc();
}
