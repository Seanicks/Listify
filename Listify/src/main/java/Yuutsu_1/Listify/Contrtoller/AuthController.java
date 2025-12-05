package Yuutsu_1.Listify.Contrtoller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Yuutsu_1.Listify.Entity.StudentEntity;
import Yuutsu_1.Listify.Entity.AdminEntity;
import Yuutsu_1.Listify.Service.StudentService;

import Yuutsu_1.Listify.Service.AdminService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private StudentService userService;

    @Autowired
    private AdminService adminService;

    // Endpoint to register a new student user
    @PostMapping("/register/user")
    public ResponseEntity<?> registerUser(@RequestBody StudentEntity user) {
        try {
            StudentEntity registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User registration failed: " + e.getMessage());
        }
    }

    // Endpoint to register a new admin
    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody AdminEntity admin) {
        try {
            AdminEntity registeredAdmin = adminService.registerAdmin(admin);
            return ResponseEntity.ok(registeredAdmin);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Admin registration failed: " + e.getMessage());
        }
    }

    // Endpoint to login a student user
    @PostMapping("/login/user")
    public ResponseEntity<?> loginUser(@RequestBody StudentEntity user) {
        return userService.loginUser(user.getEmail(), user.getPassword())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials"));
    }

    // Endpoint to login an admin
    @PostMapping("/login/admin")
    public ResponseEntity<?> loginAdmin(@RequestBody AdminEntity admin) {
        return adminService.loginAdmin(admin.getEmail(), admin.getPassword())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials"));
    }

        @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailExists(@RequestParam String email) {
        boolean exists = userService.checkEmailExists(email);
        return ResponseEntity.ok(exists);
    }

    
}

