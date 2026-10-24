package com.vehiclerental.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "hop_dong_thue")
public class HopDongThue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "khach_hang_id", nullable = false)
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "phuong_tien_id", nullable = false)
    private PhuongTien phuongTien;

    @Column(nullable = false)
    private LocalDate ngayThue;

    @Column(nullable = false)
    private LocalDate ngayTra;

    @Column(nullable = false)
    private double tongTien;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TrangThaiHopDong trangThai = TrangThaiHopDong.DANG_THUE;

    protected HopDongThue() {
    }

    public HopDongThue(
            KhachHang khachHang,
            PhuongTien phuongTien,
            LocalDate ngayThue,
            LocalDate ngayTra) {

        setKhachHang(khachHang);
        setPhuongTien(phuongTien);
        setNgayThue(ngayThue);
        setNgayTra(ngayTra);
        this.tongTien = tinhTongTien();
    }

    public Long getId() {
        return id;
    }

    public KhachHang getKhachHang() {
        return khachHang;
    }

    public void setKhachHang(KhachHang khachHang) {
        if (khachHang == null) {
            throw new IllegalArgumentException(
                    "Khách hàng không được để trống");
        }
        this.khachHang = khachHang;
    }

    public PhuongTien getPhuongTien() {
        return phuongTien;
    }

    public void setPhuongTien(PhuongTien phuongTien) {
        if (phuongTien == null) {
            throw new IllegalArgumentException(
                    "Phương tiện không được để trống");
        }
        this.phuongTien = phuongTien;
    }

    public LocalDate getNgayThue() {
        return ngayThue;
    }

    public void setNgayThue(LocalDate ngayThue) {
        if (ngayThue == null) {
            throw new IllegalArgumentException(
                    "Ngày thuê không được để trống");
        }

        if (ngayTra != null && !ngayTra.isAfter(ngayThue)) {
            throw new IllegalArgumentException(
                    "Ngày trả phải sau ngày thuê");
        }

        this.ngayThue = ngayThue;
    }

    public LocalDate getNgayTra() {
        return ngayTra;
    }

    public void setNgayTra(LocalDate ngayTra) {
        if (ngayTra == null) {
            throw new IllegalArgumentException(
                    "Ngày trả không được để trống");
        }

        if (ngayThue != null && !ngayTra.isAfter(ngayThue)) {
            throw new IllegalArgumentException(
                    "Ngày trả phải sau ngày thuê");
        }

        this.ngayTra = ngayTra;
    }

    // Đổi cả hai ngày cùng lúc: kiểm tra theo cặp ngày MỚI,
    // không so với ngày cũ còn sót lại
    public void capNhatThoiGianThue(LocalDate ngayThueMoi, LocalDate ngayTraMoi) {
        if (ngayThueMoi == null || ngayTraMoi == null) {
            throw new IllegalArgumentException(
                    "Ngày thuê và ngày trả không được để trống");
        }

        if (!ngayTraMoi.isAfter(ngayThueMoi)) {
            throw new IllegalArgumentException(
                    "Ngày trả phải sau ngày thuê");
        }

        this.ngayThue = ngayThueMoi;
        this.ngayTra = ngayTraMoi;
    }

    public long tinhSoNgayThue() {
        if (ngayThue == null || ngayTra == null) {
            throw new IllegalStateException(
                    "Ngày thuê và ngày trả chưa được thiết lập");
        }

        return ChronoUnit.DAYS.between(ngayThue, ngayTra);
    }

    public double tinhTongTien() {
        if (phuongTien == null) {
            throw new IllegalStateException(
                    "Chưa chọn phương tiện thuê");
        }

        return phuongTien.tinhGiaThue(
                Math.toIntExact(tinhSoNgayThue()));
    }

    public double getTongTien() {
        return tongTien;
    }

    public void capNhatTongTien() {
        this.tongTien = tinhTongTien();
    }

    public TrangThaiHopDong getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThaiHopDong trangThai) {
        if (trangThai == null) {
            throw new IllegalArgumentException(
                    "Trạng thái hợp đồng không được để trống");
        }

        this.trangThai = trangThai;
    }
}
