package com.paf_project.learning_platform.service;

import com.paf_project.learning_platform.model.Skill;
import com.paf_project.learning_platform.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    public Skill addSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    public List<Skill> getUserSkills(String userId) {
        return skillRepository.findByUserId(userId);
    }
    
    public void deleteSkill(String id) {
        skillRepository.deleteById(id);
    }
    
}
