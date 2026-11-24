package com.vehiclerental.service;

import com.vehiclerental.dto.ThanhToanResponse;
import com.vehiclerental.model.*;
import com.vehiclerental.repository.HopDongThueRepository;
import com.vehiclerental.repository.ThanhToanRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@Transactional
public class ThanhToanService {
    private final ThanhToanRepository thanhToanRepository;
    private final HopDongThueRepository hopDongRepository;

    @Value("${app.payment.deposit-percent:30}")
    private int depositPercent;

    public ThanhToanService(ThanhToanRepository thanhToanRepository, HopDongThueRepository hopDongRepository) {
        this.thanhToanRepository = thanhToanRepository;
        this.hopDongRepository = hopDongRepository;
    }

    public ThanhToanResponse taoDatCoc(Long hopDongId) {
        if (hopDongId == null || hopDongId <= 0) throw new IllegalArgumentException("ID hợp đồng không hợp lệ");
        var existing = thanhToanRepository.findByHopDongThueId(hopDongId);
        if (existing.isPresent()) return ThanhToanResponse.from(existing.get());

        HopDongThue hopDong = hopDongRepository.findById(hopDongId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hợp đồng"));
        if (hopDong.getTrangThai() != TrangThaiHopDong.CHO_XAC_NHAN) {
            throw new IllegalArgumentException("Chỉ tạo đặt cọc cho yêu cầu thuê đang chờ xác nhận");
        }
        if (depositPercent <= 0 || depositPercent >= 100) throw new IllegalStateException("Tỷ lệ đặt cọc cấu hình không hợp lệ");

        BigDecimal total = BigDecimal.valueOf(hopDong.getTongTien()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal deposit = total.multiply(BigDecimal.valueOf(depositPercent))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        ThanhToan saved = thanhToanRepository.save(new ThanhToan(hopDong, total, deposit));
        return ThanhToanResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public ThanhToanResponse timTheoHopDong(Long hopDongId) {
        return ThanhToanResponse.from(thanhToanRepository.findByHopDongThueId(hopDongId)
                .orElseThrow(() -> new IllegalArgumentException("Hợp đồng chưa có giao dịch thanh toán")));
    }

    @Transactional(readOnly = true)
    public List<ThanhToanResponse> layTatCa() {
        return thanhToanRepository.findAllByOrderByNgayTaoDesc().stream().map(ThanhToanResponse::from).toList();
    }

    public ThanhToanResponse baoDaChuyenKhoan(Long id, String maGiaoDich) {
        ThanhToan t = tim(id);
        if (maGiaoDich == null || maGiaoDich.isBlank()) throw new IllegalArgumentException("Vui lòng nhập mã/nội dung chuyển khoản");
        t.danhDauDaChuyenKhoan(maGiaoDich.trim());
        return ThanhToanResponse.from(t);
    }

    public ThanhToanResponse adminXacNhan(Long id) {
        ThanhToan t = tim(id);
        t.xacNhan();
        return ThanhToanResponse.from(t);
    }

    public ThanhToanResponse adminTuChoi(Long id) {
        ThanhToan t = tim(id);
        t.tuChoi();
        return ThanhToanResponse.from(t);
    }

    private ThanhToan tim(Long id) {
        if (id == null || id <= 0) throw new IllegalArgumentException("ID thanh toán không hợp lệ");
        return thanhToanRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giao dịch thanh toán"));
    }
}
