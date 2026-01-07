package com.rently.dto;

import com.rently.enums.PropertyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PropertyDto {
    private Long id;
    private String title;
    private String description;
    private String location;
    private BigDecimal price;
    private Double squareFeet;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer yearBuilt;
    private PropertyType type;
    private List<String> images;
    private Long ownerId;
    private String ownerName;
}
