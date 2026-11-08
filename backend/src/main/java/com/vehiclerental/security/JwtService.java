package com.vehiclerental.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expiration;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration:86400000}") long expiration) {

        this.secretKey = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(secret)
        );

        this.expiration = expiration;
    }

    public String taoToken(
            Long id,
            String tenDangNhap,
            String vaiTro,
            Long khachHangId) {

        Date hienTai = new Date();
        Date hetHan = new Date(
                hienTai.getTime() + expiration
        );

        return Jwts.builder()
                .subject(String.valueOf(id))
                .claim("tenDangNhap", tenDangNhap)
                .claim("vaiTro", vaiTro)
                .claim("khachHangId", khachHangId)
                .issuedAt(hienTai)
                .expiration(hetHan)
                .signWith(secretKey)
                .compact();
    }

    public Claims xacThucToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}