package com.rently.service;

import com.rently.dto.AdminStatsResponse;
import com.rently.dto.UserDto;
import com.rently.entity.User;
import com.rently.enums.Role;
import com.rently.repository.EnquiryRepository;
import com.rently.repository.PropertyRepository;
import com.rently.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PropertyRepository propertyRepository;
    @Mock
    private EnquiryRepository enquiryRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    void getStats_Success() {
        when(userRepository.count()).thenReturn(10L);
        when(propertyRepository.count()).thenReturn(5L);
        when(enquiryRepository.count()).thenReturn(20L);
        when(userRepository.countByRole(Role.OWNER)).thenReturn(3L);
        when(userRepository.countByRole(Role.BUYER)).thenReturn(7L);

        AdminStatsResponse response = adminService.getStats();

        assertNotNull(response);
        assertEquals(10L, response.getTotalUsers());
        assertEquals(5L, response.getTotalProperties());
    }

    @Test
    void getAllUsers_Success() {
        User user = User.builder()
                .id(1L)
                .email("test@example.com")
                .role(Role.BUYER)
                .build();

        when(userRepository.findAll()).thenReturn(Collections.singletonList(user));

        List<UserDto> response = adminService.getAllUsers();

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals("test@example.com", response.get(0).getEmail());
    }

    @Test
    void updateUserRole_Success() {
        User user = User.builder()
                .id(1L)
                .email("test@example.com")
                .role(Role.BUYER)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        adminService.updateUserRole(1L, Role.ADMIN);

        verify(userRepository).save(user);
        assertEquals(Role.ADMIN, user.getRole());
    }
}
