
package com.vehiclerental.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "xe_may")
@PrimaryKeyJoinColumn(name = "id")
public class XeMay extends PhuongTien {

    @Column(nullable = false)
    private int dungTichXiLanh;

    @Column(nullable = false)
    private String kieuXe;

    public XeMay() {
    }

    public XeMay(String bienSo, String hangXe, double giaThueNgay,
                 int dungTichXiLanh, String kieuXe) {
        super(bienSo, hangXe, giaThueNgay);
        this.dungTichXiLanh = dungTichXiLanh;
        this.kieuXe = kieuXe;
    }

    @Override
    public double tinhGiaThue(int soNgay) {
        if (soNgay <= 0) {
            throw new IllegalArgumentException("So ngay thue phai lon hon 0");
        }

        double tienThue = getGiaThueNgay() * soNgay;

        if (soNgay >= 7) {
            tienThue *= 0.90;
        }

        return tienThue;
    }

    public int getDungTichXiLanh() {
        return dungTichXiLanh;
    }

    public void setDungTichXiLanh(int dungTichXiLanh) {
        this.dungTichXiLanh = dungTichXiLanh;
    }

    public String getKieuXe() {
        return kieuXe;
    }

    public void setKieuXe(String kieuXe) {
        this.kieuXe = kieuXe;
    }
}

