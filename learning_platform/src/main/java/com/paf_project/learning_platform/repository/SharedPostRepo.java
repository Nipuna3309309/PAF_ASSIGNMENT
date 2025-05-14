package com.paf_project.learning_platform.repository;

import com.paf_project.learning_platform.model.SharedPost;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SharedPostRepo extends MongoRepository<SharedPost, String> {
    List<SharedPost> findBySharedToUserId(String sharedToUserId);
}
