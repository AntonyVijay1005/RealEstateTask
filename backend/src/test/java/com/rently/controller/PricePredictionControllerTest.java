package com.rently.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rently.config.JwtService;
import com.rently.dto.PredictionRequest;
import com.rently.dto.PredictionResponse;
import com.rently.enums.PropertyType;
import com.rently.service.PricePredictionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = PricePredictionController.class)
@AutoConfigureMockMvc
class PricePredictionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PricePredictionService predictionService;
    @MockBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void predictPrice_Success() throws Exception {
        PredictionRequest request = PredictionRequest.builder()
                .location("NY")
                .type(PropertyType.APARTMENT)
                .build();

        PredictionResponse response = PredictionResponse.builder()
                .estimatedPrice(BigDecimal.valueOf(500000))
                .build();

        when(predictionService.predictPrice(any(PredictionRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/predict")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estimatedPrice").value(500000));
    }

    @Test
    @WithMockUser
    void predictForProperty_Success() throws Exception {
        PredictionResponse response = PredictionResponse.builder()
                .estimatedPrice(BigDecimal.valueOf(100000))
                .build();

        when(predictionService.predictForProperty(eq(1L), eq(5))).thenReturn(response);

        mockMvc.perform(get("/api/v1/predict/1")
                .param("years", "5")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estimatedPrice").value(100000));
    }
}
