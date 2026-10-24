package com.vehiclerental.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class HopDongThueTest {

    private HopDongThue taoHopDongMau() {
        KhachHang khachHang =
                new KhachHang("Nguyen Van A", "0901234567", "Ha Noi");
        OTo oTo = new OTo("30F-999.88", "Kia", 700000, 5, "Xang");

        return new HopDongThue(
                khachHang, oTo,
                LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 4));
    }

    @Test
    void tongTienOTo_baNgay() {
        assertEquals(2310000.0, taoHopDongMau().getTongTien(), 0.001);
    }

    @Test
    void capNhatThoiGianThue_doiSangNgayMuonHon_khongBaoLoi() {
        HopDongThue hopDong = taoHopDongMau();

        hopDong.capNhatThoiGianThue(
                LocalDate.of(2026, 12, 10), LocalDate.of(2026, 12, 12));
        hopDong.capNhatTongTien();

        assertEquals(LocalDate.of(2026, 12, 10), hopDong.getNgayThue());
        assertEquals(LocalDate.of(2026, 12, 12), hopDong.getNgayTra());
        assertEquals(1540000.0, hopDong.getTongTien(), 0.001);
    }

    @Test
    void capNhatThoiGianThue_ngayTraKhongSauNgayThue_baoLoi() {
        HopDongThue hopDong = taoHopDongMau();
        LocalDate ngay = LocalDate.of(2026, 12, 10);

        assertThrows(IllegalArgumentException.class,
                () -> hopDong.capNhatThoiGianThue(ngay, ngay));
    }
}
