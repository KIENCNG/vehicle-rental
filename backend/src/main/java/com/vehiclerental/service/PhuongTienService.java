
package com.vehiclerental.service;

import com.vehiclerental.model.PhuongTien;
import com.vehiclerental.repository.PhuongTienRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhuongTienService {

    private final PhuongTienRepository phuongTienRepository;

    public PhuongTienService(PhuongTienRepository phuongTienRepository) {
        this.phuongTienRepository = phuongTienRepository;
    }

    public List<PhuongTien> layTatCa() {
        return phuongTienRepository.findAll();

    }

    public PhuongTien them(PhuongTien phuongTien) {
        return phuongTienRepository.save(phuongTien);
    }

}
