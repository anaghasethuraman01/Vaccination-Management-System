package edu.sjsu.cmpe275.vms.controller;

import edu.sjsu.cmpe275.vms.exception.ResourceNotFoundException;
import edu.sjsu.cmpe275.vms.model.User;
import edu.sjsu.cmpe275.vms.repository.UserRepository;
import edu.sjsu.cmpe275.vms.security.CurrentUser;
import edu.sjsu.cmpe275.vms.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('PATIENT')")
    public User getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }
}
