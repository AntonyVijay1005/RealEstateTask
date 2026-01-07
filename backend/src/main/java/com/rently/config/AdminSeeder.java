package com.rently.config;

import com.rently.entity.User;
import com.rently.enums.Role;
import com.rently.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@rently.com")) {
            User admin = User.builder()
                    .firstName("System")
                    .lastName("Administrator")
                    .email("admin@rently.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .phoneNumber("0000000000")
                    .build();
            userRepository.save(admin);
            System.out.println("ADMIN ACCOUNT CREATED: admin@rently.com / admin123");
        }
    }
}
