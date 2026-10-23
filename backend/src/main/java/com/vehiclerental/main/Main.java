package com.vehiclerental.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.vehiclerental")
@EntityScan(basePackages = "com.vehiclerental.model")
@EnableJpaRepositories(basePackages = "com.vehiclerental.repository")
public class Main {

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}