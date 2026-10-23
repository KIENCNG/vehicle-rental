package com.vehiclerental.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class PhuongTienTest {

    @Test
    void oToTinhGiaCoPhiBaoHiem() {
        PhuongTien oTo = new OTo("30F-123.45", "Toyota Vios", 1_000_000, 5, "Xăng");
        assertEquals(3_300_000.0, oTo.tinhGiaThue(3), 0.001);
    }

    @Test
    void xeMayKhongGiamDuoi7Ngay() {
        PhuongTien xe = new XeMay("29B1-123.45", "Honda Vision", 150_000, 110, "Tay ga");
        assertEquals(900_000.0, xe.tinhGiaThue(6), 0.001);
    }

    @Test
    void xeMayGiam10PhanTramTu7Ngay() {
        PhuongTien xe = new XeMay("29B1-123.45", "Honda Vision", 150_000, 110, "Tay ga");
        assertEquals(945_000.0, xe.tinhGiaThue(7), 0.001);
    }

    @Test
    void daHinhCungMotLoiGoiRaKetQuaKhacNhau() {
        PhuongTien[] dsXe = {
                new OTo("30F-123.45", "Toyota Vios", 1_000_000, 5, "Xăng"),
                new XeMay("29B1-123.45", "Honda SH", 1_000_000, 150, "Tay ga")
        };
        assertEquals(7_700_000.0, dsXe[0].tinhGiaThue(7), 0.001);
        assertEquals(6_300_000.0, dsXe[1].tinhGiaThue(7), 0.001);
    }

    @Test
    void soNgayKhongHopLeBiTuChoi() {
        PhuongTien oTo = new OTo("30F-123.45", "Toyota Vios", 1_000_000, 5, "Xăng");
        PhuongTien xe = new XeMay("29B1-123.45", "Honda Vision", 150_000, 110, "Tay ga");
        assertThrows(IllegalArgumentException.class, () -> oTo.tinhGiaThue(-1));
        assertThrows(IllegalArgumentException.class, () -> xe.tinhGiaThue(0));
    }

    @Test
    void duLieuKhongHopLeBiTuChoi() {
        assertThrows(IllegalArgumentException.class,
                () -> new XeMay("ABC", "Honda", 150_000, 110, "Tay ga"));
        assertThrows(IllegalArgumentException.class,
                () -> new XeMay("29B1-123.45", " ", 150_000, 110, "Tay ga"));
        assertThrows(IllegalArgumentException.class,
                () -> new XeMay("29B1-123.45", "Honda", 0, 110, "Tay ga"));
        assertThrows(IllegalArgumentException.class,
                () -> new XeMay("29B1-123.45", "Honda", 150_000, 0, "Tay ga"));
        assertThrows(IllegalArgumentException.class,
                () -> new OTo("30F-123.45", "Toyota", 1_000_000, 1, "Xăng"));

        IllegalArgumentException loi = assertThrows(IllegalArgumentException.class,
                () -> new OTo("30F-123.45", "Toyota", -5, 5, "Xăng"));
        assertEquals("Giá thuê ngày phải lớn hơn 0", loi.getMessage());
    }

    @Test
    void bienSoDuocChuanHoaThanhChuHoa() {
        PhuongTien xe = new XeMay("  29b1-123.45 ", "Honda", 150_000, 110, "Tay ga");
        assertEquals("29B1-123.45", xe.getBienSo());
    }
}