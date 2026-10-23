
package com.vehiclerental.model;

import com.vehiclerental.utils.ValidationUtils;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "khach_hang")
public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String hoTen;

    @Column(nullable = false, unique = true)
    private String soDienThoai;

    @Column(nullable = false)
    private String diaChi;

    protected KhachHang() {
    }

    public KhachHang(String hoTen, String soDienThoai, String diaChi) {
        setHoTen(hoTen);
        setSoDienThoai(soDienThoai);
        setDiaChi(diaChi);
    }

    public Long getId() {
        return id;
    }

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = ValidationUtils.chuoiKhongRong(
                hoTen, "Họ tên", 100);
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = ValidationUtils.chuoiKhongRong(
                soDienThoai, "Số điện thoại", 15);
    }

    public String getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = ValidationUtils.chuoiKhongRong(
                diaChi, "Địa chỉ", 255);
    }
}
