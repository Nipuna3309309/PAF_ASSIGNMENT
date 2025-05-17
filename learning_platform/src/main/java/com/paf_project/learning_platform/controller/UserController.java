package com.paf_project.learning_platform.controller;

import com.paf_project.learning_platform.dto.AuthRequestDTO;
import com.paf_project.learning_platform.dto.RegisterRequestDTO;
import com.paf_project.learning_platform.dto.UserDTO;
import com.paf_project.learning_platform.model.User;
import com.paf_project.learning_platform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/google-auth")
    public User googleAuth(@RequestBody UserDTO userDTO) {
        return userService.registerOrGetUser(userDTO);
    }

    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email).orElse(null);
    }

    @PostMapping("/register")
    public void register(@RequestBody RegisterRequestDTO request) {
        userService.registerUser(request);
    }

    @PostMapping("/login")
    public String login(@RequestBody AuthRequestDTO request) {
        return userService.loginUser(request);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        return userService.updateUser(id, updatedUser);
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam("q") String query) {
        List<User> allUsers = userService.getAllUsers();
        return allUsers.stream()
                .filter(user -> user.getName() != null && user.getName().toLowerCase().contains(query.toLowerCase()))
                .toList();
    }

    @GetMapping("/search-v2")
    public ResponseEntity<List<User>> searchUsersV2(@RequestParam String query) {
        List<User> users = userService.searchUsers(query);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<User>> getFollowers(@PathVariable String userId) {
        List<User> followers = userService.getFollowers(userId);
        return ResponseEntity.ok(followers);
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<List<User>> getFollowing(@PathVariable String userId) {
        List<User> following = userService.getFollowing(userId);
        return ResponseEntity.ok(following);
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

}
