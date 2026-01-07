package com.rently.service;

import com.rently.dto.EnquiryRequest;
import com.rently.dto.EnquiryResponse;
import com.rently.entity.Enquiry;
import com.rently.entity.Property;
import com.rently.entity.User;
import com.rently.enums.EnquiryStatus;
import com.rently.enums.Role;
import com.rently.repository.EnquiryRepository;
import com.rently.repository.PropertyRepository;
import com.rently.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnquiryServiceTest {

    @Mock
    private EnquiryRepository enquiryRepository;
    @Mock
    private PropertyRepository propertyRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private EnquiryService enquiryService;

    private User user;
    private User owner;
    private Property property;
    private Enquiry enquiry;
    private EnquiryRequest enquiryRequest;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .email("user@example.com")
                .role(Role.BUYER)
                .build();

        owner = User.builder()
                .id(2L)
                .email("owner@example.com")
                .role(Role.OWNER)
                .build();

        property = Property.builder()
                .id(1L)
                .title("Test Property")
                .owner(owner)
                .build();

        enquiry = Enquiry.builder()
                .id(1L)
                .property(property)
                .user(user)
                .message("Hello")
                .status(EnquiryStatus.PENDING)
                .build();

        enquiryRequest = new EnquiryRequest();
        enquiryRequest.setPropertyId(1L);
        enquiryRequest.setMessage("Hello");

        // Mock Security Context
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void createEnquiry_Success() {
        when(authentication.getName()).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(property));
        when(enquiryRepository.save(any(Enquiry.class))).thenReturn(enquiry);

        EnquiryResponse response = enquiryService.createEnquiry(enquiryRequest);

        assertNotNull(response);
        assertEquals("Hello", response.getMessage());
        verify(enquiryRepository).save(any(Enquiry.class));
    }

    @Test
    void getEnquiriesForOwner_Success() {
        when(authentication.getName()).thenReturn("owner@example.com");
        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(owner));
        when(enquiryRepository.findByPropertyOwnerId(owner.getId())).thenReturn(Collections.singletonList(enquiry));

        List<EnquiryResponse> responses = enquiryService.getEnquiriesForOwner();

        assertNotNull(responses);
        assertEquals(1, responses.size());
    }

    @Test
    void updateStatus_Owner_Success() {
        when(enquiryRepository.findById(1L)).thenReturn(Optional.of(enquiry));
        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(owner));
        when(enquiryRepository.save(any(Enquiry.class))).thenReturn(enquiry);

        EnquiryResponse response = enquiryService.updateStatus(1L, EnquiryStatus.CONTACTED, "owner@example.com");

        assertNotNull(response);
        verify(enquiryRepository).save(enquiry);
    }

    @Test
    void updateStatus_Unauthorized_ThrowsException() {
        when(enquiryRepository.findById(1L)).thenReturn(Optional.of(enquiry));
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user)); // Not owner

        Exception exception = assertThrows(RuntimeException.class, () -> {
            enquiryService.updateStatus(1L, EnquiryStatus.CONTACTED, "user@example.com");
        });

        assertEquals("Not authorized to update this enquiry status", exception.getMessage());
    }
}
