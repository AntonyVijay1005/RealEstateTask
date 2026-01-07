package com.rently.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rently.config.JwtService;
import com.rently.dto.ChangePasswordRequest;
import com.rently.dto.UserDto;
import com.rently.dto.UserUpdateRequest;
import com.rently.enums.Role;
import com.rently.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.security.Principal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = UserController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    // Required to satisfy SecurityConfig dependency injection even with filters
    // disabled for the test classes loading
    @MockBean
    private JwtService jwtService;
    @MockBean
    private UserDetailsService userDetailsService;
    @MockBean
    private AuthenticationProvider authenticationProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private UserDto userDto;
    private Principal mockPrincipal;

    @BeforeEach
    void setUp() {
        userDto = UserDto.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .phoneNumber("1234567890")
                .role(Role.BUYER)
                .build();

        mockPrincipal = new UsernamePasswordAuthenticationToken("john@example.com", null);
    }

    @Test
    void getCurrentUser_Success() throws Exception {
        when(userService.getCurrentUserProfile("john@example.com")).thenReturn(userDto);

        mockMvc.perform(get("/api/v1/users/me")
                .principal(mockPrincipal)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("john@example.com"))
                .andExpect(jsonPath("$.firstName").value("John"));
    }

    @Test
    void updateProfile_Success() throws Exception {
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setFirstName("Jane");
        updateRequest.setLastName("Doe");

        UserDto updatedUserDto = UserDto.builder()
                .id(1L)
                .firstName("Jane")
                .lastName("Doe") // Updated
                .email("john@example.com")
                .build();

        when(userService.updateProfile(eq("john@example.com"), any(UserUpdateRequest.class)))
                .thenReturn(updatedUserDto);

        mockMvc.perform(put("/api/v1/users/me")
                .principal(mockPrincipal)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Jane"));
    }

    @Test
    void changePassword_Success() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("oldPass");
        request.setNewPassword("newPass");

        mockMvc.perform(post("/api/v1/users/change-password")
                .principal(mockPrincipal)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNoContent());

        verify(userService).changePassword(eq("john@example.com"), any(ChangePasswordRequest.class));
    }
}
