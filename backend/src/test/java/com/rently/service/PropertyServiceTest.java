package com.rently.service;

import com.rently.dto.PropertyDto;
import com.rently.dto.PropertyRequest;
import com.rently.dto.PropertyUpdateRequest;
import com.rently.entity.Property;
import com.rently.entity.User;
import com.rently.enums.PropertyType;
import com.rently.enums.Role;
import com.rently.repository.PropertyRepository;
import com.rently.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    private PropertyRepository propertyRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PropertyService propertyService;

    private User owner;
    private User admin;
    private User otherUser;
    private Property property;
    private PropertyRequest propertyRequest;

    @BeforeEach
    void setUp() {
        owner = User.builder()
                .id(1L)
                .firstName("Owner")
                .lastName("User")
                .email("owner@example.com")
                .role(Role.OWNER)
                .build();

        admin = User.builder()
                .id(2L)
                .firstName("Admin")
                .lastName("User")
                .email("admin@example.com")
                .role(Role.ADMIN)
                .build();

        otherUser = User.builder()
                .id(3L)
                .firstName("Other")
                .lastName("User")
                .email("other@example.com")
                .role(Role.BUYER)
                .build();

        property = Property.builder()
                .id(1L)
                .title("Cozy Apartment")
                .description("Nice place")
                .location("NY")
                .price(BigDecimal.valueOf(1000.0))
                .owner(owner)
                .build();

        propertyRequest = new PropertyRequest();
        propertyRequest.setTitle("Cozy Apartment");
        propertyRequest.setPrice(BigDecimal.valueOf(1000.0));
    }

    @Test
    void createProperty_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(owner));
        when(propertyRepository.save(any(Property.class))).thenReturn(property);

        PropertyDto result = propertyService.createProperty(propertyRequest, "owner@example.com");

        assertNotNull(result);
        assertEquals("Cozy Apartment", result.getTitle());
        verify(propertyRepository).save(any(Property.class));
    }

    @Test
    void deleteProperty_ByOwner_Success() {
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(property));
        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(owner));

        propertyService.deleteProperty(1L, "owner@example.com");

        verify(propertyRepository).delete(property);
    }

    @Test
    void deleteProperty_ByAdmin_Success() {
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(property));
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));

        propertyService.deleteProperty(1L, "admin@example.com");

        verify(propertyRepository).delete(property);
    }

    @Test
    void deleteProperty_ByUnauthorizedUser_ThrowsException() {
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(property));
        when(userRepository.findByEmail("other@example.com")).thenReturn(Optional.of(otherUser));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            propertyService.deleteProperty(1L, "other@example.com");
        });

        assertEquals("Not authorized to delete this property", exception.getMessage());
        verify(propertyRepository, never()).delete(any(Property.class));
    }

    @Test
    void searchProperties_Success() {
        when(propertyRepository.searchProperties(any(), any(), any(), any()))
                .thenReturn(Collections.singletonList(property));

        List<PropertyDto> result = propertyService.searchProperties("NY", null, null, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("NY", result.get(0).getLocation());
    }
}
