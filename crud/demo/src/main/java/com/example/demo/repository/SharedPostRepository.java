package com.example.demo.repository;

import com.example.demo.model.SharedPost;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SharedPostRepository extends MongoRepository<SharedPost, String> {
    List<SharedPost> findBySharedBy(String userId);
}