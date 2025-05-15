package com.paf_project.learning_platform.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.paf_project.learning_platform.model.Follow;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends MongoRepository<Follow, String> {
    Optional<Follow> findByFollowerIdAndFollowingId(String followerId, String followingId);

    List<Follow> findByFollowerId(String followerId);

    List<Follow> findByFollowingId(String followingId);

    long countByFollowerId(String followerId);

    long countByFollowingId(String followingId);

    boolean existsByFollowerIdAndFollowingId(String followerId, String followingId);
}