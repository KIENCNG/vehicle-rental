package com.vehiclerental.dto;

import com.vehiclerental.model.ThanhToan;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ThanhToanResponse(
        Long id, Long hopDongId, BigDecimal tongTienHopDong,
        BigDecimal tienDatCoc, BigDecimal tienConLai,
        String trangThai, String phuongThuc, String maGiaoDich,
        LocalDateTime ngayTao, LocalDateTime ngayXacNhan,
        String tenKhachHang, String tenPhuongTien
) {
    public static ThanhToanResponse from(ThanhToan t) {
        var hd = t.getHopDongThue();
        return new ThanhToanResponse(
                t.getId(), hd.getId(), t.getTongTienHopDong(), t.getTienDatCoc(),
                t.getTienConLai(), t.getTrangThai().name(), t.getPhuongThuc(),
                t.getMaGiaoDich(), t.getNgayTao(), t.getNgayXacNhan(),
                hd.getKhachHang().getHoTen(), hd.getPhuongTien().getHangXe()
        );
    }
}
