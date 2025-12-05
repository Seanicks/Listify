package Yuutsu_1.Listify.Contrtoller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Yuutsu_1.Listify.Entity.StudentEntity;
import Yuutsu_1.Listify.Service.StudentService;

@RestController
@RequestMapping("/api/student")
@CrossOrigin
public class StudentController {

    @Autowired
    private StudentService userRepository;

    @GetMapping("/print")
    public String print() {
        return "Hello, Seanjames Lacaba";
    }

    // Create - POST
    @PostMapping("/postStudentRecord")
    public StudentEntity postStudentRecord(@RequestBody StudentEntity studentEntity) {
        return userRepository.postStudentRecord(studentEntity);
    }

    // Read - GET
    @GetMapping("/getAllStudent")
    public List<StudentEntity> getAllStudent() {
        return userRepository.getAllStudent();
    }

    // Update - PUT
    @PutMapping("/putStudentDetails")
    public StudentEntity putStudentDetails(@RequestParam int id, @RequestBody StudentEntity newStudentDetails) {
        return userRepository.putStudentDetails(id, newStudentDetails);
    }

    // Delete - DELETE
    @DeleteMapping("/deleteStudent/{id}")
    public String deleteStudent(@PathVariable int id) {
        return userRepository.deleteStudent(id);
    }

    // Get Student by ID - GET
    @GetMapping("/getStudentById")
    public StudentEntity getStudentById(@RequestParam Long id) {
        return userRepository.findStudentById(id);
    }

    // Login - GET
    @GetMapping("/login")
    public StudentEntity loginStudent(@RequestParam String email, @RequestParam String password) {
        return userRepository.loginUser(email, password)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    }
}
