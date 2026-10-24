package com.vehiclerental.repository;

import com.vehiclerental.model.PhuongTien;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhuongTienRepository extends JpaRepository<PhuongTien, Long> {

    boolean existsByBienSo(String bienSo);

    boolean existsByBienSoAndIdNot(String bienSo, Long id);
}
