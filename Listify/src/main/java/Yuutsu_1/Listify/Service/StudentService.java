package Yuutsu_1.Listify.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Yuutsu_1.Listify.Entity.StudentEntity;
import Yuutsu_1.Listify.Repository.StudentRepository;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository userRepository;

    // Register a new student
    @Transactional
    public StudentEntity registerUser(StudentEntity user) {
        return userRepository.save(user);
    }

    // Login functionality
    public Optional<StudentEntity> loginUser(String email, String password) {
        // Assuming email and password combination must match to get a valid user
        return userRepository.findByEmailAndPassword(email, password);
    }

    // Check if the email already exists in the system
    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    // Add a new student record
    public StudentEntity postStudentRecord(StudentEntity studentEntity) {
        return userRepository.save(studentEntity);
    }

    // Get a list of all students
    public List<StudentEntity> getAllStudent() {
        return userRepository.findAll();
    }

    // Update student details
    public StudentEntity putStudentDetails(int id, StudentEntity newStudentDetails) {
        StudentEntity student = userRepository.findById((long) id)
                .orElseThrow(() -> new NoSuchElementException("StudentEntity with ID " + id + " not found"));

        student.setFirstName(newStudentDetails.getFirstName());
        student.setLastName(newStudentDetails.getLastName());

        return userRepository.save(student);
    }

    // Delete student record by ID
    public String deleteStudent(int id) {
        String msg;
        if (userRepository.existsById((long) id)) {
            userRepository.deleteById((long) id);
            msg = "Student record successfully deleted";
        } else {
            msg = "Student with ID " + id + " not found!";
        }
        return msg;
    }

    // Get student by ID
    public StudentEntity findStudentById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Student with ID " + id + " not found!"));
    }
    
}
