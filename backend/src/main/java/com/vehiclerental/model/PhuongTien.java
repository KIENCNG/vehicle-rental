package com.vehiclerental.model;

import com.vehiclerental.utils.ValidationUtils;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;

@Entity
@Table(name = "phuong_tien")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class PhuongTien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String bienSo;

    @Column(nullable = false)
    private String hangXe;

    @Column(nullable = false)
    private double giaThueNgay;

    protected PhuongTien() {
    }

    public PhuongTien(String bienSo, String hangXe, double giaThueNgay) {
        setBienSo(bienSo);
        setHangXe(hangXe);
        setGiaThueNgay(giaThueNgay);
    }

    // Mỗi loại xe tự quyết định cách tính tiền (đa hình)
    public abstract double tinhGiaThue(int soNgay);

    // Mỗi loại xe tự khai báo mình là loại nào (trả về JSON dưới dạng "loaiXe")
    public abstract String getLoaiXe();

    protected void kiemTraSoNgay(int soNgay) {
        if (soNgay <= 0) {
            throw new IllegalArgumentException("Số ngày thuê phải lớn hơn 0");
        }
    }

    public Long getId() {
        return id;
    }

    public String getBienSo() {
        return bienSo;
    }

    public void setBienSo(String bienSo) {
        this.bienSo = ValidationUtils.bienSoHopLe(bienSo);
    }

    public String getHangXe() {
        return hangXe;
    }

    public void setHangXe(String hangXe) {
        this.hangXe = ValidationUtils.chuoiKhongRong(hangXe, "Hãng xe", 50);
    }

    public double getGiaThueNgay() {
        return giaThueNgay;
    }

    public void setGiaThueNgay(double giaThueNgay) {
        this.giaThueNgay = ValidationUtils.soDuong(giaThueNgay, "Giá thuê ngày");
    }
}