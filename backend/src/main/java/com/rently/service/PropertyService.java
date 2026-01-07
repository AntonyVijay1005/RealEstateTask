package com.rently.service;

import com.rently.dto.PropertyDto;
import com.rently.dto.PropertyRequest;
import com.rently.entity.Property;
import com.rently.entity.User;
import com.rently.enums.PropertyType;
import com.rently.repository.PropertyRepository;
import com.rently.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {

        private final PropertyRepository propertyRepository;
        private final UserRepository userRepository;

        public PropertyDto createProperty(PropertyRequest request, String userEmail) {
                User owner = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                Property property = Property.builder()
                                .title(request.getTitle())
                                .description(request.getDescription())
                                .location(request.getLocation())
                                .price(request.getPrice())
                                .squareFeet(request.getSquareFeet())
                                .bedrooms(request.getBedrooms())
                                .bathrooms(request.getBathrooms())
                                .yearBuilt(request.getYearBuilt())
                                .type(request.getType())
                                .images(request.getImages())
                                .owner(owner)
                                .build();

                Property savedProperty = propertyRepository.save(property);
                return mapToDto(savedProperty);
        }

        public List<PropertyDto> getAllProperties() {
                return propertyRepository.findAll().stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

        public List<PropertyDto> getMyProperties(String userEmail) {
                User owner = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                return propertyRepository.findByOwnerId(owner.getId()).stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

        public List<PropertyDto> searchProperties(String location, PropertyType type, BigDecimal minPrice,
                        BigDecimal maxPrice) {
                return propertyRepository.searchProperties(location, type, minPrice, maxPrice).stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

        public PropertyDto getPropertyById(Long id) {
                Property property = propertyRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Property not found"));
                return mapToDto(property);
        }

        public PropertyDto updateProperty(Long id, com.rently.dto.PropertyUpdateRequest request, String userEmail) {
                Property property = propertyRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Property not found"));

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                // Allow Admin or Owner to update
                if (!property.getOwner().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
                        throw new RuntimeException("Not authorized to update this property");
                }

                property.setTitle(request.getTitle());
                property.setDescription(request.getDescription());
                property.setLocation(request.getLocation());
                property.setPrice(request.getPrice());
                property.setSquareFeet(request.getSquareFeet());
                property.setBedrooms(request.getBedrooms());
                property.setBathrooms(request.getBathrooms());
                property.setYearBuilt(request.getYearBuilt());
                property.setType(request.getType());
                property.setImages(request.getImages());

                Property updated = propertyRepository.save(property);
                return mapToDto(updated);
        }

        // Removed redundant single argument deleteProperty

        public void deleteProperty(Long id, String userEmail) {
                Property property = propertyRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Property not found"));

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                // Allow Admin or Owner to delete
                if (!property.getOwner().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
                        throw new RuntimeException("Not authorized to delete this property");
                }

                propertyRepository.delete(property);
        }

        private PropertyDto mapToDto(Property property) {
                return PropertyDto.builder()
                                .id(property.getId())
                                .title(property.getTitle())
                                .description(property.getDescription())
                                .location(property.getLocation())
                                .price(property.getPrice())
                                .squareFeet(property.getSquareFeet())
                                .bedrooms(property.getBedrooms())
                                .bathrooms(property.getBathrooms())
                                .yearBuilt(property.getYearBuilt())
                                .type(property.getType())
                                .images(property.getImages())
                                .ownerId(property.getOwner().getId())
                                .ownerName(property.getOwner().getFirstName() + " " + property.getOwner().getLastName())
                                .build();
        }
}
