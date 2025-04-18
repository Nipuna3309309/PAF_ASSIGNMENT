package com.paf_project.learning_platform.controller;


import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.paf_project.learning_platform.dto.ProgressUpdateDTO;
import com.paf_project.learning_platform.entity.ProgressUpdate;
import com.paf_project.learning_platform.service.ProgressUpdateService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/progress-updates")
public class ProgressUpdateController {

//    @GetMapping
//    public String getAllProgressUpdatesString() {
//        return "All Progress Updates!";
//    }

//    @GetMapping
//    public ResponseEntity<String> getAllProgressUpdatesResponse() {
//        return new ResponseEntity<>("All Progress Updates!", HttpStatus.OK);
//    }

    @Autowired
    private ProgressUpdateService progressUpdateService;
    

    // @GetMapping
    // public ResponseEntity<List<ProgressUpdate>> getAllProgressUpdates() {
    //     return new ResponseEntity<List<ProgressUpdate>>(progressUpdateService.allProgressUpdates(),HttpStatus.OK);
    // }

    @GetMapping
    public ResponseEntity<List<ProgressUpdateDTO>> getAllProgressUpdates() {
        return new ResponseEntity<>(progressUpdateService.getAllProgressUpdateDTOs(), HttpStatus.OK);
    }
    //Controller will only consult it self about the task of getting a request of the user and returning response
    //nothing else
    //thats what its doing, all it doing is using a service class and deligating the task of fetching all
    //theprogress updates from the database and giving it back to the API


    // @GetMapping("/{id}")
    // public ResponseEntity<Optional<ProgressUpdate>> getSingleProgressUpdate(@PathVariable ObjectId id){
    //     //meka gahnna kalin gihin service eke method eka hadnna oni
    //     return new ResponseEntity<Optional<ProgressUpdate>>(progressUpdateService.singleProgressUpdate(id), HttpStatus.OK);
    // }

    @GetMapping("/{id}")
    public ResponseEntity<ProgressUpdateDTO> getProgressUpdateDTO(@PathVariable ObjectId id) {
        Optional<ProgressUpdateDTO> dto = progressUpdateService.getProgressUpdateDTOById(id);
        return dto.map(data -> new ResponseEntity<>(data, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    // @PostMapping
    // public ResponseEntity<ProgressUpdate> createProgressUpdate(@RequestBody ProgressUpdate progressUpdate) {
    //     // Create the progress update without generating an auto-increment ID
    //     ProgressUpdate createdProgressUpdate = progressUpdateService.createProgressUpdate(progressUpdate);
    
    //     return new ResponseEntity<>(createdProgressUpdate, HttpStatus.CREATED);
    // }


    @PostMapping("/add/{userId}")
    public ResponseEntity<String> createProgressUpdate(@PathVariable String userId, @RequestBody ProgressUpdate progressUpdate) {
        String response = progressUpdateService.createProgressUpdate(userId, progressUpdate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}/progress-updates")
    public ResponseEntity<List<ProgressUpdateDTO>> getProgressUpdatesByUserId(@PathVariable String userId) {
        List<ProgressUpdateDTO> progressUpdates = progressUpdateService.getProgressUpdatesByUserId(userId);
        return new ResponseEntity<>(progressUpdates, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgressUpdate> editProgressUpdate(
            @PathVariable ObjectId id, 
            @RequestBody ProgressUpdate updatedProgress) {
        
        ProgressUpdate updated = progressUpdateService.editProgressUpdate(id, updatedProgress);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProgressUpdate(@PathVariable ObjectId id) {
        try {
            progressUpdateService.deleteProgressUpdate(id);
            return new ResponseEntity<>("Progress update deleted successfully!", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
