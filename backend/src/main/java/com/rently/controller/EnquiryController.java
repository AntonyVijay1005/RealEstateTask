package com.rently.controller;

import com.rently.dto.EnquiryRequest;
import com.rently.dto.EnquiryResponse;
import com.rently.enums.EnquiryStatus;
import com.rently.service.EnquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enquiries")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EnquiryController {

    private final EnquiryService enquiryService;

    @PostMapping
    public ResponseEntity<EnquiryResponse> createEnquiry(@RequestBody EnquiryRequest request) {
        return ResponseEntity.ok(enquiryService.createEnquiry(request));
    }

    @GetMapping("/owner")
    public ResponseEntity<List<EnquiryResponse>> getEnquiriesForOwner() {
        return ResponseEntity.ok(enquiryService.getEnquiriesForOwner());
    }

    @GetMapping("/my")
    public ResponseEntity<List<EnquiryResponse>> getMyEnquiries() {
        return ResponseEntity.ok(enquiryService.getMyEnquiries());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EnquiryResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam EnquiryStatus status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        return ResponseEntity.ok(enquiryService.updateStatus(id, status, currentPrincipalName));
    }
}
