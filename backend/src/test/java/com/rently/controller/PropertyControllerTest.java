package com.rently.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rently.config.JwtService;
import com.rently.dto.PropertyDto;
import com.rently.dto.PropertyRequest;
import com.rently.enums.PropertyType;
import com.rently.service.PropertyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = PropertyController.class)
@AutoConfigureMockMvc // Default behavior includes security filters
class PropertyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PropertyService propertyService;

    // JwtService might be needed if filters try to decode token, but WithMockUser
    // bypasses JwtFilter usually
    // unless filter is explicitly added. WebMvcTest scans SecurityConfig.
    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private PropertyDto propertyDto;
    private PropertyRequest propertyRequest;

    @BeforeEach
    void setUp() {
        propertyDto = PropertyDto.builder()
                .id(1L)
                .title("Test Property")
                .location("NY")
                .price(BigDecimal.valueOf(2000))
                .build();

        propertyRequest = new PropertyRequest();
        propertyRequest.setTitle("Test Property");
        propertyRequest.setDescription("A very nice property");
        propertyRequest.setLocation("NY");
        propertyRequest.setPrice(BigDecimal.valueOf(2000));
        propertyRequest.setSquareFeet(100.0);
        propertyRequest.setBedrooms(2);
        propertyRequest.setBathrooms(1);
        propertyRequest.setType(PropertyType.APARTMENT);
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "OWNER")
    void createProperty_Success() throws Exception {
        when(propertyService.createProperty(any(PropertyRequest.class), anyString()))
                .thenReturn(propertyDto);

        mockMvc.perform(post("/api/v1/properties")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(propertyRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Property"));
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "OWNER")
    void getAllProperties_Success() throws Exception {
        when(propertyService.getAllProperties())
                .thenReturn(Collections.singletonList(propertyDto));

        mockMvc.perform(get("/api/v1/properties")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Property"));
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "OWNER")
    void searchProperties_Success() throws Exception {
        when(propertyService.searchProperties(any(), any(), any(), any()))
                .thenReturn(Collections.singletonList(propertyDto));

        mockMvc.perform(get("/api/v1/properties/search")
                .param("location", "NY")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].location").value("NY"));
    }

    @Test
    @WithMockUser(username = "owner@example.com", roles = "OWNER")
    void deleteProperty_Success() throws Exception {
        mockMvc.perform(delete("/api/v1/properties/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(propertyService).deleteProperty(eq(1L), eq("owner@example.com"));
    }
}
