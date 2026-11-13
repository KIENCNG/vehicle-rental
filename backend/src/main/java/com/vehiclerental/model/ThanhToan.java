
package com.vehiclerental.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "thanh_toan")
public class ThanhToan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hop_dong_id", nullable = false)
    private HopDongThue hopDongThue;

    @Column(nullable = false)
    private double soTien;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TrangThaiThanhToan trangThai =
            TrangThaiThanhToan.CHUA_THANH_TOAN;

    @Column(length = 100)
    private String phuongThuc;

    @Column(length = 255)
    private String maGiaoDich;

    @Column(length = 500)
    private String ghiChu;

    private LocalDateTime ngayTao;

    private LocalDateTime ngayThanhToan;

    protected ThanhToan() {
    }

    public ThanhToan(
            HopDongThue hopDongThue,
            double soTien,
            String phuongThuc) {

        if (hopDongThue == null) {
            throw new IllegalArgumentException(
                    "Hợp đồng thuê không được để trống");
        }

        if (soTien <= 0) {
            throw new IllegalArgumentException(
                    "Số tiền phải lớn hơn 0");
        }

        if (phuongThuc == null || phuongThuc.isBlank()) {
            throw new IllegalArgumentException(
                    "Phương thức thanh toán không được để trống");
        }

        this.hopDongThue = hopDongThue;
        this.soTien = soTien;
        this.phuongThuc = phuongThuc;
        this.trangThai = TrangThaiThanhToan.CHUA_THANH_TOAN;
        this.ngayTao = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public HopDongThue getHopDongThue() {
        return hopDongThue;
    }

    public double getSoTien() {
        return soTien;
    }

    public TrangThaiThanhToan getTrangThai() {
        return trangThai;
    }

    public String getPhuongThuc() {
        return phuongThuc;
    }

    public String getMaGiaoDich() {
        return maGiaoDich;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public LocalDateTime getNgayTao() {
        return ngayTao;
    }

    public LocalDateTime getNgayThanhToan() {
        return ngayThanhToan;
    }

    public void setSoTien(double soTien) {
        if (soTien <= 0) {
            throw new IllegalArgumentException(
                    "Số tiền phải lớn hơn 0");
        }

        if (trangThai == TrangThaiThanhToan.DA_THANH_TOAN
                || trangThai == TrangThaiThanhToan.DA_HOAN_TIEN) {

            throw new IllegalStateException(
                    "Không thể thay đổi số tiền của giao dịch đã hoàn tất");
        }

        this.soTien = soTien;
    }

    public void setPhuongThuc(String phuongThuc) {
        if (phuongThuc == null || phuongThuc.isBlank()) {
            throw new IllegalArgumentException(
                    "Phương thức thanh toán không được để trống");
        }

        this.phuongThuc = phuongThuc;
    }

    public void setMaGiaoDich(String maGiaoDich) {
        this.maGiaoDich = maGiaoDich;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public void setTrangThai(TrangThaiThanhToan trangThaiMoi) {
        if (trangThaiMoi == null) {
            throw new IllegalArgumentException(
                    "Trạng thái không được null");
        }

        if (this.trangThai == trangThaiMoi) {
            throw new IllegalArgumentException(
                    "Giao dịch đã ở trạng thái này");
        }

        boolean hopLe = false;

        switch (this.trangThai) {

            case CHUA_THANH_TOAN:
                hopLe = trangThaiMoi
                        == TrangThaiThanhToan.CHO_XAC_NHAN;
                break;

            case CHO_XAC_NHAN:
                hopLe = trangThaiMoi
                        == TrangThaiThanhToan.DA_THANH_TOAN
                        || trangThaiMoi
                        == TrangThaiThanhToan.CHUA_THANH_TOAN;
                break;

            case DA_THANH_TOAN:
                hopLe = trangThaiMoi
                        == TrangThaiThanhToan.DA_HOAN_TIEN;
                break;

            case DA_HOAN_TIEN:
                hopLe = false;
                break;
        }

        if (!hopLe) {
            throw new IllegalStateException(
                    "Không thể chuyển trạng thái thanh toán từ "
                            + this.trangThai + " sang " + trangThaiMoi);
        }

        this.trangThai = trangThaiMoi;

        if (trangThaiMoi == TrangThaiThanhToan.DA_THANH_TOAN) {
            this.ngayThanhToan = LocalDateTime.now();
        }
    }
}
