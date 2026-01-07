package com.rently.service;

import com.rently.dto.PredictionRequest;
import com.rently.dto.PredictionResponse;
import com.rently.dto.TrendDataPoint;
import com.rently.entity.Property;
import com.rently.enums.PropertyType;
import com.rently.repository.PropertyRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PricePredictionServiceTest {

    @Mock
    private PropertyRepository propertyRepository;

    @InjectMocks
    private PricePredictionService predictionService;

    @Test
    void predictPrice_Success() {
        PredictionRequest request = PredictionRequest.builder()
                .location("new york")
                .squareFeet(1000.0)
                .bedrooms(2)
                .bathrooms(2)
                .yearBuilt(2021)
                .type(PropertyType.APARTMENT)
                .build();

        // Base price for NY = 500
        // Base val = 500 * 1000 * 1.0 = 500,000
        // Bed adj: 500,000 + (500,000 * 0.08 * 1) = 540,000
        // Bath adj: 540,000 + (540,000 * 0.04 * 1) = 561,600
        // Year adj (>2020): 561,600 * 1.1 = 617,760

        PredictionResponse response = predictionService.predictPrice(request);

        assertNotNull(response);
        assertEquals(0, BigDecimal.valueOf(617760.00).compareTo(response.getEstimatedPrice()));
        assertEquals("Strong Upward", response.getMarketTrend());
    }

    @Test
    void predictForProperty_Success() {
        Property property = Property.builder()
                .id(1L)
                .location("new york")
                .price(BigDecimal.valueOf(100000))
                .build();

        when(propertyRepository.findById(1L)).thenReturn(Optional.of(property));

        // Growth for NY = 0.065
        // 5 years: 100,000 * (1.065)^5
        // 1.065^5 = 1.37008
        // Expected ~ 137,008

        PredictionResponse response = predictionService.predictForProperty(1L, 5);

        assertNotNull(response);
        assertEquals(new BigDecimal("100000"), response.getEstimatedPrice());
        assertTrue(response.getProjectedPrice5Years().compareTo(new BigDecimal("137000")) > 0);
        assertNotNull(response.getHistoricalTrends());
        assertEquals(8, response.getHistoricalTrends().size());
    }
}
