package com.vehiclerental.utils;

import java.util.Locale;
import java.util.regex.Pattern;

public final class ValidationUtils {

    private static final Pattern BIEN_SO = Pattern.compile(
            "^[0-9]{2}[- ]?[A-Z][A-Z0-9]?[- ]?([0-9]{4,5}|[0-9]{3}\\.[0-9]{2})$");

    private ValidationUtils() {
    }

    public static String chuoiKhongRong(String giaTri, String tenTruong, int doDaiToiDa) {
        if (giaTri == null || giaTri.trim().isEmpty()) {
            throw new IllegalArgumentException(tenTruong + " không được để trống");
        }
        String daCat = giaTri.trim();
        if (daCat.length() > doDaiToiDa) {
            throw new IllegalArgumentException(
                    tenTruong + " không được dài quá " + doDaiToiDa + " ký tự");
        }
        return daCat;
    }

    public static double soDuong(double giaTri, String tenTruong) {
        if (Double.isNaN(giaTri) || Double.isInfinite(giaTri) || giaTri <= 0) {
            throw new IllegalArgumentException(tenTruong + " phải lớn hơn 0");
        }
        return giaTri;
    }

    public static int soTrongKhoang(int giaTri, int min, int max, String tenTruong) {
        if (giaTri < min || giaTri > max) {
            throw new IllegalArgumentException(
                    tenTruong + " phải nằm trong khoảng " + min + " đến " + max);
        }
        return giaTri;
    }

    public static String bienSoHopLe(String bienSo) {
        String chuan = chuoiKhongRong(bienSo, "Biển số", 15).toUpperCase(Locale.ROOT);
        if (!BIEN_SO.matcher(chuan).matches()) {
            throw new IllegalArgumentException(
                    "Biển số không hợp lệ (ví dụ: 30F-123.45 hoặc 29B1-12345)");
        }
        return chuan;
    }
}