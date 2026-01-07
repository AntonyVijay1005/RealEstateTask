package com.rently.service;

import com.rently.dto.ChangePasswordRequest;
import com.rently.dto.UserDto;
import com.rently.dto.UserUpdateRequest;
import com.rently.entity.User;
import com.rently.enums.Role;
import com.rently.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .password("encodedPassword")
                .role(Role.BUYER)
                .phoneNumber("1234567890")
                .build();
    }

    @Test
    void getCurrentUserProfile_Success() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        UserDto result = userService.getCurrentUserProfile("john@example.com");

        assertNotNull(result);
        assertEquals("john@example.com", result.getEmail());
        assertEquals("John", result.getFirstName());
    }

    @Test
    void getCurrentUserProfile_UserNotFound_ThrowsException() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.getCurrentUserProfile("unknown@example.com");
        });

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void updateProfile_Success() {
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setFirstName("Jane");
        updateRequest.setLastName("Smith");
        updateRequest.setPhoneNumber("0987654321");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDto result = userService.updateProfile("john@example.com", updateRequest);

        assertNotNull(result);
        assertEquals("Jane", result.getFirstName());
        assertEquals("Smith", result.getLastName());
        assertEquals("0987654321", result.getPhoneNumber());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void changePassword_Success() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("password");
        request.setNewPassword("newPassword");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("newEncodedPassword");

        userService.changePassword("john@example.com", request);

        verify(userRepository).save(user);
        assertEquals("newEncodedPassword", user.getPassword());
    }

    @Test
    void changePassword_WrongCurrentPassword_ThrowsException() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("wrongPassword");
        request.setNewPassword("newPassword");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.changePassword("john@example.com", request);
        });

        assertEquals("Invalid current password", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }
}
