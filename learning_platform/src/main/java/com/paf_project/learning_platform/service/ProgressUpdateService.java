package com.paf_project.learning_platform.service;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.paf_project.learning_platform.entity.ProgressUpdate;
import com.paf_project.learning_platform.entity.User;
import com.paf_project.learning_platform.repository.ProgressUpdateRepository;
import com.paf_project.learning_platform.repository.UserRepository;

import java.util.List;
import java.util.Optional;


@Service
public class ProgressUpdateService {
    @Autowired  //it will let framework know that we want the framework to instantiate this class here for us
    private ProgressUpdateRepository progressUpdateRepository;


    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UserRepository userRepository;
    

    // public List<ProgressUpdate> allProgressUpdates(){
    //     return progressUpdateRepository.findAll();
    // }
    
    public List<ProgressUpdate> allProgressUpdates() {
        Query query = new Query();
        query.fields().exclude("userId.progressUpdates"); // Exclude nested reference to prevent infinite loop
        return mongoTemplate.find(query, ProgressUpdate.class);
    }
    

    public Optional<ProgressUpdate> singleProgressUpdate(ObjectId id){
        return progressUpdateRepository.findById(id);
    }

    
    public String createProgressUpdate(String userId, ProgressUpdate progressUpdate) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Associate progress update with the user
            progressUpdate.setUser(user);
            ProgressUpdate savedProgress = progressUpdateRepository.save(progressUpdate);

            // Update user's progress update list
            user.getProgressUpdates().add(savedProgress);
            userRepository.save(user);

            return "Progress update added successfully and user updated!";
        } else {
            return "User not found!";
        }
    }

    public ProgressUpdate editProgressUpdate(ObjectId id, ProgressUpdate updatedProgress) {
        Optional<ProgressUpdate> existingProgressOpt = progressUpdateRepository.findById(id);

        if (existingProgressOpt.isPresent()) {
            ProgressUpdate existingProgress = existingProgressOpt.get();

            // Update all the fields
            existingProgress.setName(updatedProgress.getName());
            existingProgress.setIssuingOrganization(updatedProgress.getIssuingOrganization());
            existingProgress.setIssueDate(updatedProgress.getIssueDate());
            existingProgress.setExpireDate(updatedProgress.getExpireDate());
            existingProgress.setCredentialId(updatedProgress.getCredentialId());
            existingProgress.setCredentialUrl(updatedProgress.getCredentialUrl());
            existingProgress.setSkills(updatedProgress.getSkills());
            existingProgress.setMediaUrl(updatedProgress.getMediaUrl());

            return progressUpdateRepository.save(existingProgress);
        } else {
            throw new RuntimeException("Progress update with ID " + id + " not found.");
        }
    }

    public void deleteProgressUpdate(ObjectId id) {
        if (progressUpdateRepository.existsById(id)) {
            progressUpdateRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Progress update not found with ID: " + id);
        }
    }

}