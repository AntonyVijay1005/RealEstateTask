package com.rently.controller;

import com.rently.dto.PropertyDto;
import com.rently.dto.PropertyRequest;
import com.rently.dto.PropertyUpdateRequest;
import com.rently.enums.PropertyType;
import com.rently.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @PostMapping
    public ResponseEntity<PropertyDto> createProperty(@Valid @RequestBody PropertyRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName(); // Email
        return ResponseEntity.ok(propertyService.createProperty(request, currentPrincipalName));
    }

    @GetMapping
    public ResponseEntity<List<PropertyDto>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @GetMapping("/my")
    public ResponseEntity<List<PropertyDto>> getMyProperties() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        return ResponseEntity.ok(propertyService.getMyProperties(currentPrincipalName));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertyDto>> searchProperties(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) PropertyType type,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return ResponseEntity.ok(propertyService.searchProperties(location, type, minPrice, maxPrice));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDto> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyDto> updateProperty(
            @PathVariable Long id,
            @RequestBody PropertyUpdateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        return ResponseEntity.ok(propertyService.updateProperty(id, request, currentPrincipalName));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        propertyService.deleteProperty(id, currentPrincipalName);
        return ResponseEntity.noContent().build();
    }
}
