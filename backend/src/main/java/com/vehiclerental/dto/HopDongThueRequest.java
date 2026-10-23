
package com.vehiclerental.dto;

import com.vehiclerental.model.TrangThaiHopDong;

import java.time.LocalDate;

public class HopDongThueRequest {

    private Long khachHangId;
    private Long phuongTienId;
    private LocalDate ngayThue;
    private LocalDate ngayTra;
    private TrangThaiHopDong trangThai;

    public Long getKhachHangId() {
        return khachHangId;
    }

    public void setKhachHangId(Long khachHangId) {
        this.khachHangId = khachHangId;
    }

    public Long getPhuongTienId() {
        return phuongTienId;
    }

    public void setPhuongTienId(Long phuongTienId) {
        this.phuongTienId = phuongTienId;
    }

    public LocalDate getNgayThue() {
        return ngayThue;
    }

    public void setNgayThue(LocalDate ngayThue) {
        this.ngayThue = ngayThue;
    }

    public LocalDate getNgayTra() {
        return ngayTra;
    }

    public void setNgayTra(LocalDate ngayTra) {
        this.ngayTra = ngayTra;
    }

    public TrangThaiHopDong getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThaiHopDong trangThai) {
        this.trangThai = trangThai;
    }
}
