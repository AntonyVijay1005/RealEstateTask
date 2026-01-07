package com.rently.service;

import com.rently.dto.EnquiryRequest;
import com.rently.dto.EnquiryResponse;
import com.rently.entity.Enquiry;
import com.rently.entity.Property;
import com.rently.entity.User;
import com.rently.enums.EnquiryStatus;
import com.rently.repository.EnquiryRepository;
import com.rently.repository.PropertyRepository;
import com.rently.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnquiryService {

        private final EnquiryRepository enquiryRepository;
        private final PropertyRepository propertyRepository;
        private final UserRepository userRepository;

        public EnquiryResponse createEnquiry(EnquiryRequest request) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String userEmail = authentication.getName();

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Property property = propertyRepository.findById(request.getPropertyId())
                                .orElseThrow(() -> new RuntimeException("Property not found"));

                Enquiry enquiry = Enquiry.builder()
                                .property(property)
                                .user(user)
                                .name(request.getName())
                                .email(request.getEmail())
                                .phone(request.getPhone())
                                .message(request.getMessage())
                                .status(EnquiryStatus.PENDING)
                                .build();

                Enquiry savedEnquiry = enquiryRepository.save(enquiry);
                return mapToResponse(savedEnquiry);
        }

        public List<EnquiryResponse> getEnquiriesForOwner() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String userEmail = authentication.getName();

                User owner = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Enquiry> enquiries = enquiryRepository.findByPropertyOwnerId(owner.getId());
                return enquiries.stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        public List<EnquiryResponse> getMyEnquiries() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String userEmail = authentication.getName();

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Enquiry> enquiries = enquiryRepository.findByUserId(user.getId());
                return enquiries.stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        public EnquiryResponse updateStatus(Long enquiryId, EnquiryStatus status, String userEmail) {
                Enquiry enquiry = enquiryRepository.findById(enquiryId)
                                .orElseThrow(() -> new RuntimeException("Enquiry not found"));

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Allow Admin or Property Owner to update status
                if (!enquiry.getProperty().getOwner().getId().equals(user.getId())
                                && !user.getRole().name().equals("ADMIN")) {
                        throw new RuntimeException("Not authorized to update this enquiry status");
                }

                enquiry.setStatus(status);
                Enquiry updated = enquiryRepository.save(enquiry);
                return mapToResponse(updated);
        }

        private EnquiryResponse mapToResponse(Enquiry enquiry) {
                return EnquiryResponse.builder()
                                .id(enquiry.getId())
                                .propertyId(enquiry.getProperty().getId())
                                .propertyTitle(enquiry.getProperty().getTitle())
                                .userName(enquiry.getName())
                                .email(enquiry.getEmail())
                                .phone(enquiry.getPhone())
                                .message(enquiry.getMessage())
                                .status(enquiry.getStatus())
                                .createdAt(enquiry.getCreatedAt())
                                .build();
        }
}
