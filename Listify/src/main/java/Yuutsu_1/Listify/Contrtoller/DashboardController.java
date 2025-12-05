package Yuutsu_1.Listify.Contrtoller;
 
import Yuutsu_1.Listify.DTO.DashboardData;
import Yuutsu_1.Listify.Entity.StudentEntity;
import Yuutsu_1.Listify.Entity.TaskEntity;
import Yuutsu_1.Listify.Repository.StudentRepository;
import Yuutsu_1.Listify.Repository.TaskRepository;
 
import java.util.List;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
 
    @Autowired
    private TaskRepository taskRepository;
 
    @Autowired
    private StudentRepository studentRepository;
 
    @GetMapping
    public ResponseEntity<DashboardData> getDashboardData() {
        List<TaskEntity> tasks = taskRepository.findAll();
        List<StudentEntity> students = studentRepository.findAll();
 
        DashboardData dashboardData = new DashboardData(tasks, students);
        return ResponseEntity.ok(dashboardData);
    }
}
