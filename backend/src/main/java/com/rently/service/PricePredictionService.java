package com.rently.service;

import com.rently.dto.PredictionRequest;
import com.rently.dto.PredictionResponse;
import com.rently.enums.PropertyType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PricePredictionService {

    // Mock base prices per sq ft for demo locations
    private final com.rently.repository.PropertyRepository propertyRepository;

    public PricePredictionService(com.rently.repository.PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    // Mock base prices per sq ft for demo locations
    private static final java.util.Map<String, Double> LOCATION_BASE_PRICES = new java.util.HashMap<>();

    static {
        LOCATION_BASE_PRICES.put("new york", 500.0);
        LOCATION_BASE_PRICES.put("los angeles", 450.0);
        LOCATION_BASE_PRICES.put("california", 450.0);
        LOCATION_BASE_PRICES.put("miami", 400.0);
        LOCATION_BASE_PRICES.put("chicago", 300.0);
        LOCATION_BASE_PRICES.put("austin", 350.0);
        LOCATION_BASE_PRICES.put("seattle", 420.0);
        // Default for others: 200.0
    }

    // Mock historical growth rates per location (simulating "past rate of
    // increase")
    private static final java.util.Map<String, Double> LOCATION_GROWTH_RATES = new java.util.HashMap<>();

    static {
        LOCATION_GROWTH_RATES.put("new york", 0.065); // 6.5%
        LOCATION_GROWTH_RATES.put("los angeles", 0.07);
        LOCATION_GROWTH_RATES.put("california", 0.07);
        LOCATION_GROWTH_RATES.put("miami", 0.08);
        LOCATION_GROWTH_RATES.put("chicago", 0.04);
        LOCATION_GROWTH_RATES.put("austin", 0.09);
        LOCATION_GROWTH_RATES.put("seattle", 0.055);
        // Default: 0.04 (4%)
    }

    public PredictionResponse predictForProperty(Long propertyId, Integer years) {
        var property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        BigDecimal currentPrice = property.getPrice();
        if (currentPrice == null) {
            // Handle edge case where price is missing
            currentPrice = BigDecimal.ZERO;
        }

        // Determine growth rate based on location (Past Rate of Increase)
        String city = "unknown";
        if (property.getLocation() != null) {
            city = property.getLocation().split(",")[0].trim().toLowerCase();
        }
        double growthRate = LOCATION_GROWTH_RATES.getOrDefault(city, 0.04);

        // Calculate N year projection: Future Value = P * (1 + r)^n
        BigDecimal projectedPrice = currentPrice.multiply(
                BigDecimal.valueOf(Math.pow(1.0 + growthRate, years))).setScale(2, RoundingMode.HALF_UP);

        // Calculate total appreciation percentage
        double totalAppreciation = (Math.pow(1.0 + growthRate, years) - 1.0) * 100;

        // Generate Historical Trends (8 Quarters)
        java.util.List<com.rently.dto.TrendDataPoint> trends = new java.util.ArrayList<>();
        String[] quarters = { "Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025" };

        for (int i = 0; i < quarters.length; i++) {
            // Working backwards from current price
            double discountFactor = Math.pow(1 + growthRate / 4, quarters.length - 1 - i);
            BigDecimal histPrice = currentPrice.divide(BigDecimal.valueOf(discountFactor), 2, RoundingMode.HALF_UP);
            trends.add(com.rently.dto.TrendDataPoint.builder()
                    .quarter(quarters[i])
                    .price(histPrice)
                    .build());
        }

        return PredictionResponse.builder()
                .estimatedPrice(currentPrice)
                .projectedPrice5Years(projectedPrice)
                .annualAppreciationRate(growthRate * 100)
                .historicalTrends(trends)
                .priceRangeLow(currentPrice.multiply(BigDecimal.valueOf(0.95)))
                .priceRangeHigh(currentPrice.multiply(BigDecimal.valueOf(1.05)))
                .confidenceLevel(growthRate > 0.05 ? "High" : "Medium")
                .marketTrend(growthRate >= 0.05 ? "Up" : "Stable")
                .build();
    }

    public PredictionResponse predictPrice(PredictionRequest request) {
        // Custom request logic
        double baseRate = LOCATION_BASE_PRICES.getOrDefault(request.getLocation().toLowerCase(), 200.0);
        double typeMultiplier = getTypeMultiplier(request.getType());

        // Base value
        double estimatedVal = baseRate * request.getSquareFeet() * typeMultiplier;

        // Bedroom Adjustment: +8% per bedroom over 1
        if (request.getBedrooms() != null && request.getBedrooms() > 1) {
            estimatedVal += estimatedVal * (0.08 * (request.getBedrooms() - 1));
        }

        // Bathroom Adjustment: +4% per bathroom over 1
        if (request.getBathrooms() != null && request.getBathrooms() > 1) {
            estimatedVal += estimatedVal * (0.04 * (request.getBathrooms() - 1));
        }

        // Year Built Factor: New homes (built after 2020) get a 10% premium, older than
        // 2000 get 5% discount
        if (request.getYearBuilt() != null) {
            if (request.getYearBuilt() > 2020)
                estimatedVal *= 1.1;
            else if (request.getYearBuilt() < 2000)
                estimatedVal *= 0.95;
        }

        BigDecimal finalPrice = BigDecimal.valueOf(estimatedVal).setScale(2, RoundingMode.HALF_UP);
        BigDecimal low = finalPrice.multiply(BigDecimal.valueOf(0.92)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal high = finalPrice.multiply(BigDecimal.valueOf(1.08)).setScale(2, RoundingMode.HALF_UP);

        // Future projection (fixed to 5 years for simple prediction)
        double growthRate = LOCATION_GROWTH_RATES.getOrDefault(request.getLocation().toLowerCase(), 0.05);
        BigDecimal projectedPrice = finalPrice.multiply(
                BigDecimal.valueOf(Math.pow(1.0 + growthRate, 5))).setScale(2, RoundingMode.HALF_UP);

        return PredictionResponse.builder().estimatedPrice(finalPrice).priceRangeLow(low).priceRangeHigh(high)
                .confidenceLevel(finalPrice.doubleValue() > 0 ? "High" : "Low")
                .marketTrend(growthRate >= 0.06 ? "Strong Upward" : "Steady").projectedPrice5Years(projectedPrice)
                .annualAppreciationRate(growthRate * 100).build();
    }

    private double getTypeMultiplier(PropertyType type) {
        if (type == null)
            return 1.0;
        switch (type) {
            case VILLA:
                return 1.5;
            case APARTMENT:
                return 1.0;
            case LAND:
                return 0.8;
            default:
                return 1.0;
        }
    }
}
