package com.rently.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EnquiryRequest {
    private Long propertyId;
    private String name;
    private String email;
    private String phone;
    private String message;
}
