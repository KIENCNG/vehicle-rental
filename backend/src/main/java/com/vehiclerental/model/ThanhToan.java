package com.vehiclerental.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "thanh_toan")
public class ThanhToan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "hop_dong_id", nullable = false, unique = true)
    private HopDongThue hopDongThue;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal tongTienHopDong;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal tienDatCoc;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal tienConLai;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TrangThaiThanhToan trangThai = TrangThaiThanhToan.CHO_THANH_TOAN;

    @Column(nullable = false, length = 30)
    private String phuongThuc = "CHUYEN_KHOAN";

    @Column(length = 100)
    private String maGiaoDich;

    @Column(nullable = false)
    private LocalDateTime ngayTao = LocalDateTime.now();

    private LocalDateTime ngayXacNhan;

    protected ThanhToan() {}

    public ThanhToan(HopDongThue hopDongThue, BigDecimal tongTienHopDong, BigDecimal tienDatCoc) {
        this.hopDongThue = hopDongThue;
        this.tongTienHopDong = tongTienHopDong;
        this.tienDatCoc = tienDatCoc;
        this.tienConLai = tongTienHopDong.subtract(tienDatCoc);
    }

    public Long getId() { return id; }
    public HopDongThue getHopDongThue() { return hopDongThue; }
    public BigDecimal getTongTienHopDong() { return tongTienHopDong; }
    public BigDecimal getTienDatCoc() { return tienDatCoc; }
    public BigDecimal getTienConLai() { return tienConLai; }
    public TrangThaiThanhToan getTrangThai() { return trangThai; }
    public String getPhuongThuc() { return phuongThuc; }
    public String getMaGiaoDich() { return maGiaoDich; }
    public LocalDateTime getNgayTao() { return ngayTao; }
    public LocalDateTime getNgayXacNhan() { return ngayXacNhan; }

    public void danhDauDaChuyenKhoan(String maGiaoDich) {
        if (trangThai != TrangThaiThanhToan.CHO_THANH_TOAN) {
            throw new IllegalStateException("Giao dịch không ở trạng thái chờ thanh toán");
        }
        this.maGiaoDich = maGiaoDich;
        this.trangThai = TrangThaiThanhToan.CHO_XAC_NHAN;
    }

    public void xacNhan() {
        if (trangThai != TrangThaiThanhToan.CHO_XAC_NHAN) {
            throw new IllegalStateException("Giao dịch chưa được khách hàng báo đã chuyển khoản");
        }
        this.trangThai = TrangThaiThanhToan.DA_THANH_TOAN;
        this.ngayXacNhan = LocalDateTime.now();
    }

    public void tuChoi() {
        if (trangThai != TrangThaiThanhToan.CHO_XAC_NHAN) {
            throw new IllegalStateException("Chỉ có thể từ chối giao dịch đang chờ xác nhận");
        }
        this.trangThai = TrangThaiThanhToan.TU_CHOI;
    }
}
