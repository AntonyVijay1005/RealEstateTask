package com.rently.dto;

import com.rently.enums.PropertyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PredictionRequest {
    private String location;
    private Double squareFeet;
    private PropertyType type;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer yearBuilt;
}
