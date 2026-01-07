package com.rently.dto;

import com.rently.enums.PropertyType;
import jakarta.validation.constraints.*;
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
public class PropertyRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description is too long")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Square feet is required")
    @Min(value = 1, message = "Square feet must be at least 1")
    private Double squareFeet;

    @NotNull(message = "Bedrooms count is required")
    @Min(value = 0, message = "Bedrooms cannot be negative")
    private Integer bedrooms;

    @NotNull(message = "Bathrooms count is required")
    @Min(value = 0, message = "Bathrooms cannot be negative")
    private Integer bathrooms;

    @Min(value = 1800, message = "Year built must be after 1800")
    private Integer yearBuilt;

    @NotNull(message = "Property type is required")
    private PropertyType type;

    private List<String> images;
}
