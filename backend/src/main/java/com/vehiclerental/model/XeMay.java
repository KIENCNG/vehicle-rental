package com.vehiclerental.model;

import com.vehiclerental.utils.ValidationUtils;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "xe_may")
@PrimaryKeyJoinColumn(name = "id")
public class XeMay extends PhuongTien {

    private static final int SO_NGAY_DUOC_GIAM = 7;
    private static final double TI_LE_GIAM = 0.10;

    @Column(nullable = false)
    private int dungTichXiLanh;

    @Column(nullable = false)
    private String kieuXe;

    protected XeMay() {
    }

    public XeMay(String bienSo, String hangXe, double giaThueNgay,
                 int dungTichXiLanh, String kieuXe) {
        super(bienSo, hangXe, giaThueNgay);
        setDungTichXiLanh(dungTichXiLanh);
        setKieuXe(kieuXe);
    }

    // Xe máy: thuê từ 7 ngày trở lên được giảm 10%
    @Override
    public double tinhGiaThue(int soNgay) {
        kiemTraSoNgay(soNgay);
        double tien = getGiaThueNgay() * soNgay;
        if (soNgay >= SO_NGAY_DUOC_GIAM) {
            tien = tien * (1 - TI_LE_GIAM);
        }
        return Math.round(tien);
    }

    @Override
    public String getLoaiXe() {
        return "XEMAY";
    }

    public int getDungTichXiLanh() {
        return dungTichXiLanh;
    }

    public void setDungTichXiLanh(int dungTichXiLanh) {
        this.dungTichXiLanh = ValidationUtils.soTrongKhoang(dungTichXiLanh, 1, 2000, "Dung tích xi lanh");
    }

    public String getKieuXe() {
        return kieuXe;
    }

    public void setKieuXe(String kieuXe) {
        this.kieuXe = ValidationUtils.chuoiKhongRong(kieuXe, "Kiểu xe", 30);
    }
}