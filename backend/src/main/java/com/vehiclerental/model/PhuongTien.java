
package com.vehiclerental.model;

import jakarta.persistence.*;

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

    public PhuongTien() {
    }

    public PhuongTien(String bienSo, String hangXe, double giaThueNgay) {
        this.bienSo = bienSo;
        this.hangXe = hangXe;
        this.giaThueNgay = giaThueNgay;
    }

    public abstract double tinhGiaThue(int soNgay);

    public Long getId() {
        return id;
    }

    public String getBienSo() {
        return bienSo;
    }

    public void setBienSo(String bienSo) {
        this.bienSo = bienSo;
    }

    public String getHangXe() {
        return hangXe;
    }

    public void setHangXe(String hangXe) {
        this.hangXe = hangXe;
    }

    public double getGiaThueNgay() {
        return giaThueNgay;
    }

    public void setGiaThueNgay(double giaThueNgay) {
        this.giaThueNgay = giaThueNgay;
    }
}
