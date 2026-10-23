
package com.vehiclerental.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "o_to")
@PrimaryKeyJoinColumn(name = "id")
public class OTo extends PhuongTien {

    @Column(nullable = false)
    private int soCho;

    @Column(nullable = false)
    private String loaiNhienLieu;

    public OTo() {
    }

    public OTo(String bienSo, String hangXe, double giaThueNgay,
               int soCho, String loaiNhienLieu) {
        super(bienSo, hangXe, giaThueNgay);
        this.soCho = soCho;
        this.loaiNhienLieu = loaiNhienLieu;
    }

    @Override
    public double tinhGiaThue(int soNgay) {
        if (soNgay <= 0) {
            throw new IllegalArgumentException("So ngay thue phai lon hon 0");
        }

        double tienThue = getGiaThueNgay() * soNgay;
        return tienThue * 1.10;
    }

    public int getSoCho() {
        return soCho;
    }

    public void setSoCho(int soCho) {
        this.soCho = soCho;
    }

    public String getLoaiNhienLieu() {
        return loaiNhienLieu;
    }

    public void setLoaiNhienLieu(String loaiNhienLieu) {
        this.loaiNhienLieu = loaiNhienLieu;
    }
}
