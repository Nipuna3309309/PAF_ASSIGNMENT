package com.paf_project.learning_platform.repository;


import com.paf_project.learning_platform.model.MediaModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MediaRepo extends MongoRepository<MediaModel, String> {
    List<MediaModel> findByUserId(String userId);
}
