package com.rently.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rently.config.JwtService;
import com.rently.dto.EnquiryRequest;
import com.rently.dto.EnquiryResponse;
import com.rently.enums.EnquiryStatus;
import com.rently.service.EnquiryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = EnquiryController.class)
@AutoConfigureMockMvc
class EnquiryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EnquiryService enquiryService;
    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private EnquiryRequest enquiryRequest;
    private EnquiryResponse enquiryResponse;

    @BeforeEach
    void setUp() {
        enquiryRequest = new EnquiryRequest();
        enquiryRequest.setPropertyId(1L);
        enquiryRequest.setMessage("Interested");

        enquiryResponse = EnquiryResponse.builder()
                .id(1L)
                .message("Interested")
                .status(EnquiryStatus.PENDING)
                .build();
    }

    @Test
    @WithMockUser
    void createEnquiry_Success() throws Exception {
        when(enquiryService.createEnquiry(any(EnquiryRequest.class))).thenReturn(enquiryResponse);

        mockMvc.perform(post("/api/v1/enquiries")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(enquiryRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Interested"));
    }

    @Test
    @WithMockUser
    void getEnquiriesForOwner_Success() throws Exception {
        when(enquiryService.getEnquiriesForOwner()).thenReturn(Collections.singletonList(enquiryResponse));

        mockMvc.perform(get("/api/v1/enquiries/owner")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].message").value("Interested"));
    }

    @Test
    @WithMockUser
    void updateStatus_Success() throws Exception {
        when(enquiryService.updateStatus(eq(1L), eq(EnquiryStatus.CONTACTED), any()))
                .thenReturn(enquiryResponse);

        mockMvc.perform(patch("/api/v1/enquiries/1/status")
                .with(csrf())
                .param("status", "CONTACTED")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
