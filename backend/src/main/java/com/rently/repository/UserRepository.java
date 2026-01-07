package com.rently.repository;

import com.rently.entity.User;
import com.rently.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    long countByRole(Role role);

    boolean existsByEmail(String email);
}
