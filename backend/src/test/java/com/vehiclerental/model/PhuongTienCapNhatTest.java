package com.vehiclerental.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PhuongTienCapNhatTest {

    @Test
    void capNhatTu_otoSangOto_capNhatCaThuocTinhChungVaRieng() {
        PhuongTien cu = new OTo("30F-111.11", "Kia", 500000, 5, "Xang");
        PhuongTien moi = new OTo("30F-222.22", "Toyota", 800000, 7, "Dau");

        cu.capNhatTu(moi);

        OTo ketQua = (OTo) cu;
        assertEquals("30F-222.22", ketQua.getBienSo());
        assertEquals("Toyota", ketQua.getHangXe());
        assertEquals(800000.0, ketQua.getGiaThueNgay(), 0.001);
        assertEquals(7, ketQua.getSoCho());
        assertEquals("Dau", ketQua.getLoaiNhienLieu());
    }

    @Test
    void capNhatTu_doiLoaiXe_baoLoi() {
        PhuongTien oTo = new OTo("30F-111.11", "Kia", 500000, 5, "Xang");
        PhuongTien xeMay = new XeMay("29B1-123.45", "Honda", 150000, 125, "Tay ga");

        assertThrows(IllegalArgumentException.class,
                () -> oTo.capNhatTu(xeMay));
    }

    @Test
    void tinhGiaThue_goiQuaKieuPhuongTien_moiLoaiTinhRieng() {
        PhuongTien oTo = new OTo("30F-999.88", "Kia", 700000, 5, "Xang");
        PhuongTien xeMay = new XeMay("29B1-123.45", "Honda", 150000, 125, "Tay ga");

        // Ô tô 3 ngày: 700.000 x 3 x 1,10
        assertEquals(2310000.0, oTo.tinhGiaThue(3), 0.001);
        // Xe máy 7 ngày: 150.000 x 7, giảm 10%
        assertEquals(945000.0, xeMay.tinhGiaThue(7), 0.001);
    }
}
