package com.vehiclerental.repository;

import com.vehiclerental.model.ThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThanhToanRepository extends JpaRepository<ThanhToan, Long> {

    List<ThanhToan> findByHopDongThueId(Long hopDongId);

}