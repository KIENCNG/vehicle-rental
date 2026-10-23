package com.vehiclerental.model;

import com.vehiclerental.utils.ValidationUtils;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "o_to")
@PrimaryKeyJoinColumn(name = "id")
public class OTo extends PhuongTien {

    private static final double PHI_BAO_HIEM = 0.10;

    @Column(nullable = false)
    private int soCho;

    @Column(nullable = false)
    private String loaiNhienLieu;

    protected OTo() {
    }

    public OTo(String bienSo, String hangXe, double giaThueNgay,
               int soCho, String loaiNhienLieu) {
        super(bienSo, hangXe, giaThueNgay);
        setSoCho(soCho);
        setLoaiNhienLieu(loaiNhienLieu);
    }

    // Ô tô: tiền thuê cộng thêm 10% phí bảo hiểm
    @Override
    public double tinhGiaThue(int soNgay) {
        kiemTraSoNgay(soNgay);
        double tien = getGiaThueNgay() * soNgay * (1 + PHI_BAO_HIEM);
        return Math.round(tien);
    }

    @Override
    public String getLoaiXe() {
        return "OTO";
    }

    public int getSoCho() {
        return soCho;
    }

    public void setSoCho(int soCho) {
        this.soCho = ValidationUtils.soTrongKhoang(soCho, 2, 50, "Số chỗ");
    }

    public String getLoaiNhienLieu() {
        return loaiNhienLieu;
    }

    public void setLoaiNhienLieu(String loaiNhienLieu) {
        this.loaiNhienLieu = ValidationUtils.chuoiKhongRong(loaiNhienLieu, "Loại nhiên liệu", 30);
    }
}