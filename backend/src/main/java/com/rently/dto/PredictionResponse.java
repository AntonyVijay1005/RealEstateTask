package com.rently.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PredictionResponse {
    private BigDecimal estimatedPrice;
    private BigDecimal priceRangeLow;
    private BigDecimal priceRangeHigh;
    private String confidenceLevel;
    private String marketTrend; // "Up", "Down", "Stable"

    // Future Prediction Fields
    private BigDecimal projectedPrice5Years;
    private Double annualAppreciationRate; // e.g. 5.5%
    private java.util.List<TrendDataPoint> historicalTrends;
}
