package com.vehiclerental.service;

import com.vehiclerental.model.HopDongThue;
import com.vehiclerental.model.KhachHang;
import com.vehiclerental.model.ThanhToan;
import com.vehiclerental.model.TrangThaiHopDong;
import com.vehiclerental.model.TrangThaiThanhToan;
import com.vehiclerental.repository.HopDongThueRepository;
import com.vehiclerental.repository.ThanhToanRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ThanhToanServiceTest {

    @Mock
    private ThanhToanRepository thanhToanRepository;

    @Mock
    private HopDongThueRepository hopDongThueRepository;

    @InjectMocks
    private ThanhToanService thanhToanService;

    @Mock
    private HopDongThue hopDong;

    @Mock
    private KhachHang khachHang;

    @BeforeEach
    void setUp() {
        lenient().when(hopDong.getKhachHang())
                .thenReturn(khachHang);

        lenient().when(khachHang.getId())
                .thenReturn(1L);

        lenient().when(hopDong.getTrangThai())
                .thenReturn(TrangThaiHopDong.DANG_THUE);

        lenient().when(hopDong.getTongTien())
                .thenReturn(1_000_000.0);
    }

    // ==========================================
    // TEST TẠO THANH TOÁN
    // ==========================================

    @Test
    void taoThanhToan_thanhCong() {
        when(hopDongThueRepository.findById(10L))
                .thenReturn(Optional.of(hopDong));

        when(thanhToanRepository.findByHopDongThueId(10L))
                .thenReturn(Collections.emptyList());

        when(thanhToanRepository.save(any(ThanhToan.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ThanhToan ketQua = thanhToanService.taoThanhToan(
                10L,
                500_000.0,
                "Chuyển khoản",
                1L
        );

        assertNotNull(ketQua);
        assertEquals(1_000_000.0, ketQua.getSoTien());

        assertEquals(
                TrangThaiThanhToan.CHUA_THANH_TOAN,
                ketQua.getTrangThai()
        );

        verify(thanhToanRepository).save(any(ThanhToan.class));
    }

    @Test
    void taoThanhToan_hopDongKhongTonTai() {
        when(hopDongThueRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                IllegalArgumentException.class,
                () -> thanhToanService.taoThanhToan(
                        99L,
                        1_000_000.0,
                        "Chuyển khoản",
                        1L
                )
        );

        verify(thanhToanRepository, never()).save(any());
    }

    @Test
    void taoThanhToan_hopDongKhongTrongTrangThaiDangThue() {
        when(hopDongThueRepository.findById(10L))
                .thenReturn(Optional.of(hopDong));

        when(hopDong.getTrangThai())
                .thenReturn(TrangThaiHopDong.DA_HUY);

        assertThrows(
                IllegalArgumentException.class,
                () -> thanhToanService.taoThanhToan(
                        10L,
                        1_000_000.0,
                        "Chuyển khoản",
                        1L
                )
        );

        verify(thanhToanRepository, never()).save(any());
    }

    @Test
    void taoThanhToan_nganTaoGiaoDichTrung() {
        ThanhToan giaoDichCu = mock(ThanhToan.class);

        when(hopDongThueRepository.findById(10L))
                .thenReturn(Optional.of(hopDong));

        when(thanhToanRepository.findByHopDongThueId(10L))
                .thenReturn(List.of(giaoDichCu));

        when(giaoDichCu.getTrangThai())
                .thenReturn(TrangThaiThanhToan.CHUA_THANH_TOAN);

        assertThrows(
                IllegalArgumentException.class,
                () -> thanhToanService.taoThanhToan(
                        10L,
                        1_000_000.0,
                        "Chuyển khoản",
                        1L
                )
        );

        verify(thanhToanRepository, never()).save(any());
    }

    @Test
    void taoThanhToan_khachHangKhongSoHuuHopDong() {
        when(hopDongThueRepository.findById(10L))
                .thenReturn(Optional.of(hopDong));

        assertThrows(
                IllegalArgumentException.class,
                () -> thanhToanService.taoThanhToan(
                        10L,
                        1_000_000.0,
                        "Chuyển khoản",
                        2L
                )
        );

        verify(thanhToanRepository, never()).save(any());
    }

    // ==========================================
    // TEST ADMIN XÁC NHẬN THANH TOÁN
    // ==========================================

    @Test
    void xacNhanThanhToan_thanhCong() {
        ThanhToan thanhToan = mock(ThanhToan.class);

        when(thanhToanRepository.findById(5L))
                .thenReturn(Optional.of(thanhToan));

        when(thanhToan.getTrangThai())
                .thenReturn(TrangThaiThanhToan.CHO_XAC_NHAN);

        when(thanhToanRepository.save(thanhToan))
                .thenReturn(thanhToan);

        ThanhToan ketQua =
                thanhToanService.xacNhanThanhToan(5L);

        assertNotNull(ketQua);

        verify(thanhToan).setTrangThai(
                TrangThaiThanhToan.DA_THANH_TOAN
        );

        verify(thanhToanRepository).save(thanhToan);
    }

    @Test
    void xacNhanThanhToan_saiTrangThai() {
        ThanhToan thanhToan = mock(ThanhToan.class);

        when(thanhToanRepository.findById(5L))
                .thenReturn(Optional.of(thanhToan));

        when(thanhToan.getTrangThai())
                .thenReturn(TrangThaiThanhToan.CHUA_THANH_TOAN);

        assertThrows(
                IllegalArgumentException.class,
                () -> thanhToanService.xacNhanThanhToan(5L)
        );

        verify(thanhToanRepository, never()).save(any());
    }

    // ==========================================
    // TEST KHÁCH GỬI YÊU CẦU XÁC NHẬN
    // ==========================================

    @Test
    void guiYeuCauXacNhan_thanhCong() {
        ThanhToan thanhToan = mock(ThanhToan.class);

        when(thanhToanRepository.findById(5L))
                .thenReturn(Optional.of(thanhToan));
                when(thanhToan.getHopDongThue()).thenReturn(hopDong);

        when(thanhToan.getHopDongThue())
                .thenReturn(hopDong);

        when(thanhToan.getTrangThai())
                .thenReturn(TrangThaiThanhToan.CHUA_THANH_TOAN);

        when(thanhToanRepository.save(thanhToan))
                .thenReturn(thanhToan);

        ThanhToan ketQua =
                thanhToanService.guiYeuCauXacNhan(
                        5L,
                        "GD123456",
                        "Đã chuyển khoản",
                        1L
                );

        assertNotNull(ketQua);

        verify(thanhToan).setMaGiaoDich("GD123456");

        verify(thanhToan).setGhiChu("Đã chuyển khoản");

        verify(thanhToan).setTrangThai(
                TrangThaiThanhToan.CHO_XAC_NHAN
        );

        verify(thanhToanRepository).save(thanhToan);
    }

    @Test
    void guiYeuCauXacNhan_maGiaoDichTrong() {
        ThanhToan thanhToan = mock(ThanhToan.class);

        when(thanhToanRepository.findById(5L))
                .thenReturn(Optional.of(thanhToan));
                when(thanhToan.getHopDongThue()).thenReturn(hopDong);

        when(thanhToan.getHopDongThue())
                .thenReturn(hopDong);

        when(thanhToan.getTrangThai())
                .thenReturn(TrangThaiThanhToan.CHUA_THANH_TOAN);

        assertThrows(
                IllegalArgumentException.class,
                () -> thanhToanService.guiYeuCauXacNhan(
                        5L,
                        " ",
                        "Đã chuyển khoản",
                        1L
                )
        );

        verify(thanhToanRepository, never()).save(any());
    }

    @Test
    void guiYeuCauXacNhan_khachHangKhongSoHuuThanhToan() {
        ThanhToan thanhToan = mock(ThanhToan.class);

        HopDongThue hopDongCuaNguoiKhac =
                mock(HopDongThue.class);

        KhachHang khachHangKhac = mock(KhachHang.class);

        when(thanhToanRepository.findById(5L))
                .thenReturn(Optional.of(thanhToan));

        when(thanhToan.getHopDongThue())
                .thenReturn(hopDongCuaNguoiKhac);

        when(hopDongCuaNguoiKhac.getKhachHang())
                .thenReturn(khachHangKhac);

        when(khachHangKhac.getId())
                .thenReturn(2L);

        assertThrows(
                IllegalArgumentException.class,
                () -> thanhToanService.guiYeuCauXacNhan(
                        5L,
                        "GD123456",
                        "Đã chuyển khoản",
                        1L
                )
        );

        verify(thanhToanRepository, never()).save(any());
    }

    // ==========================================
    // TEST ADMIN HỦY YÊU CẦU
    // ==========================================

    @Test
    void huyYeuCauThanhToan_thanhCong() {
        ThanhToan thanhToan = mock(ThanhToan.class);

        when(thanhToanRepository.findById(5L))
                .thenReturn(Optional.of(thanhToan));

        when(thanhToan.getTrangThai())
                .thenReturn(TrangThaiThanhToan.CHO_XAC_NHAN);

        when(thanhToanRepository.save(thanhToan))
                .thenReturn(thanhToan);

        ThanhToan ketQua =
                thanhToanService.huyYeuCauThanhToan(5L);

        assertNotNull(ketQua);

        verify(thanhToan).setTrangThai(
                TrangThaiThanhToan.CHUA_THANH_TOAN
        );

        verify(thanhToanRepository).save(thanhToan);
    }
}