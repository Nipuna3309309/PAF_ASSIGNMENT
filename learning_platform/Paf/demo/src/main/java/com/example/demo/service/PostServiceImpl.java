package com.example.demo.service;

import com.example.demo.model.Post;
import com.example.demo.repository.PostRepository;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class PostServiceImpl implements PostService {

    @Value("${firebase.storage.bucket}")
    private String bucketName;

    @Autowired
    private PostRepository postRepository;

    @Override
    public Post createPost(String description, MultipartFile[] mediaFiles, boolean isVideo, String userId)
            throws IllegalArgumentException, IOException {

        try {
            Post post = new Post();
            post.setDescription(description);
            post.setUserId(userId);
            post.setCreatedAt(new Date());

            if (isVideo) {
                validateVideo(mediaFiles[0]);
                String videoUrl = uploadToFirebase(mediaFiles[0], "videos");
                post.setVideoUrl(videoUrl);
                post.setMediaType(Post.MediaType.VIDEO);
            } else {
                validateImages(mediaFiles);
                List<String> imageUrls = new ArrayList<>();
                for (MultipartFile file : mediaFiles) {
                    String imageUrl = uploadToFirebase(file, "images");
                    imageUrls.add(imageUrl);
                }
                post.setImageUrls(imageUrls);
                post.setMediaType(Post.MediaType.IMAGE);
            }

            // Save to MongoDB
            return postRepository.save(post);

        } catch (IOException e) {
            throw new IOException("Failed to upload media to Firebase: " + e.getMessage());
        }
    }

    private void validateVideo(MultipartFile file) throws IllegalArgumentException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Video file is empty");
        }
        if (file.getSize() > 30 * 1024 * 1024) { // 30MB limit
            throw new IllegalArgumentException("Video must be under 30MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("video/")) {
            throw new IllegalArgumentException("Invalid video format");
        }
    }

    private void validateImages(MultipartFile[] files) throws IllegalArgumentException {
        if (files == null || files.length == 0 || files.length > 3) {
            throw new IllegalArgumentException("You must upload 1 to 3 images");
        }
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("One or more image files are empty");
            }
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("Invalid image format");
            }
        }
    }

    private String uploadToFirebase(MultipartFile file, String folder) throws IOException {
        Bucket bucket = StorageClient.getInstance().bucket(bucketName);
        String fileName = String.format("%s/%s_%s",
                folder,
                UUID.randomUUID(),
                file.getOriginalFilename());

        Blob blob = bucket.create(fileName, file.getBytes(), file.getContentType());

        // Generate download URL that works directly in browsers
        return String.format("https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
                bucketName,
                fileName.replace("/", "%2F"));
    }

    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @Override
    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    @Override
    public void deletePost(String id) {
        Optional<Post> postOptional = postRepository.findById(id);

        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            Bucket bucket = StorageClient.getInstance().bucket(bucketName);

            // 🔥 1. Delete images from Firebase Storage (if images exist)
            if (post.getImageUrls() != null) {
                for (String imageUrl : post.getImageUrls()) {
                    String filePath = extractFilePathFromUrl(imageUrl);
                    bucket.get(filePath).delete();
                }
            }

            // 🔥 2. Delete video from Firebase Storage (if exists)
            if (post.getVideoUrl() != null) {
                String filePath = extractFilePathFromUrl(post.getVideoUrl());
                bucket.get(filePath).delete();
            }

            // 🔥 3. Finally, delete the post from MongoDB
            postRepository.deleteById(id);
        }
    }

    private String extractFilePathFromUrl(String url) {
        return url.substring(url.indexOf("/o/") + 3, url.indexOf("?alt=media")).replace("%2F", "/");
    }


}
