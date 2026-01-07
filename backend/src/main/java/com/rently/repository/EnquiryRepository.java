package com.rently.repository;

import com.rently.entity.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    List<Enquiry> findByPropertyId(Long propertyId);

    List<Enquiry> findByPropertyOwnerId(Long ownerId);

    List<Enquiry> findByUserId(Long userId);
}
