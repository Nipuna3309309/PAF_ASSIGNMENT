package com.paf_project.learning_platform.service;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.paf_project.learning_platform.dto.MonthYearDTO;
import com.paf_project.learning_platform.dto.ProgressUpdateDTO;
import com.paf_project.learning_platform.entity.ProgressUpdate;
import com.paf_project.learning_platform.entity.Skill;
import com.paf_project.learning_platform.entity.User;
import com.paf_project.learning_platform.repository.ProgressUpdateRepository;
import com.paf_project.learning_platform.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ProgressUpdateService {
    @Autowired  //it will let framework know that we want the framework to instantiate this class here for us
    private ProgressUpdateRepository progressUpdateRepository;


    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SkillService skillService;
    

    public ProgressUpdateDTO convertToDTO(ProgressUpdate progressUpdate) {
        ProgressUpdateDTO dto = new ProgressUpdateDTO();
        dto.setId(progressUpdate.getId().toString());
        dto.setName(progressUpdate.getName());
        dto.setIssuingOrganization(progressUpdate.getIssuingOrganization());
        dto.setIssueDate(new MonthYearDTO(
            progressUpdate.getIssueDate().getMonth(),
            progressUpdate.getIssueDate().getYear()
        ));
        dto.setExpireDate(new MonthYearDTO(
            progressUpdate.getExpireDate().getMonth(),
            progressUpdate.getExpireDate().getYear()
        ));
        dto.setCredentialId(progressUpdate.getCredentialId());
        dto.setCredentialUrl(progressUpdate.getCredentialUrl());
        dto.setMediaUrl(progressUpdate.getMediaUrl());
        dto.setSkills(progressUpdate.getSkills());

    return dto;
    }


    public Optional<ProgressUpdateDTO> getProgressUpdateDTOById(ObjectId id) {
        return progressUpdateRepository.findById(id)
            .map(this::convertToDTO);
    }

    public List<ProgressUpdateDTO> getAllProgressUpdateDTOs() {
        return allProgressUpdates().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }


    public List<ProgressUpdateDTO> getProgressUpdatesByUserId(String userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
    
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
    
            List<ProgressUpdate> progressUpdates = user.getProgressUpdates();
    
            // Map to DTOs
            return progressUpdates.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }
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

            // Process skills and add them to the user at the same time
            processSkills(progressUpdate.getSkills(), user);

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

            // Update all fields
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
        Optional<ProgressUpdate> optionalProgressUpdate = progressUpdateRepository.findById(id);
    
        if (optionalProgressUpdate.isPresent()) {
            ProgressUpdate progressUpdate = optionalProgressUpdate.get();
            User user = progressUpdate.getUser(); // get the associated user
    
            // Remove the progress update from user's list
            if (user != null) {
                user.getProgressUpdates().removeIf(p -> p.getId().equals(id));
                userRepository.save(user);
            }
    
            // Delete the progress update
            progressUpdateRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Progress update not found with ID: " + id);
        }
    }

     // Helper method to process and add skills to the user
     private void processSkills(List<Skill> skills, User user) {
        for (Skill skill : skills) {
            // Add skill to the user if not already added
            skillService.addSkillToUserAndReturnSkills(user.getId(), skill.getName());
        }
    }
    

}