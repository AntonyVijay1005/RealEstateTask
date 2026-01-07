package com.rently.dto;

import com.rently.enums.EnquiryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EnquiryResponse {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String userName;
    private String email;
    private String phone;
    private String message;
    private EnquiryStatus status;
    private LocalDateTime createdAt;
}
