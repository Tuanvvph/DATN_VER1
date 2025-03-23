package com.web.utils;


import com.web.entity.TaiKhoan;
import com.web.repository.UserRepository;
import org.hibernate.usertype.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.sql.Date;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String password = "admin";
        String email = "admin@gmail.com";
        if (!userRepository.findByEmail(email).isPresent()) {
            TaiKhoan user = new TaiKhoan();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setTrangThai(true);
            user.setHoTen("ADMIN");
            userRepository.save(user);
        }
    }
}
