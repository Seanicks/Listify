package Yuutsu_1.Listify.Service;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Yuutsu_1.Listify.Repository.TaskRepository;
import Yuutsu_1.Listify.Repository.StudentRepository;
import Yuutsu_1.Listify.DTO.DashboardData;
import Yuutsu_1.Listify.Entity.TaskEntity;
import Yuutsu_1.Listify.Entity.StudentEntity;
 
import java.util.List;
 
@Service
public class DashboardService {
 
    @Autowired
    private TaskRepository taskRepository;
 
    @Autowired
    private StudentRepository studentRepository;
 
    public DashboardData getDashboardData() {
        // Fetch all tasks
        List<TaskEntity> tasks = taskRepository.findAll();
 
        // Fetch all students
        List<StudentEntity> students = studentRepository.findAll();
 
        // Return the combined DTO
        return new DashboardData(tasks, students);
    }
}
 
 
