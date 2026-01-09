package com.rently.config;

import com.rently.entity.Property;
import com.rently.entity.User;
import com.rently.enums.PropertyType;
import com.rently.enums.Role;
import com.rently.repository.PropertyRepository;
import com.rently.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DbSeeder implements CommandLineRunner {

        private final UserRepository userRepository;
        private final PropertyRepository propertyRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) {
                // --- Ensure Admin User and Password ---
                userRepository.findByEmail("admin@rently.com").ifPresentOrElse(
                                admin -> {
                                        admin.setPassword(passwordEncoder.encode("admin123"));
                                        userRepository.save(admin);
                                        System.out.println("✅ ADMIN PASSWORD ENFORCED: admin123");
                                },
                                () -> {
                                        User admin = User.builder()
                                                        .firstName("Admin")
                                                        .lastName("User")
                                                        .email("admin@rently.com")
                                                        .password(passwordEncoder.encode("admin123"))
                                                        .role(Role.ADMIN)
                                                        .phoneNumber("1234567890")
                                                        .build();
                                        userRepository.save(admin);
                                        System.out.println("✅ ADMIN CREATED: admin@rently.com / admin123");
                                });

                if (userRepository.count() > 1) {
                        return; // Already has other users, skip property seeding
                }

                // --- Create Other Users ---

                User owner1 = User.builder()
                                .firstName("John")
                                .lastName("Owner")
                                .email("owner1@rently.com")
                                .password(passwordEncoder.encode("Owner@123"))
                                .role(Role.OWNER)
                                .phoneNumber("9876543210")
                                .build();

                User owner2 = User.builder()
                                .firstName("Jane")
                                .lastName("Smith")
                                .email("owner2@rently.com")
                                .password(passwordEncoder.encode("Owner@123"))
                                .role(Role.OWNER)
                                .phoneNumber("5554443333")
                                .build();

                User buyer = User.builder()
                                .firstName("Bob")
                                .lastName("Buyer")
                                .email("buyer1@rently.com")
                                .password(passwordEncoder.encode("Buyer@123"))
                                .role(Role.BUYER)
                                .phoneNumber("1112223333")
                                .build();

                userRepository.saveAll(List.of(owner1, owner2, buyer));

                // --- Create Properties ---

                Property p1 = Property.builder()
                                .title("Modern Villa in Miami")
                                .description("Stunning 4-bedroom villa with ocean view and private pool.")
                                .location("Miami, FL")
                                .price(new BigDecimal("1200000"))
                                .squareFeet(3500.0)
                                .bedrooms(4)
                                .bathrooms(3)
                                .yearBuilt(2022)
                                .type(PropertyType.VILLA)
                                .images(List.of("https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"))
                                .owner(owner1)
                                .build();

                Property p2 = Property.builder()
                                .title("Urban Apartment in New York")
                                .description("Sleek 2-bedroom apartment in the heart of Manhattan.")
                                .location("New York, NY")
                                .price(new BigDecimal("850000"))
                                .squareFeet(1200.0)
                                .bedrooms(2)
                                .bathrooms(2)
                                .yearBuilt(2019)
                                .type(PropertyType.APARTMENT)
                                .images(List.of("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"))
                                .owner(owner1)
                                .build();

                Property p3 = Property.builder()
                                .title("Cozy House in Austin")
                                .description("Charming family home in a quiet neighborhood.")
                                .location("Austin, TX")
                                .price(new BigDecimal("450000"))
                                .squareFeet(2000.0)
                                .bedrooms(3)
                                .bathrooms(2)
                                .yearBuilt(2015)
                                .type(PropertyType.HOUSE)
                                .images(List.of("https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop"))
                                .owner(owner2)
                                .build();

                Property p4 = Property.builder()
                                .title("Luxury Penthouse in LA")
                                .description("Exclusive penthouse with panoramic city views.")
                                .location("Los Angeles, CA")
                                .price(new BigDecimal("2500000"))
                                .squareFeet(4000.0)
                                .bedrooms(3)
                                .bathrooms(4)
                                .yearBuilt(2023)
                                .type(PropertyType.APARTMENT)
                                .images(List.of("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"))
                                .owner(owner2)
                                .build();

                Property p5 = Property.builder()
                                .title("Spacious Land in Seattle")
                                .description("Prime land for development in a growing area.")
                                .location("Seattle, WA")
                                .price(new BigDecimal("350000"))
                                .squareFeet(5000.0)
                                .bedrooms(0)
                                .bathrooms(0)
                                .yearBuilt(2024)
                                .type(PropertyType.LAND)
                                .images(List.of("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop"))
                                .owner(owner1)
                                .build();

                propertyRepository.saveAll(List.of(p1, p2, p3, p4, p5));

                System.out.println("✅ Database seeded successfully with " + userRepository.count() + " users and "
                                + propertyRepository.count() + " properties!");
        }
}
