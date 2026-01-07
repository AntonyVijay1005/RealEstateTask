package com.rently.service;

import com.rently.dto.AdminStatsResponse;
import com.rently.dto.UserDto;
import com.rently.enums.Role;
import com.rently.entity.User;
import com.rently.repository.EnquiryRepository;
import com.rently.repository.PropertyRepository;
import com.rently.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final EnquiryRepository enquiryRepository;

    public AdminStatsResponse getStats() {
        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalProperties(propertyRepository.count())
                .totalEnquiries(enquiryRepository.count())
                .ownerCount(userRepository.countByRole(Role.OWNER))
                .buyerCount(userRepository.countByRole(Role.BUYER))
                .build();
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(newRole);
        userRepository.save(user);
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .build();
    }
}
