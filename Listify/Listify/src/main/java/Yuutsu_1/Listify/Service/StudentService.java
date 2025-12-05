package Yuutsu_1.Listify.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Yuutsu_1.Listify.Entity.StudentEntity;
import Yuutsu_1.Listify.Repository.StudentRepository;

import jakarta.transaction.Transactional;

import java.util.Optional;

@Service
public class StudentService {
    @Autowired
    private StudentRepository userRepository;

    @Transactional
    public StudentEntity registerUser(StudentEntity user) {
        return userRepository.save(user);
    }

    public Optional<StudentEntity> loginUser(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }
    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    
}
