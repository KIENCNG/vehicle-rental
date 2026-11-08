
package com.vehiclerental.config;

import com.vehiclerental.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import
org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable())
            .authorizeHttpRequests(auth -> auth

                // API công khai
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/api/auth/dang-nhap").permitAll()
                .requestMatchers("/api/auth/dang-ky").permitAll()

                // Khách được xem phương tiện
                .requestMatchers(HttpMethod.GET, "/api/phuong-tien/**").permitAll()

                // Admin quản lý phương tiện
                .requestMatchers("/api/phuong-tien/**").hasRole("ADMIN")

                // Chỉ Admin quản lý khách hàng
                .requestMatchers("/api/khach-hang/**").hasRole("ADMIN")

                // Khách được gửi yêu cầu thuê
                .requestMatchers(HttpMethod.POST, "/api/hop-dong/yeu-cau")
                    .hasRole("CUSTOMER")

                // Khách xem lịch sử, Admin xem toàn bộ hợp đồng
                .requestMatchers(HttpMethod.GET, "/api/hop-dong/khach-hang/**")
                    .hasAnyRole("ADMIN", "CUSTOMER")

                // Các API hợp đồng còn lại chỉ Admin
                .requestMatchers("/api/hop-dong/**").hasRole("ADMIN")

                // Xem thông tin tài khoản cần đăng nhập
                .requestMatchers("/api/auth/thong-tin/**")
                    .hasAnyRole("ADMIN", "CUSTOMER")

                // Mọi API còn lại cần đăng nhập
                .anyRequest().authenticated()
            );

        http.addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
}

