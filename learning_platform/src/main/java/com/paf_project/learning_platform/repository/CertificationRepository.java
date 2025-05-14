package com.paf_project.learning_platform.repository;

import com.paf_project.learning_platform.model.Certification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CertificationRepository extends MongoRepository<Certification, String> {
    List<Certification> findByUserId(String userId);
}
