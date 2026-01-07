package com.rently.service;

import com.rently.config.JwtService;
import com.rently.dto.AuthenticationRequest;
import com.rently.dto.AuthenticationResponse;
import com.rently.dto.RegisterRequest;
import com.rently.entity.User;
import com.rently.enums.Role;
import com.rently.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository repository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthenticationService service;

    private RegisterRequest registerRequest;
    private AuthenticationRequest authRequest;
    private User user;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .password("password")
                .role(Role.BUYER)
                .phoneNumber("1234567890")
                .build();

        authRequest = AuthenticationRequest.builder()
                .email("john@example.com")
                .password("password")
                .build();

        user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .password("encodedPassword")
                .role(Role.BUYER)
                .build();
    }

    @Test
    void register_Success() {
        when(repository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(repository.save(any(User.class))).thenReturn(user); // save returns the entity usually, mostly ignored but
                                                                 // good to mock
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

        AuthenticationResponse response = service.register(registerRequest);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        verify(repository).save(any(User.class));
    }

    @Test
    void register_AdminRole_ThrowsException() {
        registerRequest.setRole(Role.ADMIN);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            service.register(registerRequest);
        });

        assertEquals("Admin registration is not allowed via public API", exception.getMessage());
        verify(repository, never()).save(any(User.class));
    }

    @Test
    void register_EmailExists_ThrowsException() {
        when(repository.existsByEmail(anyString())).thenReturn(true);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            service.register(registerRequest);
        });

        assertEquals("Email already exists", exception.getMessage());
        verify(repository, never()).save(any(User.class));
    }

    @Test
    void authenticate_Success() {
        when(repository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

        AuthenticationResponse response = service.authenticate(authRequest);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}
